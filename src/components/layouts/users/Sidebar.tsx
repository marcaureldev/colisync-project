"use client";
import {
  Truck,
  LayoutDashboard,
  Send,
  History,
  User,
  CreditCard,
  Tag,
  Map,
  HelpCircle,
  Settings,
  LogOut,
  X,
  PackageSearch,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  toggleSidebar?: () => void;
}

const Sidebar = ({ toggleSidebar }: SidebarProps) => {
  const pathname = usePathname();
  const { logout, isLoggingOut, error } = useAuth();

  const navigateLinks = [
    {
      name: "Tableau de bord",
      href: "/users/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Envoyer un colis",
      href: "/users/send-package",
      icon: Send,
    },
    {
      name: "Suivi d'expédition",
      href: "/users/track-shipment",
      icon: PackageSearch,
    },
    {
      name: "Historique",
      href: "/users/history",
      icon: History,
    },
    {
      name: "Mon profil",
      href: "/users/profile",
      icon: User,
    },
    {
      name: "Paiements",
      href: "/users/payments",
      icon: CreditCard,
    },
    {
      name: "Tarification",
      href: "/users/pricing",
      icon: Tag,
    },
    {
      name: "Carte",
      href: "/users/map",
      icon: Map,
    },
    // {
    //   name: "Centre d'aide",
    //   href: "/users/help",
    //   icon: HelpCircle,
    // },
  ];

  return (
    <div className="flex flex-col h-full border-r border-gray-200 dark:border-white/10 p-4 bg-white dark:bg-white/5 dark:backdrop-blur-lg relative text-gray-800 dark:text-white">
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white lg:hidden z-50"
        aria-label="Fermer la sidebar"
      >
        <X className="size-6" />
      </button>

      <div className="flex items-center gap-3 mb-8">
        <Truck className="size-8 text-blue-500 dark:text-blue-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Coli<span className="text-blue-500 dark:text-blue-400">Sync</span>
        </h1>
      </div>

      <div className="grow space-y-1">
        {navigateLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <link.icon
                className={cn(
                  "size-5",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white"
                )}
              />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="space-y-1 pt-4 border-t border-gray-200 dark:border-white/10">
        <Link
          href="/users/settings"
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg transition-colors",
            pathname === "/users/settings"
              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
              : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          )}
        >
          <Settings
            className={cn(
              "size-5",
              pathname === "/users/settings"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white"
            )}
          />
          <span>Paramètres</span>
        </Link>

        <button
          onClick={logout}
          className="w-full group flex items-center gap-3 p-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
        >
          <LogOut className="size-5 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
