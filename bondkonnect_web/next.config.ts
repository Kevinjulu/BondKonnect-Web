import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Production optimizations
  poweredByHeader: false,
  
  /* config options here */
  devIndicators: false,
  
  // Resolve workspace root conflict warning
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
