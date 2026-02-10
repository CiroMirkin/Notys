import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/graphql/schema/typeDefs';
import { resolvers } from '@/graphql/schema/resolvers';
import { createContext } from '@/graphql/context';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
});

async function handler(req: Request) {
  return startServerAndCreateNextHandler(server, {
    context: async () => {
      const context = await createContext();
      return context;
    }
  })(req);
}

export { handler as GET, handler as POST };