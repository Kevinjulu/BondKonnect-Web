"use client";
import { useRef, useState, useEffect } from "react";

import { Globe, UserRound } from 'lucide-react';
// import { Button } from '@/components/ui/button';
import { Grid, Box, Stack, Typography } from "@mui/material";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from "next/navigation";
import PageContainer from '../../(dashboard)/components/container/PageContainer';
// import AuthSignUp from '../authForms/AuthSignUp';
import IntermediaryRegistration from '../authForms/IntermediaryRegistration';
import { generateCsrfToken } from "@/lib/actions/api.actions";
// next import
import Image from "next/image";
const IntermediaryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("e");
  const token = searchParams.get("t");
  const signature = searchParams.get("s") || "string";
  const is_reset = searchParams.get("is_res") === "1";

  const [csrfToken, setCsrfToken] = useState<{ token: string; timestamp: number; } | null>(null);


  useEffect(() => {
    if (csrfToken) {
      return;
    }

    const fetchCsrfToken = async () => {
      try {
        const token_data = await generateCsrfToken();
        if (token_data?.data) {
          setCsrfToken(token_data.data);
        } else {
          console.error("Failed to generate CSRF token");
        }
      } catch (error) {
        console.error("Error generating CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, [csrfToken]);

  if (!email && !token && !signature) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Invalid or Expired Link</h1>
        <p className="text-gray-600">Please request a new verification link.</p>
      </div>
    );
  }

  return (
    <PageContainer title="Complete Registration" description="Complete your registration">
      <section className="py-6">
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
            <IntermediaryRegistration
              icon={
                <UserRound className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
              }
              title="Complete Your Registration"
              subtitle="Please complete your registration to continue"
              email={email || ""}
              csrfToken={csrfToken}
              token={token || ""}
              signature={signature}
              is_reset={is_reset}

            />
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default IntermediaryPage; 
