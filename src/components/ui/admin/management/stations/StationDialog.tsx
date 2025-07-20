"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Building } from 'lucide-react';

interface Gare {
  id: string;
  nom: string;
  ville: string;
  agentsCount: number;
}

interface StationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gare?: Gare | null;
  onSave: (nom: string, ville: string) => void;
}

export function StationDialog({ open, onOpenChange, gare, onSave }: StationDialogProps) {
  const [nom, setNom] = useState('');
  const [ville, setVille] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!gare;

  useEffect(() => {
    if (gare) {
      setNom(gare.nom);
      setVille(gare.ville);
    } else {
      setNom('');
      setVille('');
    }
  }, [gare, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !ville.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSave(nom.trim(), ville.trim());
      setIsLoading(false);
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-" />
            {isEditing ? 'Modifier la gare' : 'Ajouter une nouvelle gare'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les informations de la gare ci-dessous.' 
              : 'Entrez les informations de la nouvelle gare.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom" className="text-sm font-medium">
                Nom de la gare
              </Label>
              <div className="relative">
                <Input
                  id="nom"
                  placeholder="Ex: Gare du Nord"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="pl-10"
                  required
                />
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ville" className="text-sm font-medium">
                Ville
              </Label>
              <div className="relative">
                <Input
                  id="ville"
                  placeholder="Ex: Paris"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="pl-10"
                  required
                />
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !nom.trim() || !ville.trim()}
              className="bg-gradient-blue-600 hover:bg-gradient-blue-700"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isEditing ? 'Modification...' : 'Création...'}
                </span>
              ) : (
                isEditing ? 'Modifier' : 'Créer'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}