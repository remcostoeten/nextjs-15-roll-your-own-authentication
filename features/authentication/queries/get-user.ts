'use server';

import { getAuthenticatedUser } from '../actions';

export async function getUser() {
  return getAuthenticatedUser();
} 
