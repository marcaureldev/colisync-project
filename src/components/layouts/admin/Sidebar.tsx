"use client";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Truck,
  Building2,
  Users,
  Mail,
  FileText,
  ClipboardList,
  Settings,
  LogOut,
  X,
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

  const menuSections = [
    {
      category: "Principal",
      items: [
        {
          name: "Tableau de bord",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      category: "Gestion",
      items: [
        {
          name: "Colis",
          href: "/colis",
          icon: Package,
        },
        {
          name: "Gares",
          href: "/admin/management/stations",
          icon: MapPin,
        },
        {
          name: "Lignes",
          href: "/lignes",
          icon: Truck,
        },
      ],
    },
    {
      category: "Utilisateurs",
      items: [
        {
          name: "Compagnies",
          href: "/compagnies",
          icon: Building2,
        },
        {
          name: "Agents",
          href: "/agents",
          icon: Users,
        },
      ],
    },
    {
      category: "Administration",
      items: [
        {
          name: "Invitations",
          href: "/admin/invitations",
          icon: Mail,
        },
        {
          name: "Utilisateurs en attente",
          href: "/admin/pending-users",
          icon: Users,
        },
        {
          name: "Journal",
          href: "/journal",
          icon: FileText,
        },
        {
          name: "Rapports",
          href: "/rapports",
          icon: ClipboardList,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen border-r border-gray-200 dark:border-white/10 p-4 bg-white dark:bg-white/5 dark:backdrop-blur-lg relative text-gray-800 dark:text-white overflow-hidden">
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white lg:hidden z-50"
        aria-label="Fermer la sidebar"
      >
        <X className="size-6" />
      </button>

      <div className="flex items-center gap-3 mb-8">
        <Truck className="size-8 text-blue-500 dark:text-blue-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Coli<span className="text-blue-500 dark:text-blue-400">Sync</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {/* Titre de la catégorie */}
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-3">
              {section.category}
            </h3>

            {/* Items de la catégorie */}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-5",
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white"
                      )}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 space-y-1 pt-4 border-t border-gray-200 dark:border-white/10">
        <Link
          href="/parametres"
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg transition-colors",
            pathname === "/parametres"
              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
              : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          )}
        >
          <Settings
            className={cn(
              "size-5",
              pathname === "/parametres"
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
