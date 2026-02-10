import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Auth0Provider } from '@auth0/nextjs-auth0/client'
import { ApolloProviderWrapper } from '@/components/apollo-provider'
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
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
            </ThemeProvider>
          </ApolloProviderWrapper>
        </Auth0Provider>
      </body>
    </html>
  )
}