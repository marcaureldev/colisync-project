"use client"
import { useState, useEffect } from 'react';
import { Plus, Search, Train, BarChart3, Building2, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StationDialog } from '@/components/features/admin/management/stations/StationDialog';
import { toast } from 'sonner';
import StatusCard from '@/components/features/users/StatusCard';


interface Gare {
  id: string;
  denomination: string;
  city: string;
  agentsCount: number;
  horaireOuverture?: string;
  horaireFermeture?: string;
}

export default function ModernStations() {
  const [gares, setGares] = useState<Gare[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editGare, setEditGare] = useState<Gare | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger la liste des gares depuis l'API
  const fetchGares = async (searchValue = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = searchValue ? `?search=${encodeURIComponent(searchValue)}` : '';
      const res = await fetch(`/api/admin/management/stations${params}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Erreur lors du chargement');
      setGares(data.stations);
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGares(search);
  }, [search]);

  // Stats calculées
  const totalGares = gares.length;
  const totalAgents = gares.reduce((sum, gare) => sum + (gare.agentsCount || 0), 0);
  const averageAgents = totalGares > 0 ? Math.round(totalAgents / totalGares) : 0;
  const villes = [...new Set(gares.map(g => g.city))].length;

  // Handlers
  const openAddDialog = () => {
    setEditGare(null);
    setDialogOpen(true);
  };

  const openEditDialog = (gare: Gare) => {
    setEditGare(gare);
    setDialogOpen(true);
  };

  // Ajout ou modification d'une gare via l'API
  const handleSave = async (denomination: string, city: string, phoneNumber: string, horaireOuverture: string, horaireFermeture: string) => {
    setLoading(true);
    setError(null);
    try {
      let res, data;
      if (editGare) {
        // Modification
        res = await fetch(`/api/admin/management/stations/${editGare.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ denomination, city, phoneNumber, horaireOuverture, horaireFermeture }),
        });
        data = await res.json();
        if (!data.success) throw new Error(data.error || 'Erreur lors de la modification');
        setDialogOpen(false);
        fetchGares(search);
        toast(
          <div>
            <div className="font-bold">Gare modifiée</div>
            <div>{denomination} a été modifiée avec succès.</div>
          </div>
        );
      } else {
        // Création
        res = await fetch('/api/admin/management/stations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ denomination, city, phoneNumber, horaireOuverture, horaireFermeture }),
        });
        data = await res.json();
        if (!data.success) throw new Error(data.error || 'Erreur lors de la création');
        setDialogOpen(false);
        fetchGares(search);
        toast(
          <div>
            <div className="font-bold">Gare créée</div>
            <div>{denomination} a été ajoutée avec succès.</div>
          </div>
        );
      }
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (gare: Gare) => {
    // À implémenter (DELETE API)
    toast(
      <div>
        <div className="font-bold">Gare supprimée</div>
        <div>{gare.denomination} a été supprimée.</div>
      </div>
    );
  };

  const handleViewAgents = (gare: Gare) => {
    toast(
      <>
        <div className="font-bold mb-1">Agents de {gare.denomination}</div>
        <div>{gare.agentsCount || 0} agent(s) sont affecté(s) à cette gare.</div>
      </>
    );
  };

  // Recherche filtrée
  const filteredGares = gares; // délégué au backend

  return (
    <div className="">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Gestion des Gares
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatusCard
          title="Total Gares"
          value={totalGares}
          IconComponent={Train}
          colorName="blue"
        />
        <StatusCard
          title="Total Agents"
          value={totalAgents}
          IconComponent={BarChart3}
          colorName="green"
        />
        <StatusCard
          title="Villes"
          value={villes}
          IconComponent={Building2}
          colorName="yellow"
        />
        <StatusCard
          title="Moy. Agents"
          value={averageAgents}
          IconComponent={BarChart3}
          colorName="purple"
        />
      </div>

      {/* Recherche et Actions */}
      <div className="mt-12 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une gare ou une ville..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 py-5 bg-white"
            />
  </div>

          <Button
            onClick={openAddDialog}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une gare
          </Button>
  </div>

        {/* Results Info */}
        {search && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/20 text-primary">
              {filteredGares.length} résultat{filteredGares.length > 1 ? 's' : ''} trouvé{filteredGares.length > 1 ? 's' : ''}
            </Badge>
          </div>
        )}

        {/* Stations Table */}
        <div className="overflow-x-auto rounded-lg shadow-sm border border-border/30 bg-white min-h-[200px] flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-4" />
              <span className="text-blue-600 font-medium">Chargement...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="text-red-500 font-medium mb-2">{error}</span>
              <Button onClick={() => fetchGares(search)} className="mt-2">Réessayer</Button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ville</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ouverture</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fermeture</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Agents</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
              <tbody className="bg-white divide-y divide-border">
                {filteredGares.length > 0 ? (
                  filteredGares.map((gare) => (
                    <tr key={gare.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-muted-foreground font-mono">{gare.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">{gare.denomination}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{gare.city}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">{gare.horaireOuverture || '--:--'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">{gare.horaireFermeture || '--:--'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className="bg-primary/10 text-primary font-medium px-2 py-1">
                          {gare.agentsCount || 0} agent{gare.agentsCount > 1 ? 's' : ''}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditDialog(gare)}>
                            Modifier
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(gare)}>
                            Supprimer
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleViewAgents(gare)} title="Voir agents">
                            <Users className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <Building2 className="h-10 w-10 text-muted-foreground mb-2" />
                        <span className="text-lg font-medium">Aucune gare trouvée</span>
                        <span className="text-sm">
                          {search
                            ? `Aucune gare ne correspond à "${search}"`
                            : "Commencez par ajouter votre première gare"}
                        </span>
                        {!search && (
                          <Button onClick={openAddDialog} className="bg-gradient-primary hover:bg-gradient-primary/90 mt-2">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une gare
                          </Button>
                        )}
                      </div>
              </td>
            </tr>
                )}
        </tbody>
      </table>
          )}
        </div>
      </div>

      {/* Dialog */}
      <StationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        gare={editGare}
        onSave={handleSave}
      />
</div>
  );
}