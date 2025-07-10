"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

const recentActivity = [
  {
    id: 'COL-2401',
    expediteur: 'Jean Dupont',
    destination: 'Cotonou',
    statut: 'Livré',
    statutColor: 'bg-green-100 text-green-800',
    date: '15 Jan 2024'
  },
  {
    id: 'COL-2402',
    expediteur: 'Marie Claire',
    destination: 'Porto-Novo',
    statut: 'Livré',
    statutColor: 'bg-green-100 text-green-800',
    date: '15 Jan 2024'
  },
  {
    id: 'COL-2403',
    expediteur: 'Paul Michel',
    destination: 'Parakou',
    statut: 'En transit',
    statutColor: 'bg-yellow-100 text-yellow-800',
    date: '14 Jan 2024'
  }
];

const RecentActivityTable = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Activité Récente</CardTitle>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtrer
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">ID Colis</th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Expéditeur</th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Destination</th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Statut</th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{item.expediteur}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{item.destination}</td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary" className={item.statutColor}>
                      {item.statut}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityTable;
