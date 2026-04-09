"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import AuthForgot from '../authForms/AuthForgot';
import { HelpCircle, ArrowLeft } from "lucide-react";
import { getCurrentUserDetails } from '@/lib/actions/user.check';
import { AuthLogo } from '@/components/AuthLogo';
import Link from 'next/link';

const ForgotPasword = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUserDetails();
      if (user) {
        router.push("/");
      }
    };
    checkUser();
  }, [router]);

  return (
    <PageContainer title="Forgot Password | BondKonnect" description="Reset your account password">
      <section className="min-h-screen flex items-center justify-center bg-background py-12 px-4 relative overflow-hidden transition-colors duration-500">
        {/* Uniform Top Gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        
        <div className="w-full max-w-[420px] relative z-10">
          <div className="flex flex-col items-center gap-8">
            <AuthLogo className="mb-2 transition-transform hover:scale-105 duration-300" />
            
            <div className="w-full bg-card rounded-[32px] border border-border shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-2 transition-all">
              <div className="mb-2 ml-4 mt-4">
                <Link href="/auth/login" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/60 hover:text-black transition-colors">
                  <ArrowLeft className="size-3" />
                  Back to Login
                </Link>
              </div>

              <AuthForgot
                icon={
                  <div className="size-14 rounded-2xl bg-black/5 flex items-center justify-center mb-4 transition-colors">
                    <HelpCircle className="size-7 text-black" />
                  </div>
                }
                title="Forgot Password"
                subtitle="Enter your email to receive a reset link"
                subtext={
                  <div className="flex items-center gap-1.5">
                    <span className="text-black opacity-60">Remembered?</span>
                    <Link href="/auth/login" className="font-black text-black underline underline-offset-4 hover:bg-black hover:text-white px-1 transition-all">
                      Sign In
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

export default ForgotPasword;
