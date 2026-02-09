'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { Card, CardHeader, CardBody, Button } from '@heroui/react'
import Profile from '@/components/Profile'

export default function HomePage() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Bienvenido a Notys
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Tu aplicación de notas segura y moderna
          </p>
        </div>
        
        {!user ? (
          <div className="text-center">
            <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-sm shadow-xl">
              <CardHeader className="bg-blue-600 text-white">
                <h2 className="text-2xl font-semibold">
                  📝 Notys - Tus Notas en la Nube
                </h2>
              </CardHeader>
              <CardBody className="text-gray-700">
                <p className="mb-6">
                  La aplicación de notas más segura con autenticación Auth0.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-12 h-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-300 border-t-transparent"></div>
                  </div>
                  <p className="text-sm text-blue-600">
                    Iniciando servidor Auth0...
                  </p>
                </div>
              </CardBody>
            </Card>
            
            <div className="mt-8">
              <Button
                color="primary"
                size="lg"
                as="a"
                href="/auth/login"
                className="w-full"
              >
                Iniciar Sesión
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    ¡Hola, {user?.name}! 👋
                  </h2>
                  <p className="text-blue-100">
                    Bienvenido de nuevo a tu aplicación de notas
                  </p>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <Profile />
              </div>
            </div>
          </div>
    )
    }
  </div>
  </div>
  )
}