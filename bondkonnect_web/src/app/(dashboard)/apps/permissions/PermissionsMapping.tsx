"use client"

import { useState } from "react"
import { PermissionMappingTable } from "../../components/apps/permissions/Permissions-Table"
import PageContainer from "../../components/container/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

export default function MapPermissionsPage({ userDetails }: { userDetails: UserData }) {
  // Use URL search params to track the active role
  const searchParams = useSearchParams();
  // const router = useRouter();
  const activeRole = searchParams.get('role') || 'Admin';

  // const handleRoleChange = (role: string) => {
  //   // Update the URL when role changes
  //   router.push(`/apps/permissions?role=${role}`);
  // };

  // Define the roles with their colors
  const roles = [
    { name: 'Admin', color: '#4f46e5' },
    { name: 'Individual', color: '#0ea5e9' },
    { name: 'Agent', color: '#10b981' },
    { name: 'Corporate', color: '#f59e0b' },
    { name: 'Broker', color: '#ec4899' },
    { name: 'Authorized Dealer', color: '#8b5cf6' }
  ];

  return (
    <PageContainer title="Permission Mapping Page" description="this is Permission Mapping page">
      <div className="space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Permissions Mapping</h2>
        </div>

        {/* Role selector */}
        {/* <div className="flex flex-wrap gap-2 mb-6">
          {roles.map((role) => (
            <button
              key={role.name}
              className={`px-3 py-1 rounded-md flex items-center space-x-2 border transition-colors ${
                activeRole === role.name ? 'bg-gray-100' : 'bg-white'
              }`}
              style={{ borderColor: role.color }}
              onClick={() => handleRoleChange(role.name)}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }}></div>
              <span>{role.name}</span>
            </button>
          ))}
        </div> */}

        {/* Pass the selected role to the table component */}
        <PermissionMappingTable userDetails={userDetails} />
      </div>
    </PageContainer>
  )
}

