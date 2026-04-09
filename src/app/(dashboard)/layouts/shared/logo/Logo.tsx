import { FC, useEffect, useState } from "react";
import { useSelector } from "@/store/hooks";
import Link from "next/link";
import { styled } from "@mui/material";
import { AppState } from "@/store/store";
import Image from "next/image";
import { useTheme } from "next-themes";
import LogoImage from "@/components/ui/LogoImage";

const Logo = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && resolvedTheme === "dark" 
    ? "/images/logos/logo-dark.svg" 
    : "/images/logos/logo-c.png";
  
  const LinkStyled = styled(Link)(() => ({
    
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? "40px" : "180px",
    overflow: "hidden",
    display: "block",
  }));

  if (customizer.activeDir === "ltr") {
    return (
      <LinkStyled href="#">
        <LogoImage
          src={logoSrc}
          alt="logo"
          height={customizer.TopbarHeight}
          width={180}
          priority
          className="h-full w-auto object-contain"
        />
      </LinkStyled>
    );
  }

  return (
    <LinkStyled href="/auth/login">
      <LogoImage
        src={logoSrc}
        alt="logo"
        height={customizer.TopbarHeight}
        width={180}
        priority
        className="h-full w-auto object-contain"
      />
    </LinkStyled>
  );
};

export default Logo;

