"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ResidenceCard from "@/components/ResidenceCard";
import SearchBar from "@/components/SearchBar";
import FilterSidebar from "@/components/FilterSidebar";
import { Search, SlidersHorizontal, X, MapPin, Home, Star } from "lucide-react";

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
      const res = await api.get("residences/");
      setResidences(res.data);
      setFilteredResidences(res.data);
    } catch (err) {
      console.error("Erreur fetch:", err);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Skeleton */}
        <div className="relative h-[60vh] md:h-[70vh] bg-gradient-to-br from-orange-100 to-orange-200 animate-pulse" />
        
        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="h-64 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">

      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        
        {/* Background Image - Optimized for mobile */}
        <div className="absolute inset-0">
          <picture>
            {/* Mobile */}
            <source 
              media="(max-width: 768px)" 
              srcSet="/hero-home-mobile.jpg, /hero-home-mobile@2x.jpg 2x" 
            />
            {/* Desktop */}
            <source 
              media="(min-width: 769px)" 
              srcSet="/hero-home.jpg, /hero-home@2x.jpg 2x" 
            />
            <img 
              src="/hero-home.jpg" 
              alt="Résidences de luxe en Côte d'Ivoire"
              className="w-full h-full object-cover"
            />
          </picture>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 text-white text-sm font-medium">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>Plus de 1000+ logements vérifiés</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Trouvez votre
            <span className="block bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              résidence idéale
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Appartements • Villas • Studios • Duplex
            <span className="block mt-2">partout en Côte d'Ivoire 🇨🇮</span>
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 md:p-6 border border-white/20">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">1000+</div>
              <div className="text-sm text-gray-300">Logements</div>
            </div>
            <div className="text-center border-x border-white/20">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-sm text-gray-300">Villes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">5★</div>
              <div className="text-sm text-gray-300">Note moyenne</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ================= CONTENT SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Header with Filters Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Logements disponibles
            </h2>
            <p className="text-gray-600 flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="font-medium text-orange-600">{filteredResidences.length}</span> 
              {filteredResidences.length > 1 ? "résidences trouvées" : "résidence trouvée"}
            </p>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-all shadow-sm"
          >
            {showFilters ? (
              <>
                <X className="w-5 h-5" />
                <span className="font-medium">Fermer filtres</span>
              </>
            ) : (
              <>
                <SlidersHorizontal className="w-5 h-5" />
                <span className="font-medium">Filtres</span>
              </>
            )}
          </button>
        </div>

        {/* Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar - Filters */}
          <aside className={`
            ${showFilters ? "block" : "hidden"} 
            md:block w-full md:w-80 flex-shrink-0
          `}>
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-orange-500" />
                    Filtres
                  </h3>
                  <button
                    onClick={() => setFilteredResidences(residences)}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Réinitialiser
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
          </aside>

          {/* Main Content - Results */}
          <main className="flex-1 min-w-0">
            
            {filteredResidences.length === 0 ? (
              
              /* Empty State */
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Aucun logement trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Essayez d'ajuster vos filtres pour voir plus de résultats
                </p>
                <button
                  onClick={() => setFilteredResidences(residences)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium"
                >
                  Réinitialiser les filtres
                </button>
              </div>

            ) : (
              
              /* Results Grid */
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredResidences.map((residence, index) => (
                  <div
                    key={residence.id}
                    className="group"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                      <ResidenceCard residence={residence} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More (if needed) */}
            {filteredResidences.length > 0 && filteredResidences.length >= 12 && (
              <div className="mt-12 text-center">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-all font-medium text-gray-700 hover:text-orange-600 shadow-sm">
                  Voir plus de logements
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ================= FEATURES SECTION ================= */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Zando ?
            </h2>
            <p className="text-lg text-gray-600">
              La plateforme de location la plus fiable en Côte d'Ivoire
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🛡️",
                title: "Paiement sécurisé",
                desc: "Vos transactions sont protégées par Orange Money, Wave et MTN"
              },
              {
                icon: "✅",
                title: "Logements vérifiés",
                desc: "Tous nos logements sont inspectés et validés par notre équipe"
              },
              {
                icon: "💬",
                title: "Support 24/7",
                desc: "Notre équipe est disponible à tout moment pour vous aider"
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}