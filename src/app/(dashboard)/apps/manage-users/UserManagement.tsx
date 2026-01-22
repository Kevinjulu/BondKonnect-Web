"use client";
import { useState } from "react";
import Image from "next/image";
import PageContainer from "../../components/container/PageContainer";
import UserManagementPage from "../../components/apps/manage-users/UserManagementTable";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Add other properties as needed
}

export default function ManageUsersPage({ userDetails }: { userDetails: UserData }) {
  return (
    <PageContainer title="User Management" description="Manage system users and permissions">
      <div className="min-h-screen bg-white text-black p-4 md:p-8">
        <UserManagementPage />
      </div>      
    </PageContainer>
  );
}
