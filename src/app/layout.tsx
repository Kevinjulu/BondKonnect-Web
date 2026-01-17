"use client";
import React from "react";
import { store } from "@/app/store/store";
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
  const [loading, setLoading] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
    // Shorter loading time for better UX
    setTimeout(() => setLoading(false), 1000);
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
              color="#2563eb"
              showSpinner={false}
              height={3}
              shadow={false}
            />
            {loading ? <Loading /> : children}
          </Providers>
        </Provider>
      </body>
    </html>
  );
}
