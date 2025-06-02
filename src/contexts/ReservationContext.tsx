"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { SendPackageFormData } from "@/app/users/send-package/types";

interface ReservationContextType {
  formData: SendPackageFormData;
  updateLocalization: (
    fields: Partial<SendPackageFormData["localization"]>
  ) => void;
  updateContact: (fields: Partial<SendPackageFormData["contact"]>) => void;
  updatePackageDetails: (
    newPackages: SendPackageFormData["packageDetails"]
  ) => void;
  resetForm: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  validateStep: (step: number) => boolean;
}

const initialLocationPoint = {
  ville: "",
  quartier: "",
  adressePrecise: "",
};

const initialFormData: SendPackageFormData = {
  localization: {
    zoneDepart: { ...initialLocationPoint },
    zoneDestination: { ...initialLocationPoint },
    shippingDate: "",
  },
  contact: {
    senderName: "",
    senderPhone: "",
    recipientName: "",
    recipientPhone: "",
    notifyRecipient: true,
    additionalInstructions: "",
  },
  packageDetails: [],
};

const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined
);

export const ReservationProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<SendPackageFormData>(() => {
    if (typeof window === "undefined") {
      return initialFormData;
    }

    const savedData = localStorage.getItem("reservationFormData");
    const savedStep = localStorage.getItem("reservationCurrentStep");
    return savedData ? JSON.parse(savedData) : initialFormData;
  });

  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (typeof window === "undefined") {
      return 1;
    }

    const savedStep = localStorage.getItem("reservationCurrentStep");
    return savedStep ? parseInt(savedStep, 10) : 1;
  });

  // Sauvegarder les données dans le localStorage à chaque modification
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("reservationFormData", JSON.stringify(formData));
    }
  }, [formData]);

  // Sauvegarder l'étape actuelle dans le localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("reservationCurrentStep", currentStep.toString());
    }
  }, [currentStep]);

  // Fonctions pour mettre à jour les différentes parties du formulaire
  const updateLocalization = (
    fields: Partial<SendPackageFormData["localization"]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      localization: { ...prev.localization, ...fields },
    }));
  };

  const updateContact = (fields: Partial<SendPackageFormData["contact"]>) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...fields },
    }));
  };

  const updatePackageDetails = (
    newPackages: SendPackageFormData["packageDetails"]
  ) => {
    setFormData((prev) => ({
      ...prev,
      packageDetails: newPackages,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    if (typeof window !== "undefined") {
      localStorage.removeItem("reservationFormData");
      localStorage.removeItem("reservationCurrentStep");
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Validation de la localisation
        const locValid =
          formData.localization.zoneDepart.ville !== "" &&
          formData.localization.zoneDestination.ville !== "" &&
          formData.localization.shippingDate !== "";
        return locValid;

      case 2: // Validation des contacts
        const contactValid =
          formData.contact.senderName !== "" &&
          formData.contact.senderPhone !== "" &&
          formData.contact.recipientName !== "" &&
          formData.contact.recipientPhone !== "";
        return contactValid;

      case 3: // Validation des détails du colis
        return formData.packageDetails.length > 0;

      case 4:
        return true;

      default:
        return false;
    }
  };

  return (
    <ReservationContext.Provider
      value={{
        formData,
        updateLocalization,
        updateContact,
        updatePackageDetails,
        resetForm,
        currentStep,
        setCurrentStep,
        validateStep,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }
  return context;
};
