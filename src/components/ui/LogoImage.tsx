"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

interface LogoImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallback?: string;
}

export default function LogoImage({ src, fallback = "/images/logos/logo.png", alt, ...rest }: LogoImageProps) {
  const [current, setCurrent] = useState(src);

  // Sync state with src prop when it changes
  useEffect(() => {
    setCurrent(src);
  }, [src]);

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
