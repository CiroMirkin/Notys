'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { Card, CardHeader, CardBody, Avatar, Button } from '@heroui/react'

export default function Profile() {
  const { user, isLoading, error } = useUser()
  
  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardBody className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            <div className="h-2 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </CardBody>
      </Card>
    )
  }
  
  if (error) {
    return (
      <Card className="w-full max-w-md border-red-200">
        <CardHeader className="bg-red-50 text-red-600">
          Error de autenticación
        </CardHeader>
        <CardBody>
          <div className="text-center text-red-600">
            <p>No se pudo cargar el perfil del usuario.</p>
            <p className="text-sm text-red-500 mt-2">
              {error.message || 'Por favor, intenta nuevamente.'}
            </p>
          </div>
        </CardBody>
      </Card>
    )
  }
  
  if (!user) {
    return (
      <Card className="w-full max-w-md">
        <CardBody className="text-center py-8">
          <div className="text-gray-500">
            No hay sesión activa
          </div>
        </CardBody>
      </Card>
    )
  }
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="bg-gray-50">
        Perfil de Usuario
      </CardHeader>
      <CardBody className="flex items-center gap-4 py-6">
        <Avatar
          src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
          alt={user.name || 'Usuario'}
          size="lg"
          className="flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-gray-900">
            {user.name}
          </h3>
          <p className="text-gray-600 text-sm">
            {user.email}
          </p>
          {user.email_verified ? (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                ✓ Verificado
              </span>
            </div>
          ) : (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                ⚠ No verificado
              </span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}