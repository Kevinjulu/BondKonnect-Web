"use client";

// import { Button } from '@/app/components/ui/button';
import { Grid, Box, Stack, Typography } from "@mui/material";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from '@/app/components/ui/card';
// import { Input } from '@/app/components/ui/input';
// import { Label } from '@/app/components/ui/label';
import PageContainer from '../../(dashboard)/components/container/PageContainer';
// import AuthLogin from '../authForms/AuthLogin';
import AuthOtp from '../authForms/AuthOtp';
import { TbPassword } from "react-icons/tb";
// next import
import Image from "next/image";
const Otp = () => {
  return (
  <PageContainer title="OTP Page" description="this is OTP page">
    <section className=" py-6">
      <div className="container">
        <div className="flex flex-col gap-4">
         <Box display="flex" justifyContent="center" width="100%">

            <Image
              src="/images/logos/logo-c.svg"
              alt="logo"
              className="h-9"
              width={400}
              height={100}
            />

          </Box>
          
         
          <AuthOtp
          
            icon={
              <TbPassword className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
            }

            title="Admin OTP"
            subtitle="Enter the code sent to your email"
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

export default Otp;
