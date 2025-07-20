"use client"
import { useState } from 'react';
import { Plus, Search, Filter, Train, BarChart3, ArrowRight, Map,Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StationDialog } from '@/components/ui/admin/management/stations/StationDialog';
import { toast } from 'sonner';
import StatusCard from '@/components/ui/users/StatusCard';
import { StationCard } from '@/components/ui/admin/management/StationCard';


interface Gare {
  id: string;
  nom: string;
  ville: string;
  agentsCount: number;
}

const mockGares: Gare[] = [
  { id: '1', nom: 'Gare du Nord', ville: 'Paris', agentsCount: 12 },
  { id: '2', nom: 'Gare Saint-Charles', ville: 'Marseille', agentsCount: 8 },
  { id: '3', nom: 'Gare Part-Dieu', ville: 'Lyon', agentsCount: 15 },
  { id: '4', nom: 'Gare Montparnasse', ville: 'Paris', agentsCount: 10 },
  { id: '5', nom: 'Gare de l\'Est', ville: 'Paris', agentsCount: 7 },
  { id: '6', nom: 'Gare de Bordeaux', ville: 'Bordeaux', agentsCount: 5 },
];

export default function ModernStations() {
  const [gares, setGares] = useState<Gare[]>(mockGares);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editGare, setEditGare] = useState<Gare | null>(null);

  // Stats calculées
  const totalGares = gares.length;
  const totalAgents = gares.reduce((sum, gare) => sum + gare.agentsCount, 0);
  const averageAgents = totalGares > 0 ? Math.round(totalAgents / totalGares) : 0;
  const villes = [...new Set(gares.map(g => g.ville))].length;

  // Filtrage
  const filteredGares = gares.filter(gare =>
    gare.nom.toLowerCase().includes(search.toLowerCase()) ||
    gare.ville.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const openAddDialog = () => {
    setEditGare(null);
    setDialogOpen(true);
  };

  const openEditDialog = (gare: Gare) => {
    setEditGare(gare);
    setDialogOpen(true);
  };

  const handleSave = (nom: string, ville: string) => {
    if (editGare) {
      setGares(gares.map(g =>
        g.id === editGare.id ? { ...g, nom, ville } : g
      ));
      toast(
        <div>
          <div className="font-bold">Gare modifiée</div>
          <div>{nom} a été modifiée avec succès.</div>
        </div>
      );
    } else {
      const newGare: Gare = {
        id: Date.now().toString(),
        nom,
        ville,
        agentsCount: 0
      };
      setGares([newGare, ...gares]);
      toast(
        <div>
          <div className="font-bold">Gare créée</div>
          <div>{nom} a été ajoutée avec succès.</div>
        </div>
      );
    }
  };

  const handleDelete = (gare: Gare) => {
    setGares(gares.filter(g => g.id !== gare.id));
    toast(
      <div>
        <div className="font-bold">Gare supprimée</div>
        <div>{gare.nom} a été supprimée.</div>
      </div>
    );
  };

  const handleViewAgents = (gare: Gare) => {
    toast(
      <>
        <div className="font-bold mb-1">Agents de {gare.nom}</div>
        <div>{gare.agentsCount} agent(s) sont affecté(s) à cette gare.</div>
      </>
    );
  };

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
        <div className="overflow-x-auto rounded-lg shadow-sm border border-border/30 bg-white">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ville</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Agents</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {filteredGares.length > 0 ? (
                filteredGares.map((gare) => (
                  <tr key={gare.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-muted-foreground font-mono">{gare.id.slice(-4)}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">{gare.nom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{gare.ville}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="bg-primary/10 text-primary font-medium px-2 py-1">
                        {gare.agentsCount} agent{gare.agentsCount > 1 ? 's' : ''}
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
                        <Button size="sm" variant="outline" onClick={() => handleViewAgents(gare)}>
                          Voir agents
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-muted-foreground mb-2" />
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