"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

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
}

export default function OwnerVehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      setLoading(true);
      // ✅ Filtre "owner=me" pour récupérer seulement MES véhicules
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
      alert("Véhicule supprimé avec succès");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Véhicules</h1>
          <p className="text-gray-600">
            Gérez vos véhicules disponibles à la location
          </p>
        </div>

        <Link
          href="/owner/vehicles/new"
          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
        >
          + Ajouter un véhicule
        </Link>
      </div>

      {/* Liste des véhicules */}
      {vehicles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-xl font-bold mb-2">Aucun véhicule</h3>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore ajouté de véhicule
          </p>
          <Link
            href="/owner/vehicles/new"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
          >
            Ajouter mon premier véhicule
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="flex">
                {/* Image */}
                <div className="w-64 h-48 flex-shrink-0">
                  <img
                    src={vehicle.images?.[0]?.image || "/placeholder-car.jpg"}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Infos */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {vehicle.year} • {vehicle.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {vehicle.is_available ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          ✓ Disponible
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                          Indisponible
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-8 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Prix journalier : </span>
                      <span className="font-bold text-orange-600">
                        {vehicle.price_per_day.toLocaleString()} FCFA
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Réservations : </span>
                      <span className="font-semibold">{vehicle.bookings || 0}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      href={`/owner/vehicles/${vehicle.id}/edit`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                    >
                      ✏️ Modifier
                    </Link>

                    <button
                      onClick={() =>
                        toggleAvailability(vehicle.id, vehicle.is_available)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                    >
                      {vehicle.is_available ? "🔒 Désactiver" : "✓ Activer"}
                    </button>

                    <Link
                      href={`/vehicles/${vehicle.id}`}
                      target="_blank"
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                    >
                      👁️ Voir l'annonce
                    </Link>

                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium ml-auto"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}