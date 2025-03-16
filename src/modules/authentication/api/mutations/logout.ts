'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function runtime() {
    return 'edge'
}

export async function logoutMutation() {
    const response = new Response(null, {
        status: 200,
        headers: {
            'Set-Cookie': [
                'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
                'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
                'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly'
            ]
        }
    })

    revalidatePath('/', 'layout')
    redirect('/login')
} 