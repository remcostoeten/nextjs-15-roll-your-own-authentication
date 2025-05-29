'use server';

import { getSession } from '@/modules/authenticatie/helpers/session';
import { TWorkspace } from '../../types';
import { getUserWorkspaces } from './get-user-workspaces';

export async function getWorkspaces(): Promise<{ 
  workspaces: TWorkspace[]; 
  success: boolean;
  error?: string;
}> {
  try {
    const session = await getSession();
    
    if (!session?.id) {
      return { 
        workspaces: [], 
        success: false, 
        error: 'Not authenticated' 
      };
    }

    const workspaces = await getUserWorkspaces();
    
    return { 
      workspaces,
      success: true 
    };
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return { 
      workspaces: [], 
      success: false, 
      error: 'Failed to fetch workspaces' 
    };
  }
}