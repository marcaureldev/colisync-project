"use client";
import React, { useState, useImperativeHandle, forwardRef } from "react"; // Ajout de useState, useImperativeHandle, forwardRef
import { PackageDetailsFormData, PackageType } from "../types";
import PackageTypeCard from "./PackageTypeCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Info, Package as PackageIcon, Box, Zap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Step1Props {
  data: PackageDetailsFormData;
  updateData: (fields: Partial<PackageDetailsFormData>) => void;
}

// Interface pour les méthodes exposées par le ref
export interface Step1Ref {
  validateForm: () => boolean;
}

const packageTypes = [
  {
    id: "standard" as PackageType,
    title: "Standard",
    description: "Colis standards jusqu'à 10kg",
    icon: PackageIcon,
  },
  {
    id: "large" as PackageType,
    title: "Large",
    description: "Articles volumineux jusqu'à 30kg",
    icon: Box,
  },
  {
    id: "express" as PackageType,
    title: "Express",
    description: "Livraison prioritaire, arrive en premier",
    icon: Zap,
  },
];

const Step1_PackageDetails = forwardRef<Step1Ref, Step1Props>(
  ({ data, updateData }, ref) => {
    const [errors, setErrors] = useState<
      Partial<Record<keyof PackageDetailsFormData, string>>
    >({});

    const validateForm = () => {
      const newErrors: Partial<Record<keyof PackageDetailsFormData, string>> =
        {};
      if (!data.weight || parseFloat(data.weight) <= 0) {
        newErrors.weight = "Le poids est requis et doit être positif.";
      }
      if (!data.value || parseFloat(data.value) <= 0) {
        // Le champ 'value' est déjà 'required' via HTML, mais ajoutons une validation JS
        newErrors.value =
          "La valeur du colis est requise et doit être positive.";
      }
      if (!data.description || data.description.trim() === "") {
        newErrors.description = "La description du colis est requise.";
      }
      // Valider les dimensions si elles sont réactivées
      // if (!data.length || parseFloat(data.length) <= 0) newErrors.length = "La longueur est requise et doit être positive.";
      // if (!data.width || parseFloat(data.width) <= 0) newErrors.width = "La largeur est requise et doit être positive.";
      // if (!data.height || parseFloat(data.height) <= 0) newErrors.height = "La hauteur est requise et doit être positive.";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // Exposer la fonction de validation au parent via le ref
    useImperativeHandle(ref, () => ({
      validateForm,
    }));

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      updateData({ [name]: value });
      // Effacer l'erreur pour ce champ spécifique lors de la modification
      if (errors[name as keyof PackageDetailsFormData]) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
      }
    };

    const handlePackageTypeSelect = (value: string) => {
      updateData({ packageType: value as PackageType });
      // Si le type de colis avait une validation d'erreur, vous pourriez la nettoyer ici aussi
    };

    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Détails du Colis
        </h2>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
            Type de colis
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {packageTypes.map((pt) => (
              <PackageTypeCard
                key={pt.id}
                icon={pt.icon}
                title={pt.title}
                description={pt.description}
                value={pt.id}
                selectedValue={data.packageType}
                onSelect={handlePackageTypeSelect}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <Label
              htmlFor="weight"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Poids (kg)
            </Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              placeholder="ex: 2.5"
              value={data.weight}
              onChange={handleChange}
              className={`mt-1 bg-white dark:bg-white/10 border-gray-300 dark:border-gray-600 ${errors.weight ? "border-red-500" : ""}`}
            />
            {errors.weight && (
              <p className="text-xs text-red-500 mt-1">{errors.weight}</p>
            )}
          </div>
          <div>
            <Label
              htmlFor="value"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Valeur du colis
            </Label>
            <Input
              required // Garder la validation HTML5 pour un feedback immédiat du navigateur
              id="value"
              name="value"
              type="number"
              placeholder="ex: 5000"
              value={data.value}
              onChange={handleChange}
              className={`mt-1 bg-white dark:bg-white/10 border-gray-300 dark:border-gray-600 ${errors.value ? "border-red-500" : ""}`}
            />
            {errors.value && (
              <p className="text-xs text-red-500 mt-1">{errors.value}</p>
            )}
          </div>
        </div>

        {/* 
      <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Dimensions du colis (cm)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
        <div>
        <Label htmlFor="length" className="text-xs text-gray-600 dark:text-gray-400">Longueur</Label>
        <Input id="length" name="length" type="number" placeholder="ex: 30" value={data.length} onChange={handleChange} className={`mt-1 bg-white dark:bg-white/10 border-gray-300 dark:border-gray-600 ${errors.length ? 'border-red-500' : ''}`} />
        {errors.length && <p className="text-xs text-red-500 mt-1">{errors.length}</p>}
        </div>
        <div>
        <Label htmlFor="width" className="text-xs text-gray-600 dark:text-gray-400">Largeur</Label>
        <Input id="width" name="width" type="number" placeholder="ex: 20" value={data.width} onChange={handleChange} className={`mt-1 bg-white dark:bg-white/10 border-gray-300 dark:border-gray-600 ${errors.width ? 'border-red-500' : ''}`} />
        {errors.width && <p className="text-xs text-red-500 mt-1">{errors.width}</p>}
        </div>
        <div>
        <Label htmlFor="height" className="text-xs text-gray-600 dark:text-gray-400">Hauteur</Label>
        <Input id="height" name="height" type="number" placeholder="ex: 15" value={data.height} onChange={handleChange} className={`mt-1 bg-white dark:bg-white/10 border-gray-300 dark:border-gray-600 ${errors.height ? 'border-red-500' : ''}`} />
        {errors.height && <p className="text-xs text-red-500 mt-1">{errors.height}</p>}
        </div>
        </div>
      </div> */}

        <div>
          <Label
            htmlFor="description"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description du colis
          </Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Décrivez brièvement le contenu de votre colis..."
            value={data.description}
            onChange={handleChange}
            className={`mt-1 bg-white dark:bg-white/10 border-gray-300 dark:border-gray-600 ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        <Alert className="bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30">
          <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <AlertTitle className="text-blue-700 dark:text-blue-300 font-medium">
            Information
          </AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-300/90 text-xs">
            Pour les articles fragiles, nous recommandons un emballage de
            protection. Une assurance supplémentaire est disponible à l'étape de
            révision.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
);

Step1_PackageDetails.displayName = "Step1_PackageDetails"; // Important pour forwardRef avec des outils de dev
export default Step1_PackageDetails;
