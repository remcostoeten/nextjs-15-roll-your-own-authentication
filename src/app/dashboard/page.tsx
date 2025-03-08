import { Metadata } from 'next';
import DashboardView from '@/views/dashboard';

export const metadata: Metadata = {
    title: 'Dashboard | Raioa',
    description: 'User dashboard for managing your account and data',
};

/**
 * Dashboard page
 * Follows the architecture by importing the view component
 * This file should contain minimal logic, focusing on server component setup and metadata
 */
export default function DashboardPage() {
    return <DashboardView />;
} 