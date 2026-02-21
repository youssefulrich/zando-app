"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

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

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // ✅ Récupérer les réservations REÇUES
      const res = await api.get("bookings/received/");
      setBookings(res.data);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
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
    if (filter === "all") return true;
    return booking.status === filter;
  });

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
      <div>
        <h1 className="text-3xl font-bold mb-2">Réservations Reçues</h1>
        <p className="text-gray-600">
          Gérez les demandes de réservation de vos clients
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "all"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Toutes ({bookings.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            En attente ({bookings.filter((b) => b.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("confirmed")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "confirmed"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Confirmées ({bookings.filter((b) => b.status === "confirmed").length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "completed"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Complétées ({bookings.filter((b) => b.status === "completed").length})
          </button>
        </div>
      </div>

      {/* Liste des réservations */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-bold mb-2">Aucune réservation</h3>
          <p className="text-gray-600">
            Vous n'avez pas encore reçu de réservation
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">
                      {booking.vehicle
                        ? `${booking.vehicle.brand} ${booking.vehicle.model}`
                        : booking.residence?.title}
                    </h3>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="text-sm text-gray-500">
                    Réf: {booking.booking_number}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">
                    {booking.total_price.toLocaleString()} FCFA
                  </p>
                  <p className="text-sm text-gray-500">{booking.duration} jour(s)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Client</p>
                  <p className="font-medium">
                    {booking.client.first_name} {booking.client.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{booking.client.email}</p>
                  {booking.client.phone_number && (
                    <p className="text-xs text-gray-500">
                      {booking.client.phone_number}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Période</p>
                  <p className="font-medium">
                    {new Date(booking.start_date).toLocaleDateString("fr-FR")}
                  </p>
                  <p className="text-xs text-gray-500">
                    au {new Date(booking.end_date).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Demande reçue</p>
                  <p className="font-medium">
                    {new Date(booking.created_at).toLocaleDateString("fr-FR")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(booking.created_at).toLocaleTimeString("fr-FR")}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {booking.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleAccept(booking.id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    ✓ Accepter
                  </button>
                  <button
                    onClick={() => handleReject(booking.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    ✗ Refuser
                  </button>
                </div>
              )}

              {booking.status === "confirmed" && (
                <div className="pt-4 border-t">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      ✓ Réservation confirmée. Le client viendra récupérer le{" "}
                      {new Date(booking.start_date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
    paid: "bg-purple-100 text-purple-800",
  };

  const labels: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmée",
    completed: "Complétée",
    cancelled: "Annulée",
    paid: "Payée",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        colors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}