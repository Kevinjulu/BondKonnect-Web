import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface AuthLogoProps {
  className?: string;
}

export const AuthLogo = ({ className }: AuthLogoProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && resolvedTheme === "light" 
    ? "/images/logos/logo-c.png" 
    : "/images/logos/logo.png";

  return (
    <div className={`flex justify-center w-full ${className}`}>
      <Link href="/">
        <Image
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
