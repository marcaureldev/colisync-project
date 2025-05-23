"use client";
import Sidebar from "@/components/layouts/users/Sidebar";
import React, { useState } from "react";
import Header from "@/components/layouts/users/Header";
import { ReservationProvider } from "@/contexts/ReservationContext";
import { cn } from "@/lib/utils";

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

export default function UserDashoardLayout({
  children,
}: UserDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <ReservationProvider>
      // Changement de fond principal en fonction du thème
      <div className="flex h-screen bg-gray-100 dark:bg-gradient-to-r dark:from-[#0F123B] dark:via-[#090D2E] dark:to-[rgb(2,5,21)] text-gray-900 dark:text-white">
        {/* Conteneur de la Sidebar */}
        <div
          className={cn(
            "fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out",
            // Fond de la sidebar en mode superposition
            "dark:bg-gradient-to-r dark:from-[#0F123B]",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "w-full sm:w-1/2",
            "lg:sticky lg:top-0 lg:translate-x-0 lg:z-auto lg:h-screen lg:w-72 lg:min-w-72 lg:shadow-none"
          )}
        >
          {/* La sidebar elle-même aura ses propres styles dark: */}
          <Sidebar toggleSidebar={toggleSidebar} />
        </div>

        {sidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            aria-hidden="true"
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-3 sm:p-6">{children}</main>
        </div>
      </div>
    </ReservationProvider>
  );
}
