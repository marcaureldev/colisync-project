"use client";
import Sidebar from "@/components/layouts/users/Sidebar";
import React, { useState } from "react";
import Header from "@/components/layouts/users/Header";
import { cn } from "@/lib/utils";

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

export default function UserDashoardLayout({
  children,
}: UserDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar fermée par défaut sur mobile/tablette

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className="flex h-screen bg-gradient-to-r from-[#0F123B] via-[#090D2E] to-[rgb(2,5,21)] text-white">
      {/* Conteneur de la Sidebar */}
      <div
        className={cn(
          // Styles de base pour la sidebar en mode superposition (mobile/tablette)
          "fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out",
          // Appliquer le même fond que le reste de l'application pour la sidebar en superposition
          "bg-gradient-to-r from-[#0F123B] ", 
          // Gérer le slide in/out
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          // Largeurs conditionnelles pour le mode superposition
          "w-full sm:w-1/2", // Pleine largeur sur mobile, moitié sur sm (640px+)
          
          // Styles pour la sidebar en mode statique (desktop)
          "lg:sticky lg:top-0 lg:translate-x-0 lg:z-auto lg:h-screen lg:w-72 lg:min-w-72"
        )}
      >
        <Sidebar toggleSidebar={toggleSidebar} />
      </div>

      {/* Fond semi-transparent lorsque la sidebar est ouverte sur mobile/tablette */}
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
  );
}