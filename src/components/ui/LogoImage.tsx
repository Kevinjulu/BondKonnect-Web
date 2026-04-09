"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface LogoImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallback?: string;
}

export default function LogoImage({ src, fallback = "/images/logos/logo-c.png", alt, ...rest }: LogoImageProps) {
  const [current, setCurrent] = useState(src);

  return (
    // next/image supports onError on client components
    <Image
      src={current}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
      alt={alt ?? "BondKonnect"}
      {...rest}
    />
  );
}
