"use client"
import { useState } from 'react';
import { Edit2, Trash2, Users, MapPin, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Gare {
  id: string;
  nom: string;
  ville: string;
  agentsCount: number;
}

interface StationCardProps {
  gare: Gare;
  onEdit: (gare: Gare) => void;
  onDelete: (gare: Gare) => void;
  onViewAgents: (gare: Gare) => void;
}

export function StationCard({ gare, onEdit, onDelete, onViewAgents }: StationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        "group relative transition-all duration-300",
        "bg-white",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
              {gare.nom}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{gare.ville}</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onViewAgents(gare)}>
                <Users className="mr-2 h-4 w-4" />
                Voir les agents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(gare)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(gare)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between">
          <Badge 
            variant={gare.agentsCount > 0 ? "default" : "secondary"}
            className={cn(
              "flex items-center gap-1 transition-all duration-200",
              gare.agentsCount > 0 && "bg-blue-600 hover:bg-blue-500",
            )}
          >
            <Users className="h-3 w-3" />
            {gare.agentsCount} agent{gare.agentsCount > 1 ? 's' : ''}
          </Badge>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(gare)}
              className="h-8 w-8 p-0 hover:bg-blue-600/10 hover:text-blue-600/80"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewAgents(gare)}
              className="h-8 w-8 p-0 hover:bg-blue-600/10 hover:text-blue-600/80"
            >
              <Users className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}