import { FC, useEffect, useState } from "react";
import { useSelector } from "@/store/hooks";
import Link from "next/link";
import { styled } from "@mui/material";
import { AppState } from "@/store/store";
import Image from "next/image";
import { useTheme } from "next-themes";
import LogoImage from "@/components/ui/LogoImage";
import { useLogoSrc } from "@/hooks/use-logo-src";

const Logo = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const logoSrc = useLogoSrc('dashboard');

  const LinkStyled = styled(Link)(() => ({

    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? "40px" : "180px",
    overflow: "hidden",
    display: "block",
  }));

  if (customizer.activeDir === "ltr") {
    return (
      <LinkStyled href="/">
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
    <LinkStyled href="/">
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

