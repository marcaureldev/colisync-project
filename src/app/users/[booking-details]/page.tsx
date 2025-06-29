"use client"
import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookingDetails as BookingDetailsType } from "@/types/booking";
import BookingHeader from "@/components/ui/users/booking-details/BookingHeader";
import ItineraryCard from "@/components/ui/users/booking-details/ItineraryCard";
import ContactCard from "@/components/ui/users/booking-details/ContactCard";
import PackageSummary from "@/components/ui/users/booking-details/PackageSummary";
import PackageList from "@/components/ui/users/booking-details/PackageList";
import AdditionalInfo from "@/components/ui/users/booking-details/AdditionnalInfo";
import { useSearchParams, useRouter } from "next/navigation";


const ReservationDetails = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [reservationData, setReservationData] = useState<BookingDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const response = await fetch(`/api/users/booking-details/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full bg-gray-200" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-96 w-full bg-gray-200" />
              <div className="space-y-4">
                <Skeleton className="h-48 w-full bg-gray-200" />
                <Skeleton className="h-48 w-full bg-gray-200" />
              </div>
            </div>
            <Skeleton className="h-64 w-full bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg text-center max-w-xl mx-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-2">
            <Button
              onClick={() => window.location.reload()}
              variant="default"
            >
              Réessayer
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outline"
            >
              Retour
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!reservationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg text-center mx-4">
          <p className="text-gray-600">Aucune donnée de réservation trouvée</p>
          <Button onClick={handleGoBack} className="mt-4" variant="outline">
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div>
        <BookingHeader 
          booking={reservationData} 
          onGoBack={handleGoBack} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <ItineraryCard booking={reservationData} />
          
          <div className="space-y-4">
            <ContactCard
              title="Expéditeur"
              contact={reservationData.senderContact}
              type="sender"
            />
            <ContactCard
              title="Destinataire"
              contact={reservationData.receiverContact}
              type="receiver"
            />
          </div>
        </div>

        <PackageSummary packages={reservationData.packages} />
        
        <PackageList packages={reservationData.packages} />
        
        <AdditionalInfo additionalInfo={reservationData.additionalInfo} />
      </div>
    </div>
  );
};

export default ReservationDetails;
