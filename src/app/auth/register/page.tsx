"use client";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";
import { ClipLoader } from "react-spinners";
import { Building2, User, CheckCircle, AlertCircle } from "lucide-react";

interface InvitationInfo {
  code: string;
  type: 'company' | 'agent';
  name: string;
  email?: string;
  station?: string;
  expiresAt: string;
}

const Register = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [invitationInfo, setInvitationInfo] = React.useState<InvitationInfo | null>(null);
  const [validatingInvitation, setValidatingInvitation] = React.useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const domain = process.env.NEXT_PUBLIC_SITE_URL;

  // Récupérer le code d'invitation depuis l'URL
  const invitationCode = searchParams.get('code');

  // Valider l'invitation au chargement de la page
  React.useEffect(() => {
    if (invitationCode) {
      validateInvitation(invitationCode);
    } else {
      setValidatingInvitation(false);
    }
  }, [invitationCode]);

  const validateInvitation = async (code: string) => {
    try {
      const response = await fetch(`/api/auth/validate-invitation?code=${code}`);
      const data = await response.json();
      
      if (data.success) {
        setInvitationInfo(data.invitation);
        // Pré-remplir le formulaire avec les informations de l'invitation
        if (data.invitation.email) {
          form.setValue('email', data.invitation.email);
        }
        if (data.invitation.name) {
          form.setValue('fullname', data.invitation.name);
        }
      } else {
        setError(data.error || 'Code d\'invitation invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      setError('Erreur lors de la validation du code d\'invitation');
    } finally {
      setValidatingInvitation(false);
    }
  };

  const formSchema = z
    .object({
      email: z
        .string()
        .min(1, "L'adresse email est requise")
        .email("Format d'email invalide"),
      fullname: z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(50, "Le nom ne peut pas dépasser 50 caractères"),
      password: z
        .string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
      confirmPassword: z
        .string()
        .min(1, "Veuillez confirmer votre mot de passe"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Les mots de passe ne correspondent pas",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullname: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError(null);
      setIsLoading(true);
      
      const requestData = {
        ...values,
        invitationCode: invitationCode || undefined,
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log('Réponse de registration:', data);

      if (response.ok && data.success) {
        form.reset();
        console.log('Redirection vers:', data.redirectLink);
        router.push(data.redirectLink);
      } else {
        const errorMessage = data.error || "Une erreur est survenue lors de l'inscription.";
        console.error('Erreur de registration:', errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setError("Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  }

  const getTypeBadge = (type: 'company' | 'agent') => {
    return type === 'company' ? (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
        <Building2 className="h-3 w-3 mr-1" />
        Entreprise
      </Badge>
    ) : (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        <User className="h-3 w-3 mr-1" />
        Agent de gare
      </Badge>
    );
  };

  if (validatingInvitation) {
    return (
      <section className="h-screen">
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-r from-[#0F123B] via-[#090D2E] to-[rgb(2,5,21)]">
          <div className="flex flex-col items-center justify-center text-white text-center border p-8 rounded-lg shadow-lg bg-white/5 backdrop-blur-lg border-white/10 w-[400px]">
            <ClipLoader color="#ffffff" loading={true} size={24} />
            <p className="text-gray-400 mt-4">Validation du code d'invitation...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="h-screen">
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-r from-[#0F123B] via-[#090D2E] to-[rgb(2,5,21)]">
        <div className="flex flex-col items-center justify-center text-white text-center border p-8 rounded-lg shadow-lg bg-white/5 backdrop-blur-lg border-white/10 w-[400px]">
          <h1 className="text-3xl text-white font-bold">
            {invitationInfo ? 'Finaliser votre inscription' : 'Créer un compte'}
          </h1>
          
          {invitationInfo && (
            <div className="w-full mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-green-400 text-sm font-medium">Invitation valide</span>
                </div>
                {getTypeBadge(invitationInfo.type)}
              </div>
              <div className="mt-2 text-xs text-gray-300">
                <span className="font-mono bg-white/10 px-2 py-1 rounded">{invitationInfo.code}</span>
                {invitationInfo.station && (
                  <span className="ml-2 text-gray-400">• {invitationInfo.station}</span>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="w-full px-2 py-3 mt-4 text-xs text-red-500 bg-red-100/10 border border-red-500 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            </div>
          )}

          <p className="text-gray-400 mt-4 text-xs mb-6">
            {invitationInfo 
              ? "Complétez les informations pour finaliser votre inscription"
              : "Veuillez remplir le formulaire suivant pour créer votre compte"
            }
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="votre.email@exemple.com"
                        {...field}
                        className="bg-white/5 backdrop-blur-lg border-white/10"
                        disabled={!!invitationInfo?.email}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom et prénom</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Votre nom complet"
                        {...field}
                        className="bg-white/5 backdrop-blur-lg border-white/10"
                        disabled={!!invitationInfo?.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Votre mot de passe"
                        {...field}
                        className="bg-white/5 backdrop-blur-lg border-white/10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirmez votre mot de passe"
                        {...field}
                        className="bg-white/5 backdrop-blur-lg border-white/10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className={`w-full mt-6 bg-blue-500 hover:bg-blue-600 transition-all duration-200 cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="py-2 flex items-center justify-center">
                    <ClipLoader
                      color={"#ffffff"}
                      loading={true}
                      size={18}
                      aria-label="Chargement"
                    />
                    <span className="ml-2">Traitement en cours...</span>
                  </div>
                ) : (
                  <span className="text-white py-2">
                    {invitationInfo ? 'Finaliser l\'inscription' : 'S\'inscrire'}
                  </span>
                )}
              </Button>
            </form>
          </Form>

          <p className="text-xs mt-6">
            Vous avez déjà un compte?{" "}
            <Link href="/auth/login" className="text-blue-400 hover:underline">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
