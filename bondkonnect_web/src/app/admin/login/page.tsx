"use client";
import { UserRound } from 'lucide-react';
import { Box } from "@mui/material";
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import AuthLogin from '../authForms/AuthLogin';
import Image from 'next/image';

const Login = () => {
  return (
  <PageContainer title="Admin Login Page" description="this is Admin Login page">
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
          <AuthLogin
          
            icon={
              <UserRound className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
            }

            title="Admin Log In"
            subtitle="Enter your information to login"
            // subtext={
            //   <div className="mx-auto flex gap-1 text-sm">
            //   <p>Don&apos;t have an account yet?</p>
            //   <a href="/auth/role" className="underline">
            //     Sign Up
            //   </a>
            // </div>
            // }
            // socialauths={
            //   <Button variant="outline" className="w-full">
            //     <Globe className="mr-2 size-4" />
            //     Log In with Google
            //   </Button>

            // }
          />
        </div>
      </div>
    </section>
  </PageContainer>
  );
};

export default Login;
