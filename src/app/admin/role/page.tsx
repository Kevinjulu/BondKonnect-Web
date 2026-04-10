"use client";
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import AuthRole from '../authForms/AuthRole';
import { UserCheck } from 'lucide-react';
import { AuthLogo } from '@/components/AuthLogo';

const RoleSelection = () => {
  return (
  <PageContainer title="Role Selection Page" description="this is Role Selection page">
    <section className=" py-6">
      <div className="container">
        <div className="flex flex-col gap-4">
          <AuthLogo className="mb-2" />
          <AuthRole
            icon={
              <UserCheck className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
            }
            title="Select Your Role"
            subtitle="Choose how you will use BondKonnect"
          />
        </div>
      </div>
    </section>
  </PageContainer>
  );
};

export default RoleSelection;
