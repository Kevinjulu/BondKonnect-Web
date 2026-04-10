"use client";
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import AuthOtp from '../authForms/AuthOtp';
import { KeyRound } from 'lucide-react';
import { AuthLogo } from '@/components/AuthLogo';

const OtpPage = () => {
  return (
  <PageContainer title="OTP Verification Page" description="this is OTP Verification page">
    <section className=" py-6">
      <div className="container">
        <div className="flex flex-col gap-4">
          <AuthLogo className="mb-2" />
          <AuthOtp
            icon={
              <KeyRound className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
            }
            title="OTP Verification"
            subtitle="Enter the code sent to your email"
          />
        </div>
      </div>
    </section>
  </PageContainer>
  );
};

export default OtpPage;
