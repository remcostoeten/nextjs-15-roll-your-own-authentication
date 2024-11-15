'use server';

import { getAuthenticatedUser } from '../actions';
export async function getCurrentUser() {
  return getAuthenticatedUser();
} 
