"use client";
import React, { useState, useImperativeHandle, forwardRef } from "react"; // Ajout de useState, useImperativeHandle, forwardRef
import { ContactFormData } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea"; // Si vous gardez additionalInstructions ici

interface Step2ContactProps {
  data: ContactFormData;
  updateData: (fields: Partial<ContactFormData>) => void;
}

// Interface pour les méthodes exposées par le ref
export interface Step2Ref {
  validateForm: () => boolean;
}

// Type pour les erreurs de contact
type ContactErrors = Partial<
  Record<
    keyof Omit<ContactFormData, "notifyRecipient" | "additionalInstructions">,
    string
  >
>;

const Step2_Contact = forwardRef<Step2Ref, Step2ContactProps>(
  ({ data, updateData }, ref) => {
    const [errors, setErrors] = useState<ContactErrors>({});

    const validateForm = () => {
      const newErrors: ContactErrors = {};
      if (!data.senderName.trim()) {
        newErrors.senderName = "Le nom de l'expéditeur est requis.";
      }
      if (!data.senderPhone.trim()) {
        newErrors.senderPhone = "Le téléphone de l'expéditeur est requis.";
      } else if (!/^\+?\d{8,}$/.test(data.senderPhone.replace(/\s/g, ""))) {
        // Exemple de validation de format simple
        newErrors.senderPhone =
          "Format de téléphone invalide (minimum 8 chiffres, peut commencer par +).";
      }

      if (!data.recipientName.trim()) {
        newErrors.recipientName = "Le nom du destinataire est requis.";
      }
      if (!data.recipientPhone.trim()) {
        newErrors.recipientPhone = "Le téléphone du destinataire est requis.";
      } else if (!/^\+?\d{8,}$/.test(data.recipientPhone.replace(/\s/g, ""))) {
        newErrors.recipientPhone =
          "Format de téléphone invalide (minimum 8 chiffres, peut commencer par +).";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => ({
      validateForm,
    }));

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      updateData({ [name]: value });
      if (errors[name as keyof ContactErrors]) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
      }
    };

    const handleCheckboxChange = (checked: boolean) => {
      updateData({ notifyRecipient: checked });
    };

    return (
      <div className="space-y-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Informations de Contact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Informations de l'Expéditeur */}
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">
              Expéditeur
            </h3>
            <div>
              <Label htmlFor="senderName" className="text-sm">
                Nom complet
              </Label>
              <Input
                id="senderName"
                name="senderName"
                value={data.senderName}
                onChange={handleChange}
                placeholder="Nom de l'expéditeur"
                className={`mt-1 bg-white dark:bg-white/10 border-gray-300 dark:border-gray-600 ${errors.senderName ? "border-red-500" : ""}`}
              />
              {errors.senderName && (
                <p className="text-xs text-red-500 mt-1">{errors.senderName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="senderPhone" className="text-sm">
                Numéro de téléphone
              </Label>
              <Input
                id="senderPhone"
                name="senderPhone"
                type="tel"
                value={data.senderPhone}
                onChange={handleChange}
                placeholder="+229 XX XX XX XX"
                className={`mt-1 bg-white dark:bg-white/10 border-gray-300 dark:border-gray-600 ${errors.senderPhone ? "border-red-500" : ""}`}
              />
              {errors.senderPhone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.senderPhone}
                </p>
              )}
            </div>
          </div>

          {/* Informations du Destinataire */}
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">
              Destinataire
            </h3>
            <div>
              <Label htmlFor="recipientName" className="text-sm">
                Nom complet
              </Label>
              <Input
                id="recipientName"
                name="recipientName"
                value={data.recipientName}
                onChange={handleChange}
                placeholder="Nom du destinataire"
                className={`mt-1 bg-white dark:bg-white/10 border-gray-300 dark:border-gray-600 ${errors.recipientName ? "border-red-500" : ""}`}
              />
              {errors.recipientName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.recipientName}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="recipientPhone" className="text-sm">
                Numéro de téléphone
              </Label>
              <Input
                id="recipientPhone"
                name="recipientPhone"
                type="tel"
                value={data.recipientPhone}
                onChange={handleChange}
                placeholder="+229 XX XX XX XX"
                className={`mt-1 bg-white dark:bg-white/10 border-gray-300 dark:border-gray-600 ${errors.recipientPhone ? "border-red-500" : ""}`}
              />
              {errors.recipientPhone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.recipientPhone}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="additionalInstructions" className="text-sm">
            Instructions additionnelles (Optionnel)
          </Label>
          <Textarea
            id="additionalInstructions"
            name="additionalInstructions"
            rows={3}
            value={data.additionalInstructions || ""}
            onChange={handleChange}
            placeholder="Instructions spéciales pour la livraison ou le contact..."
            className="mt-1 bg-white dark:bg-white/10 border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="notifyRecipient"
            checked={data.notifyRecipient}
            onCheckedChange={handleCheckboxChange}
            className="border-gray-400 dark:border-gray-500 data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500"
          />
          <Label
            htmlFor="notifyRecipient"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            Notifier le destinataire des mises à jour du colis.
          </Label>
        </div>
      </div>
    );
  }
);

Step2_Contact.displayName = "Step2_Contact"; // Important pour forwardRef
export default Step2_Contact;
