"use client"
import React, { useState, useEffect } from "react";
import GeneratedCodeModal from "@/components/ui/admin/invitations/GeneratedCodeModal";
import InvitationFormModal from "@/components/ui/admin/invitations/InvitationFormModal";
import SelectionModal from "@/components/ui/admin/invitations/SelectionModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Building2,
  User,
  Plus,
  Search,
  Copy,
  Mail,
  MoreHorizontal,
} from "lucide-react";

type InvitationType = "company" | "agent";
type InvitationStatus = "pending" | "used" | "expired";

interface Invitation {
  id: string;
  code: string;
  type: InvitationType;
  name: string;
  email?: string;
  station?: string;
  createdAt: string;
  status: InvitationStatus;
}

const InvitationManagement = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTypeSelection, setShowTypeSelection] = useState(false);
  const [showInvitationForm, setShowInvitationForm] = useState(false);
  const [showGeneratedCode, setShowGeneratedCode] = useState(false);
  const [selectedType, setSelectedType] = useState<InvitationType>('company');
  const [generatedInvitation, setGeneratedInvitation] = useState<Invitation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Fetch invitations from API
  const fetchInvitations = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        type: filterType,
        status: filterStatus,
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      const response = await fetch(`/api/admin/invitations-list?${params.toString()}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Erreur lors du chargement');
      setInvitations(data.invitations);
      setTotalCount(data.totalCount);
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterType, filterStatus, page]);

  const handleInviteClick = () => {
    setShowTypeSelection(true);
  };

  const handleTypeSelect = (type: InvitationType) => {
    setSelectedType(type);
    setShowTypeSelection(false);
    setShowInvitationForm(true);
  };

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/generate-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: selectedType }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Erreur lors de la création');
      setGeneratedInvitation(result.invitation);
      setShowInvitationForm(false);
      setShowGeneratedCode(true);
      setPage(1); // Retour à la première page
      fetchInvitations(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: InvitationStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'used':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Utilisé</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expiré</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: InvitationType) => {
    return type === 'company' ? (
      <Badge variant="outline" className="gap-1">
        <Building2 className="h-3 w-3" />
        Compagnie
      </Badge>
    ) : (
      <Badge variant="outline" className="gap-1">
        <User className="h-3 w-3" />
        Agent
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Invitations</h1>
          <p className="text-muted-foreground">Créer et gérer les codes d'invitation</p>
        </div>
        <Button onClick={handleInviteClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Inviter un utilisateur
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="company">Compagnie</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="used">Utilisé</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading & Error */}
      {loading && <div className="text-center text-blue-500">Chargement...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Invitations Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">CODE</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">TYPE</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">NOM</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">DATE DE CRÉATION</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">STATUT</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((invitation) => (
                  <tr key={invitation.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium text-foreground">{invitation.code}</td>
                    <td className="py-3 px-4">{getTypeBadge(invitation.type)}</td>
                    <td className="py-3 px-4 text-foreground">{invitation.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{invitation.createdAt}</td>
                    <td className="py-3 px-4">{getStatusBadge(invitation.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Régénérer</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Révoquer</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Affichage de {invitations.length > 0 ? ((page - 1) * pageSize + 1) : 0} à {Math.min(page * pageSize, totalCount)} sur {totalCount} résultats
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>‹</Button>
              {[...Array(Math.ceil(totalCount / pageSize)).keys()].map((i) => (
                <Button
                  key={i + 1}
                  variant="outline"
                  size="sm"
                  className={page === i + 1 ? "bg-primary/10" : ""}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" size="sm" disabled={page === Math.ceil(totalCount / pageSize) || totalCount === 0} onClick={() => setPage(page + 1)}>›</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <SelectionModal
        isOpen={showTypeSelection}
        onClose={() => setShowTypeSelection(false)}
        onSelectType={handleTypeSelect}
      />

      <InvitationFormModal
        isOpen={showInvitationForm}
        onClose={() => setShowInvitationForm(false)}
        type={selectedType}
        onSubmit={handleFormSubmit}
      />

      <GeneratedCodeModal
        isOpen={showGeneratedCode}
        onClose={() => setShowGeneratedCode(false)}
        invitation={generatedInvitation}
      />
    </div>
  );
};

export default InvitationManagement;
