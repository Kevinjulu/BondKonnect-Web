"use client";
import React from "react";
import { store } from "@/store/store";
import { Provider } from "react-redux";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./providers";
import Loading from "./loading";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>
          <Provider store={store}>
            <Providers>
              <Loading />
            </Providers>
          </Provider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body  onContextMenu={(e) => e.preventDefault()}> */}
      <body>
        <Provider store={store}>
          <Providers>
            <NextTopLoader
              color="#000000"
              showSpinner={false}
              height={3}
              shadow={false}
            />
            {children}
          </Providers>
        </Provider>
      </body>
    </html>
  );
}
