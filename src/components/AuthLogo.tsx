import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import LogoImage from "@/components/ui/LogoImage";
import { useLogoSrc } from "@/hooks/use-logo-src";

interface AuthLogoProps {
  className?: string;
}

export const AuthLogo = ({ className }: AuthLogoProps) => {
  const logoSrc = useLogoSrc('auth');

  return (
    <div className={`flex justify-center w-full ${className}`}>
      <Link href="/">
        <LogoImage
          src={logoSrc}
          alt="BondKonnect Logo"
          width={200}
          height={54}
          priority
          className="h-10 w-auto object-contain"
        />
      </Link>
    </div>
  );
};
