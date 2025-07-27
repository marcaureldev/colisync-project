export interface Notification {
  id: string;
  type: 'PENDING_USER' | 'USER_ACTIVATED' | 'USER_REJECTED' | 'SYSTEM_ALERT';
  title: string;
  message: string;
  status: 'UNREAD' | 'READ';
  createdAt: string;
  targetUserId?: string | null;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearReadNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  refreshNotifications: () => void;
} 