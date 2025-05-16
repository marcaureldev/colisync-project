"use client";
import React, { useState, useEffect } from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BeatLoader, ClipLoader } from "react-spinners";

const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const existingOTP = searchParams.has("otp");
  const otp = existingOTP ? searchParams.get("otp") : null;
  const autoVerify = searchParams.get("autoVerify") === "true";

  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const verifyOtpCode = async (otpCode: string) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/auth/verifyEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          otp: otpCode,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess("Email vérifié avec succès");
        // Redirection après un court délai pour montrer le message de succès
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
        return true;
      } else {
        setError(result.error || "Échec de la vérification de l'email");
        return false;
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la vérification de l'email.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await verifyOtpCode(data.otp);
  }

  // Vérification automatique si le code OTP est présent dans l'URL
  useEffect(() => {
    if (autoVerify && otp && token && !isVerifying) {
      setIsVerifying(true);
      // Pré-remplir le formulaire OTP si on a le code dans l'URL
      form.setValue("otp", otp);

      // Vérifier automatiquement
      verifyOtpCode(otp).then((success) => {
        if (!success) {
          // Si échec, on laisse l'utilisateur essayer manuellement
          setIsVerifying(false);
        }
      });
    }
  }, [autoVerify, otp, token]);

  useEffect(() => {
    if (!isTimerRunning) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTimerRunning(false);
    }
  }, [timeLeft, isTimerRunning]);

  // const handleResendCode = async () => {
  //   // Ici vous pouvez implémenter la logique pour renvoyer un code
  //   const otpCode = generateNumericOTP(6);
  //   const response = await fetch("/api/auth/resendOtpCode", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       email,
  //       token,
  //       otp: otpCode,
  //     }),
  //   });

  //   const data = await response.json();
  //   if (response.ok) {
  //     setSuccess("Un nouveau code a été envoyé à votre adresse e-mail.");
  //     setIsTimerRunning(true);
  //     setTimeLeft(60);
  //   } else {
  //     setError(data.error || "Une erreur est survenue lors du renvoi du code.");
  //   }

  //   setTimeLeft(60);
  //   setIsTimerRunning(true);
  // };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-[#0F123B] via-[#090D2E] to-[rgb(2,5,21)] text-white">
      <div className="p-8 w-full max-w-md border rounded-lg shadow-lg bg-white/5 backdrop-blur-lg border-white/10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Vérifiez votre email</h2>
          {autoVerify && isVerifying ? (
            <p className="mt-2">Vérification automatique en cours...</p>
          ) : (
            <p className="mt-2">
              Nous avons envoyé un code à 6 chiffres à l'adresse {email}
            </p>
          )}
        </div>

        {/* Afficher le formulaire uniquement si on n'est pas en mode vérification auto ou si la vérification auto a échoué */}
        {(!autoVerify || (autoVerify && !isVerifying)) && (
          <div className="mb-8 flex flex-col items-center">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center w-full">
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                          className="flex justify-center"
                          {...field}
                        >
                          <InputOTPGroup className="flex justify-center gap-2">
                            <InputOTPSlot
                              index={0}
                              className="w-12 h-12 border-2 rounded-md border-gray-300"
                            />
                            <InputOTPSlot
                              index={1}
                              className="w-12 h-12 border-2 rounded-md border-gray-300"
                            />
                            <InputOTPSlot
                              index={2}
                              className="w-12 h-12 border-2 rounded-md border-gray-300"
                            />
                            <InputOTPSlot
                              index={3}
                              className="w-12 h-12 border-2 rounded-md border-gray-300"
                            />
                            <InputOTPSlot
                              index={4}
                              className="w-12 h-12 border-2 rounded-md border-gray-300"
                            />
                            <InputOTPSlot
                              index={5}
                              className="w-12 h-12 border-2 rounded-md border-gray-300"
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {error && (
                  <div className="p-2 mt-4 bg-red-100 text-red-700 rounded">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-2 mt-4 bg-green-100 text-green-700 rounded">
                    {success}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full mt-6 bg-blue-500 hover:bg-blue-600 relative flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="py-2">
                      <ClipLoader
                        color={"#ffffff"}
                        loading={isLoading}
                        size={18}
                        aria-label="Chargement"
                      />
                    </div>
                  ) : (
                    <span className="text-white py-2">Vérifier</span>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        )}

        {/* Zone pour le message en cas de vérification auto */}
        {autoVerify && isVerifying && (
          <div className="my-6 text-center">
            {isLoading && (
              <div className="flex flex-col items-center justify-center space-y-2">
                <BeatLoader
                  color={"#3B82F6"}
                  loading={isLoading}
                  size={10}
                  margin={4}
                  speedMultiplier={1}
                />
                <p className="text-blue-500 font-medium text-sm">
                  Vérification en cours...
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded mt-4">
                {error}
                <p className="mt-2 text-sm">
                  Vous pouvez essayer de saisir le code manuellement ci-dessous.
                </p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-100 text-green-700 rounded mt-4">
                {success}
                {/* <p className="mt-2 text-sm">
                  Redirection vers le tableau de bord...
                </p> */}
              </div>
            )}
          </div>
        )}

        {/* Section pour renvoyer le code */}
        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Vous n'avez pas reçu de code?{" "}
            {timeLeft > 0 ? (
              <span className="text-gray-400">Renvoyer dans {timeLeft}s</span>
            ) : (
              <button
                className="text-blue-400 font-medium hover:underline"
              >
                Renvoyer le code
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
