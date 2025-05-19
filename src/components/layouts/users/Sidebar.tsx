"use client";
import {
  Truck,
  LayoutDashboard,
  Send,
  PackageSearch,
  History,
  User,
  CreditCard,
  Tag,
  Map,
  HelpCircle,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface SidebarProps {
  toggleSidebar?: () => void;
}

const Sidebar = ({ toggleSidebar }: SidebarProps) => {
  const pathname = usePathname();

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
    <div className="h-full border-r border-white/10 p-4 bg-white/5 backdrop-blur-lg relative">
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white lg:hidden z-50"
        aria-label="Fermer la sidebar"
      >
        <X className="size-6" />
      </button>
      <div className="flex items-center gap-3 mb-8">
        <Truck className="size-8 text-blue-400" />
        <h1 className="text-3xl font-bold">
          Coli<span className="text-blue-400">Sync</span>
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
                  ? "bg-blue-500/10 text-blue-400"
                  : "hover:bg-white/5 text-gray-400 hover:text-white"
              )}
            >
              <link.icon className="size-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="space-y-1 pt-4 border-t border-white/10">
        <Link
          href="/users/settings"
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg transition-colors",
            pathname === "/users/settings"
              ? "bg-blue-500/10 text-blue-400"
              : "hover:bg-white/5 text-gray-400 hover:text-white"
          )}
        >
          <Settings className="size-5" />
          <span>Paramètres</span>
        </Link>

        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 transition-colors text-gray-400 hover:text-red-400">
          <LogOut className="size-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
