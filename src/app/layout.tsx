"use client";
import React from "react";
import { store } from "@/store/store";
import { Provider } from "react-redux";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        <Analytics />
      </body>
    </html>
  );
}
