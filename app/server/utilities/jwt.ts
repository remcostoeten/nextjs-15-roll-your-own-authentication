import { env } from '@/env/server'
import { TextEncoder } from 'util'

export const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET)
