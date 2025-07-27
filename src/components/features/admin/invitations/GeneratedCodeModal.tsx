// import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
// import { Copy, Mail } from 'lucide-react';
// import React from 'react';
// import { Button } from '../../button';
// import { DialogHeader } from '../../dialog';

// type InvitationType = 'company' | 'agent';
// type InvitationStatus = 'pending' | 'used' | 'expired';

// interface Invitation {
//   id: string;
//   code: string;
//   type: InvitationType;
//   name: string;
//   email?: string;
//   station?: string;
//   createdAt: string;
//   status: InvitationStatus;
// }

// const GeneratedCodeModal = ({ 
//   isOpen, 
//   onClose, 
//   invitation 
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   invitation: Invitation | null;
// }) => {
//   const handleCopyCode = () => {
//     if (invitation) {
//       navigator.clipboard.writeText(invitation.code);
//     }
//   };

//   const handleSendEmail = () => {
//     // Implement email sending logic
//     console.log('Sending email...');
//   };

//   if (!invitation) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Code d'invitation généré</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           <div className="text-center">
//             <div className="text-sm text-gray-600 mb-2">
//               Code d'invitation pour
//             </div>
//             <div className="font-semibold">{invitation.name}</div>
//           </div>
          
//           <div className="bg-gray-50 p-4 rounded-lg text-center">
//             <div className="text-2xl font-bold text-blue-600 mb-2">
//               {invitation.code}
//             </div>
//             <div className="text-sm text-gray-600">
//               Type: {invitation.type === 'company' ? 'Compagnie' : 'Agent'}
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <Button onClick={handleCopyCode} variant="outline" className="flex-1">
//               <Copy className="h-4 w-4 mr-2" />
//               Copier
//             </Button>
//             {invitation.email && (
//               <Button onClick={handleSendEmail} className="flex-1">
//                 <Mail className="h-4 w-4 mr-2" />
//                 Envoyer par email
//               </Button>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };


// export default GeneratedCodeModal;


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Mail } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

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

interface GeneratedCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: Invitation | null;
}

const GeneratedCodeModal = ({ 
  isOpen, 
  onClose, 
  invitation 
}: GeneratedCodeModalProps) => {
  const handleCopyCode = () => {
    if (invitation) {
      navigator.clipboard.writeText(invitation.code);
    }
  };

  const handleSendEmail = () => {
    // Implement email sending logic
    console.log('Sending email...');
  };

  if (!invitation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Code d'invitation généré</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">
              Code d'invitation pour
            </div>
            <div className="font-semibold text-foreground">{invitation.name}</div>
          </div>
          
          <div className="bg-muted p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary mb-2">
              {invitation.code}
            </div>
            <div className="text-sm text-muted-foreground">
              Type: {invitation.type === 'company' ? 'Compagnie' : 'Agent'}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCopyCode} variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copier
            </Button>
            {invitation.email && (
              <Button onClick={handleSendEmail} className="flex-1">
                <Mail className="h-4 w-4 mr-2" />
                Envoyer par email
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeneratedCodeModal;