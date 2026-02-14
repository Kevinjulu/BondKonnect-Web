"use client";
import Link from 'next/link';
import { Globe, UserRound } from 'lucide-react';
// import { Button } from '@/components/ui/button';
import { Grid, Box, Stack, Typography } from "@mui/material";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import AuthLogin from '../authForms/AuthLogin';
import { AuthLogo } from '@/components/AuthLogo';

const Login = () => {
  return (
  <PageContainer title="Login Page" description="this is Login page">
    <section className=" py-6">
      <div className="container">
        <div className="flex flex-col gap-4">
          <AuthLogo className="mb-4" />
          <AuthLogin
          
            icon={
              <UserRound className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
            }

            title="Log In"
            subtitle="Enter your information to login"
            subtext={
              <div className="mx-auto flex gap-1 text-sm">
              <p>Don&apos;t have an account yet?</p>
              <Link href="/auth/role" className="underline">
                Sign Up
              </Link>
            </div>
            }
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
