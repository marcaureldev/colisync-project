'use client';

import { X, Bell, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/contexts/NotificationContext';
import { Notification } from '@/types/notification';

export function NotificationsModal() {
  const { 
    notifications, 
    loading,
    isModalOpen, 
    closeModal, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearReadNotifications,
    refreshNotifications
  } = useNotifications();

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
      });
      if (response.ok) {
        markAsRead(id);
      }
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      });
      if (response.ok) {
        markAllAsRead();
      }
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        deleteNotification(id);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleClearReadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications/clear-read', {
        method: 'DELETE',
      });
      if (response.ok) {
        clearReadNotifications();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression des notifications lues:', error);
    }
  };

  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;
  const readCount = notifications.filter(n => n.status === 'READ').length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'PENDING_USER':
        return '👤';
      case 'USER_ACTIVATED':
        return '✅';
      case 'USER_REJECTED':
        return '❌';
      case 'SYSTEM_ALERT':
        return '⚠️';
      default:
        return '🔔';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  if (!isModalOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9999]"
        onClick={closeModal}
      />
      
      {/* Modal */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#0F123B] shadow-2xl z-[10000] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Notifications
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeModal}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Actions */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex-shrink-0">
          <div className="flex gap-2 flex-wrap">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Tout marquer comme lu
              </Button>
            )}
            {readCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearReadNotifications}
                className="text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Effacer les lues
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">
                Chargement des notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucune notification
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Vous n'avez pas encore de notifications
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                                  <Card 
                    key={notification.id}
                    className={cn(
                      "transition-all duration-200 hover:shadow-md cursor-pointer",
                      notification.status === 'UNREAD' 
                        ? "bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20" 
                        : "bg-white dark:bg-[#0F123B]"
                    )}
                    onClick={() => notification.status === 'UNREAD' && handleMarkAsRead(notification.id)}
                  >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-lg mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                {notification.title}
                              </h4>
                              {notification.status === 'UNREAD' && (
                                <Badge variant="default" className="text-xs px-1.5 py-0.5 flex-shrink-0">
                                  Nouveau
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 overflow-hidden" style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(notification.createdAt)}
                              </span>
                              <div className="flex gap-1">
                                {notification.status === 'UNREAD' && (
                                                                  <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                  }}
                                  className="h-5 w-5 p-0"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotification(notification.id);
                                }}
                                className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 