// "use client";
// import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
// import { Building2, User } from "lucide-react";
// import React from "react";
// import { DialogHeader } from "../../dialog";

// type InvitationType = "company" | "agent";
// const SelectionModal = ({
//   isOpen,
//   onClose,
//   onSelectType,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   onSelectType: (type: InvitationType) => void;
// }) => {
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Sélectionner le type d'invitation</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           <button
//             onClick={() => onSelectType("company")}
//             className="w-full flex items-center gap-3 p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
//           >
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <Building2 className="h-5 w-5 text-blue-600" />
//             </div>
//             <div className="text-left">
//               <div className="font-medium">Inviter une compagnie</div>
//               <div className="text-sm text-gray-500">
//                 Créer un accès pour une société de transport
//               </div>
//             </div>
//           </button>

//           <button
//             onClick={() => onSelectType("agent")}
//             className="w-full flex items-center gap-3 p-4 border rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors"
//           >
//             <div className="p-2 bg-green-100 rounded-lg">
//               <User className="h-5 w-5 text-green-600" />
//             </div>
//             <div className="text-left">
//               <div className="font-medium">Inviter un agent de gare</div>
//               <div className="text-sm text-gray-500">
//                 Créer un accès pour un agent
//               </div>
//             </div>
//           </button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default SelectionModal;


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building2, User } from "lucide-react";
import React from "react";

type InvitationType = "company" | "agent";

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: InvitationType) => void;
}

const SelectionModal = ({
  isOpen,
  onClose,
  onSelectType,
}: SelectionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sélectionner le type d'invitation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <button
            onClick={() => onSelectType("company")}
            className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-accent hover:border-primary/20 transition-colors"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium text-foreground">Inviter une compagnie</div>
              <div className="text-sm text-muted-foreground">
                Créer un accès pour une société de transport
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelectType("agent")}
            className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-accent hover:border-primary/20 transition-colors"
          >
            <div className="p-2 bg-secondary/50 rounded-lg">
              <User className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div className="text-left">
              <div className="font-medium text-foreground">Inviter un agent de gare</div>
              <div className="text-sm text-muted-foreground">
                Créer un accès pour un agent
              </div>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectionModal;
