"use client";
import React, { useState, useRef } from "react";
import StepperNav from "./components/StepperNav";
import Step1_PackageDetails, {
  Step1Ref,
} from "./components/Step1_PackageDetails";
import Step2_Localization, { Step2Ref } from "./components/Step2_Localization";
import Step3_Contact, { Step3Ref } from "./components/Step3_Contact";
import Step4_ReviewAndConfirm, {
  Step4Ref,
} from "./components/Step4_ReviewAndConfirm"; // Importer Step4
import { Button } from "@/components/ui/button";
import {
  SendPackageFormData,
  PackageDetailsFormData,
  LocalizationFormData,
  LocationPoint,
  ContactFormData,
  ReviewAndConfirmFormData,
} from "./types";
import {
  Package,
  MapPin,
  User,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const steps = [
  { id: 1, name: "Détails Colis", Icon: Package },
  { id: 2, name: "Localisation & Date", Icon: MapPin }, // Nom ajusté
  { id: 3, name: "Contact", Icon: User },
  { id: 4, name: "Confirmation", Icon: CheckCircle },
];

const initialLocationPoint: LocationPoint = {
  ville: "",
  quartier: "",
  adressePrecise: "",
};

const initialPackageDetails: PackageDetailsFormData = {
  packageType: "standard",
  weight: "",
  value: "",
  // length: "",
  // width: "",
  // height: "",
  description: "",
};

const initialLocalization: LocalizationFormData = {
  zoneDepart: { ...initialLocationPoint },
  zoneDestination: { ...initialLocationPoint },
  shippingDate: "",
};

const initialContact: ContactFormData = {
  senderName: "",
  senderPhone: "",
  recipientName: "",
  recipientPhone: "",
  notifyRecipient: true,
  additionalInstructions: "",
};

const initialReviewAndConfirm: ReviewAndConfirmFormData = {
  // preferredShipDate: '', // Supprimé ou commenté
  insurance: false, // Vous pouvez ajouter un champ pour cela dans une étape précédente si besoin
  acceptTerms: false,
};

const SendPackagePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SendPackageFormData>({
    packageDetails: initialPackageDetails,
    localization: initialLocalization,
    contact: initialContact,
    reviewAndConfirm: initialReviewAndConfirm,
  });

  const step1Ref = useRef<Step1Ref>(null);
  const step2Ref = useRef<Step2Ref>(null);
  const step3Ref = useRef<Step3Ref>(null);
  const step4Ref = useRef<Step4Ref>(null); // Ref pour l'étape 4

  const updatePackageDetails = (fields: Partial<PackageDetailsFormData>) => {
    setFormData((prev) => ({
      ...prev,
      packageDetails: { ...prev.packageDetails, ...fields },
    }));
  };

  const updateLocalization = (fields: Partial<LocalizationFormData>) => {
    setFormData((prev) => ({
      ...prev,
      localization: { ...prev.localization, ...fields },
    }));
  };

  const updateContact = (fields: Partial<ContactFormData>) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...fields },
    }));
  };

  const updateReviewAndConfirm = (
    fields: Partial<ReviewAndConfirmFormData>
  ) => {
    setFormData((prev) => ({
      ...prev,
      reviewAndConfirm: { ...prev.reviewAndConfirm, ...fields },
    }));
  };

  const nextStep = async () => {
    let isValid = true;
    if (currentStep === 1 && step1Ref.current) {
      isValid = step1Ref.current.validateForm();
    } else if (currentStep === 2 && step2Ref.current) {
      isValid = step2Ref.current.validateForm();
    } else if (currentStep === 3 && step3Ref.current) {
      isValid = step3Ref.current.validateForm();
    }
    // Pas de nextStep depuis l'étape 4, le bouton devient "Confirmer"

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    if (step4Ref.current && step4Ref.current.validateForm()) {
      // Logique de soumission du formulaire
      console.log("Formulaire complet soumis:", formData);
      alert("Commande confirmée (simulation) ! \nDonnées en console.");
      // Ici, vous enverriez les données à votre backend
    } else {
      // Normalement, la validation dans step4Ref.current.validateForm() affichera les erreurs
      console.log("Validation de l'étape 4 échouée ou ref non disponible.");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1_PackageDetails
            ref={step1Ref}
            data={formData.packageDetails}
            updateData={updatePackageDetails}
          />
        );
      case 2:
        return (
          <Step2_Localization
            ref={step2Ref}
            data={formData.localization}
            updateData={updateLocalization}
          />
        );
      case 3:
        return (
          <Step3_Contact
            ref={step3Ref}
            data={formData.contact}
            updateData={updateContact}
          />
        );
      case 4:
        return (
          <Step4_ReviewAndConfirm
            ref={step4Ref}
            formData={formData}
            updateReviewData={updateReviewAndConfirm}
          />
        );
      default:
        return <p>Étape inconnue</p>;
    }
  };

  return (
    <div className="">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          Envoyer un Colis
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          Remplissez les détails pour envoyer votre colis à travers le Bénin.
        </p>
      </div>

      <StepperNav currentStep={currentStep} steps={steps} />

      <div className="bg-white dark:bg-white/5 dark:backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg p-4">
        {renderStepContent()}
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={18} className="mr-2" />
          Précédent
        </Button>
        {currentStep < steps.length ? (
          <Button
            onClick={nextStep}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Suivant
            <ArrowRight size={18} className="ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
          >
            Confirmer la Commande
          </Button>
        )}
      </div>
    </div>
  );
};

export default SendPackagePage;
