"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Spinner,
} from "@heroui/react";
import Link from "next/link";
import Profile from "@/components/Profile";

export default function Navbar() {
  const { user, isLoading } = useUser();

  return (
    <HeroNavbar>
      <NavbarBrand>
        <Link href="/" className="font-bold text-inherit">
          NOTYS
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        {isLoading ? (
          <NavbarItem>
            <Spinner size="sm" />
          </NavbarItem>
        ) : user ? (
          <>
            <NavbarItem className="hidden sm:flex">
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
            
            <NavbarItem>
              <Profile />
            </NavbarItem>
          </>
        ) : (
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
        )}
      </NavbarContent>
    </HeroNavbar>
  );
}