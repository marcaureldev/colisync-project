
import { User, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ContactCardProps {
  title: string;
  contact: {
    fullName: string;
    phoneNumber: string;
  };
  type: "sender" | "receiver";
}

const formatPhoneNumber = (phone: string) => {
  return phone.replace(
    /(\+\d{3})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
    "$1 $2 $3 $4 $5 $6"
  );
};

export default function ContactCard({ title, contact, type }: ContactCardProps) {
  const colorScheme = type === "sender" 
    ? { bg: "bg-green-100", text: "text-green-600" }
    : { bg: "bg-blue-100", text: "text-blue-600" };

  return (
    <Card>
      <CardContent>
        <h2 className={`text-xl font-semibold text-gray-800 mb-4 flex items-center`}>
          <User className={`w-5 h-5 mr-2 ${colorScheme.text}`} />
          {title}
        </h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${colorScheme.bg} rounded-full flex items-center justify-center mr-3`}>
              <User className={`w-5 h-5 ${colorScheme.text}`} />
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {contact.fullName}
              </p>
              <p className="text-sm text-gray-500">{title}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className={`w-10 h-10 ${colorScheme.bg} rounded-full flex items-center justify-center mr-3`}>
              <Phone className={`w-4 h-4 ${colorScheme.text}`} />
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {formatPhoneNumber(contact.phoneNumber)}
              </p>
              <p className="text-sm text-gray-500">Téléphone</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
