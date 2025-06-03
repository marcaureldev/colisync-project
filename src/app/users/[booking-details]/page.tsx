"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Package,
  MapPin,
  User,
  Calendar,
  Clock,
  Weight,
  Hash,
  Info,
  AlertCircle,
  ChevronLeft,
  Phone,
  Navigation,
  ZoomIn,
  ImageIcon,
} from "lucide-react";

interface ReservationData {
  id: string;
  userId: string;
  additionalInfo: string;
  shippingDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  departureLocation: {
    city: string;
    district: string;
    preciseLocation: string;
  };
  arrivalLocation: {
    city: string;
    district: string;
    preciseLocation: string;
  };
  senderContact: {
    fullName: string;
    phoneNumber: string;
  };
  receiverContact: {
    fullName: string;
    phoneNumber: string;
  };
  packages: Array<{
    id: string;
    description: string;
    quantity: number;
    category: string;
    weight: number;
    sender_userId: string;
    reservationId: string;
    imageFile: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
}

const ReservationDetailsPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [reservationData, setReservationData] =
    useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getReservationDetails = async () => {
      if (!id) {
        setError("ID de réservation manquant");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/users/booking-details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setReservationData(result.data);
        } else {
          setError(
            result.error || `Erreur ${response.status}: ${response.statusText}`
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération:", error);
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    getReservationDetails();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "IN_TRANSIT":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "En attente";
      case "CONFIRMED":
        return "Confirmée";
      case "IN_TRANSIT":
        return "En transit";
      case "DELIVERED":
        return "Livrée";
      case "CANCELLED":
        return "Annulée";
      default:
        return status;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case "MERCHANDISES":
        return "Marchandises";
      case "DOCUMENTS":
        return "Documents";
      case "ELECTRONICS":
        return "Appareils Electroniques";
      case "CLOTHING":
        return "Vêtements";
      case "OTHERS":
        return "Autres";
      default:
        return category;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatPhoneNumber = (phone: string) => {
    // Format: +229 01 58 46 69 65
    return phone.replace(
      /(\+\d{3})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
      "$1 $2 $3 $4 $5 $6"
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ELECTRONICS":
        return "bg-blue-100 text-blue-800";
      case "MERCHANDISES":
        return "bg-green-100 text-green-800";
      case "DOCUMENTS":
        return "bg-purple-100 text-purple-800";
      case "FRAGILE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[30em]">
        <div className="text-center">
          <div className="animate-spin rounded-full size-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[30em] bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!reservationData) {
    return (
      <div className="h-[30em] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg text-center">
          <p className="text-gray-600">Aucune donnée de réservation trouvée</p>
        </div>
      </div>
    );
  }

  const totalWeight = reservationData.packages.reduce(
    (sum, pkg) => sum + pkg.weight,
    0
  );
  const totalQuantity = reservationData.packages.reduce(
    (sum, pkg) => sum + pkg.quantity,
    0
  );

  const goBack = () => {
    router.back();
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-3 items-center">
              <ChevronLeft onClick={goBack} className="cursor-pointer" />
              <h1 className="text-2xl font-bold text-gray-800">
                Détails de la réservation
              </h1>
            </div>
            <div
              className={`px-4 py-2 rounded-full border text-sm font-medium ${getStatusColor(reservationData.status)}`}
            >
              {getStatusText(reservationData.status)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Hash className="w-4 h-4 mr-2" />
              <span className="font-medium">ID:</span>
              <span className="ml-1 font-mono text-xs">
                {reservationData.id}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="font-medium">Créée le:</span>
              <span className="ml-1">
                {formatDate(reservationData.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Itinéraire amélioré */}
          <div className="bg-white rounded-lg p-6">
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
                    {reservationData.departureLocation.city},{" "}
                    {reservationData.departureLocation.district}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {reservationData.departureLocation.preciseLocation}
                  </p>
                </div>
              </div>

              {/* Ligne de connexion */}
              {/* <div className="absolute left-2 top-4 bottom-20 w-0.5 bg-gradient-to-b from-green-500 to-red-500"></div> */}

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
                    {reservationData.arrivalLocation.city},{" "}
                    {reservationData.arrivalLocation.district}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {reservationData.arrivalLocation.preciseLocation}
                  </p>
                </div>
              </div>
            </div>

            {/* Date d'expédition */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <div className="flex items-center text-blue-700">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  Date d{"'"}expédition prévue:
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-blue-800">
                {formatDate(reservationData.shippingDate)}
              </p>
            </div>
          </div>

          {/* Contacts améliorés */}
          <div className="space-y-4">
            {/* Expéditeur */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Expéditeur
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {reservationData.senderContact.fullName}
                    </p>
                    <p className="text-sm text-gray-500">Expéditeur</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {formatPhoneNumber(
                        reservationData.senderContact.phoneNumber
                      )}
                    </p>
                    <p className="text-sm text-gray-500">Téléphone</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Destinataire */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Destinataire
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {reservationData.receiverContact.fullName}
                    </p>
                    <p className="text-sm text-gray-500">Destinataire</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {formatPhoneNumber(
                        reservationData.receiverContact.phoneNumber
                      )}
                    </p>
                    <p className="text-sm text-gray-500">Téléphone</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Résumé des colis */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Résumé des colis
            </h2>
            <div className="text-sm text-gray-600">
              {reservationData.packages.length} colis • {totalQuantity} articles
              • {totalWeight} kg
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {reservationData.packages.length}
              </div>
              <div className="text-sm text-gray-600">Colis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalQuantity}
              </div>
              <div className="text-sm text-gray-600">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {totalWeight} kg
              </div>
              <div className="text-sm text-gray-600">Poids total</div>
            </div>
          </div>
        </div>

        {/* Liste des colis avec images */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Détails des colis
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reservationData.packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className="border border-gray-200 rounded-lg p-6 transition-all duration-200"
              >
                <div className="sm:flex items-start justify-between mb-4 space-y-4 sm:space-y-0">
                  <div className="flex items-center">
                    <div className="size-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {pkg.description}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono">
                        #{pkg.id.slice(-8)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${getCategoryColor(pkg.category)}`}
                  >
                    {getCategoryText(pkg.category)}
                  </span>
                </div>

                {/* Image du colis */}
                {pkg.imageFile && (
                  <div className="mb-4">
                    <div className="relative group">
                      <Image
                        src={pkg.imageFile || "/placeholder.svg"}
                        alt={`Image de ${pkg.description}`}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement>
                        ) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                      <div
                        className="absolute inset-0 bg-black/10 group-hover:bg-black/50 transition-all duration-200 rounded-lg flex items-center justify-center cursor-pointer"
                        onClick={() => setSelectedImage(pkg.imageFile)}
                      >
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Placeholder si pas d'image */}
                {!pkg.imageFile && (
                  <div className="mb-4 h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucune image disponible</p>
                    </div>
                  </div>
                )}

                {/* Détails du colis */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Hash className="w-4 h-4 mr-2 text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-500">Quantité</p>
                      <p className="font-semibold text-gray-800">
                        {pkg.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Weight className="w-4 h-4 mr-2 text-green-500" />
                    <div>
                      <p className="text-xs text-gray-500">Poids</p>
                      <p className="font-semibold text-gray-800">
                        {pkg.weight} kg
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Ajouté le {formatDate(pkg.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informations additionnelles */}
        {reservationData.additionalInfo && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Informations additionnelles
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{reservationData.additionalInfo}</p>
            </div>
          </div>
        )}

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt="Image agrandie"
                width={800}
                height={600}
                className="max-w-[80vw] h-[80vh] object-cover rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/30 text-white p-2 rounded-full transition-all duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationDetailsPage;
