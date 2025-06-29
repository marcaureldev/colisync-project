
import { ChevronLeft, Hash, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingDetails } from "@/types/booking";

interface ReservationHeaderProps {
  booking: BookingDetails;
  onGoBack: () => void;
}

const getStatusConfig = (status: BookingDetails["status"]) => {
  switch (status) {
    case "PENDING":
      return { color: "bg-amber-100 text-amber-800 border-amber-200", text: "En attente" };
    case "CONFIRMED":
      return { color: "bg-blue-100 text-blue-800 border-blue-200", text: "Confirmée" };
    case "IN_TRANSIT":
      return { color: "bg-purple-100 text-purple-800 border-purple-200", text: "En transit" };
    case "DELIVERED":
      return { color: "bg-green-100 text-green-800 border-green-200", text: "Livrée" };
    case "CANCELLED":
      return { color: "bg-red-100 text-red-800 border-red-200", text: "Annulée" };
    default:
      return { color: "bg-gray-100 text-gray-800 border-gray-200", text: status };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function ReservationHeader({ booking, onGoBack }: ReservationHeaderProps) {
  const statusConfig = getStatusConfig(booking.status);

  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2 items-center">
            <Button variant="ghost" size="icon" onClick={onGoBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-base sm:text-2xl font-bold text-gray-800">
              Détails de la réservation
            </h1>
          </div>
          <Badge className={`px-2 py-1 rounded-full border text-sm font-medium ${statusConfig.color}`}>
            {statusConfig.text}
          </Badge>
        </div>

        <div className=" text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="font-medium">Créée le:</span>
            <span className="ml-1">
              {formatDate(booking.createdAt)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
