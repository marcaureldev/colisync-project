"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Building2, User } from "lucide-react";
import { useSearchParams } from "next/navigation";

const EmailVerified = () => {
  const searchParams = useSearchParams();
  const userRole = searchParams?.get("role");
  const userStatus = searchParams?.get("status");

  const getRoleInfo = () => {
    if (userRole === "COMPANY") {
      return {
        icon: <Building2 className="h-12 w-12 text-blue-500" />,
        title: "Compte entreprise créé",
        description: "Votre compte entreprise a été créé avec succès.",
        message: "Votre compte sera activé après validation par un administrateur. Vous recevrez un email de confirmation une fois validé."
      };
    } else if (userRole === "AGENT_GARE") {
      return {
        icon: <User className="h-12 w-12 text-green-500" />,
        title: "Compte agent créé",
        description: "Votre compte agent de gare a été créé avec succès.",
        message: "Votre compte sera activé après validation par un administrateur. Vous recevrez un email de confirmation une fois validé."
      };
    }
    return {
      icon: <CheckCircle className="h-12 w-12 text-green-500" />,
      title: "Email vérifié",
      description: "Votre email a été vérifié avec succès.",
      message: "Votre compte est maintenant actif et vous pouvez vous connecter."
    };
  };

  const roleInfo = getRoleInfo();

  return (
    <section className="h-screen">
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-r from-[#0F123B] via-[#090D2E] to-[rgb(2,5,21)]">
        <div className="flex flex-col items-center justify-center text-white text-center border p-8 rounded-lg shadow-lg bg-white/5 backdrop-blur-lg border-white/10 w-[500px]">
          <div className="mb-6">
            {roleInfo.icon}
          </div>
          
          <h1 className="text-3xl text-white font-bold mb-4">
            {roleInfo.title}
          </h1>
          
          <div className="w-full p-4 bg-green-500/10 border border-green-500/20 rounded-lg mb-6">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-green-400 font-medium">Email vérifié</span>
            </div>
            <p className="text-sm text-gray-300">
              Votre adresse email a été vérifiée avec succès.
            </p>
          </div>

          {userStatus === "PENDING" && (
            <div className="w-full p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-6">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-blue-400 font-medium">En attente de validation</span>
              </div>
              <p className="text-sm text-gray-300">
                {roleInfo.message}
              </p>
            </div>
          )}
          
          <p className="text-gray-400 mb-6">
            {roleInfo.description}
          </p>
          
          <div className="flex gap-4 w-full">
            <Button 
              asChild
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Link href="/auth/login">
                Se connecter
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              <Link href="/">
                Retour à l'accueil
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-xs text-yellow-300">
              <strong>Note :</strong> 
              {userStatus === "PENDING" 
                ? " Vous ne pourrez pas vous connecter tant que votre compte n'est pas validé par un administrateur."
                : " Vous pouvez maintenant vous connecter à votre compte."
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailVerified;
