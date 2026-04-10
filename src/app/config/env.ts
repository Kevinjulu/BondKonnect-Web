import { z } from "zod";

/**
 * Helper to handle URLs that might be missing a protocol, have spaces, or be empty strings.
 * Railway/Nixpacks sometimes provides hostnames like 'Laravel API' or 'backend.railway.internal'.
 */
const flexibleUrlSchema = (optional = false) => 
  z.preprocess((val) => {
    if (typeof val !== "string" || val.trim() === "") return undefined;
    
    let url = val.trim();
    
    // 1. Handle spaces in hostnames (common in Railway service names)
    // Replace spaces with hyphens as that's how internal DNS usually works
    if (url.includes(' ')) {
      url = url.replace(/\s+/g, '-');
    }

    // 2. Add protocol if missing
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `http://${url}`;
    }
    
    return url;
  }, optional ? z.string().optional() : z.string().min(1)); // Be more relaxed than .url() if needed

const envSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_API_URL: flexibleUrlSchema().transform((v) => v.replace(':4040', '').replace(':8080', '')),
  NEXT_PUBLIC_APP_URL: flexibleUrlSchema(),
  NEXT_PUBLIC_WEBSOCKET_URL: flexibleUrlSchema(true).transform((v) => v?.replace(':4040', '').replace(':8080', '')),
  NEXT_PUBLIC_LOGIN_URL: flexibleUrlSchema(true),
  
  // Internal API for SSR within Railway/Vercel (if applicable)
  INTERNAL_API_URL: flexibleUrlSchema(true).transform((v) => v?.replace(':4040', '').replace(':8080', '')),
  FORCE_PUBLIC_API: z.preprocess((v) => v === "true" || v === true, z.boolean().default(false)),

  // Pusher
  NEXT_PUBLIC_PUSHER_APP_KEY: z.string().min(1).optional().default("missing_key"),
  NEXT_PUBLIC_PUSHER_APP_CLUSTER: z.string().min(1).optional().default("mt1"),

  // Vercel System Variables (automatically populated by Vercel)
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  NEXT_PUBLIC_PAYPAL_ENV: z.enum(["sandbox", "live"]).default("sandbox"),
});

/**
 * Validates environment variables and provides a type-safe object.
 */
function validateEnv() {
  const envData = {
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WEBSOCKET_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
    NEXT_PUBLIC_LOGIN_URL: process.env.NEXT_PUBLIC_LOGIN_URL,
    INTERNAL_API_URL: process.env.INTERNAL_API_URL,
    FORCE_PUBLIC_API: process.env.FORCE_PUBLIC_API,
    NEXT_PUBLIC_PUSHER_APP_KEY: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    NEXT_PUBLIC_PUSHER_APP_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_PAYPAL_ENV: process.env.NEXT_PUBLIC_PAYPAL_ENV,
  };

  const result = envSchema.safeParse(envData);

  if (!result.success) {
    if (typeof window === 'undefined') {
      console.error("❌ Invalid environment variables:", JSON.stringify(result.error.format(), null, 2));
    } else {
      console.error("❌ Invalid environment variables:", result.error.format());
    }
    
    // In production, we log but DON'T throw to prevent SIGTERM loops
    if (process.env.NODE_ENV === "production") {
      console.warn("⚠️ App is starting with missing/invalid environment variables. Expect runtime errors.");
    }

    // CRITICAL FIX: Even if validation fails, we want to return the raw values 
    // for those that are set, to avoid making everything 'undefined'.
    // We cast to any then to the schema type to satisfy TypeScript.
    return {
      ...envData,
      // Fallback for required fields that might be missing in envData but have defaults in schema
      NEXT_PUBLIC_APP_ENV: envData.NEXT_PUBLIC_APP_ENV || "development",
      FORCE_PUBLIC_API: envData.FORCE_PUBLIC_API === "true",
    } as unknown as z.infer<typeof envSchema>;
  }

  return result.data;
}

export const env = validateEnv();
