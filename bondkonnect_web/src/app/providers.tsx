"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeSettings } from "@/utils/theme/Theme";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import { NextAppDirEmotionCacheProvider } from "@/utils/theme/EmotionCache";
import RTL from "./(dashboard)/layouts/shared/customizer/RTL";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children, ...props }: ThemeProviderProps) {
  const theme = ThemeSettings();
  const customizer = useSelector((state: AppState) => state.customizer);
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        {...props}
      >
        <NextAppDirEmotionCacheProvider options={{ key: "bondkonnect" }}>
          <MuiThemeProvider theme={theme}>
            <RTL direction={customizer.activeDir}>
              <CssBaseline />
              {children}
            </RTL>
          </MuiThemeProvider>
        </NextAppDirEmotionCacheProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
} 
