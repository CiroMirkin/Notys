import { GraphQLError } from 'graphql';

export const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (!context.user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      let user = await context.prisma.user.findUnique({
        where: { auth0Id: context.user.sub },
        include: { notes: true }
      });

      if (!user) {
        user = await context.prisma.user.create({
          data: {
            auth0Id: context.user.sub,
            email: context.user.email,
            name: context.user.name,
            avatar: context.user.picture
          },
          include: { notes: true }
        });
      }

      return user;
    },

    myNotes: async (_parent: any, _args: any, context: any) => {
      if (!context.user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const user = await context.prisma.user.findUnique({
        where: { auth0Id: context.user.sub }
      });

      if (!user) {
        return [];
      }

      return context.prisma.note.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
        include: { user: true }
      });
    },

    note: async (_parent: any, args: { id: string }, context: any) => {
      if (!context.user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const user = await context.prisma.user.findUnique({
        where: { auth0Id: context.user.sub }
      });

      if (!user) {
        throw new GraphQLError('Usuario no encontrado');
      }

      const note = await context.prisma.note.findUnique({
        where: { id: args.id },
        include: { user: true }
      });

      if (!note || note.userId !== user.id) {
        throw new GraphQLError('Nota no encontrada', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      return note;
    }
  },

  Mutation: {
    createNote: async (_parent: any, args: { input: { title: string; content: string } }, context: any) => {
      if (!context.user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      let user = await context.prisma.user.findUnique({
        where: { auth0Id: context.user.sub }
      });

      if (!user) {
        user = await context.prisma.user.create({
          data: {
            auth0Id: context.user.sub,
            email: context.user.email,
            name: context.user.name,
            avatar: context.user.picture
          }
        });
      }

      return context.prisma.note.create({
        data: {
          title: args.input.title,
          content: args.input.content,
          userId: user.id
        },
        include: { user: true }
      });
    },

    updateNote: async (_parent: any, args: { id: string; input: { title?: string; content?: string } }, context: any) => {
      if (!context.user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const user = await context.prisma.user.findUnique({
        where: { auth0Id: context.user.sub }
      });

      if (!user) {
        throw new GraphQLError('Usuario no encontrado');
      }

      const note = await context.prisma.note.findUnique({
        where: { id: args.id }
      });

      if (!note || note.userId !== user.id) {
        throw new GraphQLError('Nota no encontrada', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      return context.prisma.note.update({
        where: { id: args.id },
        data: args.input,
        include: { user: true }
      });
    },

    deleteNote: async (_parent: any, args: { id: string }, context: any) => {
      if (!context.user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const user = await context.prisma.user.findUnique({
        where: { auth0Id: context.user.sub }
      });

      if (!user) {
        throw new GraphQLError('Usuario no encontrado');
      }

      const note = await context.prisma.note.findUnique({
        where: { id: args.id }
      });

      if (!note || note.userId !== user.id) {
        throw new GraphQLError('Nota no encontrada', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      await context.prisma.note.delete({
        where: { id: args.id }
      });

      return true;
    }
  }
};