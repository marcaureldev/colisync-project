import { useRouter } from "next/navigation";
import { useState } from "react";

interface UseAuth {
  logout: () => Promise<void>;
  isLoggingOut: boolean;
  error: string | null;
}

export const useAuth = (): UseAuth => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const logout = async (): Promise<void> => {
    setIsLoggingOut(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem("reservationFormData");
        localStorage.removeItem("reservationCurrentStep");
        localStorage.removeItem("theme");
        sessionStorage.clear();

        router.push("/auth/login");
        router.refresh();
      } else {
        setError(data.error || "Erreur lors de la déconnexion");
      }
    } catch (err) {
      console.error("Erreur de déconnexion:", err);
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    logout,
    isLoggingOut,
    error,
  };
};
