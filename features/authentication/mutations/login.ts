'use server';

import { loginUser } from '@/features/authentication/mutations';
import { ActionResponse, AuthCredentials } from '../types';

export async function login(credentials: AuthCredentials): Promise<ActionResponse> {
  try {
    const result = await loginUser(credentials);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed'
    };
  }
} 
