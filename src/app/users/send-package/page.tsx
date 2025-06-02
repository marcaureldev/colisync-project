"use client";
import React, { useRef, useState } from "react";
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
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, name: "Localisation & Date", Icon: MapPin },
  { id: 2, name: "Contact", Icon: User },
  { id: 3, name: "Détails Colis", Icon: Package },
  { id: 4, name: "Confirmation", Icon: CheckCircle },
];

const SendPackagePage = () => {
  const {
    formData,
    updateLocalization,
    updateContact,
    updatePackageDetails,
    currentStep,
    resetForm,
    setCurrentStep,
  } = useReservation();

  const step1Ref = useRef<Step1Ref>(null);
  const step2Ref = useRef<Step2Ref>(null);
  const step3Ref = useRef<Step3Ref>(null);

  const nextStep = async () => {
    let isValid = true;
    if (currentStep === 1 && step1Ref.current) {
      isValid = step1Ref.current.validateForm();
    } else if (currentStep === 2 && step2Ref.current) {
      isValid = step2Ref.current.validateForm();
    } else if (currentStep === 3 && step3Ref.current) {
      isValid = step3Ref.current.validateForm();
    }

    if (isValid) {
      setCurrentStep(Math.min(currentStep + 1, steps.length));
    }
  };

  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Créer un FormData pour gérer les fichiers
      const submitFormData = new FormData();

      submitFormData.append(
        "localization",
        JSON.stringify(formData.localization)
      );
      submitFormData.append("contact", JSON.stringify(formData.contact));

      const packageDetailsForJson = formData.packageDetails.map(
        (pkg, index) => ({
          ...pkg,
          imageFile: null,
        })
      );
      submitFormData.append(
        "packageDetails",
        JSON.stringify(packageDetailsForJson)
      );

      // Ajouter les fichiers séparément avec des clés uniques
      formData.packageDetails.forEach((pkg, index) => {
        if (pkg.imageFile && pkg.imageFile instanceof File) {
          submitFormData.append(`package_${index}_image`, pkg.imageFile);
        }
      });

      const response = await fetch("/api/users/send-package", {
        method: "POST",
        body: submitFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      setSubmitSuccess(true);
      resetForm();
      router.push("/users/bookings-list");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting}
            className={`bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white flex space-x-2 items-center`}
          >
            {isSubmitting && (
              <span className="animate-spin size-5 rounded-full border-b-2 border-white mx-auto"></span>
            )}
            {isSubmitting
              ? "Confirmation en cours..."
              : " Confirmer la réservation"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SendPackagePage;
