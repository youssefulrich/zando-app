"use client";

import { SearchParams } from "@/app/residences/page";
import { MapPin, DollarSign, Bed, Home, RotateCcw } from "lucide-react";

interface Props {
  searchParams: SearchParams;
  onFilterChange: (params: SearchParams) => void;
  onReset: () => void;
}

export default function FilterSidebar({
  searchParams,
  onFilterChange,
  onReset,
}: Props) {

  const handleChange = (key: keyof SearchParams, value: string) => {
    onFilterChange({
      ...searchParams,
      [key]: value,
    });
  };

  const cities = [
    { value: "", label: "Toutes les villes" },
    { value: "abidjan", label: "Abidjan" },
    { value: "yamoussoukro", label: "Yamoussoukro" },
    { value: "bouake", label: "Bouaké" },
    { value: "san_pedro", label: "San-Pédro" },
    { value: "korhogo", label: "Korhogo" },
    { value: "daloa", label: "Daloa" },
    { value: "man", label: "Man" },
  ];

  const types = [
    { value: "", label: "Tous les types" },
    { value: "appartement", label: "Appartement" },
    { value: "villa", label: "Villa" },
    { value: "maison", label: "Maison" },
    { value: "studio", label: "Studio" },
    { value: "duplex", label: "Duplex" },
  ];

  const bedroomOptions = [
    { value: "", label: "Peu importe" },
    { value: "1", label: "1+ chambre" },
    { value: "2", label: "2+ chambres" },
    { value: "3", label: "3+ chambres" },
    { value: "4", label: "4+ chambres" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Ville */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <MapPin className="w-4 h-4 text-orange-500" />
          Localisation
        </label>
        <div className="relative">
          <select
            value={searchParams.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="w-full appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-900 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all cursor-pointer hover:border-gray-300"
          >
            {cities.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Type de logement */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <Home className="w-4 h-4 text-orange-500" />
          Type de logement
        </label>
        <div className="relative">
          <select
            value={searchParams.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-900 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all cursor-pointer hover:border-gray-300"
          >
            {types.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Prix */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <DollarSign className="w-4 h-4 text-orange-500" />
          Budget par nuit
        </label>
        <div className="space-y-3">
          <div className="relative">
            <input
              type="number"
              placeholder="Prix minimum"
              value={searchParams.minPrice}
              onChange={(e) => handleChange("minPrice", e.target.value)}
              className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pl-12 text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
              FCFA
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="w-full h-px bg-gray-200" />
            <span className="px-2 text-xs text-gray-400 font-medium">à</span>
            <div className="w-full h-px bg-gray-200" />
          </div>

          <div className="relative">
            <input
              type="number"
              placeholder="Prix maximum"
              value={searchParams.maxPrice}
              onChange={(e) => handleChange("maxPrice", e.target.value)}
              className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pl-12 text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
              FCFA
            </div>
          </div>
        </div>
      </div>

      {/* Chambres */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <Bed className="w-4 h-4 text-orange-500" />
          Chambres
        </label>
        <div className="grid grid-cols-2 gap-2">
          {bedroomOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleChange("bedrooms", option.value)}
              className={`
                px-4 py-3 rounded-xl font-medium text-sm transition-all
                ${searchParams.bedrooms === option.value
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                  : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-gray-100" />

      {/* Résumé des filtres actifs */}
      {(searchParams.city || searchParams.type || searchParams.minPrice || searchParams.maxPrice || searchParams.bedrooms) && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-orange-900 mb-2">
            Filtres actifs :
          </p>
          <div className="flex flex-wrap gap-2">
            {searchParams.city && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-700">
                📍 {cities.find(c => c.value === searchParams.city)?.label}
              </span>
            )}
            {searchParams.type && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-700">
                🏠 {types.find(t => t.value === searchParams.type)?.label}
              </span>
            )}
            {searchParams.bedrooms && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-700">
                🛏️ {searchParams.bedrooms}+ chambres
              </span>
            )}
            {(searchParams.minPrice || searchParams.maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-700">
                💰 {searchParams.minPrice || "0"} - {searchParams.maxPrice || "∞"} FCFA
              </span>
            )}
          </div>
        </div>
      )}

      {/* Bouton Reset */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 text-gray-700 hover:text-orange-600 py-3 rounded-xl font-semibold transition-all group"
      >
        <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
        Réinitialiser les filtres
      </button>
    </div>
  );
}