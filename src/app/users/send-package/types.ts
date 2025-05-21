export type PackageType = "standard" | "large" | "express";

export interface PackageDetailsFormData {
  packageType: PackageType;
  weight: string;
  value: string;
  // length: string;
  // width: string;
  // height: string;
  description: string;
}

export interface LocationPoint {
  ville: string;
  quartier: string;
  adressePrecise: string;
}

export interface LocalizationFormData {
  zoneDepart: LocationPoint;
  zoneDestination: LocationPoint;
  shippingDate: string; // Nouvelle propriété pour la date d'envoi
}

export interface ContactFormData { // Anciennement SenderRecipientFormData, recentré sur le contact
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  notifyRecipient: boolean;
  additionalInstructions?: string; // Peut rester ici ou aller à l'étape de révision
}

export interface ReviewAndConfirmFormData {
  // preferredShipDate: string; // Déjà géré par shippingDate dans LocalizationFormData, à supprimer si redondant
  insurance: boolean; // On peut l'afficher si cochée
  acceptTerms: boolean; // Nouveau champ pour les conditions générales
}

// Type global pour toutes les données du formulaire
export interface SendPackageFormData {
  packageDetails: PackageDetailsFormData;
  localization: LocalizationFormData;
  contact: ContactFormData;
  reviewAndConfirm: ReviewAndConfirmFormData;
}