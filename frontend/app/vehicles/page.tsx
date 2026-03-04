"use client";

import { useEffect, useState } from "react";
import VehicleCard from "@/components/VehicleCard";
import { Car, Users, Shield, Zap, Star, TrendingUp, Search, SlidersHorizontal } from "lucide-react";

/* ================= TYPES ================= */

interface Vehicle {
  id: number;
  title: string;
  brand: string;
  model: string;
  year: number;
  city: string;
  price_per_day: number;
  seats: number;
  transmission: string;
  fuel_type: string;
  images: Array<{ image: string; is_primary?: boolean }>;
}

/* ================= COMPONENT ================= */

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  /* ================= FETCH PUBLIC ================= */

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://zando-backend.onrender.com';
      const res = await fetch(`${API_URL}/api/vehicles/`);
      
      if (!res.ok) throw new Error('Erreur de chargement');
      
      const data = await res.json();
      console.log('Véhicules chargés:', data.length);
      
      setVehicles(data);
      setFilteredVehicles(data);
    } catch (err: any) {
      console.error('Erreur fetch véhicules:', err);
      setError(err.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */

  useEffect(() => {
    let filtered = vehicles;

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(v => 
        v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par catégorie (basé sur le nombre de places)
    if (selectedCategory !== "all") {
      if (selectedCategory === "compact") {
        filtered = filtered.filter(v => v.seats <= 5);
      } else if (selectedCategory === "suv") {
        filtered = filtered.filter(v => v.seats > 5 && v.seats <= 7);
      } else if (selectedCategory === "minibus") {
        filtered = filtered.filter(v => v.seats > 7);
      }
    }

    setFilteredVehicles(filtered);
  }, [searchQuery, selectedCategory, vehicles]);

  const categories = [
    { id: "all", label: "Tous", icon: Car },
    { id: "compact", label: "Compactes", icon: Car },
    { id: "suv", label: "SUV", icon: Car },
    { id: "minibus", label: "Minibus", icon: Users },
  ];

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Skeleton */}
        <div className="relative h-[60vh] md:h-[70vh] bg-gradient-to-br from-blue-100 to-indigo-200 animate-pulse" />
        
        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="h-56 bg-gray-200 animate-pulse" />
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

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchVehicles}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">

      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[60vh] md:h-[75vh] flex items-center justify-center overflow-hidden">
        
        {/* Background Image */}
        <div className="absolute inset-0">
          <picture>
            <source media="(max-width: 768px)" srcSet="/hero-car-mobile.jpg" />
            <img 
              src="/hero-car.jpg" 
              alt="Véhicules de qualité en Côte d'Ivoire"
              className="w-full h-full object-cover"
            />
          </picture>
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/70 to-purple-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Animated Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 text-white">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Véhicules vérifiés et assurés</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
              Louez la voiture
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                parfaite pour vous
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              Des voitures récentes, bien entretenues et disponibles partout en Côte d'Ivoire 🇨🇮
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par marque, modèle ou ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/95 backdrop-blur-xl rounded-2xl pl-14 pr-6 py-5 text-gray-900 placeholder:text-gray-500 font-medium shadow-2xl border border-white/20 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                  ${selectedCategory === cat.id
                    ? "bg-white text-blue-600 shadow-xl"
                    : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                  }
                `}
              >
                <cat.icon className="w-5 h-5" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">500+</div>
              <div className="text-sm text-gray-300">Véhicules</div>
            </div>
            <div className="text-center border-x border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-gray-300">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-gray-300">Vérifiés</div>
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
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Véhicules disponibles
            </h2>
            <p className="text-gray-600 flex items-center gap-2">
              <Car className="w-4 h-4" />
              <span className="font-medium text-blue-600">{filteredVehicles.length}</span>
              {filteredVehicles.length > 1 ? "véhicules trouvés" : "véhicule trouvé"}
            </p>
          </div>

          {/* Sort (optional) */}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-all">
            <SlidersHorizontal className="w-5 h-5" />
            <span className="font-medium">Trier</span>
          </button>
        </div>

        {/* Results */}
        {filteredVehicles.length === 0 ? (
          
          /* Empty State */
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Aucun véhicule trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier votre recherche ou catégorie
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>

        ) : (
          
          /* Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <VehicleCard vehicle={vehicle} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= TRUST SECTION ================= */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi louer avec Zando ?
            </h2>
            <p className="text-lg text-gray-600">
              La plateforme de location automobile de confiance
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Assurance incluse",
                desc: "Tous nos véhicules sont assurés tous risques"
              },
              {
                icon: Zap,
                title: "Réservation rapide",
                desc: "Louez en quelques clics, confirmé instantanément"
              },
              {
                icon: Star,
                title: "Véhicules premium",
                desc: "Des voitures récentes et bien entretenues"
              },
              {
                icon: TrendingUp,
                title: "Prix transparents",
                desc: "Pas de frais cachés, tout est clair dès le départ"
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-4">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animation */}
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