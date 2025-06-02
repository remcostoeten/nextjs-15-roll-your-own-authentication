'use client';

import { useCallback, useEffect, useState } from 'react';
import { archiveNotifications } from '../server/mutations/archive-notifications';
import {
	markAllNotificationsAsRead,
	markNotificationsAsRead,
} from '../server/mutations/mark-as-read';
import { getNotificationStats } from '../server/queries/get-notification-stats';
import { getUserNotifications } from '../server/queries/get-notifications';
import { TGetNotificationsOptions, TNotificationStats, TNotificationWithActor } from '../types';

/**
 * React hook for managing user notifications, including fetching, marking as read, archiving, and retrieving notification statistics.
 *
 * Provides state and operations for notification data, loading and error status, and notification statistics. Exposes functions to mark notifications as read, mark all as read, archive notifications, and refresh notification data and stats.
 *
 * @param initialOptions - Optional options for fetching notifications on initialization.
 * @returns An object containing the current notifications, notification statistics, loading and error state, and functions for notification operations.
 */
export function useNotifications(initialOptions: TGetNotificationsOptions = {}) {
  const [notifications, setNotifications] = useState<TNotificationWithActor[]>([]);
  const [stats, setStats] = useState<TNotificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<TGetNotificationsOptions>(initialOptions);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getUserNotifications(options);
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getNotificationStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch notification stats:', err);
    }
  }, []);

  const markAsRead = useCallback(async (ids: string[]) => {
    try {
      const result = await markNotificationsAsRead(ids);
      if (result.success) {
        // Update local state
        setNotifications(prev =>
          prev.map(notification =>
            ids.includes(notification.id)
              ? { ...notification, read: true }
              : notification
          )
        );
        // Refresh stats
        fetchStats();
      }
      return result;
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
      return { success: false, error: 'Failed to mark notifications as read' };
    }
  }, [fetchStats]);

  const markAllAsRead = useCallback(async () => {
    try {
      const result = await markAllNotificationsAsRead();
      if (result.success) {
        // Update local state
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
        // Refresh stats
        fetchStats();
      }
      return result;
    } catch (err) {
      console.error('Failed to mark all notifications as read:',
        err);
      return { success: false, error: 'Failed to mark all notifications as read' };
    }
  }, [fetchStats]);

  const archive = useCallback(async (ids: string[]) => {
    try {
      const result = await archiveNotifications(ids);
      if (result.success) {
        // Update local state
        setNotifications(prev =>
          prev.filter(notification => !ids.includes(notification.id))
        );
        // Refresh stats
        fetchStats();
      }
      return result;
    } catch (err) {
      console.error('Failed to archive notifications:', err);
      return { success: false, error: 'Failed to archive notifications' };
    }
  }, [fetchStats]);

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, [fetchNotifications, fetchStats, options]);

  return {
    notifications,
    stats,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    archive,
    fetchNotifications,
    fetchStats,
  };
}
