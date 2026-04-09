"use client";
import { Box } from "@mui/material";
import PageContainer from '../../(dashboard)/components/container/PageContainer';
import Image from "next/image";
import AuthSuccess from '../authForms/AuthSuccess';
import { IoMailOutline } from "react-icons/io5";

const Success = () => {
  return (
  <PageContainer title="Success Page" description="this is Success page">
    <section className=" py-6">
      <div className="container">
        <div className="flex flex-col gap-4">
        <Box display="flex" justifyContent="center" width="100%">

          <Image
            src="/images/logos/logo-c.svg"
            alt="logo"
            className="h-9"
            width={400}
            height={36}
            import Image from "next/image";
            import LogoImage from "@/components/ui/LogoImage";

          </Box>
          
          <AuthSuccess
          
            icon={
              <IoMailOutline className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
            }
                          <LogoImage
                            src="/images/logos/logo-c.svg"
                            alt="logo"
                            width={400}
                            height={36}
                          />
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
