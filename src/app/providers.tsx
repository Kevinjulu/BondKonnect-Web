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

export function Providers({ children, ...props }: ThemeProviderProps) {
  const theme = ThemeSettings();
  const customizer = useSelector((state: AppState) => state.customizer);

  return (
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
  );
} 
