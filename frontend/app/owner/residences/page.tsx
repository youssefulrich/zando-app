"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { 
  Plus, 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock,
  TrendingUp,
  Search,
  Filter,
  Grid3x3,
  LayoutList,
  Star,
  CheckCircle2
} from "lucide-react";

interface Residence {
  id: number;
  title: string;
  city: string;
  neighborhood: string;
  price_per_night: number;
  bedrooms: number;
  bathrooms: number;
  is_active: boolean;
  images: Array<{ image: string }>;
  bookings_count?: number;
  rating_average?: number;
  reviews_count?: number;
}

export default function OwnerResidencesPage() {
  const router = useRouter();
  const [residences, setResidences] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchMyResidences();
  }, []);

  const fetchMyResidences = async () => {
    try {
      setLoading(true);
      const res = await api.get("residences/?owner=me");
      setResidences(res.data);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette résidence ?")) {
      return;
    }

    try {
      await api.delete(`residences/${id}/`);
      alert("✓ Résidence supprimée avec succès");
      fetchMyResidences();
    } catch (err: any) {
      alert(err.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`residences/${id}/`, {
        is_active: !currentStatus,
      });
      fetchMyResidences();
    } catch (err) {
      alert("Erreur lors de la modification");
    }
  };

  const filteredResidences = residences.filter((residence) => {
    const matchesSearch = residence.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         residence.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         residence.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && residence.is_active) ||
                         (statusFilter === "inactive" && !residence.is_active);
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: residences.length,
    active: residences.filter(r => r.is_active).length,
    inactive: residences.filter(r => !r.is_active).length,
    totalBookings: residences.reduce((sum, r) => sum + (r.bookings_count || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          <Home className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-orange-600 animate-pulse" />
        </div>
        <p className="mt-4 text-gray-600 font-medium">Chargement de vos résidences...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Mes Résidences
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Home className="w-4 h-4" />
            Gérez vos logements disponibles à la location
          </p>
        </div>

        <Link
          href="/owner/residences/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter une résidence</span>
        </Link>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: Home, color: "from-blue-500 to-cyan-500" },
          { label: "Actives", value: stats.active, icon: CheckCircle2, color: "from-green-500 to-emerald-500" },
          { label: "Inactives", value: stats.inactive, icon: Lock, color: "from-gray-500 to-gray-600" },
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
              placeholder="Rechercher par titre, ville ou quartier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
            />
          </div>
        </div>

        {/* Filters & View */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          
          {/* Status Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            {[
              { id: "all", label: "Toutes", count: stats.total },
              { id: "active", label: "Actives", count: stats.active },
              { id: "inactive", label: "Inactives", count: stats.inactive },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id as any)}
                className={`
                  px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2
                  ${statusFilter === filter.id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
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
                viewMode === "grid" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"
              }`}
            >
              <LayoutList className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= LISTE ================= */}
      <AnimatePresence mode="wait">
        {filteredResidences.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-200 p-12 text-center"
          >
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery || statusFilter !== "all" ? "Aucun résultat" : "Aucune résidence"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== "all"
                ? "Essayez de modifier vos filtres"
                : "Commencez par ajouter votre première résidence"
              }
            </p>
            <Link
              href="/owner/residences/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              Ajouter ma première résidence
            </Link>
          </motion.div>
        ) : (
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredResidences.map((residence, index) => (
              <motion.div
                key={residence.id}
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
                        src={residence.images?.[0]?.image || "https://via.placeholder.com/400x300?text=Residence"}
                        alt={residence.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        {residence.is_active ? (
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-full text-xs font-bold shadow-lg">
                            <Lock className="w-3 h-3" />
                            Inactive
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                        <span className="text-lg font-black text-orange-600">
                          {residence.price_per_night ? Number(residence.price_per_night).toLocaleString() : "0"} FCFA
                        </span>
                        <span className="text-xs text-gray-600 ml-1">/ nuit</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      
                      {/* Title */}
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                        {residence.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span className="line-clamp-1">{residence.city} • {residence.neighborhood}</span>
                      </div>

                      {/* Details */}
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold">{residence.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold">{residence.bathrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold">{residence.bookings_count || 0}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/owner/residences/${residence.id}/edit`}
                          className="flex items-center justify-center gap-1 px-3 py-2 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Modifier
                        </Link>
                        
                        <button
                          onClick={() => toggleStatus(residence.id, residence.is_active)}
                          className="flex items-center justify-center gap-1 px-3 py-2 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-sm font-medium"
                        >
                          {residence.is_active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          {residence.is_active ? "Désactiver" : "Activer"}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Link
                          href={`/residences/${residence.id}`}
                          target="_blank"
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          Voir
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(residence.id)}
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
                        src={residence.images?.[0]?.image || "https://via.placeholder.com/400x300?text=Residence"}
                        alt={residence.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        {residence.is_active ? (
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-full text-xs font-bold">
                            <Lock className="w-3 h-3" />
                            Inactive
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col h-full">
                        
                        {/* Header */}
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-gray-900 mb-2">
                            {residence.title}
                          </h3>

                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                            <MapPin className="w-4 h-4 text-orange-500" />
                            <span>{residence.city} • {residence.neighborhood}</span>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Prix / nuit</p>
                              <p className="font-bold text-orange-600">
                                {residence.price_per_night ? Number(residence.price_per_night).toLocaleString() : "0"} FCFA
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Chambres</p>
                              <p className="font-semibold flex items-center gap-1">
                                <Bed className="w-4 h-4 text-gray-400" />
                                {residence.bedrooms}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Salles de bain</p>
                              <p className="font-semibold flex items-center gap-1">
                                <Bath className="w-4 h-4 text-gray-400" />
                                {residence.bathrooms}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Réservations</p>
                              <p className="font-semibold flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {residence.bookings_count || 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/owner/residences/${residence.id}/edit`}
                            className="flex items-center gap-1 px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-sm font-medium"
                          >
                            <Edit className="w-4 h-4" />
                            Modifier
                          </Link>
                          
                          <button
                            onClick={() => toggleStatus(residence.id, residence.is_active)}
                            className="flex items-center gap-1 px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-sm font-medium"
                          >
                            {residence.is_active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            {residence.is_active ? "Désactiver" : "Activer"}
                          </button>

                          <Link
                            href={`/residences/${residence.id}`}
                            target="_blank"
                            className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            Voir l'annonce
                          </Link>
                          
                          <button
                            onClick={() => handleDelete(residence.id)}
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