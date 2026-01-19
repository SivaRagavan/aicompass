// @ts-nocheck
import { SignJWT, jwtVerify } from 'jose'
import { createHash } from 'crypto'
import { env } from './env'

const encoder = new TextEncoder()

const secretKey = encoder.encode(env.JWT_SECRET)

export const hashPassword = (password: string) => {
  return createHash('sha256').update(password).digest('hex')
}

export const signToken = async (payload: Record<string, string>) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)
}

export const verifyToken = async (token: string) => {
  const { payload } = await jwtVerify(token, secretKey)
  return payload
}
