# Guía Completa del Backend GraphQL

Esta guía explica en detalle cada archivo del backend GraphQL, sus responsabilidades y cómo interactúan entre sí. 📝

## 🏗️ Arquitectura General

El backend sigue un patrón **Serverless + API Routes** con Next.js 15, utilizando Apollo Server para GraphQL, integrado con Prisma ORM y Auth0 para autenticación.

## 📁 Archivos Clave y sus Funciones

### 1. Punto de Entrada Principal
**`src/app/api/graphql/route.ts`** - *El cerebro del servidor GraphQL*
```
Función: Configura y expone el endpoint GraphQL
Relaciones: Conecta todo el stack GraphQL
```

**Responsabilidades:**
- Crear instancia de Apollo Server con typeDefs y resolvers
- Habilitar introspección solo en desarrollo (`process.env.NODE_ENV !== 'production'`)
- Exportar handlers GET/POST para Next.js API Routes
- Crear contexto asíncrono para cada request

**Relación directa:** Importa de typeDefs, resolvers, y context

---

### 2. Contexto GraphQL
**`src/graphql/context.ts`** - *El puente entre autenticación y base de datos*
```
Función: Proveer datos compartidos a todos los resolvers
Relaciones: Conecta Auth0 + Prisma
```

**Responsabilidades:**
- Obtener sesión de usuario desde Auth0 (`auth0.getSession()`)
- Inyectar cliente Prisma para operaciones de BD
- Retornar objeto context con `{ user, prisma }`
- Definir tipo `Context` para tipado estático

**Relación directa:** Importa de auth0 y prisma

---

### 3. Schema GraphQL
**`src/graphql/schema/typeDefs.ts`** - *El contrato del API*
```
Función: Definir la estructura completa de la API GraphQL
Relaciones: Define lo que los resolvers deben implementar
```

**Responsabilidades:**
- Definir tipos: `User`, `Note`
- Definir queries: `me`, `myNotes`, `note`
- Definir mutations: `createNote`, `updateNote`, `deleteNote`
- Definir inputs: `CreateNoteInput`, `UpdateNoteInput`

**Relación directa:** Exportado a route.ts, genera types.ts

---

### 4. Lógica de Negocio
**`src/graphql/schema/resolvers.ts`** - *El corazón de las operaciones CRUD*
```
Función: Implementar toda la lógica de las operaciones GraphQL
Relaciones: Usa context para acceder a BD y validación
```

**Responsabilidades:**
- Implementar todas las queries y mutations
- Validación de autenticación en cada operación
- Creación automática de usuarios si no existen
- Verificación de ownership de datos
- Manejo de errores con códigos específicos (`UNAUTHENTICATED`, `NOT_FOUND`)

**Relación directa:** Recibe context, usa Prisma client

---

## 🔧 Capas de Infraestructura

### 5. Base de Datos (Prisma)
**`src/lib/prisma.ts`** - *Gestor de conexión a base de datos*
```
Función: Proveer conexión optimizada a PostgreSQL
Patrón: Singleton para evitar múltiples conexiones
```

**Responsabilidades:**
- Implementar patrón singleton
- Configurar URL de Supabase desde variables de entorno
- Prevenir múltiples conexiones en desarrollo

**Relación directa:** Exportado a context.ts y resolvers

---

### 6. Autenticación (Auth0)
**`src/lib/auth0.ts`** - *Configuración de Auth0 v4*
```
Función: Configurar cliente Auth0 para Next.js
Relaciones: Usado por middleware y context
```

**Responsabilidades:**
- Configurar Auth0Client con scope específico
- Definir parámetros de autorización (`response_type: 'code'`)
- Configurar scope: `openid profile email`

**Relación directa:** Exportado a context.ts y middleware.ts

---

## 🌐 Capas de Cliente

### 7. Cliente Apollo (Frontend)
**`src/lib/apollo-client.ts`** - *Puente frontend-backend*
```
Función: Configurar cliente Apollo para consumir GraphQL
Relaciones: Conecta frontend con /api/graphql
```

**Responsabilidades:**
- Configurar HttpLink a `/api/graphql`
- Configuración de cache `InMemoryCache`
- Fetch options con `cache: 'no-store'`
- Default options con `fetchPolicy: 'cache-and-network'`

**Relación directa:** Usado por apollo-provider.tsx

---

### 8. Provider React
**`src/components/apollo-provider.tsx`** - *Context provider para React*
```
Función: Proveer contexto Apollo a toda la app React
Relaciones: Envuelve la aplicación en layout
```

**Responsabilidades:**
- Componente wrapper que provee cliente Apollo
- Marcado como `'use client'` para Next.js App Router
- Proveer tipado con `ReactNode`

**Relación directa:** Importado en layout principal

---

## 🛡️ Middleware de Seguridad

### 9. Autenticación Global
**`src/middleware.ts`** - *Guardián de autenticación*
```
Función: Intercepta todas las requests para validar auth
Relaciones: Protege todas las rutas excepto estáticos
```

**Responsabilidades:**
- Aplicar middleware Auth0 a todas las rutas
- Excluir archivos estáticos y de Next.js con matcher
- Validar autenticación antes de llegar a API routes

**Relación directa:** Importa auth0.ts

---

## 🔨 Herramientas de Desarrollo

### 10. Generación de Tipos
**`codegen.ts`** - *Autogenerador de tipos TypeScript*
```
Función: Generar tipos estáticos desde schema GraphQL
Relaciones: Actualiza types.ts automáticamente
```

**Responsabilidades:**
- Configurar GraphQL Code Generator
- Leer typeDefs.ts y generar types.ts
- Plugin TypeScript para tipos estáticos

**Relación directa:** Usado por `npm run graphql:codegen`

---

## 🔄 Flujo de Interacción Completo

```
1. Request del Cliente
   ↓
2. middleware.ts (Auth0 validation)
   ↓
3. route.ts (Apollo Server handler)
   ↓
4. createContext() (session + prisma)
   ↓
5. resolvers.ts (lógica de negocio)
   ↓
6. prisma.ts (operaciones BD)
   ↓
7. Respuesta GraphQL
```

---

## 🔗 Relaciones Clave

- **Route ↔ Context ↔ Auth0/Prisma**: Cadena principal de datos
- **TypeDefs ↔ Resolvers**: Contrato vs implementación
- **CodeGen ↔ TypeDefs**: Generación automática de tipos
- **Apollo Client ↔ Route**: Frontend-Backend communication
- **Middleware ↔ Auth0**: Seguridad global

---

## 💡 Patrones de Diseño Implementados

1. **Singleton Pattern**: Prisma client para evitar múltiples conexiones
2. **Provider Pattern**: Apollo Provider para React context
3. **Middleware Pattern**: Auth0 middleware para seguridad global
4. **Factory Pattern**: `createApolloClient()` para instanciar cliente
5. **Dependency Injection**: GraphQL context para inyectar dependencias

---

## 📋 Resumen de Responsabilidades

| Archivo | Responsabilidad Principal | Capa |
|---------|-------------------------|------|
| `route.ts` | Exponer endpoint GraphQL | API |
| `context.ts` | Proveer datos compartidos | Contexto |
| `typeDefs.ts` | Definir contrato GraphQL | Schema |
| `resolvers.ts` | Implementar lógica de negocio | Lógica |
| `prisma.ts` | Gestión de conexión BD | Datos |
| `auth0.ts` | Configuración auth | Seguridad |
| `apollo-client.ts` | Cliente HTTP GraphQL | Cliente |
| `apollo-provider.tsx` | Provider React | UI |
| `middleware.ts` | Interceptor de auth | Middleware |
| `codegen.ts` | Generador de tipos | Herramientas |

Esta arquitectura proporciona separación clara de responsabilidades, tipado fuerte, seguridad integrada y escalabilidad óptima.