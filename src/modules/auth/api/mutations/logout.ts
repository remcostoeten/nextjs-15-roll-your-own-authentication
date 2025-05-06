import { cookies } from 'next/headers';

export async function logout() {
    'use server';
    
    try {
        cookies().delete('auth_token');
        return { success: true };
    } catch (error) {
        console.error('Error during logout:', error);
        return { success: false };
    }
} 