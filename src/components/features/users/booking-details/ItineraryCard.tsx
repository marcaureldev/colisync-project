
import { Navigation, MapPin, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BookingDetails } from "@/types/booking";

interface ItineraryCardProps {
  booking: BookingDetails;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function ItineraryCard({ booking }: ItineraryCardProps) {
  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Navigation className="w-5 h-5 mr-2 text-blue-600" />
          Itinéraire
        </h2>

        <div className="relative">
          {/* Départ */}
          <div className="flex items-start mb-8">
            <div className="relative z-10">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center mb-2">
                <h3 className="font-semibold text-gray-800">Départ</h3>
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Origine
                </span>
              </div>
              <p className="text-gray-700 font-medium capitalize mb-1">
                {booking.departureLocation.city},{" "}
                {booking.departureLocation.district}
              </p>
              <p className="text-sm text-gray-500 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {booking.departureLocation.preciseLocation}
              </p>
            </div>
          </div>

          {/* Arrivée */}
          <div className="flex items-start">
            <div className="relative z-10">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center mb-2">
                <h3 className="font-semibold text-gray-800">Arrivée</h3>
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                  Destination
                </span>
              </div>
              <p className="text-gray-700 font-medium capitalize mb-1">
                {booking.arrivalLocation.city},{" "}
                {booking.arrivalLocation.district}
              </p>
              <p className="text-sm text-gray-500 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {booking.arrivalLocation.preciseLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Date d'expédition */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="flex items-center text-blue-700">
            <Calendar className="w-5 h-5 mr-2" />
            <span className="font-medium">
              Date d'expédition prévue:
            </span>
          </div>
          <p className="mt-1 text-lg font-semibold text-blue-800">
            {formatDate(booking.shippingDate)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}