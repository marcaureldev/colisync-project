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
  gare?: any | null;
  onSave: (
    denomination: string,
    city: string,
    phoneNumber: string,
    horaireOuverture: string,
    horaireFermeture: string
  ) => void;
}

export function StationDialog({ open, onOpenChange, gare, onSave }: StationDialogProps) {
  const [denomination, setDenomination] = useState('');
  const [city, setCity] = useState('');
  const [adress, setAdress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [horaireOuverture, setHoraireOuverture] = useState('');
  const [horaireFermeture, setHoraireFermeture] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!gare;

  useEffect(() => {
    if (gare) {
      setDenomination(gare.denomination || '');
      setCity(gare.city || '');
      setAdress(gare.adress || '');
      setPhoneNumber(gare.phoneNumber || '');
      setHoraireOuverture(gare.horaireOuverture || '');
      setHoraireFermeture(gare.horaireFermeture || '');
    } else {
      setDenomination('');
      setCity('');
      setAdress('');
      setPhoneNumber('');
      setHoraireOuverture('');
      setHoraireFermeture('');
    }
  }, [gare, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!denomination.trim() || !city.trim() || !phoneNumber.trim() || !horaireOuverture.trim() || !horaireFermeture.trim()) return;
    setIsLoading(true);
    await onSave(
      denomination.trim(),
      city.trim(),
      phoneNumber.trim(),
      horaireOuverture.trim(),
      horaireFermeture.trim()
    );
      setIsLoading(false);
      onOpenChange(false);
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
              <Label htmlFor="denomination" className="text-sm font-medium">
                Nom de la gare
              </Label>
              <div className="relative">
                <Input
                  id="denomination"
                  placeholder="Ex: Gare du Nord"
                  value={denomination}
                  onChange={(e) => setDenomination(e.target.value)}
                  className="pl-10"
                  required
                />
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                Ville
              </Label>
              <div className="relative">
                <Input
                  id="city"
                  placeholder="Ex: Paris"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="pl-10"
                  required
                />
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium">
                Téléphone
              </Label>
              <Input
                id="phoneNumber"
                placeholder="Ex: 01 23 45 67 89"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horaireOuverture" className="text-sm font-medium">
                Horaire d'ouverture
              </Label>
              <input
                type="time"
                id="horaireOuverture"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={horaireOuverture}
                onChange={(e) => setHoraireOuverture(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horaireFermeture" className="text-sm font-medium">
                Horaire de fermeture
              </Label>
              <input
                type="time"
                id="horaireFermeture"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={horaireFermeture}
                onChange={(e) => setHoraireFermeture(e.target.value)}
                required
              />
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
              disabled={isLoading || !denomination.trim() || !city.trim() || !phoneNumber.trim() || !horaireOuverture.trim() || !horaireFermeture.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
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