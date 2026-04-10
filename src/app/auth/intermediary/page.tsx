"use client";
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import { AuthLogo } from '@/components/AuthLogo';

const IntermediaryPage = () => {
  return (
  <PageContainer title="Please Wait" description="Processing your request">
    <section className=" py-6">
      <div className="container">
        <div className="flex flex-col gap-4 items-center">
          <AuthLogo className="mb-8" />
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Please wait while we process your request...</p>
          </div>
        </div>
      </div>
    </section>
  </PageContainer>
  );
};

export default IntermediaryPage;
