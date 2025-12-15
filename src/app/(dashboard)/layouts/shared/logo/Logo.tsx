import { FC } from "react";
import { useSelector } from "@/app/store/hooks";
import Link from "next/link";
import { styled } from "@mui/material";
import { AppState } from "@/app/store/store";
import Image from "next/image";

const Logo = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  
  const LinkStyled = styled(Link)(() => ({
    
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? "40px" : "180px",
    overflow: "hidden",
    display: "block",
  }));

  if (customizer.activeDir === "ltr") {
    return (
      <LinkStyled href="#">
        {customizer.activeMode === "dark" ? (
          <Image
            src="/images/logos/logo-dark.svg"
            alt="logo"
            height={customizer.TopbarHeight}
            width={400}
            priority
             className="" 
          />
        ) : (
          <Image
            src={"/images/logos/logo-c.svg"}
            alt="logo"
            height={customizer.TopbarHeight}
            width={400}
            priority
          />
        )}
      </LinkStyled>
    );
  }

  return (
    <LinkStyled href="/auth/login">
      {customizer.activeMode === "dark" ? (
        <Image
          src="/images/logos/logo-dark.svg"
          alt="logo"
          height={customizer.TopbarHeight}
          width={100}
          priority
        />
      ) : (
        <Image
          src="/images/logos/logo-c.svg"
          alt="logo"
          height={customizer.TopbarHeight}
          width={100}
          priority
        />
      )}
    </LinkStyled>
  );
};

export default Logo;
