'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/modules/authentication/hooks/use-auth';
import { getUserMetrics, getUserActivities } from '../api/queries';

type ActivityLog = {
    id: string;
    userId: string;
    action: string;
    details?: string | null;
    createdAt: Date;
    timestamp: string;
};

type UserMetricsData = {
    loginStreak: number;
    accountAge: string;
    lastLoginFormatted: string;
    activityLog: ActivityLog[];
    isLoading: boolean;
    error: string | null;
};

/**
 * Hook to fetch and manage user metrics data from the database
 */
export function useUserMetrics(): UserMetricsData {
    const { user, isAuthenticated } = useAuth();
    const [metrics, setMetrics] = useState<UserMetricsData>({
        loginStreak: 0,
        accountAge: '',
        lastLoginFormatted: '',
        activityLog: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        if (!user || !isAuthenticated) {
            setMetrics(prev => ({ ...prev, isLoading: false }));
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch user metrics
                const metricsData = await getUserMetrics(user.id);

                // Fetch user activities
                const activities = await getUserActivities(user.id);

                setMetrics({
                    loginStreak: metricsData.loginStreak || 0,
                    accountAge: metricsData.accountAge,
                    lastLoginFormatted: metricsData.lastLoginFormatted,
                    activityLog: activities,
                    isLoading: false,
                    error: null,
                });
            } catch (error) {
                console.error('Error fetching user metrics:', error);
                setMetrics(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Failed to fetch metrics'
                }));
            }
        };

        fetchData();
    }, [user, isAuthenticated]);

    return metrics;
} 