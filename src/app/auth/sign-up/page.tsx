"use client";

import { UserRound } from 'lucide-react';
import { Box } from "@mui/material";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import PageContainer from '../../(dashboard)/components/container/PageContainer';
// import AuthLogin from '../authForms/AuthLogin';
import AuthSignUp from '../authForms/AuthSignUp';


const SignUp = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  console.log(role);




  return (
  <PageContainer title="Sign Up Page" description="this is Sign Up page">
    <section className=" py-6">
      <div className="container">
        <div className="flex flex-col gap-4">
         <Box display="flex" justifyContent="center" width="100%">

            <Image
              src="/images/logos/logo-c.svg"
              alt="logo"
              className="h-9"
              width={400}
              height={36}
            />

          </Box>
          <AuthSignUp
          
            icon={
              <UserRound className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
            }

            title="Sign Up"
            subtitle="Enter your information to sign up"
            subtext={
              <div className="mx-auto flex gap-1 text-sm">
              <p>Already Registered?</p>
              <a href="/auth/login" className="underline">
                Sign In
              </a>
            </div>
            }

            role={role ?? undefined}
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

export default SignUp;
