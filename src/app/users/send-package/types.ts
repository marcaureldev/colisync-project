export type PackageType = "standard" | "large" | "express";

export type PackageCategory = "documents" | "electronics" | "clothing" | "merchandises" | "other";
export interface PackageItem {
  id: string; 
  description: string;
  quantity: string;
  weight: string;
  packageCategory: PackageCategory;
  // value: string;
  imageFile: File | null;
}

export interface LocationPoint {
  ville: string;
  quartier: string;
  adressePrecise: string;
}

export interface LocalizationFormData {
  zoneDepart: LocationPoint;
  zoneDestination: LocationPoint;
  shippingDate: string;
}

export interface ContactFormData {
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  notifyRecipient: boolean;
  additionalInstructions?: string;
}

export interface ReviewAndConfirmFormData {
  // preferredShipDate: string; // Déjà géré par shippingDate dans LocalizationFormData, à supprimer si redondant
  acceptTerms: boolean; // Nouveau champ pour les conditions générales
}

// Type global pour toutes les données du formulaire
export interface SendPackageFormData {
  packageDetails: PackageItem[]; // Modifié: maintenant un tableau de PackageItem
  localization: LocalizationFormData;
  contact: ContactFormData;
  reviewAndConfirm: ReviewAndConfirmFormData;
}