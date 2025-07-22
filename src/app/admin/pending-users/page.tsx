"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, User, CheckCircle, XCircle, Clock, Mail } from "lucide-react";
import { ClipLoader } from "react-spinners";

interface PendingUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
  createdAt: string;
  gare?: {
    denomination: string;
    city: string;
  };
}

export default function PendingUsersPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingUser, setProcessingUser] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/pending-users');
      const data = await response.json();

      if (response.ok) {
        setPendingUsers(data.users);
      } else {
        setError(data.error || 'Erreur lors du chargement des utilisateurs');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      setProcessingUser(userId);
      const response = await fetch(`/api/admin/activate-user/${userId}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        // Mettre à jour la liste locale
        setPendingUsers(prev => prev.filter(user => user.id !== userId));
      } else {
        setError(data.error || 'Erreur lors de l\'activation');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setProcessingUser(null);
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      setProcessingUser(userId);
      const response = await fetch(`/api/admin/reject-user/${userId}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        // Mettre à jour la liste locale
        setPendingUsers(prev => prev.filter(user => user.id !== userId));
      } else {
        setError(data.error || 'Erreur lors du rejet');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setProcessingUser(null);
    }
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'COMPANY':
        return {
          icon: <Building2 className="h-4 w-4" />,
          label: 'Entreprise',
          color: 'bg-blue-100 text-blue-800'
        };
      case 'AGENT_GARE':
        return {
          icon: <User className="h-4 w-4" />,
          label: 'Agent de gare',
          color: 'bg-green-100 text-green-800'
        };
      default:
        return {
          icon: <User className="h-4 w-4" />,
          label: role,
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ClipLoader color="#3B82F6" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Utilisateurs en attente de validation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez les comptes en attente d'activation
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-yellow-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {pendingUsers.length} utilisateur(s) en attente
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {pendingUsers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Aucun utilisateur en attente
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Tous les comptes ont été traités. Les nouveaux comptes apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Comptes en attente de validation</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Gare</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.displayName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={roleInfo.color}>
                          {roleInfo.icon}
                          <span className="ml-1">{roleInfo.label}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.gare ? (
                          <div>
                            <div className="font-medium">{user.gare.denomination}</div>
                            <div className="text-sm text-gray-500">{user.gare.city}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleActivateUser(user.id)}
                            disabled={processingUser === user.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {processingUser === user.id ? (
                              <ClipLoader color="#ffffff" size={14} />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            <span className="ml-1">Activer</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectUser(user.id)}
                            disabled={processingUser === user.id}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            {processingUser === user.id ? (
                              <ClipLoader color="#dc2626" size={14} />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            <span className="ml-1">Rejeter</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 