"use client";

import { useSearchParams } from "next/navigation";
import Link from 'next/link';
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import AuthSignUp from '../authForms/AuthSignUp';
import { AuthLogo } from '@/components/AuthLogo';
import { UserRound } from 'lucide-react';

const SignUp = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "individual";

  return (
    <PageContainer title="Sign Up | BondKonnect" description="Create your BondKonnect account">
      <section className="min-h-screen flex items-center justify-center bg-background py-12 px-4 relative overflow-hidden transition-colors duration-500">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        
        <div className="w-full max-w-[480px] relative z-10">
          <div className="flex flex-col items-center gap-8">
            <AuthLogo className="mb-2 transition-transform hover:scale-105 duration-300 dark:brightness-200" />
            
            <div className="w-full bg-card rounded-[32px] border border-border shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-2 transition-all">
              <AuthSignUp
                icon={
                  <div className="size-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-4 transition-colors">
                    <UserRound className="size-7 text-foreground" />
                  </div>
                }
                title="Sign Up"
                subtitle={`Join BondKonnect as an ${role}`}
                subtext={
                  <div className="flex items-center gap-1.5">
                    <span className="text-foreground opacity-60">Already Registered?</span>
                    <Link href="/auth/login" className="font-black text-foreground underline underline-offset-4 hover:bg-foreground hover:text-background px-1 transition-all">
                      Sign In
                    </Link>
                  </div>
                }
                role={role}
              />
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default SignUp;
