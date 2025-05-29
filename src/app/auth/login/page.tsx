"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";

const formSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères",
  }),
});

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        form.reset();
        router.push("/users/dashboard");
      } else {
        setError(data.error || "Une erreur est survenue lors de la connexion.");
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la connexion.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="h-screen">
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-r from-[#0F123B] via-[#090D2E] to-[rgb(2,5,21)]">
        <div className="flex flex-col items-center justify-center text-white text-center border p-8 rounded-lg shadow-lg bg-white/5 backdrop-blur-lg border-white/10 w-[400px]">
          <h1 className="text-3xl text-white font-bold">Connexion</h1>
          <p className="text-gray-400 mt-4 text-xs mb-6">
            Connectez-vous à votre compte pour accéder à votre espace
          </p>

          <Form {...form}>
            {error && (
              <div className="w-full px-2 py-3 mb-4 text-xs text-red-500 bg-red-100/10 border border-red-500 rounded-md">
                {error}
              </div>
            )}
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

              <Button
                type="submit"
                className={`w-full mt-6 bg-blue-500 hover:bg-blue-600 transition-all duration-200 cursor-pointer ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
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
                    <span className="ml-2">Connexion en cours...</span>
                  </div>
                ) : (
                  <span className="text-white py-2">Se connecter</span>
                )}
              </Button>
            </form>
          </Form>

          <p className="text-xs mt-6">
            Vous n'avez pas de compte ?{" "}
            <Link href="/auth/register" className="text-blue-400 hover:underline">
              Créez-en un
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;