import { auth0 } from "@/lib/auth0";
import { Card, CardHeader, CardBody } from '@heroui/react'
import Profile from '@/components/Profile'

export default async function HomePage() {
   const session = await auth0.getSession();
  const user = session?.user;

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
                <p>notas</p>
              </CardBody>
            </Card>
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