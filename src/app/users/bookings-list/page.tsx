"use client";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Search } from "lucide-react";
import BookingCard, {
  Reservation,
} from "@/components/ui/users/bookings/BookingCard";

const Page = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");

    useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/users/bookings-list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Erreur HTTP: ${response.status} - ${response.statusText}`
          );
        }

        const data = await response.json();
        setReservations(data.reservations);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Une erreur inconnue est survenue";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);


  const formatCity = (city: string) => {
    return city.charAt(0).toUpperCase() + city.slice(1).replace("-", " ");
  };

  const filteredAndSortedReservations = useMemo(() => {
    const filtered = reservations.filter((reservation) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        formatCity(reservation.departureLocation.city)
          .toLowerCase()
          .includes(searchLower) ||
        formatCity(reservation.arrivalLocation.city)
          .toLowerCase()
          .includes(searchLower) ||
        reservation.senderContact.fullName
          .toLowerCase()
          .includes(searchLower) ||
        reservation.receiverContact.fullName.toLowerCase().includes(searchLower)
      );
    });

    return filtered.sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.shippingDate).getTime() -
          new Date(a.shippingDate).getTime()
        );
      } else if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });
  }, [reservations, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="text-center h-[30em] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des réservations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-red-100 p-2 rounded-full">
            <Package className="text-red-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-red-800">
            Erreur de chargement
          </h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => {
            setError(null);
            window.location.reload();
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="mb-6 bg-white rounded-lg p-4 shadow-md border-gray-200">
        <div className="flex items-center gap-3 mb-5">
          <Package className="h-7 w-7 text-blue-500" />
          <h1 className="text-2xl font-semibold text-gray-900">
            Voir mes réservations en cours
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Rechercher par ville ou nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-1/3 h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date d&apos;expédition</SelectItem>
              <SelectItem value="status">Statut</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span className="font-semibold text-gray-700">
            {filteredAndSortedReservations.length}
          </span>
          <span>
            réservation{filteredAndSortedReservations.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      {/* Main content */}
      <div className="space-y-5">
        {filteredAndSortedReservations.length === 0 ? (
          <div className="bg-white h-[20em] shadow-md rounded-lg text-center flex flex-col justify-center items-center">
            <Package className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucune réservation trouvée
            </h3>
            <p className="text-gray-500">
              Aucune réservation ne correspond à vos critères de recherche.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredAndSortedReservations.map((reservation: Reservation) => (
              <BookingCard key={reservation.id} booking={reservation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
