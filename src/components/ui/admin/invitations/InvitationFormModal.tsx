// "use client";
// import React, { useState } from "react";
// import { Input } from "../../input";
// import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@radix-ui/react-select";
// import { Button } from "../../button";
// import { DialogHeader } from "../../dialog";
// type InvitationType = "company" | "agent";
// const mockStations = [
//   "Cotonou",
//   "Porto-Novo",
//   "Parakou",
//   "Abomey",
//   "Bohicon",
//   "Natitingou",
// ];

// const InvitationFormModal = ({ 
//   isOpen, 
//   onClose, 
//   type, 
//   onSubmit 
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   type: InvitationType;
//   onSubmit: (data: any) => void;
// }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     station: ''
//   });

//   const handleSubmit = () => {
//     if (formData.name.trim() && (type === 'company' || formData.station)) {
//       onSubmit(formData);
//       setFormData({ name: '', email: '', station: '' });
//     }
//   };

//   const title = type === 'company' ? 'Nouvelle invitation - Compagnie' : 'Nouvelle invitation - Agent de gare';

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>{title}</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <label htmlFor="name">
//               {type === 'company' ? 'Nom de la compagnie' : 'Nom de l\'agent'} *
//             </label>
//             <Input
//               id="name"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               placeholder={type === 'company' ? 'Entrez le nom de la compagnie' : 'Entrez le nom de l\'agent'}
//               required
//             />
//           </div>

//           {type === 'agent' && (
//             <div className="space-y-2">
//               <label htmlFor="station">Gare associée *</label>
//               <Select 
//                 value={formData.station} 
//                 onValueChange={(value) => setFormData({ ...formData, station: value })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Sélectionnez une gare" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {mockStations.map((station) => (
//                     <SelectItem key={station} value={station}>
//                       {station}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           <div className="space-y-2">
//             <label htmlFor="email">Email de contact</label>
//             <Input
//               id="email"
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               placeholder="email@exemple.com"
//             />
//           </div>

//           <Button onClick={handleSubmit} className="w-full">
//             Générer le code
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default InvitationFormModal;

import React, { useState } from "react";
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

interface InvitationFormData {
  name: string;
  email: string;
  station: string;
}

interface InvitationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: InvitationType;
  onSubmit: (data: InvitationFormData) => void;
}

const mockStations = [
  "Cotonou",
  "Porto-Novo",
  "Parakou",
  "Abomey",
  "Bohicon",
  "Natitingou",
];

const InvitationFormModal = ({ 
  isOpen, 
  onClose, 
  type, 
  onSubmit 
}: InvitationFormModalProps) => {
  const [formData, setFormData] = useState<InvitationFormData>({
    name: '',
    email: '',
    station: ''
  });

  const handleSubmit = () => {
    if (formData.name.trim() && (type === 'company' || formData.station)) {
      onSubmit(formData);
      setFormData({ name: '', email: '', station: '' });
    }
  };

  const title = type === 'company' ? 'Nouvelle invitation - Compagnie' : 'Nouvelle invitation - Agent de gare';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
              <Label htmlFor="station">Gare associée *</Label>
              <Select 
                value={formData.station} 
                onValueChange={(value) => setFormData({ ...formData, station: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une gare" />
                </SelectTrigger>
                <SelectContent>
                  {mockStations.map((station) => (
                    <SelectItem key={station} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <Button onClick={handleSubmit} className="w-full">
            Générer le code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationFormModal;
