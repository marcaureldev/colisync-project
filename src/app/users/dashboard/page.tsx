import StatusCard from "@/components/ui/users/StatusCard";
import {
  Package,
  CheckCircle,
  AlertTriangle,
  Truck,
  ArrowRight,
} from "lucide-react";
import React from "react";

const DashboardPage = () => {
  return (
    <div className="space-y-6 dark:bg-white/5 dark:backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg p-2 sm:p-4 shadow-sm">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Tableau de bord
      </h1>
      {/* Section des cartes de statut */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatusCard
          title="Active Shipments"
          value={2}
          IconComponent={Package}
          colorName="blue"
        />
        <StatusCard
          title="Delivered This Month"
          value={5}
          IconComponent={CheckCircle}
          colorName="green"
        />
        <StatusCard
          title="Pending Payments"
          value={1}
          IconComponent={AlertTriangle}
          colorName="yellow"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
        <div className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center justify-between cursor-pointer transition-colors">
          <div className="flex space-x-2 items-center">
            <Truck />
            <span>Envoyer un nouveau colis</span>
          </div>
          <ArrowRight />
        </div>
        <div className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center justify-between cursor-pointer transition-colors">
          <div className="flex space-x-2 itemms-center">
            <Package />
            <span>Suivre un colis</span>
          </div>
          <ArrowRight />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
