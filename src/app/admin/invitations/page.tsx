"use client"
import React, { useState, useEffect } from "react";
import GeneratedCodeModal from "@/components/features/admin/invitations/GeneratedCodeModal";
import InvitationFormModal from "@/components/features/admin/invitations/InvitationFormModal";
import SelectionModal from "@/components/features/admin/invitations/SelectionModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Loader2,
  Ticket,
} from "lucide-react";
import StatusCard from "@/components/features/users/StatusCard";

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
  const [pendingCount, setPendingCount] = useState(0);
  const [usedCount, setUsedCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
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
      setPendingCount(data.pendingCount);
      setUsedCount(data.usedCount);
      setExpiredCount(data.expiredCount);
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
      setPage(1);
      fetchInvitations();
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async (invitationId: string) => {
    try {
      const response = await fetch('/api/admin/resend-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Erreur lors de l\'envoi');
      // Afficher un toast de succès
      alert('Email envoyé avec succès');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi de l\'email');
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // Afficher un toast de succès
      alert('Code copié dans le presse-papiers');
    } catch (err) {
      setError('Erreur lors de la copie du code');
    }
  };

  const getStatusBadge = (status: InvitationStatus) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'used':
        return <Badge className="bg-green-100 text-green-800">Utilisé</Badge>;
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

  // Stats calculées
  // const pendingCount = invitations.filter(inv => inv.status === 'pending').length;
  // const usedCount = invitations.filter(inv => inv.status === 'used').length;
  // const expiredCount = invitations.filter(inv => inv.status === 'expired').length;

  return (
    <div className="">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Gestion des Invitations
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatusCard
          title="Total des invitations"
          value={totalCount}
          IconComponent={Mail}
          colorName="blue"
        />
        <StatusCard
          title="En attente"
          value={pendingCount}
          IconComponent={Mail}
          colorName="yellow"
        />
        <StatusCard
          title="Utilisées"
          value={usedCount}
          IconComponent={Mail}
          colorName="green"
        />
        <StatusCard
          title="Expirées"
          value={expiredCount}
          IconComponent={Mail}
          colorName="purple"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
            placeholder="Rechercher par nom ou code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
                />
              </div>
        <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48 bg-white">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="company">Compagnie</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48 bg-white">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="used">Utilisé</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
              </SelectContent>
            </Select>
          <Button onClick={handleInviteClick} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Inviter
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm border border-border/30 bg-white min-h-[200px] flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-4" />
            <span className="text-blue-600 font-medium">Chargement...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-red-500 font-medium mb-2">{error}</span>
            <Button onClick={() => fetchInvitations()} className="mt-2">Réessayer</Button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">CODE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">TYPE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">NOM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">DATE DE CRÉATION</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">STATUT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ACTIONS</th>
                </tr>
              </thead>
            <tbody className="bg-white divide-y divide-border">
              {invitations.length > 0 ? (
                invitations.map((invitation) => (
                  <tr key={invitation.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">{invitation.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(invitation.type)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-foreground">{invitation.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{invitation.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(invitation.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          title="Copier le code"
                          onClick={() => handleCopyCode(invitation.code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {invitation.email && invitation.status === 'pending' && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            title="Envoyer par email"
                            onClick={() => handleResendEmail(invitation.id)}
                          >
                          <Mail className="h-4 w-4" />
                        </Button>
                        )}
                        <Button size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                      <Ticket className="h-10 w-10 text-muted-foreground mb-2" />
                      <span className="text-lg font-medium">Aucune invitation trouvée</span>
                      <span className="text-sm">
                        {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                          ? "Aucune invitation ne correspond aux filtres."
                          : "Commencez par créer une invitation."}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
              </tbody>
            </table>
        )}
          </div>
          
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
