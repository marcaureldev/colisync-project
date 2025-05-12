import Link from "next/link";
import React from "react";

const register = () => {
  return (
    <section className="h-screen">
      {/* <div className="bg-[url(/images/register.svg)] bg-no-repeat bg-cover bg- h-full w-1/2"></div> */}
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
              className="w-full p-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10"
            />
            <input
              type="text"
              placeholder="Entrez votre nom et prénom"
              className="w-full p-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10"
            />
            <input
              type="password"
              placeholder="Entrez un mot de passe"
              className="w-full p-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10"
            />
            <input
              type="password"
              placeholder="Confirmez le mot de passe"
              className="w-full p-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10"
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded-lg"
            >
              S'inscrire
            </button>

            <p className="text-xs mt-5">
              Vous avez déjà un compte?{" "}
              <Link href="/login">Connectez-vous</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default register;
