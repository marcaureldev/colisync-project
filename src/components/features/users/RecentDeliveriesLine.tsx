import React from 'react';
import { Clock } from 'lucide-react'; // Pour l'icône de l'horloge
import { cn } from '@/lib/utils';

interface RecentDeliveryLineProps {
  id: string;
  recipient: string;
  destination: string;
  deliveryDate: string;
  status: string; // Par exemple "Livré"
}

const RecentDeliveriesLine: React.FC<RecentDeliveryLineProps> = ({
  id,
  recipient,
  destination,
  deliveryDate,
  status,
}) => {
  // Définir les couleurs du badge de statut ici si nécessaire, ou le rendre plus générique
  const statusBgColor = 'bg-green-100 dark:bg-green-500/20';
  const statusTextColor = 'text-green-700 dark:text-green-400';

  return (
    <div className="py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start last:border-b-0">
      {/* Informations principales à gauche */}
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-gray-800 dark:text-white">{id}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">À: {recipient}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{destination}</p>
      </div>

      {/* Statut et date à droite */}
      <div className="text-right flex flex-col items-end gap-1">
        <span
          className={cn(
            'px-2 py-0.5 text-xs font-medium rounded-full inline-block',
            statusBgColor,
            statusTextColor
          )}
        >
          {status}
        </span>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Clock size={14} className="mr-1" />
          <span>{deliveryDate}</span>
        </div>
      </div>
    </div>
  );
};

export default RecentDeliveriesLine;