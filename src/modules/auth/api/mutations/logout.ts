'use server';
    
import { cookies } from 'next/headers';

export async function logout() {
    
    try {
        (await cookies()).delete('auth_token');
        return { success: true };
    } catch (error) {
        console.error('Error during logout:', error);
        return { success: false };
    }
} 