import { useState } from "react";
import { Hash, Weight, Clock, ZoomIn, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "@/types/booking";

interface PackageListProps {
  packages: Package[];
}

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function PackageList({ packages }: PackageListProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <Card className="mb-6">
        <CardContent>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Détails des colis
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className="border border-gray-200 rounded-lg p-6 transition-all duration-200"
              >
                <div className="mb-4 space-y-4">
                  <Badge
                    className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${getCategoryColor(pkg.category)}`}
                  >
                    {getCategoryText(pkg.category)}
                  </Badge>
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
                </div>

                {/* Image du colis */}
                {pkg.imageFile && (
                  <div className="mb-4">
                    <div className="relative group">
                      <img
                        src={pkg.imageFile || "/placeholder.svg"}
                        alt={`Image de ${pkg.description}`}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
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
        </CardContent>
      </Card>

      {/* Modal d'image agrandie */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Image agrandie"
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
    </>
  );
}
