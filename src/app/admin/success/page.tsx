"use client";

// import { Button } from '@/components/ui/button';
import { Grid, Box, Stack, Typography } from "@mui/material";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import PageContainer from '../../(dashboard)/components/container/PageContainer';
// import AuthLogin from '../authForms/AuthLogin';
import AuthSuccess from '../authForms/AuthSuccess';
import { IoMailOutline } from "react-icons/io5";
// next import
import LogoImage from "@/components/ui/LogoImage";
const Success = () => {
  return (
  <PageContainer title="Success Page" description="this is Success page">
    <section className=" py-6">
      <div className="container">
        <div className="flex flex-col gap-4">
        <Box display="flex" justifyContent="center" width="100%">
            <LogoImage
              src="/images/logos/logo-c.svg"
              alt="logo"
              width={300}
              height={60}
            />
          </Box>
          <AuthSuccess
            icon={
              <IoMailOutline className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
            }
            title="Mail Sent Successfully!"
            subtitle="Please check your email address for your Sign Up link. You will be redirected to the Log in page."
            // subtext={
            //   <div className="mx-auto flex gap-1 text-sm">
            //   <p>Don&apos;t have an account yet?</p>
            //   <a href="/auth/sign-up" className="underline">
            //     Sign Up
            //   </a>
            // </div>
            // }

          />
        </div>
      </div>
    </section>
  </PageContainer>
  );
};

export default Success;
