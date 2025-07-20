"use client";
import DeliveryVolumeChart from "@/components/ui/admin/dashboard/DeliveryVolumeChart";
import DistributionStatusChart from "@/components/ui/admin/dashboard/DistributionStatusChart";
import RecentActivityTable from "@/components/ui/admin/dashboard/RecentActivityTable";
import StatusCard from "@/components/ui/users/StatusCard";
import {
  ArrowRight,
  Building2,
  CheckCircle,
  Package,
  Map,
  UserCheck,
  Users,
} from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div className="">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Tableau de bord
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatusCard
          title="Colis en transit"
          value={2}
          IconComponent={Package}
          colorName="blue"
        />
        <StatusCard
          title="Livraisons ce mois-ci"
          value={5}
          IconComponent={CheckCircle}
          colorName="green"
        />
        <StatusCard
          title="Gares actives"
          value={1}
          IconComponent={Map}
          colorName="yellow"
        />

        <StatusCard
          title="Agents en service"
          value={1}
          IconComponent={Users}
          colorName="purple"
        />
      </div>

      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6">
        <div className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center justify-between cursor-pointer transition-colors">
          <div className="flex space-x-2 items-center">
            <UserCheck />
            <span>Inviter un agent</span>
          </div>
          <ArrowRight />
        </div>
        <div className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center justify-between cursor-pointer transition-colors">
          <div className="flex space-x-2 items-center">
            <Building2 />
            <span>Inviter une nouvelle compagnie</span>
          </div>
          <ArrowRight />
        </div>
        <div className="bg-orange-900/80 hover:bg-orange-900/90 text-white p-4 rounded-lg flex items-center justify-between cursor-pointer transition-colors">
          <div className="flex space-x-2 items-center">
            <Map />
            <span>Gérer gares</span>
          </div>
          <ArrowRight />
        </div>
      </div> */}

      <div className="mt-6 space-y-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Statistiques
        </h2>
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DeliveryVolumeChart />
          <DistributionStatusChart />
        </div>

        {/* Recent Activity Table */}
        <RecentActivityTable />
      </div>
    </div>
  );
};

export default page;
