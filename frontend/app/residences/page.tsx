"use client";

import { useEffect, useState } from "react";
import ResidenceCard from "@/components/ResidenceCard";
import SearchBar from "@/components/SearchBar";
import FilterSidebar from "@/components/FilterSidebar";
import {
  Search,
  SlidersHorizontal,
  X,
  Home,
  Star,
} from "lucide-react";

/* ================= TYPES ================= */

export interface Residence {
  id: number;
  title: string;
  description: string;
  city: string;
  neighborhood: string;
  type: string;
  price_per_night: number;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  rating_average: number;
  reviews_count: number;
  images: Array<{ image: string; is_primary: boolean }>;
  has_wifi: boolean;
  has_ac: boolean;
  has_pool: boolean;
  has_parking: boolean;
  has_kitchen?: boolean;
  has_tv?: boolean;
  has_security?: boolean;
  has_generator?: boolean;
}

export interface SearchParams {
  city: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
}

/* ================= COMPONENT ================= */

export default function ResidencesPage() {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [filteredResidences, setFilteredResidences] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchResidences();
  }, []);

  const fetchResidences = async () => {
    try {
      setLoading(true);

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://zando-backend.onrender.com";

      const res = await fetch(`${API_URL}/api/residences/`);

      if (!res.ok) {
        throw new Error("Erreur API");
      }

      const data = await res.json();
      setResidences(data);
      setFilteredResidences(data);
    } catch (err) {
      alert("Impossible de charger les résidences.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */

  const handleSearch = (params: SearchParams) => {
    setFilteredResidences(
      residences.filter((r) => {
        if (
          params.city &&
          !r.city.toLowerCase().includes(params.city.toLowerCase())
        )
          return false;
        if (params.type && r.type !== params.type) return false;
        if (
          params.minPrice &&
          r.price_per_night < Number(params.minPrice)
        )
          return false;
        if (
          params.maxPrice &&
          r.price_per_night > Number(params.maxPrice)
        )
          return false;
        if (params.bedrooms && r.bedrooms < Number(params.bedrooms))
          return false;
        return true;
      })
    );
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Chargement...</p>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HERO ================= */}
      <section className="relative h-[60vh] flex items-center justify-center text-center bg-black text-white">

        <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/60" />

        <div className="relative z-10 px-6 max-w-4xl">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 px-4 py-2 rounded-full flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              1000+ logements vérifiés
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Trouvez votre résidence idéale
          </h1>

          <p className="mb-8 text-gray-200">
            Appartements • Villas • Studios partout en Côte d'Ivoire 🇨🇮
          </p>

          <div className="bg-white rounded-2xl shadow-2xl p-4">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">
              Logements disponibles
            </h2>
            <p className="text-gray-600">
              <span className="text-orange-600 font-semibold">
                {filteredResidences.length}
              </span>{" "}
              résultats
            </p>
          </div>

          {/* MOBILE FILTER BUTTON */}
          <button
            onClick={() => setShowFilters(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-xl"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filtres
          </button>
        </div>

        <div className="flex gap-8">

          {/* DESKTOP SIDEBAR */}
          <aside className="hidden md:block w-80">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <FilterSidebar
                onFilterChange={handleSearch}
                onReset={() => setFilteredResidences(residences)}
                searchParams={{
                  city: "",
                  type: "",
                  minPrice: "",
                  maxPrice: "",
                  bedrooms: "",
                }}
              />
            </div>
          </aside>

          {/* RESULTS */}
          <main className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredResidences.map((residence) => (
              <div
                key={residence.id}
                className="transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl"
              >
                <ResidenceCard residence={residence} />
              </div>
            ))}
          </main>
        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          showFilters ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setShowFilters(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
            showFilters ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Filtres</h3>
              <button onClick={() => setShowFilters(false)}>
                <X />
              </button>
            </div>

            <FilterSidebar
              onFilterChange={handleSearch}
              onReset={() => setFilteredResidences(residences)}
              searchParams={{
                city: "",
                type: "",
                minPrice: "",
                maxPrice: "",
                bedrooms: "",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}