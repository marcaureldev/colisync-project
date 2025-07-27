'use client';

import { useNotificationListener } from '@/hooks/useNotificationListener';

export function NotificationListener() {
  useNotificationListener();
  
  // Ce composant ne rend rien, il utilise juste le hook
  return null;
} 