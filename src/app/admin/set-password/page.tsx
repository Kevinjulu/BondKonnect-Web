"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import AuthSetPassword from '../authForms/AuthSetPassword';
import { TbPasswordFingerprint } from "react-icons/tb";
import { AuthLogo } from '@/components/AuthLogo';
import { generateCsrfToken } from "@/lib/actions/api.actions";

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
          <AuthLogo className="mb-2" />
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
