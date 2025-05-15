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
import React from "react";
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";

const Register = () => {
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const domain = process.env.NEXT_PUBLIC_SITE_URL;

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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        form.reset();
        router.push(
          `/auth/verifyEmail?email=${encodeURIComponent(values.email)}`
        );
      } else {
        setError(
          data.error || "Une erreur est survenue lors de l'inscription."
        );
      }
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Une erreur est survenue lors de l'inscription.",
        },
        { status: 500 }
      );
    }
  }

  return (
    <section className="h-screen">
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-r from-[#0F123B] via-[#090D2E] to-[rgb(2,5,21)]">
        <div className="flex flex-col items-center justify-center text-white text-center border p-8 rounded-lg shadow-lg bg-white/5 backdrop-blur-lg border-white/10 w-[400px]">
          <h1 className="text-3xl text-white font-bold">Créer un compte</h1>
          <p className="text-gray-400 mt-4 text-xs mb-6">
            Veuillez remplir le formulaire suivant pour créer votre compte
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
                className="w-full mt-6 bg-blue-500 hover:bg-blue-600"
              >
                S'inscrire
              </Button>
            </form>
          </Form>

          <p className="text-xs mt-6">
            Vous avez déjà un compte?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
