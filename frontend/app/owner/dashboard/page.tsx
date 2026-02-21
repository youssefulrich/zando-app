"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Impossible de charger les statistiques</p>
      </div>
    );
  }

  // ✅ Vérifier le type de propriétaire (adapté aux termes français)
  const canManageVehicles = user && [
    'proprietaire_vehicule',  // ✅ Propriétaire véhicules uniquement
    'proprietaire',           // ✅ Propriétaire des deux
    'admin'
  ].includes(user.user_type);

  const canManageResidences = user && [
    'proprietaire_residence', // ✅ Propriétaire résidences uniquement
    'proprietaire',           // ✅ Propriétaire des deux
    'admin'
  ].includes(user.user_type);

  const totalListings = stats.vehicles.total_vehicles + stats.residences.total_residences;

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Vue d'ensemble de votre activité sur Zando
        </p>
      </div>

      {/* Cartes principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Annonces actives"
          value={totalListings}
          subtitle={`${canManageVehicles ? stats.vehicles.total_vehicles : 0} véhicules, ${canManageResidences ? stats.residences.total_residences : 0} résidences`}
          icon="📋"
          color="blue"
        />

        <StatCard
          title="Réservations en cours"
          value={stats.vehicles.active_bookings + stats.residences.active_bookings}
          subtitle="Confirmées"
          icon="✓"
          color="green"
        />

        <StatCard
          title="En attente"
          value={stats.bookings.pending}
          subtitle="À traiter"
          icon="⏳"
          color="yellow"
          link="/owner/bookings"
        />

        <StatCard
          title="Revenus totaux"
          value={`${stats.bookings.total_revenue.toLocaleString()} FCFA`}
          subtitle="Total cumulé"
          icon="💰"
          color="orange"
        />
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ Véhicules - Visible si peut gérer véhicules */}
        {canManageVehicles && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">🚗 Mes Véhicules</h2>
              <Link
                href="/owner/vehicles"
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                Voir tout →
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Total</span>
                <span className="font-bold text-lg">{stats.vehicles.total_vehicles}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Disponibles</span>
                <span className="text-green-600 font-semibold">{stats.vehicles.available}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Indisponibles</span>
                <span className="text-gray-500">{stats.vehicles.unavailable}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total réservations</span>
                <span className="font-semibold">{stats.vehicles.total_bookings}</span>
              </div>
            </div>

            <Link
              href="/owner/vehicles/new"
              className="mt-6 w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition block text-center"
            >
              + Ajouter un véhicule
            </Link>
          </div>
        )}

        {/* ✅ Résidences - Visible si peut gérer résidences */}
        {canManageResidences && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">🏠 Mes Résidences</h2>
              <Link
                href="/owner/residences"
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                Voir tout →
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Total</span>
                <span className="font-bold text-lg">{stats.residences.total_residences}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Disponibles</span>
                <span className="text-green-600 font-semibold">{stats.residences.available}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Indisponibles</span>
                <span className="text-gray-500">{stats.residences.unavailable}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total réservations</span>
                <span className="font-semibold">{stats.residences.total_bookings}</span>
              </div>
            </div>

            <Link
              href="/owner/residences/new"
              className="mt-6 w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition block text-center"
            >
              + Ajouter une résidence
            </Link>
          </div>
        )}
      </div>

      {/* Réservations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">📅 Réservations</h2>
          <Link
            href="/owner/bookings"
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            Voir tout →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600">
              {stats.bookings.pending}
            </div>
            <div className="text-sm text-gray-600 mt-1">En attente</div>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">
              {stats.bookings.confirmed}
            </div>
            <div className="text-sm text-gray-600 mt-1">Confirmées</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {stats.bookings.completed}
            </div>
            <div className="text-sm text-gray-600 mt-1">Complétées</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-600">
              {stats.bookings.cancelled}
            </div>
            <div className="text-sm text-gray-600 mt-1">Annulées</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant StatCard
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  color: "blue" | "green" | "yellow" | "orange";
  link?: string;
}

function StatCard({ title, value, subtitle, icon, color, link }: StatCardProps) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    orange: "bg-orange-50 text-orange-600",
  };

  const content = (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold mb-2">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }

  return content;
}