import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { z } from 'zod'

const envPath = fileURLToPath(new URL('../.env', import.meta.url))
config({ path: envPath })

const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(16),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
  PORT: z.string().optional(),
  CLIENT_ORIGIN: z.string().optional(),
})

export const env = envSchema.parse({
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
})
