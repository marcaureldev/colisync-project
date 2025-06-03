"use client";
import { useState, useEffect } from "react";
import { Package, MapPin, User, Phone, Calendar, Search } from "lucide-react";
import Link from "next/link";
interface Location {
  city: string;
  district: string;
  preciseLocation: string;
}

interface Contact {
  fullName: string;
  phoneNumber: string;
}

interface Reservation {
  id: string;
  userId: string;
  departureLocation: Location;
  arrivalLocation: Location;
  senderContact: Contact;
  receiverContact: Contact;
  additionalInfo: string;
  shippingDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const ShippingReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "IN_TRANSIT":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "En attente";
      case "IN_TRANSIT":
        return "En transit";
      case "DELIVERED":
        return "Livré";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return dateString;
    }
  };

  const formatCity = (city: string) => {
    if (!city) return "";
    return city.charAt(0).toUpperCase() + city.slice(1).replace("-", " ");
  };

  const filteredReservations = reservations.filter((reservation) => {
    if (!reservation) return false;

    try {
      const matchesSearch =
        (reservation.senderContact?.fullName?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (reservation.receiverContact?.fullName?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (reservation.departureLocation?.city?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (reservation.arrivalLocation?.city?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        );

      const matchesStatus =
        statusFilter === "ALL" || reservation.status === statusFilter;

      return matchesSearch && matchesStatus;
    } catch (error) {
      console.error("Erreur lors du filtrage:", error);
      return false;
    }
  });

  // État de chargement
  if (loading) {
    return (
      <div className="text-center h-[30em] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des réservations...</p>
      </div>
    );
  }

  // État d'erreur
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
      <div className="max-w-7xl mx-auto">
        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher par nom ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 px-2 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="IN_TRANSIT">En transit</option>
                <option value="DELIVERED">Livré</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des réservations */}
        <div className="grid gap-6">
          {filteredReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white rounded-lg transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                {/* Header de la carte */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-md">
                      <Package className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <Link
                        href={{
                          pathname: `/users/booking-details`,
                          query: { id: `${reservation.id}` },
                        }}
                      >
                        <h3 className="text-lg font-semibold text-gray-900">
                          #{reservation.id?.slice(-8) || "N/A"}
                        </h3>
                      </Link>
                      <p className="text-gray-500 text-sm">
                        Créé le {formatDate(reservation.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(reservation.status)}`}
                  >
                    {getStatusText(reservation.status)}
                  </div>
                </div>

                {/* Informations de trajet */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Départ */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-md border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="text-green-600" size={18} />
                      <span className="font-semibold text-green-800">
                        Départ
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatCity(reservation.departureLocation?.city || "")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {reservation.departureLocation?.district || ""}
                    </p>
                    <p className="text-sm text-gray-500">
                      {reservation.departureLocation?.preciseLocation || ""}
                    </p>
                  </div>

                  {/* Arrivée */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-md border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="text-blue-600" size={18} />
                      <span className="font-semibold text-blue-800">
                        Arrivée
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatCity(reservation.arrivalLocation?.city || "")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {reservation.arrivalLocation?.district || ""}
                    </p>
                    <p className="text-sm text-gray-500">
                      {reservation.arrivalLocation?.preciseLocation || ""}
                    </p>
                  </div>
                </div>

                {/* Contacts */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Expéditeur */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <User className="text-orange-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expéditeur</p>
                      <p className="font-medium text-gray-900">
                        {reservation.senderContact?.fullName || "N/A"}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Phone size={12} />
                        {reservation.senderContact?.phoneNumber || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Destinataire */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <User className="text-purple-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Destinataire</p>
                      <p className="font-medium text-gray-900">
                        {reservation.receiverContact?.fullName || "N/A"}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Phone size={12} />
                        {reservation.receiverContact?.phoneNumber || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="flex flex-col justify-between md:flex-row gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>
                      Expédition prévue: {formatDate(reservation.shippingDate)}
                    </span>
                  </div>
                  {reservation.additionalInfo && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span>{reservation.additionalInfo}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReservations.length === 0 && !loading && (
          <div className="bg-white h-[25em] rounded-lg text-center flex flex-col justify-center items-center">
            <Package className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucune réservation trouvée
            </h3>
            <p className="text-gray-500">
              Aucune réservation ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingReservations;
