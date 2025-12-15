"use client";
import { useEffect,useState } from "react";
import { Input } from "@/app/components/ui/input"
import { useRouter } from "next/navigation";

export function Search({ userDetails }: { userDetails: UserData }) {
  return (
    <div>
      <Input
        type="search"
        placeholder="Search..."
        className="md:w-[100px] lg:w-[300px]"
      />
    </div>
  )
}