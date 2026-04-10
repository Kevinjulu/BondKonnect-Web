"use client";
import { Box } from "@mui/material";
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import LogoImage from "@/components/ui/LogoImage";
import AuthSuccess from '../authForms/AuthSuccess';
import { IoMailOutline } from "react-icons/io5";

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
              className="h-9"
              width={400}
              height={36}
            />
          </Box>
          
          <AuthSuccess
          
            icon={
              <IoMailOutline className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
            }
            // subtext={
            //   <div className="mx-auto flex gap-1 text-sm">
            //   <p>Don&apos;t have an account yet?</p>
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
