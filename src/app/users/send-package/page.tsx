"use client";
import React, { useRef } from "react";
import StepperNav from "./components/StepperNav";
import Step1_Localization, { Step1Ref } from "./components/Step1_Localization";
import Step2_Contact, { Step2Ref } from "./components/Step2_Contact";
import Step3_DetailsPackage, {
  Step3Ref,
} from "./components/Step3_DetailsPackage";
import Step4_ReviewAndConfirm from "./components/Step4_ReviewAndConfirm"; 
import { Button } from "@/components/ui/button";
import { useReservation } from "@/contexts/ReservationContext";
import {
  MapPin,
  User,
  Package,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const steps = [
  { id: 1, name: "Localisation & Date", Icon: MapPin },
  { id: 2, name: "Contact", Icon: User },
  { id: 3, name: "Détails Colis", Icon: Package },
  { id: 4, name: "Confirmation", Icon: CheckCircle },
];

const SendPackagePage = () => {
  // Utiliser le contexte au lieu des états locaux
  const {
    formData,
    updateLocalization,
    updateContact,
    updatePackageDetails,
    currentStep,
    setCurrentStep,
  } = useReservation();

  const step1Ref = useRef<Step1Ref>(null);
  const step2Ref = useRef<Step2Ref>(null);
  const step3Ref = useRef<Step3Ref>(null);
  // Plus besoin de step4Ref

  const nextStep = async () => {
    let isValid = true;
    // Logique de validation corrigée et adaptée :
    if (currentStep === 1 && step1Ref.current) {
      isValid = step1Ref.current.validateForm();
    } else if (currentStep === 2 && step2Ref.current) {
      isValid = step2Ref.current.validateForm();
    } else if (currentStep === 3 && step3Ref.current) {
      // Validation pour Détails Colis
      isValid = step3Ref.current.validateForm();
    }

    if (isValid) {
      setCurrentStep(Math.min(currentStep + 1, steps.length));
    }
  };

  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1));

  const handleSubmit = async () => {
    // Plus besoin de validation pour l'étape 4 puisqu'elle est juste un récapitulatif
    console.log("Formulaire complet soumis:", formData);
    const response = await fetch("/api/users/send-package", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1_Localization
            ref={step1Ref}
            data={formData.localization}
            updateData={updateLocalization}
          />
        );
      case 2:
        return (
          <Step2_Contact
            ref={step2Ref}
            data={formData.contact}
            updateData={updateContact}
          />
        );
      case 3:
        return (
          <Step3_DetailsPackage
            ref={step3Ref}
            data={formData.packageDetails}
            updateData={updatePackageDetails}
          />
        );
      case 4:
        return <Step4_ReviewAndConfirm formData={formData} />;
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
