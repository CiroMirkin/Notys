import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { Auth0Provider } from '@auth0/nextjs-auth0/client'
import { ApolloProviderWrapper } from '@/components/apollo-provider'
import { Providers } from './providers'
import Navbar from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Notys - App de Notas',
  description: 'Una aplicación de notas simple-',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Auth0Provider>
          <ApolloProviderWrapper>
            <Providers>
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
            </Providers>
          </ApolloProviderWrapper>
        </Auth0Provider>
      </body>
    </html>
  )
}