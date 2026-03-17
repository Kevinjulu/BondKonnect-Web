"use client";

import { useSearchParams } from "next/navigation";
import Link from 'next/link';
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import AuthLogin from '../authForms/AuthLogin';
import { AuthLogo } from '@/components/AuthLogo';
import { UserRound, LogIn } from 'lucide-react';

const Login = () => {
  return (
    <PageContainer title="Login | BondKonnect" description="Access your BondKonnect workstation">
      <section className="min-h-screen flex items-center justify-center bg-white py-12 px-4 relative overflow-hidden transition-colors duration-500">
        {/* Uniform Top Gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        
        <div className="w-full max-w-[420px] relative z-10">
          <div className="flex flex-col items-center gap-8">
            <AuthLogo className="mb-2 transition-transform hover:scale-105 duration-300 dark:brightness-200" />
            
            <div className="w-full bg-card rounded-[32px] border border-border shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-2 transition-all">
              <AuthLogin
                icon={
                  <div className="size-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-4 transition-colors">
                    <LogIn className="size-7 text-foreground" />
                  </div>
                }
                title="Log In"
                subtitle="Enter your credentials to access your portal"
                subtext={
                  <div className="flex items-center gap-1.5">
                    <span className="text-foreground opacity-60">New to the platform?</span>
                    <Link href="/auth/role" className="font-black text-foreground underline underline-offset-4 hover:bg-foreground hover:text-background px-1 transition-all">
                      Sign Up
                    </Link>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default Login;
