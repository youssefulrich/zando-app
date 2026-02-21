"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ResidenceCard from "@/components/ResidenceCard";
import SearchBar from "@/components/SearchBar";
import FilterSidebar from "@/components/FilterSidebar";

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

  /* ================= HERO TEXT ANIMATION ================= */

  const texts = [
    "Découvrez Zando",
    "Trouvez votre résidence idéale",
    "Appartements • Villas • Hôtels",
    "Réservez facilement partout en Côte d’Ivoire",
  ];

  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const current = texts[index];
    let i = 0;

    const typing = setInterval(() => {
      setDisplayed(current.slice(0, i));
      i++;

      if (i > current.length) {
        clearInterval(typing);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % texts.length);
        }, 1200);
      }
    }, 35);

    return () => clearInterval(typing);
  }, [index]);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchResidences();
  }, []);

  const fetchResidences = async () => {
    try {
      const res = await api.get("residences/");
      setResidences(res.data);
      setFilteredResidences(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */

  const handleSearch = (params: SearchParams) => {
    setFilteredResidences(
      residences.filter((r) => {
        if (params.city && !r.city.toLowerCase().includes(params.city.toLowerCase()))
          return false;
        if (params.type && r.type !== params.type) return false;
        if (params.minPrice && r.price_per_night < Number(params.minPrice))
          return false;
        if (params.maxPrice && r.price_per_night > Number(params.maxPrice))
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
      <div className="min-h-screen p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HERO ================= */}
      <section className="relative h-[55vh] flex items-center justify-center text-white">

        {/* image */}
        <div className="absolute inset-0 bg-[url('/hero-home.jpg')] bg-cover bg-center" />

        {/* overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center px-6 w-full max-w-4xl">

          {/* TYPEWRITER */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 h-[70px]">
            {displayed}
            <span className="animate-pulse">|</span>
          </h1>

          {/* SEARCH */}
          <div className="bg-white rounded-2xl p-4 shadow-2xl">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-8">

        {/* SIDEBAR */}
        <aside
          className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64`}
        >
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
        </aside>

        {/* MAIN */}
        <main className="flex-1">

          <div className="flex justify-between items-center mb-8">
            <h2 className="font-semibold text-gray-700">
              {filteredResidences.length} logement(s) disponible(s)
            </h2>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              Filtres
            </button>
          </div>

          {filteredResidences.length === 0 ? (
            <p>Aucun logement trouvé</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResidences.map((residence) => (
                <div
                  key={residence.id}
                  className="transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <ResidenceCard residence={residence} />
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
