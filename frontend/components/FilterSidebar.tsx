"use client";

import { SearchParams } from "@/app/residences/page";

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

  return (
    <div className="bg-white rounded-xl shadow-md p-5 space-y-4">

      <h3 className="text-lg font-bold mb-3">Filtres</h3>

      <input
        placeholder="Ville"
        value={searchParams.city}
        onChange={(e) => handleChange("city", e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      />

      <input
        type="number"
        placeholder="Prix min"
        value={searchParams.minPrice}
        onChange={(e) => handleChange("minPrice", e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      />

      <input
        type="number"
        placeholder="Prix max"
        value={searchParams.maxPrice}
        onChange={(e) => handleChange("maxPrice", e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      />

      <input
        type="number"
        placeholder="Chambres"
        value={searchParams.bedrooms}
        onChange={(e) => handleChange("bedrooms", e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      />

      <button
        onClick={onReset}
        className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
      >
        Réinitialiser
      </button>
    </div>
  );
}
