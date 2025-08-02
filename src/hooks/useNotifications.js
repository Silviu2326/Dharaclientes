import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../features/notifications/notifications.api';
import { queryKeys } from '../app/store';

export const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications using TanStack Query
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: getNotifications,
    refetchInterval: 30000, // Poll every 30 seconds
  });

  // Calculate unread count
  useEffect(() => {
    const unread = notifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // TODO: Implement WebSocket connection for real-time notifications
  useEffect(() => {
    // WebSocket setup would go here
    // const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    // ws.onmessage = (event) => {
    //   const notification = JSON.parse(event.data);
    //   // Handle real-time notification
    // };
    // return () => ws.close();
  }, []);

  const markAsRead = (notificationId) => {
    // TODO: Implement mark as read functionality
    console.log('Marking notification as read:', notificationId);
  };

  const markAllAsRead = () => {
    // TODO: Implement mark all as read functionality
    console.log('Marking all notifications as read');
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
  };
};