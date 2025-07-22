import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InvitationType = "company" | "agent";

interface Gare {
  id: string;
  denomination: string;
  city: string;
  phoneNumber: string;
  horaireOuverture: string;
  horaireFermeture: string;
}

interface InvitationFormData {
  name: string;
  email?: string;
  gareId?: string;
  expiresInDays?: number;
}

interface InvitationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: InvitationType;
  onSubmit: (data: InvitationFormData) => void;
}

const InvitationFormModal = ({ 
  isOpen, 
  onClose, 
  type, 
  onSubmit 
}: InvitationFormModalProps) => {
  const [formData, setFormData] = useState<InvitationFormData>({
    name: '',
    email: '',
    gareId: '',
    expiresInDays: 7
  });
  
  const [gares, setGares] = useState<Gare[]>([]);
  const [loadingGares, setLoadingGares] = useState(false);
  const [error, setError] = useState<string>('');

  // Charger les gares quand le modal s'ouvre et que c'est pour un agent
  useEffect(() => {
    if (isOpen && type === 'agent') {
      fetchGares();
    }
    // Reset le formulaire quand le modal s'ouvre
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        gareId: '',
        expiresInDays: 7
      });
      setError('');
    }
  }, [isOpen, type]);

  const fetchGares = async () => {
    setLoadingGares(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/management/stations`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.success) {
        // CORRECTION: L'API retourne 'stations', pas 'gares'
        setGares(data.stations || []);
      } else {
        setError(data.error || 'Erreur lors du chargement des gares');
      }
    } catch (err) {
      setError('Erreur lors du chargement des gares');
      console.error('Erreur fetch gares:', err);
    } finally {
      setLoadingGares(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setError('Le nom est requis');
      return;
    }
    
    if (type === 'agent' && !formData.gareId) {
      setError('La sélection d\'une gare est requise pour un agent');
      return;
    }

    // Validation de l'email si fourni
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setError('Veuillez entrer une adresse email valide');
        return;
      }
    }

    // Préparer les données à envoyer
    const submitData: InvitationFormData = {
      name: formData.name.trim(),
      expiresInDays: formData.expiresInDays || 7
    };

    // Ajouter l'email seulement s'il est fourni et valide
    if (formData.email && formData.email.trim()) {
      submitData.email = formData.email.trim();
    }

    // Ajouter gareId seulement pour les agents
    if (type === 'agent' && formData.gareId) {
      submitData.gareId = formData.gareId;
    }

    onSubmit(submitData);
    onClose(); // Fermer le modal après soumission
  };

  const title = type === 'company' ? 'Nouvelle invitation - Compagnie' : 'Nouvelle invitation - Agent de gare';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">
              {type === 'company' ? 'Nom de la compagnie' : 'Nom de l\'agent'} *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={type === 'company' ? 'Entrez le nom de la compagnie' : 'Entrez le nom de l\'agent'}
              required
            />
          </div>

          {type === 'agent' && (
            <div className="space-y-2">
              <Label htmlFor="gare">Gare associée *</Label>
              {loadingGares ? (
                <div className="flex items-center justify-center p-3 text-sm text-gray-500 border rounded-md">
                  Chargement des gares...
                </div>
              ) : gares.length === 0 ? (
                <div className="flex items-center justify-center p-3 text-sm text-gray-500 border rounded-md">
                  Aucune gare disponible
                </div>
              ) : (
                <Select 
                  value={formData.gareId} 
                  onValueChange={(value) => setFormData({ ...formData, gareId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une gare" />
                  </SelectTrigger>
                  <SelectContent>
                    {gares.map((gare) => (
                      <SelectItem key={gare.id} value={gare.id}>
                        {gare.denomination} - {gare.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email de contact</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@exemple.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires">Expire dans (jours)</Label>
            <Input
              id="expires"
              type="number"
              min="1"
              max="365"
              value={formData.expiresInDays}
              onChange={(e) => setFormData({ 
                ...formData, 
                expiresInDays: parseInt(e.target.value) || 7 
              })}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={
                !formData.name.trim() || 
                (type === 'agent' && !formData.gareId) ||
                loadingGares
              }
            >
              Générer le code
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationFormModal;