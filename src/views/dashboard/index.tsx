"use client";

import React from 'react';
import { useAuth } from '@/modules/authentication/hooks/use-auth';
import { useUserMetrics } from '@/modules/dashboard/hooks';
import { useRouter } from 'next/navigation';

/**
 * Dashboard view component
 * This component handles the UI presentation for the dashboard page
 * Following the architecture, this file should contain only UI elements and composition
 */
export default function DashboardView() {
    const { user, isLoading, logout } = useAuth();
    const metrics = useUserMetrics();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (isLoading || metrics.isLoading) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                    Logout
                </button>
            </div>

            {/* User Profile Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">User Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium">{user?.email || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                        <p className="font-medium">
                            {user?.firstName && user?.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user?.firstName || user?.lastName || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                        <p className="font-medium text-xs truncate">{user?.id || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Account Status</p>
                        <p className="font-medium">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Active
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Summary Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Summary</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Welcome{user?.firstName ? `, ${user.firstName}` : ''}! This is where you can manage your account and view your data.
                    </p>
                </div>

                {/* Metrics Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Your Metrics</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Login Streak:</span>
                            <span className="font-medium">{metrics.loginStreak} days</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Account Age:</span>
                            <span className="font-medium">{metrics.accountAge}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Last Login:</span>
                            <span className="font-medium">{metrics.lastLogin}</span>
                        </div>
                    </div>
                </div>

                {/* Activity Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-3">
                        {metrics.activityLog.length > 0 ? (
                            metrics.activityLog.map((activity, index) => (
                                <div key={index} className="border-l-2 border-blue-500 pl-3">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.timestamp}</p>
                                    <p className="text-gray-700 dark:text-gray-300">{activity.action}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 dark:text-gray-300">No recent activity to display.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 