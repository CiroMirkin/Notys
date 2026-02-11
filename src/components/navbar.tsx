import { auth0 } from "@/lib/auth0";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import Link from "next/link";

export default async function Navbar() {
  const session = await auth0.getSession();
  const user = session?.user;

  const renderNavbarItems = () => {
    if (user) {
      return (
        <>
          <NavbarItem>
            <Button 
              as={Link} 
              href="/dashboard" 
              variant="light" 
              size="sm"
            >
              Dashboard
            </Button>
          </NavbarItem>
          
          <NavbarItem className="hidden sm:flex">
            <span className="text-sm">{user.name}</span>
          </NavbarItem>
          
          <NavbarItem>
            <Button
              as="a"
              href="/auth/logout"
              color="danger"
              variant="flat"
              size="sm"
            >
              Cerrar Sesión
            </Button>
          </NavbarItem>
        </>
      );
    }

    return (
      <NavbarItem>
        <Button
          as="a"
          href="/auth/login"
          color="primary"
          variant="flat"
          size="sm"
        >
          Iniciar Sesión
        </Button>
      </NavbarItem>
    );
  };

  return (
    <HeroNavbar>
      <NavbarBrand>
        <Link href="/" className="font-bold text-inherit">
          NOTYS
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        {renderNavbarItems()}
      </NavbarContent>
    </HeroNavbar>
  );
}