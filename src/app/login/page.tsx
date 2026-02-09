import LoginButton from "@/components/LoginButton";
import { Card, CardHeader, CardBody } from '@heroui/react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center">
            Iniciar Sesión
          </h2>
        </CardHeader>
        <CardBody className="flex flex-col items-center gap-4">
          <p className="text-center text-gray-600">
            Accede a tu cuenta para continuar
          </p>
          <LoginButton />
        </CardBody>
      </Card>
    </div>
  )
}