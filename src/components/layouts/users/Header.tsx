"use client";
import React, { useState } from "react";
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
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nouveau colis",
      message: "Votre colis #COL-12345 a été expédié",
      time: "Il y a 5 min",
      read: false,
    },
    {
      id: 2,
      title: "Livraison effectuée",
      message: "Le colis #COL-12340 a été livré",
      time: "Il y a 2 heures",
      read: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

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
            {notifications.length === 0 ? (
              <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                Aucune notification
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "group flex flex-col items-start p-3 cursor-pointer transition-colors",
                    !notification.read ? "bg-blue-500/10" : "",
                    "hover:bg-gray-100 dark:hover:bg-blue-500/20 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-blue-500/20"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {notification.title}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 group-data-[highlighted]:text-gray-600 dark:group-data-[highlighted]:text-gray-200 transition-colors">
                      {notification.time}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 group-hover:text-gray-600 dark:group-hover:text-gray-200 group-data-[highlighted]:text-gray-600 dark:group-data-[highlighted]:text-gray-200 transition-colors">
                    {notification.message}
                  </span>
                  {!notification.read && (
                    <Badge
                      className="mt-2 bg-blue-500 text-white"
                      variant="default"
                    >
                      Nouveau
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator className="dark:bg-white/10" />
            <DropdownMenuItem className="justify-center text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 data-[highlighted]:text-blue-600 dark:data-[highlighted]:text-blue-300 hover:bg-gray-100 dark:hover:bg-blue-500/10 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-blue-500/10 transition-colors">
              Voir toutes les notifications
            </DropdownMenuItem>
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
