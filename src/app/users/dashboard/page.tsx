import React from "react";

const page = () => {
  return (
    <div className="">
      {/* Conteneur principal de la page dashboard */}
      <div className="bg-white dark:bg-white/5 dark:backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg p-2 sm:p-4 shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Tableau de bord
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte statistiques */}
          <div className="bg-gray-50 dark:bg-white/5 dark:backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Total des colis
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              0
            </p>
          </div>

          {/* Carte statistiques */}
          <div className="bg-gray-50 dark:bg-white/5 dark:backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              En transit
            </h3>
            <p className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">
              0
            </p>
          </div>

          {/* Carte statistiques */}
          <div className="bg-gray-50 dark:bg-white/5 dark:backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Livrés
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
