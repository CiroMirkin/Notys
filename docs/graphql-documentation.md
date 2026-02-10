# Documentación GraphQL - Notys

## Arquitectura Implementada

### Stack Tecnológico
- **Backend**: Apollo Server + Next.js API Routes
- **Frontend**: Apollo Client + React Hooks
- **Base de Datos**: Prisma + PostgreSQL (Supabase)
- **Autenticación**: Auth0 v4 SDK
- **Code Generation**: GraphQL Code Generator

---

## Estructura de Archivos

### Backend GraphQL
```
src/
├── graphql/
│   ├── schema/
│   │   ├── typeDefs.ts    # Definición del schema
│   │   └── resolvers.ts   # Lógica de negocio
│   ├── context.ts         # Contexto de GraphQL
│   └── types.ts           # Tipos generados (autogenerado)
└── app/
    └── api/
        └── graphql/
            └── route.ts    # API Route de Apollo Server
```

### Cliente GraphQL
```
src/
├── lib/
│   └── apollo-client.ts   # Configuración del cliente
└── components/
    └── apollo-provider.tsx # Provider de Apollo
```

---

## Schema GraphQL

### Types
```graphql
type User {
  id: ID!
  auth0Id: String!
  email: String!
  name: String
  avatar: String
  notes: [Note!]!
  createdAt: String!
  updatedAt: String!
}

type Note {
  id: ID!
  title: String!
  content: String!
  userId: String!
  user: User!
  createdAt: String!
  updatedAt: String!
}
```

### Queries
```graphql
me: User                    # Usuario autenticado actual
myNotes: [Note!]!           # Todas las notas del usuario
note(id: ID!): Note         # Nota específica por ID
```

### Mutations
```graphql
createNote(input: CreateNoteInput!): Note!
updateNote(id: ID!, input: UpdateNoteInput!): Note!
deleteNote(id: ID!): Boolean!
```

### Inputs
```graphql
input CreateNoteInput {
  title: String!
  content: String!
}

input UpdateNoteInput {
  title: String
  content: String
}
```

---

## Funcionalidades Implementadas

### Autenticación
- **Validación obligatoria**: Todas las operaciones requieren autenticación
- **Creación automática**: Si el usuario no existe en BD, se crea automáticamente
- **Ownership validation**: Solo el dueño puede ver/editar sus notas

### Seguridad
- **Session validation**: Verificación de Auth0 session en cada operación
- **Data isolation**: Los usuarios solo acceden a sus propios datos
- **Error handling**: Códigos de error GraphQL estándar

### Contexto GraphQL
```typescript
export async function createContext() {
  const session = await auth0.getSession();
  
  return {
    user: session?.user || null,
    prisma  // Cliente Prisma inyectado
  };
}
```

---

## API Endpoints

### GraphQL Endpoint
```
GET  /api/graphql  # GraphQL Playground (desarrollo)
POST /api/graphql  # GraphQL mutations y queries
```

### Autenticación
```
/auth/login     # Login con Auth0
/auth/logout    # Logout con Auth0
/auth/callback  # Callback de Auth0
```

---

## Uso del Cliente Apollo

### Configuración
```typescript
// src/lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: '/api/graphql',
    credentials: 'same-origin'
  }),
  cache: new InMemoryCache()
});
```

### Query Example
```typescript
import { gql, useQuery } from '@apollo/client';

const GET_MY_NOTES = gql`
  query GetMyNotes {
    myNotes {
      id
      title
      content
      createdAt
      updatedAt
    }
  }
`;

function MyNotesComponent() {
  const { data, loading, error } = useQuery(GET_MY_NOTES);
  // Component logic...
}
```

### Mutation Example
```typescript
const CREATE_NOTE = gql`
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      id
      title
      content
    }
  }
`;

function CreateNoteComponent() {
  const [createNote, { loading }] = useMutation(CREATE_NOTE);
  // Component logic...
}
```

---

## Code Generation

### Configuración
```typescript
// codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/graphql/schema/typeDefs.ts',
  generates: {
    './src/graphql/types.ts': {
      plugins: ['typescript']
    }
  }
};
```

### Comando
```bash
npm run graphql:codegen
```

### Tipos Generados
- Interfaces de TypeScript para todos los types GraphQL
- Tipos para inputs y outputs
- Validación estática en tiempo de desarrollo

---

## Variables de Entorno

### Archivo `.env.local`
```bash
# Auth0 Configuration - v4 SDK
AUTH0_SECRET=your-super-secret-32-char-string
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
APP_BASE_URL=http://localhost:3000

# Database Configuration
SUPABASE_DB_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

---

## Scripts Disponibles

### GraphQL
```bash
npm run graphql:codegen  # Generar tipos desde schema
```

### Base de Datos
```bash
npm run db:generate     # Generar cliente Prisma
npm run db:push         # Sincronizar schema con BD
npm run db:studio       # Abrir Prisma Studio
```

---

## Cambios en el Modelo de Datos

### Archivos a Modificar

1. **Base de Datos (Prisma Schema)**
   - `prisma/schema.prisma` - Definición de modelos y relaciones

2. **GraphQL Schema**
   - `src/graphql/schema/typeDefs.ts` - Tipos GraphQL, queries y mutations
   - `src/graphql/schema/resolvers.ts` - Lógica de negocio para las operaciones

3. **Types Autogenerados**
   - `src/graphql/types.ts` - Se regenerará automáticamente

### Comandos a Ejecutar (en orden)

```bash
# 1. Generar cliente Prisma con nuevos tipos
npm run db:generate

# 2. Sincronizar cambios con la base de datos
npm run db:push

# 3. Generar tipos TypeScript desde GraphQL
npm run graphql:codegen
```

---

## Testing del API

### GraphQL Playground (Development)
Accede a `http://localhost:3000/api/graphql` para probar el API.

### Query Example
```graphql
query {
  me {
    id
    email
    name
    notes {
      id
      title
      content
      createdAt
    }
  }
}
```

### Mutation Example
```graphql
mutation {
  createNote(input: {
    title: "Mi nota de prueba"
    content: "Contenido de la nota"
  }) {
    id
    title
    content
    createdAt
  }
}
```

---

## Integración con Components UI

### Layout Integration
El Apollo Provider está integrado en el layout principal:

```typescript
// src/app/layout.tsx
<Auth0Provider>
  <ApolloProviderWrapper>
    <ThemeProvider>
      {/* App content */}
    </ThemeProvider>
  </ApolloProviderWrapper>
</Auth0Provider>
```

### Middleware
El middleware de Auth0 protege todas las rutas:

```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}
```

---

## Error Handling

### GraphQL Errors
- `UNAUTHENTICATED`: Usuario no logueado
- `NOT_FOUND`: Recurso no encontrado o sin permiso
- Standard GraphQL error format con extensions

### Client-Side
Apollo Client maneja automáticamente:
- Network errors
- GraphQL errors
- Loading states
- Cache management

---

## Performance Considerations

### Apollo Cache
- InMemoryCache para queries repetitivas
- Cache-and-network policy para datos frescos
- Refetch automático después de mutations

### Prisma Optimization
- Relations incluidas para evitar N+1 queries
- Índices en campos críticos
- Connection pooling con PostgreSQL

---

## Deploy Considerations

### Environment Variables
Configurar todas las variables de entorno en producción:
- Auth0 credentials
- Supabase database URL
- Base URL correcta

### Build Process
```bash
npm run build  # Verifica types y compila
npm run start  # Servidor de producción
```

---

## Troubleshooting

### Common Issues
1. **Auth0 session**: Verificar configuración de dominios y callbacks
2. **Prisma connection**: Validar URL de base de datos
3. **GraphQL context**: Session debe estar disponible en middleware
4. **Apollo cache**: Limpiar cache si hay datos desactualizados

### Debug Commands
```bash
# Verificar conexión a BD
npm run db:studio

# Verificar schema GraphQL
curl http://localhost:3000/api/graphql

# Generar tipos
npm run graphql:codegen
```

---

## Next Steps (Opcional)

La infraestructura GraphQL está completa. Los componentes UI para notas ya están disponibles pero no integrados:

- `src/components/notes-list.tsx` - Listado de notas
- `src/components/note-form.tsx` - Formulario de creación

Para activar la UI completa, simplemente reemplazar el contenido del dashboard con la versión que incluye estos componentes.