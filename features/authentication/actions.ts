'use server';

import { AuthCredentials, loginUser, logoutUser, registerUser } from './mutations';
import { getAuthenticatedUser } from './queries';

type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

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

export async function register(credentials: AuthCredentials): Promise<ActionResponse> {
  try {
    const result = await registerUser(credentials);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed. Please try again.'
    };
  }
}

export async function logout() {
  await logoutUser();
}

export async function getCurrentUser() {
  return getAuthenticatedUser();
} 
