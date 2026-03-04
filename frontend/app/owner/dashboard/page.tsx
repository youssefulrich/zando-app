"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";
import Link from "next/link";
import { 
  LayoutDashboard,
  Car,
  Home as HomeIcon,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  ArrowUpRight,
  Activity,
  Eye,
  Sparkles
} from "lucide-react";

interface User {
  user_type: string;
}

interface Stats {
  vehicles: {
    total_vehicles: number;
    available: number;
    unavailable: number;
    total_bookings: number;
    active_bookings: number;
  };
  residences: {
    total_residences: number;
    available: number;
    unavailable: number;
    total_bookings: number;
    active_bookings: number;
  };
  bookings: {
    total_bookings: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    total_revenue: number;
  };
}

export default function OwnerDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [vehiclesRes, residencesRes, bookingsRes] = await Promise.all([
        api.get("vehicles/my_stats/"),
        api.get("residences/my_stats/"),
        api.get("bookings/owner_stats/"),
      ]);

      setStats({
        vehicles: vehiclesRes.data,
        residences: residencesRes.data,
        bookings: bookingsRes.data,
      });
    } catch (err) {
      console.error("Erreur chargement stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-orange-600 animate-pulse" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600 mb-6">Impossible de charger les statistiques</p>
        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-semibold"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const canManageVehicles = user && [
    'proprietaire_vehicule',
    'proprietaire',
    'admin'
  ].includes(user.user_type);

  const canManageResidences = user && [
    'proprietaire_residence',
    'proprietaire',
    'admin'
  ].includes(user.user_type);

  const totalListings = stats.vehicles.total_vehicles + stats.residences.total_residences;
  const activeBookings = stats.vehicles.active_bookings + stats.residences.active_bookings;

  return (
    <div className="space-y-8">
      
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-8 text-white shadow-2xl"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-black">Dashboard</h1>
          </div>
          <p className="text-white/90 text-lg">
            Vue d'ensemble de votre activité sur Zando
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-4 right-20 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />
      </motion.div>

      {/* ================= MAIN STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Annonces actives"
          value={totalListings}
          subtitle={`${canManageVehicles ? stats.vehicles.total_vehicles : 0} véhicules, ${canManageResidences ? stats.residences.total_residences : 0} résidences`}
          icon={LayoutDashboard}
          gradient="from-blue-500 to-cyan-500"
          index={0}
        />

        <StatCard
          title="Réservations en cours"
          value={activeBookings}
          subtitle="Confirmées et actives"
          icon={CheckCircle}
          gradient="from-green-500 to-emerald-500"
          index={1}
        />

        <StatCard
          title="En attente"
          value={stats.bookings.pending}
          subtitle="À traiter rapidement"
          icon={Clock}
          gradient="from-yellow-500 to-orange-500"
          link="/owner/bookings"
          index={2}
        />

        <StatCard
          title="Revenus totaux"
          value={`${stats.bookings.total_revenue.toLocaleString()}`}
          subtitle="FCFA cumulés"
          icon={DollarSign}
          gradient="from-purple-500 to-pink-500"
          index={3}
        />
      </div>

      {/* ================= DETAILED STATS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* VÉHICULES */}
        {canManageVehicles && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Mes Véhicules</h2>
                    <p className="text-sm text-gray-600">Gestion de votre flotte</p>
                  </div>
                </div>
                <Link
                  href="/owner/vehicles"
                  className="flex items-center gap-1 text-green-600 hover:text-green-700 font-semibold text-sm group"
                >
                  <span>Voir tout</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Total</span>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.vehicles.total_vehicles}</div>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Disponibles</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{stats.vehicles.available}</div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Loués</span>
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.vehicles.unavailable}</div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Réservations</span>
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{stats.vehicles.total_bookings}</div>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/owner/vehicles/new"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                <Plus className="w-5 h-5" />
                Ajouter un véhicule
              </Link>
            </div>
          </motion.div>
        )}

        {/* RÉSIDENCES */}
        {canManageResidences && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <HomeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Mes Résidences</h2>
                    <p className="text-sm text-gray-600">Gestion de vos biens</p>
                  </div>
                </div>
                <Link
                  href="/owner/residences"
                  className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold text-sm group"
                >
                  <span>Voir tout</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Total</span>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.residences.total_residences}</div>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Disponibles</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{stats.residences.available}</div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Occupées</span>
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.residences.unavailable}</div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Réservations</span>
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{stats.residences.total_bookings}</div>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/owner/residences/new"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                <Plus className="w-5 h-5" />
                Ajouter une résidence
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* ================= BOOKINGS OVERVIEW ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Réservations</h2>
                <p className="text-sm text-gray-600">État de vos réservations</p>
              </div>
            </div>
            <Link
              href="/owner/bookings"
              className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-semibold text-sm group"
            >
              <span>Voir tout</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <BookingStatCard
              value={stats.bookings.pending}
              label="En attente"
              icon={Clock}
              color="yellow"
            />
            <BookingStatCard
              value={stats.bookings.confirmed}
              label="Confirmées"
              icon={CheckCircle}
              color="blue"
            />
            <BookingStatCard
              value={stats.bookings.completed}
              label="Complétées"
              icon={TrendingUp}
              color="green"
            />
            <BookingStatCard
              value={stats.bookings.cancelled}
              label="Annulées"
              icon={XCircle}
              color="gray"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ================= STAT CARD ================= */
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  gradient: string;
  link?: string;
  index: number;
}

function StatCard({ title, value, subtitle, icon: Icon, gradient, link, index }: StatCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-black text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </motion.div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }

  return content;
}

/* ================= BOOKING STAT CARD ================= */
interface BookingStatCardProps {
  value: number;
  label: string;
  icon: any;
  color: "yellow" | "blue" | "green" | "gray";
}

function BookingStatCard({ value, label, icon: Icon, color }: BookingStatCardProps) {
  const colors = {
    yellow: "from-yellow-500 to-orange-500",
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    gray: "from-gray-400 to-gray-600",
  };

  const bgColors = {
    yellow: "bg-yellow-50",
    blue: "bg-blue-50",
    green: "bg-green-50",
    gray: "bg-gray-50",
  };

  return (
    <div className={`${bgColors[color]} rounded-xl p-4 text-center transition-all hover:scale-105`}>
      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${colors[color]} mb-3 shadow-lg`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-600">{label}</div>
    </div>
  );
}