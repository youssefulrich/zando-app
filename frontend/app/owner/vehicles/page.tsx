"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { 
  Plus, 
  Car, 
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Search,
  Filter,
  Grid3x3,
  LayoutList,
  CheckCircle2,
  Gauge,
  Fuel,
  Settings,
  TrendingUp
} from "lucide-react";

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  category: string;
  price_per_day: number;
  is_available: boolean;
  images: Array<{ image: string }>;
  bookings: number;
  transmission?: string;
  fuel_type?: string;
  seats?: number;
}

export default function OwnerVehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "unavailable">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      setLoading(true);
      const res = await api.get("vehicles/?owner=me");
      setVehicles(res.data);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce véhicule ?")) {
      return;
    }

    try {
      await api.delete(`vehicles/${id}/`);
      alert("✓ Véhicule supprimé avec succès");
      fetchMyVehicles();
    } catch (err: any) {
      alert(err.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  const toggleAvailability = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`vehicles/${id}/`, {
        is_available: !currentStatus,
      });
      fetchMyVehicles();
    } catch (err) {
      alert("Erreur lors de la modification");
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = 
      vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "available" && vehicle.is_available) ||
      (statusFilter === "unavailable" && !vehicle.is_available);
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.is_available).length,
    unavailable: vehicles.filter(v => !v.is_available).length,
    totalBookings: vehicles.reduce((sum, v) => sum + (v.bookings || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <Car className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
        </div>
        <p className="mt-4 text-gray-600 font-medium">Chargement de vos véhicules...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Mes Véhicules
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Car className="w-4 h-4" />
            Gérez votre flotte de véhicules à louer
          </p>
        </div>

        <Link
          href="/owner/vehicles/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un véhicule</span>
        </Link>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: Car, color: "from-blue-500 to-cyan-500" },
          { label: "Disponibles", value: stats.available, icon: CheckCircle2, color: "from-green-500 to-emerald-500" },
          { label: "Indisponibles", value: stats.unavailable, icon: Lock, color: "from-gray-500 to-gray-600" },
          { label: "Réservations", value: stats.totalBookings, icon: Calendar, color: "from-purple-500 to-pink-500" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-gray-900">{stat.value}</div>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ================= SEARCH & FILTERS ================= */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par marque, modèle ou catégorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
          </div>
        </div>

        {/* Filters & View */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          
          {/* Status Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            {[
              { id: "all", label: "Tous", count: stats.total },
              { id: "available", label: "Disponibles", count: stats.available },
              { id: "unavailable", label: "Indisponibles", count: stats.unavailable },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id as any)}
                className={`
                  px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2
                  ${statusFilter === filter.id
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {filter.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  statusFilter === filter.id ? 'bg-white/20' : 'bg-white'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
              }`}
            >
              <LayoutList className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= LISTE ================= */}
      <AnimatePresence mode="wait">
        {filteredVehicles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-200 p-12 text-center"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery || statusFilter !== "all" ? "Aucun résultat" : "Aucun véhicule"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== "all"
                ? "Essayez de modifier vos filtres"
                : "Commencez par ajouter votre premier véhicule"
              }
            </p>
            <Link
              href="/owner/vehicles/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              Ajouter mon premier véhicule
            </Link>
          </motion.div>
        ) : (
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
              >
                
                {viewMode === "grid" ? (
                  // ================= GRID VIEW =================
                  <>
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={vehicle.images?.[0]?.image || "https://via.placeholder.com/400x300?text=Vehicle"}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        {vehicle.is_available ? (
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
                            <CheckCircle2 className="w-3 h-3" />
                            Disponible
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-full text-xs font-bold shadow-lg">
                            <Lock className="w-3 h-3" />
                            Indisponible
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                        <span className="text-lg font-black text-blue-600">
                          {vehicle.price_per_day.toLocaleString()} FCFA
                        </span>
                        <span className="text-xs text-gray-600 ml-1">/ jour</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      
                      {/* Category Badge */}
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold mb-3">
                        <Car className="w-3 h-3" />
                        {vehicle.category}
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {vehicle.brand} {vehicle.model}
                      </h3>

                      {/* Year */}
                      <p className="text-sm text-gray-600 mb-4">
                        Année {vehicle.year}
                      </p>

                      {/* Details */}
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        {vehicle.seats && (
                          <div className="flex items-center gap-1">
                            <Settings className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold">{vehicle.seats} places</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold">{vehicle.bookings || 0}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/owner/vehicles/${vehicle.id}/edit`}
                          className="flex items-center justify-center gap-1 px-3 py-2 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Modifier
                        </Link>
                        
                        <button
                          onClick={() => toggleAvailability(vehicle.id, vehicle.is_available)}
                          className="flex items-center justify-center gap-1 px-3 py-2 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-sm font-medium"
                        >
                          {vehicle.is_available ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          {vehicle.is_available ? "Désactiver" : "Activer"}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Link
                          href={`/vehicles/${vehicle.id}`}
                          target="_blank"
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          Voir
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  // ================= LIST VIEW =================
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative w-full sm:w-64 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                      <img
                        src={vehicle.images?.[0]?.image || "https://via.placeholder.com/400x300?text=Vehicle"}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        {vehicle.is_available ? (
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            Disponible
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-full text-xs font-bold">
                            <Lock className="w-3 h-3" />
                            Indisponible
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col h-full">
                        
                        {/* Header */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold mb-2">
                                <Car className="w-3 h-3" />
                                {vehicle.category}
                              </div>
                              <h3 className="font-bold text-xl text-gray-900">
                                {vehicle.brand} {vehicle.model}
                              </h3>
                              <p className="text-sm text-gray-600">Année {vehicle.year}</p>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Prix / jour</p>
                              <p className="font-bold text-blue-600">
                                {vehicle.price_per_day.toLocaleString()} FCFA
                              </p>
                            </div>
                            {vehicle.seats && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Places</p>
                                <p className="font-semibold flex items-center gap-1">
                                  <Settings className="w-4 h-4 text-gray-400" />
                                  {vehicle.seats}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Réservations</p>
                              <p className="font-semibold flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {vehicle.bookings || 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/owner/vehicles/${vehicle.id}/edit`}
                            className="flex items-center gap-1 px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-sm font-medium"
                          >
                            <Edit className="w-4 h-4" />
                            Modifier
                          </Link>
                          
                          <button
                            onClick={() => toggleAvailability(vehicle.id, vehicle.is_available)}
                            className="flex items-center gap-1 px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-sm font-medium"
                          >
                            {vehicle.is_available ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            {vehicle.is_available ? "Désactiver" : "Activer"}
                          </button>

                          <Link
                            href={`/vehicles/${vehicle.id}`}
                            target="_blank"
                            className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            Voir l'annonce
                          </Link>
                          
                          <button
                            onClick={() => handleDelete(vehicle.id)}
                            className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium ml-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}