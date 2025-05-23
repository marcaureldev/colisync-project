"use client";
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import {
  SendPackageFormData,
  ReviewAndConfirmFormData,
  PackageItem,
} from "../types";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Info, ImageIcon } from "lucide-react";

// Recréer ou importer la liste des villes pour afficher les noms
const villesBenin = [
  { id: "porto-novo", name: "Porto-Novo" },
  { id: "cotonou", name: "Cotonou" },
  { id: "parakou", name: "Parakou" },
  { id: "bohicon", name: "Bohicon" },
  { id: "natitingou", name: "Natitingou" },
  { id: "abomey-calavi", name: "Abomey-Calavi" },
  // ... autres villes
];

const getCityName = (cityId: string) => {
  const city = villesBenin.find((v) => v.id === cityId);
  return city ? city.name : cityId;
};

const packageCategoryDisplay: Record<string, string> = {
  merchandise: "Marchandises",
  documents: "Documents",
  clothing: "Vêtements",
  electonics: "Appareils électroniques",
  other: "Autres",
};

interface Step4Props {
  formData: SendPackageFormData; // Toutes les données du formulaire
  updateReviewData: (fields: Partial<ReviewAndConfirmFormData>) => void;
}

export interface Step4Ref {
  validateForm: () => boolean;
}

type ReviewErrors = {
  acceptTerms?: string;
};

const DetailItem: React.FC<{
  label: string;
  value: string | React.ReactNode;
}> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
      {label}
    </dt>
    <dd className="text-sm text-gray-800 dark:text-white text-right">
      {value}
    </dd>
  </div>
);

// Interface pour gérer les URLs d'objets pour les images dans le récapitulatif
interface ReviewPackageItem extends PackageItem {
  reviewImagePreviewUrl?: string;
}

const Step4_ReviewAndConfirm = forwardRef<Step4Ref, Step4Props>(
  ({ formData, updateReviewData }, ref) => {
    const [errors, setErrors] = useState<ReviewErrors>({});
    // Gérer les URLs d'objets pour les images dans le récapitulatif
    const [reviewPackageItems, setReviewPackageItems] = useState<
      ReviewPackageItem[]
    >([]);

    useEffect(() => {
      const itemsWithPreviews = formData.packageDetails.map((pkg) => {
        let reviewImagePreviewUrl;
        if (pkg.imageFile) {
          try {
            reviewImagePreviewUrl = URL.createObjectURL(pkg.imageFile);
          } catch (error) {
            console.error(
              "Error creating object URL for review preview:",
              error
            );
            reviewImagePreviewUrl = undefined;
          }
        }
        return { ...pkg, reviewImagePreviewUrl };
      });
      setReviewPackageItems(itemsWithPreviews);

      // Nettoyage des URLs d'objets
      return () => {
        itemsWithPreviews.forEach((item) => {
          if (item.reviewImagePreviewUrl) {
            URL.revokeObjectURL(item.reviewImagePreviewUrl);
          }
        });
      };
    }, [formData.packageDetails]); // Se déclenche si les détails des colis changent

    const validateForm = () => {
      const newErrors: ReviewErrors = {};
      if (!formData.reviewAndConfirm.acceptTerms) {
        newErrors.acceptTerms = "Vous devez accepter les conditions générales.";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => ({
      validateForm,
    }));

    const handleAcceptTermsChange = (checked: boolean) => {
      updateReviewData({ acceptTerms: checked });
      if (errors.acceptTerms) {
        setErrors((prev) => ({ ...prev, acceptTerms: undefined }));
      }
    };

    const formatDate = (dateString: string) => {
      if (!dateString) return "Non spécifiée";
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
          Récapitulatif de la Commande
        </h2>

        <dl className="divide-y divide-gray-200 dark:divide-gray-700 bg-gray-50 dark:bg-gray-800/30 p-4 sm:p-6 rounded-md">
          {/* Section pour afficher les détails de chaque colis */}
          {reviewPackageItems.length > 0 && (
            <div className="py-2">
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Colis ({reviewPackageItems.length}):
              </dt>
              {reviewPackageItems.map((pkg, index) => (
                <dd
                  key={pkg.id || index}
                  className="ml-0 sm:ml-4 mb-3 p-3 border rounded-md bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600/50 text-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    {pkg.reviewImagePreviewUrl ? (
                      <img
                        src={pkg.reviewImagePreviewUrl}
                        alt={`Colis ${pkg.description.substring(0, 20)}`}
                        className="w-full sm:w-24 h-auto sm:h-24 rounded-md object-cover border dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-full sm:w-24 h-20 sm:h-24 rounded-md bg-gray-100 dark:bg-gray-600 flex items-center justify-center border dark:border-gray-500">
                        <ImageIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    <div className="">
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {pkg.description}
                      </p>
                      <p>
                        <strong>Type:</strong>{" "}
                        {packageCategoryDisplay[pkg.packageCategory] ||
                          pkg.packageCategory}
                      </p>
                      <p>
                        <strong>Quantité:</strong> {pkg.quantity}
                      </p>
                      <p>
                        <strong>Poids:</strong> {pkg.weight} kg
                      </p>
                      <p>
                        <strong>Valeur:</strong> FCFA
                      </p>
                    </div>
                  </div>
                </dd>
              ))}
            </div>
          )}
          <DetailItem
            label="De:"
            value={`${getCityName(formData.localization.zoneDepart.ville)}, ${formData.localization.zoneDepart.adressePrecise || formData.localization.zoneDepart.quartier}`}
          />
          <DetailItem
            label="À:"
            value={`${getCityName(formData.localization.zoneDestination.ville)}, ${formData.localization.zoneDestination.adressePrecise || formData.localization.zoneDestination.quartier}`}
          />
          <DetailItem
            label="Date de collecte:"
            value={formatDate(formData.localization.shippingDate)}
          />
          <DetailItem
            label="Expéditeur:"
            value={`${formData.contact.senderName} (${formData.contact.senderPhone})`}
          />
          <DetailItem
            label="Destinataire:"
            value={`${formData.contact.recipientName} (${formData.contact.recipientPhone})`}
          />
          {formData.contact.additionalInstructions && (
            <DetailItem
              label="Instructions additionnelles:"
              value={formData.contact.additionalInstructions}
            />
          )}
        </dl>

        <div className="text-right font-semibold text-lg text-blue-600 dark:text-blue-400">
          Prix estimé: FCFA
        </div>

        <div className="items-top flex space-x-2 pt-4">
          <Checkbox
            id="acceptTerms"
            checked={formData.reviewAndConfirm.acceptTerms}
            onCheckedChange={handleAcceptTermsChange}
            className={`border-gray-400 dark:border-gray-500 data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500 ${errors.acceptTerms ? "border-red-500" : ""}`}
          />
          <div className="grid gap-1.5 leading-none">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              J'accepte les{" "}
              <a
                href="/terms"
                target="_blank"
                className="underline text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
              >
                conditions générales d'utilisation
              </a>{" "}
              et la{" "}
              <a
                href="/privacy"
                target="_blank"
                className="underline text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
              >
                politique de confidentialité
              </a>
              .
            </p>
            {errors.acceptTerms && (
              <p className="text-xs text-red-500">{errors.acceptTerms}</p>
            )}
          </div>
        </div>

        <Alert
          variant="default"
          className="bg-yellow-50 dark:bg-yellow-500/10 border-yellow-300 dark:border-yellow-500/30 mt-4"
        >
          <Info className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
          <AlertTitle className="text-yellow-700 dark:text-yellow-300 font-medium">
            Vérification finale
          </AlertTitle>
          <AlertDescription className="text-yellow-600 dark:text-yellow-300/90 text-xs">
            Veuillez vérifier attentivement toutes les informations avant de
            confirmer. Une fois la commande confirmée, certaines modifications
            pourraient ne plus être possibles.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
);

Step4_ReviewAndConfirm.displayName = "Step4_ReviewAndConfirm";
export default Step4_ReviewAndConfirm;
