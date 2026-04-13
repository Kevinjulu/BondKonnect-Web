import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export type LogoContext = 'auth' | 'dashboard' | 'sidebar' | 'loading';

export function useLogoSrc(context: LogoContext = 'auth') {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return default light logo during SSR
    return "/images/logos/logo.png";
  }

  const isDark = resolvedTheme === "dark";

  // Centralized logo selection logic
  switch (context) {
    case 'auth':
    case 'loading':
      return isDark ? "/images/logos/logo-dark.svg" : "/images/logos/logo.png";

    case 'dashboard':
    case 'sidebar':
      // Dashboard uses compact logo for space efficiency
      return isDark ? "/images/logos/logo-dark.svg" : "/images/logos/logo-c.png";

    default:
      return isDark ? "/images/logos/logo-dark.svg" : "/images/logos/logo.png";
  }
}