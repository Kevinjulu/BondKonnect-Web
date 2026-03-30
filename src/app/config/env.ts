import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_API_URL: z.string().url().transform((v) => v.replace(':4040', '')),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_WEBSOCKET_URL: z.string().url().optional().transform((v) => v?.replace(':4040', '')),
  NEXT_PUBLIC_LOGIN_URL: z.string().url().optional(),
  
  // Internal API for SSR within Railway/Vercel (if applicable)
  INTERNAL_API_URL: z.string().url().optional().transform((v) => v?.replace(':4040', '')),
  FORCE_PUBLIC_API: z.string().transform((v) => v === "true").default("false"),

  // Pusher
  NEXT_PUBLIC_PUSHER_APP_KEY: z.string().min(1),
  NEXT_PUBLIC_PUSHER_APP_CLUSTER: z.string().min(1),

  // Vercel System Variables (automatically populated by Vercel)
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
});

/**
 * Validates environment variables and provides a type-safe object.
 */
function validateEnv() {
  const result = envSchema.safeParse({
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
  });

  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    // Only throw in production build to catch missing envs early
    if (process.env.NODE_ENV === "production") {
      throw new Error("Missing or invalid environment variables. Check .env and dashboard.");
    }
  }

  return result.success ? result.data : ({} as z.infer<typeof envSchema>);
}

export const env = validateEnv();
