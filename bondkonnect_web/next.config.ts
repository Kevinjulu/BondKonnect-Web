import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',s
  // Enable file system routing (this was causing the 404 issue)
  useFileSystemPublicRoutes: true,
  
  // For cPanel hosting compatibility
  trailingSlash: true,
  
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Image optimization for cPanel
  images: {
    unoptimized: true,
  },

  /* config options here */
  devIndicators: false,

};

export default nextConfig;
