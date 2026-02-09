"use client";

import { Button } from "@heroui/react";

interface LoginButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
}

export default function LoginButton({ isLoading = false, disabled = false }: LoginButtonProps) {
  return (
    <Button
      as="a"
      href="/auth/login"
      color="primary"
      variant="flat"
      size="sm"
      isLoading={isLoading}
      disabled={disabled}
      className="transition-all duration-200 hover:scale-105 active:scale-95"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/20 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Autenticando...</span>
        </span>
      ) : (
        "Iniciar sesión"
      )}
    </Button>
  );
}