import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils'; // Assurez-vous que cn est importé

type ShipmentStatus = 'En transit' | 'En traitement' | 'Livré' | 'En attente';

interface ActiveShipmentLineProps {
  id: string;
  destination: string;
  status: ShipmentStatus;
  estDelivery: string;
  recipient: string;
  trackLink: string;
}

const StatusBadge: React.FC<{ status: ShipmentStatus }> = ({ status }) => {
  let bgColor = '';
  let textColor = '';

  switch (status) {
    case 'En transit':
      bgColor = 'bg-blue-100 dark:bg-blue-500/20';
      textColor = 'text-blue-600 dark:text-blue-400';
      break;
    case 'En traitement':
      bgColor = 'bg-yellow-100 dark:bg-yellow-500/20';
      textColor = 'text-yellow-700 dark:text-yellow-400';
      break;
    case 'Livré':
      bgColor = 'bg-green-100 dark:bg-green-500/20';
      textColor = 'text-green-700 dark:text-green-400';
      break;
    case 'En attente':
      bgColor = 'bg-gray-100 dark:bg-gray-600/20';
      textColor = 'text-gray-700 dark:text-gray-400';
      break;
    default:
      bgColor = 'bg-gray-100 dark:bg-gray-600/20';
      textColor = 'text-gray-700 dark:text-gray-400';
  }

  return (
    <span
      className={cn(
        'px-2.5 py-0.5 text-xs font-medium rounded-full inline-block',
        bgColor,
        textColor
      )}
    >
      {status}
    </span>
  );
};

const ActiveShipmentLine: React.FC<ActiveShipmentLineProps> = ({
  id,
  destination,
  status,
  estDelivery,
  recipient,
  trackLink,
}) => {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors whitespace-nowrap">
      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
        {id}
      </td>
      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
        {destination}
      </td>
      <td className="py-3 px-4 text-sm">
        <StatusBadge status={status} />
      </td>
      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
        {estDelivery}
      </td>
      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
        {recipient}
      </td>
      <td className="py-3 px-4 text-sm">
        <Link href={trackLink} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
          Track
        </Link>
      </td>
    </tr>
  );
};

export default ActiveShipmentLine;