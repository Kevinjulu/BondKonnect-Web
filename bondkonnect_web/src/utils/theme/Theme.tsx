import _ from 'lodash';
import { createTheme } from '@mui/material/styles';
import { useSelector } from '@/app/store/hooks';
import { useEffect } from 'react';
import { AppState } from '@/app/store/store';
import components from './Components';
import typography from './Typography';
import { shadows, darkshadows } from './Shadows';
import { DarkThemeColors } from './DarkThemeColors';
import { LightThemeColors } from './LightThemeColors';
import { baseDarkTheme, baselightTheme } from './DefaultColors';
import * as locales from '@mui/material/locale';
import { useTheme } from 'next-themes';

export const BuildTheme = (config: any = {}) => {
  const themeOptions = LightThemeColors.find((theme) => theme.name === config.theme);
  const darkthemeOptions = DarkThemeColors.find((theme) => theme.name === config.theme);
  const customizer = useSelector((state: AppState) => state.customizer);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  const defaultTheme = isDarkMode ? baseDarkTheme : baselightTheme;
  const defaultShadow = isDarkMode ? darkshadows : shadows;
  const themeSelect = isDarkMode ? darkthemeOptions : themeOptions;
  
  const baseMode = {
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
    shape: {
      borderRadius: customizer.borderRadius,
    },
    shadows: defaultShadow,
    typography: typography,
  };

  const theme = createTheme(
    _.merge({}, baseMode, defaultTheme, locales, themeSelect, {
      direction: config.direction,
    }),
  );
  theme.components = components(theme);

  return theme;
};

const ThemeSettings = () => {
  const activDir = useSelector((state: AppState) => state.customizer.activeDir);
  const activeTheme = useSelector((state: AppState) => state.customizer.activeTheme);
  const theme = BuildTheme({
    direction: activDir,
    theme: activeTheme,
  });

  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    if (typeof document !== 'undefined') {
      document.dir = activDir;
    }
  }, [activDir]);

  return theme;
};

export { ThemeSettings };
