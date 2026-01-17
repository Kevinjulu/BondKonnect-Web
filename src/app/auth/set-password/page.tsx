"use client";
import { useState, useEffect } from "react";

// import { Button } from '@/app/components/ui/button';
import {  Box } from "@mui/material";
// import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from '@/app/components/ui/card';
// import { Input } from '@/app/components/ui/input';
// import { Label } from '@/app/components/ui/label';
import { useRouter, useSearchParams } from "next/navigation";
import PageContainer from '../../(dashboard)/components/container/PageContainer';
// import AuthLogin from '../authForms/AuthLogin';
import AuthSetPassword from '../authForms/AuthSetPassword';
import { TbPasswordFingerprint } from "react-icons/tb";
// next import
import Image from "next/image";
import { generateCsrfToken } from "@/app/lib/actions/api.actions";


const SetPassword = () => {
  const router = useRouter();
  const searchParams: any = useSearchParams();
  const email: any = decodeURIComponent(searchParams.get("e") || "");

  const [csrfToken, setCsrfToken] = useState<{
    token: string;
    timestamp: number;
  } | null>(null);

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

  return (
  <PageContainer title="Set Password Page" description="this is Set Password page">
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
         
          <AuthSetPassword
          
            icon={
              <TbPasswordFingerprint className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
            }

            title="Set Password"
            subtitle="Set a strong password"

            email={email || ""}
            csrfToken={csrfToken}
          />
        </div>
      </div>
    </section>
  </PageContainer>
  );
};

export default SetPassword;
