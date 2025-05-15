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
  const otp = searchParams.get(
    "otp<Form {...form} onSubmit={form.handleSubmit(onSubmit)}>"
  );

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
          email,
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Bonjour")
    // await verifyOtpCode(data.otp);
  }

  useEffect(() => {
    if (autoVerify && otp && token && email && !isVerifying) {
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
  }, [autoVerify, otp, token, email]);

  useEffect(() => {
    if (!isTimerRunning) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTimerRunning(false);
    }
  }, [timeLeft, isTimerRunning]);

  const handleResendCode = () => {
    // Ici vous pouvez implémenter la logique pour renvoyer un code
    setTimeLeft(60);
    setIsTimerRunning(true);
  };

  return (
    // <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-[#0F123B] via-[#090D2E] to-[rgb(2,5,21)] text-white">
    //   <div className="p-8 w-full max-w-md border rounded-lg shadow-lg bg-white/5 backdrop-blur-lg border-white/10">
    //     <div className="text-center mb-6">
    //       <h2 className="text-2xl font-bold">Vérifiez votre email</h2>
    //       <p className="mt-2">
    //         Nous avons envoyé un code à 6 chiffres à l'adresse {email}
    //       </p>
    //     </div>

    //     <div className="mb-8 flex flex-col items-center">
    //       <Form {...form}>
    // <FormField
    //   control={form.control}
    //   name="otp"
    //   render={({ field }) => (
    //     <FormItem>
    //       <FormControl>
    //         <InputOTP
    //           maxLength={6}
    //           pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
    //           className="gap-3 justify-center"
    //         >
    //           <InputOTPGroup>
    //             <InputOTPSlot
    //               index={0}
    //               className="w-12 h-12 mr-2 border-2 rounded-md border-gray-300"
    //             />
    //             <InputOTPSlot
    //               index={1}
    //               className="w-12 h-12 mr-2 border-2 rounded-md border-gray-300"
    //             />
    //             <InputOTPSlot
    //               index={2}
    //               className="w-12 h-12 mr-2 border-2 rounded-md border-gray-300"
    //             />
    //             <InputOTPSlot
    //               index={3}
    //               className="w-12 h-12 mr-2 border-2 rounded-md border-gray-300"
    //             />
    //             <InputOTPSlot
    //               index={4}
    //               className="w-12 h-12 mr-2 border-2 rounded-md border-gray-300"
    //             />
    //             <InputOTPSlot
    //               index={5}
    //               className="w-12 h-12 border-2 rounded-md border-gray-300"
    //             />
    //           </InputOTPGroup>
    //         </InputOTP>
    //       </FormControl>
    //     </FormItem>
    //   )}
    // />

    //         {error && (
    //           <div className="p-2 bg-red-100 text-red-700 rounded">{error}</div>
    //         )}

    //         {success && (
    //           <div className="p-2 bg-green-100 text-green-700 rounded">
    //             {success}
    //           </div>
    //         )}
    //         <Button
    //           type="submit"
    //           className="w-full mt-6 bg-blue-500 hover:bg-blue-600"
    //         >
    //           Vérifier
    //         </Button>
    //       </Form>
    //     </div>

    //     <div className="mt-6 text-center">
    //       <p className="text-gray-600">
    //         Vous n'avez pas reçu de code?{" "}
    //         {timeLeft > 0 ? (
    //           <span className="text-gray-500">Renvoyer dans {timeLeft}s</span>
    //         ) : (
    //           <button
    //             onClick={handleResendCode}
    //             className="text-blue-600 font-medium hover:underline"
    //           >
    //             Renvoyer le code
    //           </button>
    //         )}
    //       </p>
    //     </div>
    //   </div>
    // </div>

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

        {/* Afficher le formulaire uniquement si on n'est pas en mode vérification auto
            ou si la vérification auto a échoué */}
        {(!autoVerify || (autoVerify && !isVerifying)) && (
          <div className="mb-8 flex flex-col items-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                          className="gap-3 justify-center"
                        >
                          <InputOTPGroup>
                            <InputOTPSlot
                              index={0}
                              className="w-12 h-12 mr-2 border-2 rounded-md border-gray-300"
                            />
                            <InputOTPSlot
                              index={1}
                              className="w-12 h-12 mr-2 border-2 rounded-md border-gray-300"
                            />
                            <InputOTPSlot
                              index={2}
                              className="w-12 h-12 mr-2 border-2 rounded-md border-gray-300"
                            />
                            <InputOTPSlot
                              index={3}
                              className="w-12 h-12 mr-2 border-2 rounded-md border-gray-300"
                            />
                            <InputOTPSlot
                              index={4}
                              className="w-12 h-12 mr-2 border-2 rounded-md border-gray-300"
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
                  className="w-full mt-6 bg-blue-500 hover:bg-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Vérification..." : "Vérifier"}
                </Button>
              </form>
            </Form>
          </div>
        )}

        {/* Zone pour le message en cas de vérification auto */}
        {autoVerify && isVerifying && (
          <div className="my-6 text-center">
            {isLoading && (
              <div className="flex justify-center">
                {/* Ici vous pouvez ajouter un spinner/loader */}
                <p>Vérification en cours...</p>
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
                <p className="mt-2 text-sm">
                  Redirection vers le tableau de bord...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Section pour renvoyer le code reste identique */}
        <div className="mt-6 text-center">{/* ... */}</div>
      </div>
    </div>
  );
};

export default VerifyEmail;
