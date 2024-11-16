'use server';

import { getAuthenticatedUser } from "../queries";

export async function getCurrentUser() {
  return getAuthenticatedUser();
} 
