"use client";
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import AuthSignUp from '../authForms/AuthSignUp';
import { UserPlus } from 'lucide-react';
import { AuthLogo } from '@/components/AuthLogo';

const SignUp = () => {
  return (
  <PageContainer title="Admin Sign Up Page" description="this is Admin Sign Up page">
    <section className=" py-6">
      <div className="container">
        <div className="flex flex-col gap-4">
          <AuthLogo className="mb-2" />
          <AuthSignUp
            icon={
              <UserPlus className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
            }
            title="Admin Sign Up"
            subtitle="Create an admin account"
          />
        </div>
      </div>
    </section>
  </PageContainer>
  );
};

export default SignUp;
