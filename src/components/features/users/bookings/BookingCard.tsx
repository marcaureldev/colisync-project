import { Badge } from "@/components/ui/badge";
import { MapPin, User, Info, Package, ExternalLink, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Location {
  city: string;
  district: string;
  preciseLocation: string;
}

interface Contact {
  fullName: string;
  phoneNumber: string;
}

export interface Reservation {
  id: string;
  userId: string;
  departureLocation: Location;
  arrivalLocation: Location;
  senderContact: Contact;
  receiverContact: Contact;
  additionalInfo?: string;
  shippingDate: string;
  status: "PENDING" | "DELIVERED" | "CANCELLED" | "IN_TRANSIT";
  createdAt: string;
  updatedAt: string;
}

const getStatusConfig = (status: Reservation["status"]) => {
  switch (status) {
    case "PENDING":
      return {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        text: "En attente",
      };
    case "DELIVERED":
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        text: "Livré",
      };
    case "CANCELLED":
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        text: "Annulé",
      };
    case "IN_TRANSIT":
      return {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        text: "En transit",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        text: status,
      };
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatCity = (city: string) => {
  return city.charAt(0).toUpperCase() + city.slice(1).replace("-", " ");
};

export default function BookingCard({ booking }: { booking: Reservation }) {
  const statusConfig = getStatusConfig(booking.status);

  return (
    <Card className="border border-gray-200 shadow-md bg-white rounded-lg transition-all">
      <CardContent className="">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-md">
              <Package className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                #{booking.id?.slice(-8) || "N/A"}
              </h3>
              <p className="text-gray-500 text-sm">
                Créé le {formatDate(booking.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex space-x-1 items-center">
            <div>
              <Link
                href={{
                  pathname: `/users/booking-details`,
                  query: { id: `${booking.id}` },
                }}
              >
                <Button className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-md px-2 py-1">
                  <ExternalLink />
                </Button>
              </Link>
            </div>
            <div>
              <Button className="bg-red-100 hover:bg-red-200 text-red-600 rounded-md px-2 py-1">
              <Trash2 />
              </Button>
            </div>
          </div>
        </div>

        {/* Status and date */}
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs text-gray-500 font-medium tracking-tight">
            <p>
              Expédition prévue le{" "}
              <span>{formatDate(booking.shippingDate)}</span>
            </p>
          </div>

          <Badge
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-none ${statusConfig.color} border`}
          >
            {statusConfig.text}
          </Badge>
        </div>

        {/* Separator */}
        <div className="border-t border-dashed border-gray-200 mb-4" />

        {/* Locations */}
        <div className="flex flex-col md:flex-row md:justify-between gap-2 mb-4">
          <div className="flex items-center text-gray-800 gap-1">
            <MapPin className="w-4 h-4 text-green-500 mr-1" />
            <div>
              <p className="text-green-800 font-bold tracking-wider uppercase text-base">
                Départ
              </p>
              <span className="font-semibold text-base">
                {formatCity(booking.departureLocation.city)}
              </span>
              <span className="block text-xs text-gray-500">
                {booking.departureLocation.district} -{" "}
                {booking.departureLocation.preciseLocation}
              </span>
            </div>
          </div>
          <div className="flex items-center text-gray-800 gap-1">
            <MapPin className="w-4 h-4 text-blue-500 mr-1" />
            <div>
              <p className="uppercase text-blue-800 font-bold tracking-wider text-base">
                Arrivée
              </p>
              <span className="font-semibold text-base">
                {formatCity(booking.arrivalLocation.city)}
              </span>
              <span className="block text-xs text-gray-500">
                {booking.arrivalLocation.district} -{" "}
                {booking.arrivalLocation.preciseLocation}
              </span>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-dashed border-gray-200 mb-3" />

        {/* Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
          <div>
            <span className="uppercase text-xs text-orange-800 font-bold tracking-wider">
              Expéditeur
            </span>
            <div className="flex items-center bg-orange-50 border border-orange-100 rounded px-2 py-1.5">
              <User className="h-4 w-4 text-gray-400 mr-2" />
              <span className="font-medium text-sm">
                {booking.senderContact.fullName}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                {booking.senderContact.phoneNumber}
              </span>
            </div>
          </div>
          <div>
            <span className="uppercase text-xs text-purple-800 font-bold tracking-wider">
              Destinataire
            </span>
            <div className="flex items-center bg-purple-50 border border-purple-100 rounded px-2 py-1.5">
              <User className="h-4 w-4 text-gray-400 mr-2" />
              <span className="font-medium text-sm">
                {booking.receiverContact.fullName}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                {booking.receiverContact.phoneNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Additional info */}
        {booking.additionalInfo && (
          <div className="flex items-start mt-2 bg-amber-50 border border-amber-100 rounded px-3 py-2">
            <Info className="h-4 w-4 text-amber-400 mr-2 mt-0.5" />
            <span className="text-xs text-amber-900">
              {booking.additionalInfo}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
