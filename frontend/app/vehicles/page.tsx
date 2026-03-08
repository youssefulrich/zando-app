"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import VehicleCard from "@/components/VehicleCard";
import { 
  Car, 
  Users, 
  Shield, 
  Zap, 
  Star, 
  TrendingUp, 
  Search, 
  Sparkles,
  Award,
  CheckCircle2,
  X
} from "lucide-react";

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

  // Parallax effect
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.1]);

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

    // Filtre par catégorie
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="relative h-screen bg-gradient-to-br from-blue-100 to-indigo-200 animate-pulse" />
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchVehicles}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            Réessayer
          </button>
        </motion.div>
      </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <main className="bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-x-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* Background with Parallax */}
        <motion.div 
          className="absolute inset-0"
          style={{ scale: heroScale }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        </motion.div>

        {/* Animated Blobs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Content */}
        <motion.div 
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ opacity: heroOpacity }}
        >
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8"
          >
            <Shield className="w-5 h-5 text-white" />
            <span className="text-white font-medium">500+ véhicules vérifiés et assurés</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight"
          >
            Louez la voiture
            <span className="block mt-2 bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              parfaite pour vous
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto"
          >
            Des voitures récentes, bien entretenues et disponibles partout en Côte d'Ivoire 🇨🇮
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par marque, modèle ou ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/95 backdrop-blur-xl rounded-3xl pl-16 pr-8 py-6 text-gray-900 placeholder:text-gray-500 font-medium shadow-2xl border border-white/20 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all text-lg"
              />
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                  ${selectedCategory === cat.id
                    ? "bg-white text-blue-600 shadow-2xl"
                    : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                  }
                `}
              >
                <cat.icon className="w-5 h-5" />
                {cat.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {[
              { value: "500+", label: "Véhicules" },
              { value: "24/7", label: "Support" },
              { value: "100%", label: "Vérifiés" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ================= RESULTS SECTION ================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              Véhicules disponibles
            </h2>
            <p className="text-lg text-gray-600 flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-blue-600">{filteredVehicles.length}</span>
              {filteredVehicles.length > 1 ? "véhicules trouvés" : "véhicule trouvé"}
            </p>
          </motion.div>

          {/* Results */}
          {filteredVehicles.length === 0 ? (
            
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucun véhicule trouvé
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Essayez de modifier votre recherche ou catégorie
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>

          ) : (
            
            /* Grid with Animations */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <VehicleCard vehicle={vehicle} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Pourquoi louer avec Zando ?
            </h2>
            <p className="text-xl text-gray-600">
              La plateforme de location automobile de confiance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Assurance incluse",
                desc: "Tous nos véhicules sont assurés tous risques",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Zap,
                title: "Réservation rapide",
                desc: "Louez en quelques clics, confirmé instantanément",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Star,
                title: "Véhicules premium",
                desc: "Des voitures récentes et bien entretenues",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: TrendingUp,
                title: "Prix transparents",
                desc: "Pas de frais cachés, tout est clair dès le départ",
                color: "from-purple-500 to-pink-500"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all text-center"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <Award className="w-16 h-16 text-white mx-auto mb-6" />
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Prêt à prendre la route ?
          </h2>
          
          <p className="text-xl text-white/90 mb-10">
            Réservez votre véhicule en quelques clics et partez à l'aventure
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-5 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all">
              Réserver maintenant
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}