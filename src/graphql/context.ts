import { auth0 } from '@/lib/auth0';
import { prisma } from '@/lib/prisma';

export async function createContext() {
  const session = await auth0.getSession();
  
  return {
    user: session?.user || null,
    prisma
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;