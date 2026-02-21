import { useState } from "react";

interface SearchBarProps {
  onSearch: (params: any) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    onSearch({
      city,
      type,
      startDate,
      endDate,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Ville */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ville
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Toutes les villes</option>
            <option value="abidjan">Abidjan</option>
            <option value="yamoussoukro">Yamoussoukro</option>
            <option value="bouake">Bouaké</option>
            <option value="san_pedro">San-Pédro</option>
            <option value="korhogo">Korhogo</option>
            <option value="daloa">Daloa</option>
            <option value="man">Man</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de logement
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Tous les types</option>
            <option value="appartement">Appartement</option>
            <option value="villa">Villa</option>
            <option value="maison">Maison</option>
            <option value="studio">Studio</option>
            <option value="duplex">Duplex</option>
          </select>
        </div>

        {/* Date d'arrivée */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Arrivée
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Date de départ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Départ
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Bouton rechercher */}
      <div className="mt-4">
        <button
          onClick={handleSearch}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md"
        >
          🔍 Rechercher
        </button>
      </div>
    </div>
  );
}