"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

interface BookingDetails {
  id: number;
  booking_number: string;
  start_date: string;
  end_date: string;
  duration: number;
  subtotal: number;
  fees: number;
  total_price: number;
  status: string;
  item: {
    id: number;
    title: string;
    image: string;
    type: "vehicle" | "residence";
  };
}

export default function BookingConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking");

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"full" | "partial" | "installments">("full");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`bookings/${bookingId}/`);
      
      // Enrichir avec les détails de l'objet réservé
      let itemDetails;
      if (res.data.content_type) {
        const type = res.data.content_type.model;
        if (type === "vehicle") {
          const vehicleRes = await api.get(`vehicles/${res.data.object_id}/`);
          itemDetails = {
            id: vehicleRes.data.id,
            title: `${vehicleRes.data.brand} ${vehicleRes.data.model}`,
            image: vehicleRes.data.images?.[0]?.image || "/placeholder.jpg",
            type: "vehicle" as const,
          };
        } else if (type === "residence") {
          const residenceRes = await api.get(`residences/${res.data.object_id}/`);
          itemDetails = {
            id: residenceRes.data.id,
            title: residenceRes.data.title,
            image: residenceRes.data.images?.[0]?.image || "/placeholder.jpg",
            type: "residence" as const,
          };
        }
      }

    if (!itemDetails) {
        alert("Objet introuvable");
        router.push("/bookings");
        return;
    }

    setBooking({
        ...res.data,
        item: itemDetails,
    });

    } catch (err) {
      console.error("Erreur:", err);
      alert("Impossible de charger les détails de la réservation");
      router.push("/bookings");
    } finally {
      setLoading(false);
    }
  };

  const calculatePartialAmount = () => {
    if (!booking) return 0;
    return booking.total_price * 0.3; // 30% maintenant
  };

  const calculateRemainingAmount = () => {
    if (!booking) return 0;
    return booking.total_price * 0.7; // 70% plus tard
  };

  const calculateInstallmentAmount = () => {
    if (!booking) return 0;
    return booking.total_price / 3; // En 3 fois
  };

  const handlePayment = async () => {
    if (!booking) return;

    setProcessing(true);

    try {
      const paymentData = {
        booking: booking.id,
        amount: paymentMethod === "full" 
          ? booking.total_price 
          : paymentMethod === "partial"
          ? calculatePartialAmount()
          : calculateInstallmentAmount(),
        payment_method: paymentMethod,
      };

      // TODO: Intégration avec Stripe/PayPal/Wave/Orange Money
      console.log("Payment data:", paymentData);

      // Simuler un paiement
        await api.post(`bookings/${booking.id}/pay/`, paymentData);

      alert(
        `Paiement de ${paymentData.amount.toLocaleString()} FCFA effectué avec succès ! 🎉\n\n` +
        `Numéro de réservation: ${booking.booking_number}`
      );

      router.push(`/booking-success?booking=${booking.id}`);
    } catch (err: any) {
      console.error("Erreur paiement:", err);
      alert("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!booking) return;

    if (!confirm("Voulez-vous vraiment annuler cette réservation ?")) {
      return;
    }

    try {
      await api.post(`bookings/${booking.id}/cancel/`, {
        reason: "Annulation avant paiement",
      });

      alert("Réservation annulée");
      router.push("/bookings");
    } catch (err) {
      console.error("Erreur:", err);
      alert("Impossible d'annuler la réservation");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Réservation introuvable</p>
        </div>
      </div>
    );
  }

  const isPaid = booking.status === "paid";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-orange-600"
        >
          ← Retour
        </button>

        <h1 className="text-3xl font-bold mb-8">Confirmer et payer</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Options de paiement */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Options de paiement */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">
                1. Choisissez quand vous souhaitez payer
              </h2>

              <div className="space-y-3">
                {/* Payer maintenant */}
                <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:border-orange-600 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="full"
                    checked={paymentMethod === "full"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="mt-1"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-semibold">
                      Payer {booking.total_price.toLocaleString()} FCFA maintenant
                    </p>
                  </div>
                </label>

                {/* Payer une partie */}
                <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:border-orange-600 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="partial"
                    checked={paymentMethod === "partial"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="mt-1"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-semibold">
                      Payer une partie maintenant et l'autre plus tard
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {calculatePartialAmount().toLocaleString()} FCFA maintenant,{" "}
                      {calculateRemainingAmount().toLocaleString()} FCFA le{" "}
                      {new Date(
                        new Date(booking.start_date).getTime() - 7 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Pas de frais supplémentaires
                    </p>
                  </div>
                </label>

                {/* Payer en 3 fois */}
                <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:border-orange-600 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="installments"
                    checked={paymentMethod === "installments"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="mt-1"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-semibold">Payer en 3 fois</p>
                    <p className="text-sm text-gray-600 mt-1">
                      3 versements de {calculateInstallmentAmount().toLocaleString()} FCFA
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* 2. Mode de paiement */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">2. Ajoutez un mode de paiement</h2>

              <div className="space-y-3">
                <button className="w-full p-4 border-2 rounded-lg text-left hover:border-orange-600 transition">
                  💳 Carte bancaire
                </button>
                <button className="w-full p-4 border-2 rounded-lg text-left hover:border-orange-600 transition">
                  📱 Orange Money
                </button>
                <button className="w-full p-4 border-2 rounded-lg text-left hover:border-orange-600 transition">
                  📱 Wave
                </button>
                <button className="w-full p-4 border-2 rounded-lg text-left hover:border-orange-600 transition">
                  📱 MTN Mobile Money
                </button>
              </div>
            </div>

            {/* 3. Politique d'annulation */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">3. Vérifiez votre réservation</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Annulation gratuite</h3>
                  <p className="text-sm text-gray-600">
                    Annulez avant le{" "}
                    {new Date(
                      new Date(booking.start_date).getTime() - 30 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("fr-FR")}{" "}
                    pour recevoir un remboursement intégral.
                  </p>
                </div>

                <div className="border-t pt-4">
                  <button
                    onClick={handleCancel}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Annuler cette réservation
                  </button>
                </div>
              </div>
            </div>

            {/* Bouton de paiement */}
            <button
              onClick={handlePayment}
              disabled={processing || isPaid}
              className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-orange-700 transition disabled:bg-gray-400"
            >
              {processing
                ? "Traitement en cours..."
                : isPaid
                ? "Déjà payé"
                : `Confirmer et payer ${
                    paymentMethod === "full"
                      ? booking.total_price.toLocaleString()
                      : paymentMethod === "partial"
                      ? calculatePartialAmount().toLocaleString()
                      : calculateInstallmentAmount().toLocaleString()
                  } FCFA`}
            </button>
          </div>

          {/* Colonne droite - Résumé */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              {/* Image et titre */}
              <div className="flex items-start space-x-4 mb-6">
                <img
                  src={booking.item.image}
                  alt={booking.item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">{booking.item.title}</h3>
                  <p className="text-sm text-gray-500">
                    {booking.item.type === "vehicle" ? "Véhicule" : "Résidence"}
                  </p>
                  {booking.status === "paid" && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Payé ✓
                    </span>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Dates</span>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(booking.start_date).toLocaleDateString("fr-FR")} -{" "}
                  {new Date(booking.end_date).toLocaleDateString("fr-FR")}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {booking.duration} {booking.item.type === "vehicle" ? "jour(s)" : "nuit(s)"}
                </p>
              </div>

              {/* Détail du prix */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold mb-3">Détail du prix</h3>

                <div className="flex justify-between text-sm">
                  <span>
                    {booking.duration} × {(booking.subtotal / booking.duration).toLocaleString()}{" "}
                    FCFA
                  </span>
                  <span>{booking.subtotal.toLocaleString()} FCFA</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Frais de service</span>
                  <span>{booking.fees.toLocaleString()} FCFA</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-600">
                    {booking.total_price.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}