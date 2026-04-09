import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import LogoImage from "@/components/ui/LogoImage";

interface AuthLogoProps {
  className?: string;
}

export const AuthLogo = ({ className }: AuthLogoProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && resolvedTheme === "dark" 
    ? "/images/logos/logo-dark.svg" 
    : "/images/logos/logo-c.png";

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
