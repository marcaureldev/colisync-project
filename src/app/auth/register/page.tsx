"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
    } else {
      setError("");
    }
  }, [password, confirmPassword]);
  const onSubmit = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    const data = {
      email,
      name,
      password,
    };
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success === false) {
        setError(result.error);
      }
      router.push(result.redirectUrl);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className="h-screen">
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-r from-[#0F123B] via-[#090D2E] to-[rgb(2,5,21)] ">
        <div className="flex flex-col items-center justify-center text-white text-center border p-8 rounded-lg shadow-lg bg-white/5 backdrop-blur-lg border-white/10 h-[550px] w-[400px]">
          <h1 className="text-3xl text-white font-bold">Créer un compte</h1>
          <p className="text-gray-400 mt-4 text-xs">
            Veuillez remplir le formulaire suivant pour créer votre compte
          </p>
          <form className="flex flex-col items-center justify-center w-full max-w-md mt-8 space-y-6">
            <input
              type="email"
              placeholder="Entrez votre adresse email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10"
            />
            <input
              type="text"
              placeholder="Entrez votre nom et prénom"
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10"
            />
            <input
              type="password"
              placeholder="Entrez un mot de passe"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10"
            />
            <input
              type="password"
              placeholder="Confirmez le mot de passe"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </form>
          <div className="mt-2.5">
            <button
              onClick={onSubmit}
              className="w-full p-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-400"
            >
              S'inscrire
            </button>

            <p className="text-xs mt-5">
              Vous avez déjà un compte?{" "}
              <Link href="/login">Connectez-vous</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default register;
