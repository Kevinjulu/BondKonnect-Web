"use client";
import { UserRound } from 'lucide-react';
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import AuthLogin from '../authForms/AuthLogin';
import { AuthLogo } from '@/components/AuthLogo';

const Login = () => {
  return (
  <PageContainer title="Admin Login Page" description="this is Admin Login page">
    <section className=" py-6">
      <div className="container">
        <div className="flex flex-col gap-4">
          <AuthLogo className="mb-2" />
          <AuthLogin
            icon={
              <UserRound className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
            }
            title="Admin Log In"
            subtitle="Enter your information to login"
          />
        </div>
      </div>
    </section>
  </PageContainer>
  );
};

export default Login;
