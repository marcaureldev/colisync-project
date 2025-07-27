"use client";
import DeliveryVolumeChart from "@/components/features/admin/dashboard/DeliveryVolumeChart";
import DistributionStatusChart from "@/components/features/admin/dashboard/DistributionStatusChart";
import RecentActivityTable from "@/components/features/admin/dashboard/RecentActivityTable";
import StatusCard from "@/components/features/users/StatusCard";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  CheckCircle,
  Package,
  Map,
  UserCheck,
  Users,
  Bell,
} from "lucide-react";
import React, { useState } from "react";

const page = () => {
  const [isTesting, setIsTesting] = useState(false);

  const testUserRegistration = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('/api/test-user-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Jean Dupont',
          email: 'jean.dupont@example.com',
          role: 'AGENT_GARE'
        }),
      });

      if (response.ok) {
        alert('Test d\'inscription réussi ! Vérifiez les notifications.');
      } else {
        alert('Erreur lors du test d\'inscription');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du test');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
        Tableau de bord
      </h1>
        <Button
          onClick={testUserRegistration}
          disabled={isTesting}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Bell className="h-4 w-4" />
          {isTesting ? 'Test en cours...' : 'Tester notification'}
        </Button>
      </div>
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
