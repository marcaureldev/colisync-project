import React from "react";

const ActiveShipmentHead = () => {
  return (
      <thead className="border-b border-gray-200 dark:border-gray-700">
        <tr className="text-gray-500 dark:text-gray-400 uppercase whitespace-nowrap">
          <th className="py-3 px-4 font-semibold">ID</th>
          <th className="py-3 px-4 font-semibold">Destination</th>
          <th className="py-3 px-4 font-semibold">Statut</th>
          <th className="py-3 px-4 font-semibold">Livraison</th>
          <th className="py-3 px-4 font-semibold">Destinataire</th>
          <th className="py-3 px-4 font-semibold">Action</th>
        </tr>
      </thead>
  );
};

export default ActiveShipmentHead;
