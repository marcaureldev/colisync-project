'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification, NotificationContextType } from '@/types/notification';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id 
          ? { ...notif, status: 'READ' as const }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, status: 'READ' as const }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearReadNotifications = () => {
    setNotifications(prev => prev.filter(notif => notif.status === 'UNREAD'));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const refreshNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications/all');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les notifications au montage
  React.useEffect(() => {
    refreshNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      isModalOpen,
      openModal,
      closeModal,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearReadNotifications,
      addNotification,
      refreshNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
} 