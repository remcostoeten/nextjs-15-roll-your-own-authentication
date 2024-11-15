'use server';

import { logoutUser } from '@/features/authentication/mutations';
import { ActionResponse } from '../types';

export async function logout(): Promise<ActionResponse> {
  try {
    await logoutUser();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Logout failed'
    };
  }
} 
