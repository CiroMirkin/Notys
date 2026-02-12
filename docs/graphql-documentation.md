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
  notes: [Note!]!
  createdAt: String!
}

type Note {
  id: ID!
  title: String!
  content: String!
  userId: String!
  user: User!
  createdAt: String!
}
```

**Nota:** El schema actual no incluye campos `avatar`, `updatedAt` en User, ni `updatedAt` en Note. Estos campos existen en Prisma pero no están expuestos en GraphQL por simplicidad.

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

### Configuración Actual
```typescript
// src/lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
      fetchOptions: {
        cache: 'no-store'
      }
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network'
      }
    }
  });
}

export const apolloClient = createApolloClient();
```

**Archivo real:** `src/lib/apollo-client.ts`

**Características implementadas:**
- Factory Pattern para crear cliente Apollo
- Configuración de cache `no-store` en fetch options
- Política `cache-and-network` para queries
- Credenciales `same-origin` para autenticación

### Query Example (Implementación Real)
```typescript
// src/components/notes-list.tsx
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

export function NotesList() {
  const { data, loading, error } = useQuery(GET_MY_NOTES);

  if (loading) return <div>Cargando notas...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid gap-4">
      {data?.myNotes.map((note: any) => (
        <div key={note.id} className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold">{note.title}</h3>
          <p className="text-gray-600 mt-2">{note.content}</p>
          <p className="text-sm text-gray-400 mt-2">
            {new Date(note.updatedAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
```

### Mutation Example (Implementación Real)
```typescript
// src/components/note-form.tsx
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';

const CREATE_NOTE = gql`
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      id
      title
      content
      createdAt
    }
  }
`;

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

export function NoteForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const [createNote, { loading }] = useMutation(CREATE_NOTE, {
    refetchQueries: [{ query: GET_MY_NOTES }],
    onCompleted: () => {
      setTitle('');
      setContent('');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createNote({
      variables: {
        input: { title, content }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Contenido"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded"
        rows={4}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Creando...' : 'Crear Nota'}
      </button>
    </form>
  );
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

---

## 🎯 Estado Actual de la Implementación

### ✅ Backend GraphQL Completamente Funcional
- **Schema**: Definido en `typeDefs.ts` con tipos User y Note
- **Resolvers**: Implementados en `resolvers.ts` con toda la lógica CRUD
- **Autenticación**: Integrada con Auth0 en todos los endpoints
- **Base de Datos**: Modelo Prisma funcional con PostgreSQL
- **API Endpoint**: `/api/graphql` operativo en desarrollo y producción

### 🔄 Componentes UI Implementados pero No Integrados
- **`note-form.tsx`**: Formulario para crear notas nuevas
  - Utiliza `useMutation` de Apollo Client
  - Refetch automático de notas después de creación
  - Manejo de estados de loading

- **`notes-list.tsx`**: Listado de notas del usuario
  - Utiliza `useQuery` de Apollo Client
  - Muestra título, contenido y fecha de actualización
  - Manejo de estados de loading y error

### ⚠️ Elementos Faltantes por Implementar
- **Dashboard Page**: Ruta `/dashboard` referenciada en navbar pero inexistente
- **Integración UI**: Conectar componentes de notas al dashboard
- **Funcionalidad adicional**: Edición y eliminación de notas en la UI

---

## 🚀 Próximos Pasos para Completar la Integración

### 1. Crear Dashboard (src/app/dashboard/page.tsx)
```tsx
'use client';

import { NoteForm } from '@/components/note-form';
import { NotesList } from '@/components/notes-list';

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mis Notas</h1>
      
      <div className="grid gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Crear Nueva Nota</h2>
          <NoteForm />
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Mis Notas</h2>
          <NotesList />
        </section>
      </div>
    </div>
  );
}
```

### 2. Agregar Funcionalidad de Edición/Eliminación
Extender `notes-list.tsx` con botones para editar y eliminar notas usando las mutations existentes.

---

La infraestructura GraphQL está completa y lista para usar. Solo falta la integración final con la UI para tener una aplicación de notas completamente funcional.