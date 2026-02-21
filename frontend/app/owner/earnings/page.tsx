"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Stats {
  total_bookings: number;
  confirmed: number;
  completed: number;
  total_revenue: number;
}

export default function OwnerEarningsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("bookings/owner_stats/");
      setStats(res.data);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mes Gains</h1>
        <p className="text-gray-600">
          Suivez vos revenus et performances
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total revenus */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-500 text-sm">Revenus totaux</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {stats?.total_revenue
              ? Number(stats.total_revenue).toLocaleString("fr-FR")
              : "0"}{" "}
            FCFA
          </p>
        </div>

        {/* Réservations confirmées */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-500 text-sm">Réservations confirmées</p>
          <p className="text-2xl font-bold mt-2">
            {stats?.confirmed || 0}
          </p>
        </div>

        {/* Réservations complétées */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-500 text-sm">Réservations complétées</p>
          <p className="text-2xl font-bold mt-2">
            {stats?.completed || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
