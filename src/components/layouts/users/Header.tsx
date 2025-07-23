"use client";
import React, { useState, useEffect } from "react";
import {
  Bell,
  Search,
  Menu,
  Settings,
  User,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { logout, isLoggingOut, error } = useAuth();
  const { user, loading } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Fonction pour récupérer les notifications (seulement pour les admins)
  const fetchNotifications = async () => {
    if (user?.role !== 'ADMIN') return;
    
    try {
      setLoadingNotifications(true);
      const response = await fetch('/api/admin/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Fonction pour marquer une notification comme lue
  const markAsRead = async (notificationId: string) => {
    if (user?.role !== 'ADMIN') return;
    
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, status: 'READ' }
              : notif
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  // Fonction pour marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    if (user?.role !== 'ADMIN') return;
    
    try {
      const response = await fetch('/api/admin/notifications/mark-all-read', {
        method: 'POST',
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, status: 'READ' }))
        );
      }
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
    }
  };

  // Charger les notifications au montage et toutes les 30 secondes (seulement pour les admins)
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.role]);

  const unreadCount = notifications.filter((n) => n.status === 'UNREAD').length;

  const getUserDisplayText = () => {
    if (loading) return "Chargement...";
    if (user?.displayName) return `Bienvenue, ${user.displayName}`;
    if (user?.email) return `Bienvenue, ${user.email}`;
    return "Bienvenue";
  };

  return (
    <header className="border-b bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur-lg p-4 flex items-center justify-between text-gray-800 dark:text-white">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="size-5" />
        </Button>

        <div>
          <p className="text-sm sm:text-base">{getUserDisplayText()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Changer de thème"
        >
          {theme === "light" ? (
            <Moon className="size-5 text-slate-700" />
          ) : (
            <Sun className="size-5 text-white" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-5 text-gray-500 dark:text-gray-400" />
              {unreadCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 px-1.5 h-5 min-w-5 flex items-center justify-center bg-blue-500 text-white"
                  variant="default"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 bg-white dark:bg-[#0F123B] border dark:border-white/10 text-gray-800 dark:text-white shadow-lg"
          >
            <DropdownMenuLabel className="dark:text-white">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:bg-white/10" />
            {loadingNotifications ? (
              <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                Chargement...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                Aucune notification
              </div>
            ) : (
              <>
                {notifications.map((notification) => {
                  const formatDate = (dateString: string) => {
                    const date = new Date(dateString);
                    const now = new Date();
                    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
                    
                    if (diffInMinutes < 1) return 'À l\'instant';
                    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
                    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
                    return date.toLocaleDateString('fr-FR');
                  };

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

                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        "group flex flex-col items-start p-3 cursor-pointer transition-colors",
                        notification.status === 'UNREAD' ? "bg-blue-500/10" : "",
                        "hover:bg-gray-100 dark:hover:bg-blue-500/20 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-blue-500/20"
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-2 w-full">
                        <span className="text-lg">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between w-full">
                            <span className="font-medium text-gray-800 dark:text-white truncate">
                              {notification.title}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 group-data-[highlighted]:text-gray-600 dark:group-data-[highlighted]:text-gray-200 transition-colors ml-2">
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 group-hover:text-gray-600 dark:group-hover:text-gray-200 group-data-[highlighted]:text-gray-600 dark:group-data-[highlighted]:text-gray-200 transition-colors">
                            {notification.message}
                          </span>
                          {notification.status === 'UNREAD' && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                          )}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
                {unreadCount > 0 && (
                  <>
                    <DropdownMenuSeparator className="dark:bg-white/10" />
                    <DropdownMenuItem 
                      onClick={markAllAsRead}
                      className="justify-center text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 data-[highlighted]:text-blue-600 dark:data-[highlighted]:text-blue-300 hover:bg-gray-100 dark:hover:bg-blue-500/10 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-blue-500/10 transition-colors"
                    >
                      Tout marquer comme lu
                    </DropdownMenuItem>
                  </>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  {user?.displayName
                    ? user.displayName.charAt(0).toUpperCase() + user.displayName.split(" ")[1].charAt(0).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white dark:bg-[#0F123B] border dark:border-white/10 text-gray-800 dark:text-white shadow-lg"
          >
            <DropdownMenuLabel className="dark:text-white">
              Mon compte
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:bg-white/10" />
            <DropdownMenuItem className="group hover:bg-gray-100 dark:hover:bg-blue-500/20 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-blue-500/20 transition-colors">
              <User className="mr-2 size-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 group-data-[highlighted]:text-blue-600 dark:group-data-[highlighted]:text-blue-300 transition-colors" />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300 group-data-[highlighted]:text-blue-600 dark:group-data-[highlighted]:text-blue-300 transition-colors">
                Profil
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="group hover:bg-gray-100 dark:hover:bg-blue-500/20 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-blue-500/20 transition-colors">
              <Settings className="mr-2 size-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 group-data-[highlighted]:text-blue-600 dark:group-data-[highlighted]:text-blue-300 transition-colors" />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300 group-data-[highlighted]:text-blue-600 dark:group-data-[highlighted]:text-blue-300 transition-colors">
                Paramètres
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-white/10" />
            <DropdownMenuItem onClick={logout} className="group text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 data-[highlighted]:text-red-600 dark:data-[highlighted]:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/10 data-[highlighted]:bg-red-100 dark:data-[highlighted]:bg-red-500/10 transition-colors">
              <LogOut className="mr-2 size-4 group-hover:text-red-600 dark:group-hover:text-red-300 group-data-[highlighted]:text-red-600 dark:group-data-[highlighted]:text-red-300 transition-colors" />
              <span className="group-hover:text-red-600 dark:group-hover:text-red-300 group-data-[highlighted]:text-red-600 dark:group-data-[highlighted]:text-red-300 transition-colors">
                Déconnexion
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
