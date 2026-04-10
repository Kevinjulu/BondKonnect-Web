"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from "@mui/material";
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import AuthForgot from '../authForms/AuthForgot';
import { GoQuestion } from "react-icons/go";
import { getCurrentUserDetails } from '@/lib/actions/user.check';
import LogoImage from '@/components/ui/LogoImage';

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
        <Box display="flex" justifyContent="center" width="100%">
            <LogoImage
              src="/images/logos/logo-c.svg"
              alt="logo"
              className="h-9"
              width={400}
              height={36}
            />
          </Box>
          <AuthForgot
            icon={
              <GoQuestion className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
            }
            title="Forgot Password"
            subtitle="Enter email and check for link to reset your password."
            // subtext={
            //   <div className="mx-auto flex gap-1 text-sm">
            //   <p>Don&apos;t have an account yet?</p>
            //   <a href="/auth/sign-up" className="underline">
            //     Sign Up
            //   </a>
            // </div>
            // }
            // socialauths={
            //   <Button variant="outline" className="w-full">
            //     <Globe className="mr-2 size-4" />
            //     Sign up with Google
            //   </Button>
            // }
          />
        </div>
      </div>
    </section>
  </PageContainer>
  );
};

export default ForgotPasword;
