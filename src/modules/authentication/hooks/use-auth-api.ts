"use client";

/**
 * This hook provides functions for calling the authentication API endpoints
 */
export function useAuthApi() {
  /**
   * Login a user
   */
  const login = async (credentials: { email: string; password: string }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to login');
    }

    return response.json();
  };

  /**
   * Register a new user
   */
  const register = async (userData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    lastName?: string;
  }) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to register');
    }

    return response.json();
  };

  /**
   * Logout the current user
   */
  const logout = async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to logout');
    }

    return response.json();
  };

  /**
   * Refresh the authentication tokens
   */
  const refreshAuth = async () => {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to refresh authentication');
    }

    return response.json();
  };

  /**
   * Get the current user
   */
  const getUser = async () => {
    const response = await fetch('/api/auth/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get user');
    }

    return response.json();
  };

  return {
    login,
    register,
    logout,
    refreshAuth,
    getUser,
  };
} 