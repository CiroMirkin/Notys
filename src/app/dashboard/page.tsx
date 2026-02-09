
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import Profile from "@/components/Profile";
import { Card, CardHeader, CardBody } from '@heroui/react';

export default async function DashboardPage() {
  const session = await auth0.getSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Profile />
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Acciones</h2>
          </CardHeader>
          <CardBody>
            <LogoutButton />
          </CardBody>
        </Card>
      </div>
    </div>
  );
} 