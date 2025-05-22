"use client";
import React, { useState, useImperativeHandle, forwardRef } from "react";
import { LocalizationFormData, LocationPoint } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Step1LocalizationProps {
  data: LocalizationFormData;
  updateData: (fields: Partial<LocalizationFormData>) => void;
}

// Interface pour les méthodes exposées par le ref
export interface Step1Ref {
  validateForm: () => boolean;
}

// Type pour les erreurs de localisation
type LocalizationErrors = {
  zoneDepart?: Partial<Record<keyof LocationPoint, string>>;
  zoneDestination?: Partial<Record<keyof LocationPoint, string>>;
  shippingDate?: string; // Erreur pour la date d'envoi
};

const villesBenin = [
  { id: "porto-novo", name: "Porto-Novo" },
  { id: "cotonou", name: "Cotonou" },
  { id: "parakou", name: "Parakou" },
  { id: "bohicon", name: "Bohicon" },
  { id: "natitingou", name: "Natitingou" },
  { id: "abomey-calavi", name: "Abomey-Calavi" },
  // ... autres villes
];

interface LocationSectionProps {
  title: string;
  locationData: LocationPoint;
  onLocationChange: (field: keyof LocationPoint, value: string) => void;
  prefix: "zoneDepart" | "zoneDestination";
  errors?: Partial<Record<keyof LocationPoint, string>>;
  disabledCityId?: string; // Nouvelle prop pour la ville à désactiver
}

const LocationSection: React.FC<LocationSectionProps> = ({
  title,
  locationData,
  onLocationChange,
  prefix,
  errors = {},
  disabledCityId, // Utiliser la nouvelle prop
}) => {
  return (
    <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${prefix}_ville`} className="text-sm">
            Ville
          </Label>
          <Select
            value={locationData.ville}
            onValueChange={(value) => onLocationChange("ville", value)}
          >
            <SelectTrigger
              id={`${prefix}_ville`}
              className={`mt-1 w-full bg-white dark:bg-white/10 border-gray-300 dark:border-gray-600 ${errors.ville ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Sélectionnez une ville" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800">
              {villesBenin.map((ville) => (
                <SelectItem
                  key={ville.id}
                  value={ville.id}
                  disabled={ville.id === disabledCityId} // Désactiver la ville si son ID correspond
                >
                  {ville.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.ville && (
            <p className="text-xs text-red-500 mt-1">{errors.ville}</p>
          )}
        </div>
        <div>
          <Label htmlFor={`${prefix}_quartier`} className="text-sm">
            Quartier
          </Label>
          <Input
            id={`${prefix}_quartier`}
            name={`${prefix}_quartier`}
            value={locationData.quartier}
            onChange={(e) => onLocationChange("quartier", e.target.value)}
            placeholder="ex: Avrankou, Bannikanni"
            className={`mt-1 bg-white dark:bg-white/10 border-gray-300 dark:border-gray-600 ${errors.quartier ? "border-red-500" : ""}`}
          />
          {errors.quartier && (
            <p className="text-xs text-red-500 mt-1">{errors.quartier}</p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor={`${prefix}_adressePrecise`} className="text-sm">
          Adresse précise
        </Label>
        <Input
          id={`${prefix}_adressePrecise`}
          name={`${prefix}_adressePrecise`}
          value={locationData.adressePrecise}
          onChange={(e) => onLocationChange("adressePrecise", e.target.value)}
          placeholder="ex: Près du marché Dantokpa, Maison bleue à côté de la pharmacie"
          className={`mt-1 bg-white dark:bg-white/10 border-gray-300 dark:border-gray-600 ${errors.adressePrecise ? "border-red-500" : ""}`}
        />
        {errors.adressePrecise && (
          <p className="text-xs text-red-500 mt-1">{errors.adressePrecise}</p>
        )}
      </div>
    </div>
  );
};

const Step1_Localization = forwardRef<Step1Ref, Step1LocalizationProps>(
  ({ data, updateData }, ref) => {
    const [errors, setErrors] = useState<LocalizationErrors>({});

    const validateLocationPoint = (
      location: LocationPoint,
      pointName: "zoneDepart" | "zoneDestination"
    ): Partial<Record<keyof LocationPoint, string>> => {
      const pointErrors: Partial<Record<keyof LocationPoint, string>> = {};
      if (!location.ville) pointErrors.ville = "La ville est requise.";
      if (!location.quartier.trim())
        pointErrors.quartier = "Le quartier est requis.";
      if (!location.adressePrecise.trim())
        pointErrors.adressePrecise = "L'adresse précise est requise.";
      return pointErrors;
    };

    const validateForm = () => {
      const newErrors: LocalizationErrors = {};
      const departErrors = validateLocationPoint(data.zoneDepart, "zoneDepart");
      const destinationErrors = validateLocationPoint(
        data.zoneDestination,
        "zoneDestination"
      );

      if (Object.keys(departErrors).length > 0) {
        newErrors.zoneDepart = departErrors;
      }
      if (Object.keys(destinationErrors).length > 0) {
        newErrors.zoneDestination = destinationErrors;
      }

      // Validation pour la date d'envoi
      if (!data.shippingDate) {
        newErrors.shippingDate = "La date d'envoi est requise.";
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Comparer uniquement la date, pas l'heure
        const selectedDate = new Date(data.shippingDate);
        if (selectedDate < today) {
          newErrors.shippingDate =
            "La date d'envoi ne peut pas être dans le passé.";
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => ({
      validateForm,
    }));

    const handleGenericChange = (
      fieldName: keyof LocalizationFormData,
      value: string
    ) => {
      updateData({ [fieldName]: value });
      if (errors[fieldName as keyof LocalizationErrors]) {
        setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
      }
    };

    const handleLocationPointChange = (
      zone: "zoneDepart" | "zoneDestination",
      field: keyof LocationPoint,
      value: string
    ) => {
      const updatedFields: Partial<LocalizationFormData> = {
        [zone]: {
          ...data[zone],
          [field]: value,
        },
      };

      // Si le champ modifié est 'ville'
      if (field === "ville") {
        if (
          zone === "zoneDepart" &&
          value &&
          value === data.zoneDestination.ville
        ) {
          // Si la nouvelle ville de départ est la même que la destination, réinitialiser la destination
          updatedFields.zoneDestination = {
            ...data.zoneDestination,
            ville: "",
          };
        } else if (
          zone === "zoneDestination" &&
          value &&
          value === data.zoneDepart.ville
        ) {
          // Si la nouvelle ville de destination est la même que le départ, réinitialiser le départ
          // Normalement empêché par la désactivation, mais bonne sécurité
          updatedFields.zoneDepart = { ...data.zoneDepart, ville: "" };
        }
      }

      updateData(updatedFields);

      // Effacer l'erreur pour ce champ spécifique lors de la modification
      if (errors[zone] && errors[zone]?.[field]) {
        setErrors((prevErrors) => {
          const updatedZoneErrors = { ...prevErrors[zone] };
          delete updatedZoneErrors[field];

          const finalErrors = { ...prevErrors };
          if (Object.keys(updatedZoneErrors).length > 0) {
            finalErrors[zone] = updatedZoneErrors;
          } else {
            delete finalErrors[zone];
          }
          // Nettoyer l'objet d'erreur principal si zoneDepart ou zoneDestination est maintenant vide
          if (
            finalErrors.zoneDepart &&
            Object.keys(finalErrors.zoneDepart).length === 0
          )
            delete finalErrors.zoneDepart;
          if (
            finalErrors.zoneDestination &&
            Object.keys(finalErrors.zoneDestination).length === 0
          )
            delete finalErrors.zoneDestination;

          return finalErrors;
        });
      }
    };

    return (
      <div className="space-y-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Localisation et Date d'Envoi
        </h2>

        <LocationSection
          title="Zone de Départ"
          locationData={data.zoneDepart}
          onLocationChange={(field, value) =>
            handleLocationPointChange("zoneDepart", field, value)
          }
          prefix="zoneDepart"
          errors={errors.zoneDepart}
          disabledCityId={data.zoneDestination.ville || undefined} // Passer la ville de destination sélectionnée
        />

        <LocationSection
          title="Zone de Destination"
          locationData={data.zoneDestination}
          onLocationChange={(field, value) =>
            handleLocationPointChange("zoneDestination", field, value)
          }
          prefix="zoneDestination"
          errors={errors.zoneDestination}
          disabledCityId={data.zoneDepart.ville || undefined} // Passer la ville de départ sélectionnée
        />

        {/* Section pour la date d'envoi */}
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date d'Envoi Souhaitée
          </h3>
          <div>
            <Label htmlFor="shippingDate" className="text-sm">
              Date d'envoi
            </Label>
            <Input
              id="shippingDate"
              name="shippingDate"
              type="date"
              value={data.shippingDate}
              onChange={(e) =>
                handleGenericChange("shippingDate", e.target.value)
              }
              className={`mt-1 w-full bg-white dark:bg-white/10 border-gray-300 dark:border-gray-600 ${errors.shippingDate ? "border-red-500" : ""}`}
              min={new Date().toISOString().split("T")[0]} // Empêche la sélection de dates passées dans le picker
            />
            {errors.shippingDate && (
              <p className="text-xs text-red-500 mt-1">{errors.shippingDate}</p>
            )}
          </div>
        </div>

        <div className="mt-6 p-8 bg-gray-100 dark:bg-gray-800/30 rounded-md text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Carte interactive du Bénin (sera implémentée)
          </p>
          {/* Vous pouvez ajouter ici une image placeholder ou un composant de carte simple */}
        </div>
      </div>
    );
  }
);

Step1_Localization.displayName = "Step1_Localization";
export default Step1_Localization;
