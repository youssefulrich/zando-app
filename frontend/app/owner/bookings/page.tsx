"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { 
  Calendar, 
  User, 
  Clock, 
  DollarSign, 
  Check, 
  X, 
  Phone, 
  Mail,
  MapPin,
  Car,
  Home,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  Download,
  RefreshCw
} from "lucide-react";

interface Booking {
  id: number;
  booking_number: string;
  client: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
  };
  vehicle?: {
    brand: string;
    model: string;
  };
  residence?: {
    title: string;
  };
  start_date: string;
  end_date: string;
  duration: number;
  total_price: number;
  status: string;
  created_at: string;
}

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("bookings/received/");
      setBookings(res.data);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleAccept = async (id: number) => {
    if (!confirm("Voulez-vous accepter cette réservation ?")) return;

    try {
      await api.post(`bookings/${id}/accept/`);
      alert("✓ Réservation acceptée");
      fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.error || "Erreur");
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("Raison du refus (optionnel) :");
    if (reason === null) return;

    try {
      await api.post(`bookings/${id}/reject/`, { reason });
      alert("Réservation refusée");
      fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.error || "Erreur");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter = filter === "all" || booking.status === filter;
    const matchesSearch = 
      booking.booking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.client.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.client.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.client.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
  };

  const filterOptions = [
    { id: "all", label: "Toutes", count: stats.total, color: "bg-gray-100 text-gray-700", activeColor: "bg-gradient-to-r from-gray-600 to-gray-700" },
    { id: "pending", label: "En attente", count: stats.pending, color: "bg-yellow-50 text-yellow-700", activeColor: "bg-gradient-to-r from-yellow-500 to-orange-500", icon: AlertCircle },
    { id: "confirmed", label: "Confirmées", count: stats.confirmed, color: "bg-green-50 text-green-700", activeColor: "bg-gradient-to-r from-green-500 to-emerald-500", icon: CheckCircle2 },
    { id: "completed", label: "Terminées", count: stats.completed, color: "bg-blue-50 text-blue-700", activeColor: "bg-gradient-to-r from-blue-500 to-indigo-500", icon: CheckCircle2 },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          <Calendar className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-orange-600 animate-pulse" />
        </div>
        <p className="mt-4 text-gray-600 font-medium">Chargement des réservations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Réservations Reçues
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Gérez les demandes de vos clients
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className={`p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-all shadow-sm ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5 text-gray-700" />
          </button>
          
          <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
        </div>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: Calendar, color: "from-blue-500 to-cyan-500" },
          { label: "En attente", value: stats.pending, icon: AlertCircle, color: "from-yellow-500 to-orange-500" },
          { label: "Confirmées", value: stats.confirmed, icon: CheckCircle2, color: "from-green-500 to-emerald-500" },
          { label: "Terminées", value: stats.completed, icon: CheckCircle2, color: "from-purple-500 to-pink-500" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
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
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par numéro, client, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <div className="flex gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all flex-shrink-0 shadow-sm
                  ${filter === option.id
                    ? `${option.activeColor} text-white shadow-lg`
                    : `${option.color} hover:shadow-md`
                  }
                `}
              >
                {option.icon && <option.icon className="w-4 h-4" />}
                <span>{option.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  filter === option.id ? 'bg-white/20' : 'bg-white'
                }`}>
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= BOOKINGS LIST ================= */}
      <AnimatePresence mode="wait">
        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-200 p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery ? "Aucun résultat" : "Aucune réservation"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? "Essayez de modifier votre recherche"
                : "Vous n'avez pas encore reçu de réservation"
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-semibold"
              >
                Réinitialiser la recherche
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="p-6">
                  
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-xl ${booking.vehicle ? 'bg-blue-50' : 'bg-orange-50'}`}>
                          {booking.vehicle ? (
                            <Car className={`w-5 h-5 ${booking.vehicle ? 'text-blue-600' : 'text-orange-600'}`} />
                          ) : (
                            <Home className="w-5 h-5 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900">
                            {booking.vehicle
                              ? `${booking.vehicle.brand} ${booking.vehicle.model}`
                              : booking.residence?.title}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <span>Réf:</span>
                            <code className="px-2 py-0.5 bg-gray-100 rounded font-mono text-xs">
                              {booking.booking_number}
                            </code>
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    <div className="text-right">
                      <div className="inline-flex flex-col items-end p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
                        <p className="text-3xl font-black text-orange-600 mb-1">
                          {booking.total_price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">FCFA</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {booking.duration} jour{booking.duration > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    
                    {/* Client */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-semibold text-gray-500 uppercase">Client</span>
                      </div>
                      <p className="font-bold text-gray-900 mb-1">
                        {booking.client.first_name} {booking.client.last_name}
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {booking.client.email}
                        </p>
                        {booking.client.phone_number && (
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {booking.client.phone_number}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Period */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-semibold text-gray-500 uppercase">Période</span>
                      </div>
                      <p className="font-bold text-gray-900 mb-1">
                        {new Date(booking.start_date).toLocaleDateString("fr-FR", {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        au {new Date(booking.end_date).toLocaleDateString("fr-FR", {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                        <Clock className="w-3 h-3" />
                        {booking.duration} jour{booking.duration > 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Created */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-semibold text-gray-500 uppercase">Demande reçue</span>
                      </div>
                      <p className="font-bold text-gray-900 mb-1">
                        {new Date(booking.created_at).toLocaleDateString("fr-FR", {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-600">
                        à {new Date(booking.created_at).toLocaleTimeString("fr-FR", {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status === "pending" && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleAccept(booking.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                      >
                        <Check className="w-5 h-5" />
                        Accepter la réservation
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                      >
                        <X className="w-5 h-5" />
                        Refuser
                      </button>
                    </div>
                  )}

                  {booking.status === "confirmed" && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-start gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-green-900 mb-1">Réservation confirmée</p>
                          <p className="text-sm text-green-700">
                            Le client récupérera le {new Date(booking.start_date).toLocaleDateString("fr-FR", {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {booking.status === "completed" && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        <p className="text-sm font-medium text-blue-900">
                          Réservation terminée avec succès
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; icon: any; color: string }> = {
    pending: { 
      label: "En attente", 
      icon: AlertCircle, 
      color: "bg-gradient-to-r from-yellow-400 to-orange-400 text-white" 
    },
    confirmed: { 
      label: "Confirmée", 
      icon: CheckCircle2, 
      color: "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
    },
    completed: { 
      label: "Terminée", 
      icon: CheckCircle2, 
      color: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" 
    },
    cancelled: { 
      label: "Annulée", 
      icon: XCircle, 
      color: "bg-gradient-to-r from-red-500 to-pink-500 text-white" 
    },
    paid: { 
      label: "Payée", 
      icon: DollarSign, 
      color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
    },
  };

  const current = config[status] || { 
    label: status, 
    icon: AlertCircle, 
    color: "bg-gray-100 text-gray-800" 
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm shadow-lg ${current.color}`}>
      <current.icon className="w-4 h-4" />
      {current.label}
    </div>
  );
}