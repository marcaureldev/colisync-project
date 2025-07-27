'use client';

import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

export function useNotificationListener() {
  const { refreshNotifications } = useNotifications();

  useEffect(() => {
    // Vérifier les nouvelles notifications toutes les 10 secondes
    const interval = setInterval(refreshNotifications, 10000);

    return () => clearInterval(interval);
  }, [refreshNotifications]);
} 