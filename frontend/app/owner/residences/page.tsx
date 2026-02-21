"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

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
}

export default function OwnerResidencesPage() {
  const router = useRouter();
  const [residences, setResidences] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(true);

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
      alert("Résidence supprimée avec succès");
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
          <h1 className="text-3xl font-bold mb-2">Mes Résidences</h1>
          <p className="text-gray-600">
            Gérez vos logements disponibles à la location
          </p>
        </div>

        <Link
          href="/owner/residences/new"
          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
        >
          + Ajouter une résidence
        </Link>
      </div>

      {/* Liste */}
      {residences.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-bold mb-2">Aucune résidence</h3>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore ajouté de résidence
          </p>
          <Link
            href="/owner/residences/new"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
          >
            Ajouter ma première résidence
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {residences.map((residence) => (
            <div
              key={residence.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="flex">
                {/* Image */}
                <div className="w-64 h-48 flex-shrink-0">
                  <img
                    src={
                      residence.images?.[0]?.image ||
                      "/placeholder-house.jpg"
                    }
                    alt={residence.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Infos */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">
                        {residence.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {residence.city} • {residence.neighborhood}
                      </p>
                    </div>

                    <div>
                      {residence.is_active ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          ✓ Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-8 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Prix / nuit : </span>
                      <span className="font-bold text-orange-600">
                        {residence.price_per_night
                          ? Number(residence.price_per_night).toLocaleString(
                              "fr-FR"
                            )
                          : "0"}{" "}
                        FCFA
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500">Chambres : </span>
                      <span className="font-semibold">
                        {residence.bedrooms}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500">Salles de bain : </span>
                      <span className="font-semibold">
                        {residence.bathrooms}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500">Réservations : </span>
                      <span className="font-semibold">
                        {residence.bookings_count || 0}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      href={`/owner/residences/${residence.id}/edit`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                    >
                      ✏️ Modifier
                    </Link>

                    <button
                      onClick={() =>
                        toggleStatus(residence.id, residence.is_active)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                    >
                      {residence.is_active
                        ? "🔒 Désactiver"
                        : "✓ Activer"}
                    </button>

                    <Link
                      href={`/residences/${residence.id}`}
                      target="_blank"
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                    >
                      👁️ Voir l'annonce
                    </Link>

                    <button
                      onClick={() => handleDelete(residence.id)}
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
