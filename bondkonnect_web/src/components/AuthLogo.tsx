import Image from "next/image";
import Link from "next/link";

interface AuthLogoProps {
  className?: string;
}

export const AuthLogo = ({ className }: AuthLogoProps) => {
  return (
    <div className={`flex justify-center w-full ${className}`}>
      <Link href="/">
        <Image
          src="/images/logos/logo-c.png"
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
