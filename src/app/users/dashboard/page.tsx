import React from 'react'

const page = () => {
  return (
    <div className="">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-2 sm:p-4">
        <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte statistiques */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Total des colis</h3>
            <p className="text-3xl font-bold text-blue-400">0</p>
          </div>
          
          {/* Carte statistiques */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">En transit</h3>
            <p className="text-3xl font-bold text-yellow-400">0</p>
          </div>
          
          {/* Carte statistiques */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Livrés</h3>
            <p className="text-3xl font-bold text-green-400">0</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page