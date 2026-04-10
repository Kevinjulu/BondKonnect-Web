"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import AuthForgot from '../authForms/AuthForgot';
import { GoQuestion } from "react-icons/go";
import { getCurrentUserDetails } from '@/lib/actions/user.check';
import { AuthLogo } from '@/components/AuthLogo';

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
  <PageContainer title="Forgot Password " description="this is Forgot Password page">
    <section className=" py-6">
      <div className="container">
        <div className="flex flex-col gap-4">
          <AuthLogo className="mb-2" />
          <AuthForgot
            icon={
              <GoQuestion className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
            }
            title="Forgot Password"
            subtitle="Enter email and check for link to reset your password."
          />
        </div>
      </div>
    </section>
  </PageContainer>
  );
};

export default ForgotPasword;
