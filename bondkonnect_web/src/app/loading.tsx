'use client'
import React from 'react';
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-background">
      <div className="mb-6 animate-pulse">
        <Image
          src="/images/logos/logo-c.svg"
          alt="BondKonnect"
          width={180}
          height={60}
          priority
        />
      </div>
      
      <div className="spinner"></div>
    </div>
  );
}
