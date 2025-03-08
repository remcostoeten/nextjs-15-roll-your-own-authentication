import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, registerUser, logoutUser, refreshToken } from '../api/mutations';
import { getCurrentUser } from '../api/queries';

type User = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
};

type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: { email: string; password: string }) => Promise<void>;
    register: (userData: {
        email: string;
        password: string;
        confirmPassword: string;
        firstName?: string;
        lastName?: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
    fetchUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const { user } = await loginUser(credentials);
                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to login',
                        isLoading: false
                    });
                    throw error;
                }
            },

            register: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    // Register and automatically log in
                    const { user } = await registerUser(userData);
                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to register',
                        isLoading: false
                    });
                    throw error;
                }
            },

            logout: async () => {
                set({ isLoading: true, error: null });
                try {
                    await logoutUser();
                    set({ user: null, isAuthenticated: false, isLoading: false });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to logout',
                        isLoading: false
                    });
                    throw error;
                }
            },

            refreshAuth: async () => {
                set({ isLoading: true, error: null });
                try {
                    const { user } = await refreshToken();
                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({
                        user: null,
                        isAuthenticated: false,
                        error: error instanceof Error ? error.message : 'Failed to refresh authentication',
                        isLoading: false
                    });
                    throw error;
                }
            },

            fetchUser: async () => {
                set({ isLoading: true, error: null });
                try {
                    const user = await getCurrentUser();
                    set({
                        user,
                        isAuthenticated: !!user,
                        isLoading: false
                    });
                } catch (error) {
                    set({
                        user: null,
                        isAuthenticated: false,
                        error: error instanceof Error ? error.message : 'Failed to fetch user',
                        isLoading: false
                    });
                    throw error;
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
); 