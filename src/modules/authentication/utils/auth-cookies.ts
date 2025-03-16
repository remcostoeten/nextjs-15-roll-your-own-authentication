'use server'

import { cookies } from 'next/headers'
import { env } from 'env'
import { FIFTEEN_MINUTES, WEEK } from '@/shared/helpers/date-helpers'
import { generateTokens } from './tokens'

export async function setAuthCookies(userId: string) {
    const { accessToken, refreshToken } = await generateTokens({ sub: userId })
    const cookieStore = await cookies()

    const commonOptions = {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        path: '/',
    }

    cookieStore.set('access_token', accessToken, {
        ...commonOptions,
        maxAge: FIFTEEN_MINUTES,
    })

    cookieStore.set('refresh_token', refreshToken, {
        ...commonOptions,
        maxAge: WEEK,
    })
} 