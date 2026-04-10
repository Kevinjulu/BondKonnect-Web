"use client";
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import AuthSuccess from '../authForms/AuthSuccess';
import { IoMailOutline } from "react-icons/io5";
import { AuthLogo } from '@/components/AuthLogo';

const Success = () => {
  return (
  <PageContainer title="Success Page" description="this is Success page">
    <section className=" py-6">
      <div className="container">
        <div className="flex flex-col gap-4">
          <AuthLogo className="mb-2" />
          <AuthSuccess
            icon={
              <IoMailOutline className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
            }
            title="Mail Sent Successfully!"
            subtitle="Please check your email address for your Sign Up link. You will be redirected to the Log in page."
          />
        </div>
      </div>
    </section>
  </PageContainer>
  );
};

export default Success;
