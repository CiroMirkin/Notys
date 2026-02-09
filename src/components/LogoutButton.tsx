"use client";

import { Button } from "@heroui/react";

interface LogoutButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  onLogout?: () => void;
}

export default function LogoutButton({ isLoading = false, disabled = false, onLogout }: LogoutButtonProps) {
  const handleClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback: redirigir directamente
      window.location.href = "/auth/logout";
    }
  };

  return (
    <Button
      as="a"
      href="/auth/logout"
      color="danger"
      variant="flat"
      size="sm"
      onClick={handleClick}
      disabled={disabled}
      isLoading={isLoading}
      className="transition-all duration-200 hover:scale-105 active:scale-95"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/20 border-red-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Cerrando...</span>
        </span>
      ) : (
        "Cerrar sesión"
      )}
    </Button>
  );
}