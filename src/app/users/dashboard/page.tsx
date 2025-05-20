import StatusCard from "@/components/ui/users/StatusCard";
import ActiveShipmentLine from "@/components/ui/users/ActiveShipmentLine";
import {
  Package,
  CheckCircle,
  AlertTriangle,
  Truck,
  ArrowRight,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import RecentDeliveriesLine from "@/components/ui/users/RecentDeliveriesLine";
import ActiveShipmentHead from "@/components/ui/users/ActiveShipmentHead";

// Données d'exemple pour les expéditions
const shipments = [
  {
    id: "PKG-2023-001",
    destination: "Cotonou Bus Terminal",
    status: "En transit" as const,
    estDelivery: "24 Oct, 2023",
    recipient: "Amina Kouassi",
    trackLink: "/users/track-shipment/PKG-2023-001",
  },
  {
    id: "PKG-2023-002",
    destination: "Parakou Central Station",
    status: "En traitement" as const,
    estDelivery: "26 Oct, 2023",
    recipient: "Jean Mensah",
    trackLink: "/users/track-shipment/PKG-2023-002",
  },
];

// Données d'exemple pour les livraisons récentes
const recentDeliveries = [
  {
    id: "PKG-2023-000",
    recipient: "Marc Adebayo",
    destination: "Porto-Novo Main Station",
    deliveryDate: "20 Oct, 2023",
    status: "Livré",
  },
  {
    id: "PKG-1999-999",
    recipient: "Sophie Amoussou",
    destination: "Bohicon Terminal",
    deliveryDate: "15 Oct, 2023",
    status: "Livré",
  },
];

const Page = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-white/5 dark:backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg p-4 sm:p-6 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Tableau de bord
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatusCard
            title="Expéditions actives"
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
            title="Paiements en attente"
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
            <div className="flex space-x-2 items-center">
              <Package />
              <span>Suivre un colis</span>
            </div>
            <ArrowRight />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 dark:backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg p-4 sm:p-6 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Expéditions actives
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full w-full text-left text-sm">
            <ActiveShipmentHead/>
            <tbody>
              {shipments.length > 0 ? (
                shipments.map((shipment) => (
                  <ActiveShipmentLine
                    key={shipment.id}
                    id={shipment.id}
                    destination={shipment.destination}
                    status={shipment.status}
                    estDelivery={shipment.estDelivery}
                    recipient={shipment.recipient}
                    trackLink={shipment.trackLink}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 px-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    Aucune expédition active.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {shipments.length > 0 && (
          <div className="mt-4 text-right">
            <Link
              href="/users/shipments"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm inline-flex items-center group"
            >
              Voir toutes les expéditions
              <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-white/5 dark:backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg p-4 sm:p-6 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Livraisons Récentes
        </h2>
        <div className="space-y-0">
          {recentDeliveries.length > 0 ? (
            recentDeliveries.map((delivery) => (
              <RecentDeliveriesLine
                key={delivery.id}
                id={delivery.id}
                recipient={delivery.recipient}
                destination={delivery.destination}
                deliveryDate={delivery.deliveryDate}
                status={delivery.status}
              />
            ))
          ) : (
            <p className="py-4 text-center text-gray-500 dark:text-gray-400">
              Aucune livraison récente.
            </p>
          )}
        </div>
        {recentDeliveries.length > 0 && (
          <div className="mt-4 text-right">
            <Link
              href="/users/deliveries-history" 
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm inline-flex items-center group"
            >
              Voir l'historique des livraisons
              <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
