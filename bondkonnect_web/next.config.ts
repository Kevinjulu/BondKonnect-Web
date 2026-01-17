import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',s
  // Enable file system routing (this was causing the 404 issue)
  useFileSystemPublicRoutes: true,
  
  // For cPanel hosting compatibility
  trailingSlash: true,
  
  // Production optimizations
  poweredByHeader: false,
  compress: false, // Disabled for build speed/debug
  
  // Image optimization for cPanel
  images: {
    unoptimized: true,
  },

  /* config options here */
  devIndicators: false,
  
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

};

export default nextConfig;
