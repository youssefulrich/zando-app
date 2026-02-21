"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  content_type: { model: string };
  object_id: number;
}

interface OwnerDetails {
  first_name: string;
  last_name: string;
  orange_money_number?: string;
  wave_number?: string;
  mtn_money_number?: string;
  moov_money_number?: string;
}

interface ItemDetails {
  id: number;
  title: string;
  image: string;
  type: "vehicle" | "residence";
  owner?: OwnerDetails;
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id;

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [item, setItem] = useState<ItemDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentProvider, setPaymentProvider] = useState<
    "orange" | "wave" | "mtn" | "moov"
  >("orange");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);

      const bookingRes = await api.get(`bookings/${bookingId}/`);
      setBooking(bookingRes.data);

      const type =
        bookingRes.data.content_type?.model ||
        bookingRes.data.content_type_model;

      const objectId = bookingRes.data.object_id;

      if (!type || !objectId) {
        throw new Error("Type ou ID manquant");
      }

      if (type === "vehicle") {
        const vehicleRes = await api.get(`vehicles/${objectId}/`);

        setItem({
          id: vehicleRes.data.id,
          title: `${vehicleRes.data.brand} ${vehicleRes.data.model}`,
          image:
            vehicleRes.data.images?.[0]?.image || "/placeholder.jpg",
          type: "vehicle",
          owner: vehicleRes.data.owner,
        });
      } else if (type === "residence") {
        const residenceRes = await api.get(
          `residences/${objectId}/`
        );

        setItem({
          id: residenceRes.data.id,
          title: residenceRes.data.title,
          image:
            residenceRes.data.images?.[0]?.image || "/placeholder.jpg",
          type: "residence",
          owner: residenceRes.data.owner,
        });
      }
    } catch (err) {
      alert("Impossible de charger la réservation");
      router.push("/bookings");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!booking) return;

    if (!transactionNumber.trim()) {
      alert("Veuillez entrer le numéro de transaction");
      return;
    }

    setProcessing(true);

    try {
      console.log("=== CRÉATION PAIEMENT ===");
      
      const paymentData = {
        booking: booking.id,
        amount: booking.total_price,
        payment_method: paymentProvider === "orange" ? "orange_money" 
                      : paymentProvider === "wave" ? "wave"
                      : paymentProvider === "mtn" ? "mtn_money"
                      : "moov_money",
        transaction_id: transactionNumber,
      };

      console.log("Données:", paymentData);

      const paymentRes = await api.post("payments/", paymentData);

      console.log("Réponse:", paymentRes.data);

      // ✅ Récupérer l'ID du paiement
      let paymentId = paymentRes.data?.id;

      // ✅ SI l'ID est manquant, essayer de le récupérer autrement
      if (!paymentId) {
        console.warn("⚠️ ID manquant, tentative de récupération...");
        
        try {
          // Option 1: Récupérer le dernier paiement créé
          const listRes = await api.get("payments/?ordering=-id&limit=1");
          
          if (listRes.data?.results?.[0]?.id) {
            paymentId = listRes.data.results[0].id;
          } else if (Array.isArray(listRes.data) && listRes.data[0]?.id) {
            paymentId = listRes.data[0].id;
          }
        } catch (err) {
          console.error("Erreur récupération ID:", err);
        }
      }

      if (!paymentId) {
        alert("Paiement créé mais impossible de récupérer l'ID. Consultez vos réservations.");
        router.push("/bookings");
        return;
      }

      console.log("✅ ID récupéré:", paymentId);

      // ✅ REDIRECTION vers votre page d'instructions
      router.push(`/payment/instructions/${paymentId}`);
    } catch (error: any) {
      console.error("❌ ERREUR PAIEMENT:", error);
      console.error("Response:", error.response?.data);
      
      const errorMsg = error.response?.data?.error 
        || error.response?.data?.detail
        || JSON.stringify(error.response?.data)
        || "Erreur lors du paiement";
      
      alert(`Erreur: ${errorMsg}`);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!booking || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Réservation introuvable</p>
      </div>
    );
  }

  const getSelectedNumber = () => {
    if (!item.owner) return "Non disponible";

    switch (paymentProvider) {
      case "orange":
        return item.owner.orange_money_number || "Non configuré";
      case "wave":
        return item.owner.wave_number || "Non configuré";
      case "mtn":
        return item.owner.mtn_money_number || "Non configuré";
      case "moov":
        return item.owner.moov_money_number || "Non configuré";
      default:
        return "Non disponible";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">
          Confirmation de paiement
        </h1>

        {/* Détails de la réservation */}
        <div className="mb-6 pb-6 border-b">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={item.image}
              alt={item.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <p className="font-semibold text-lg">{item.title}</p>
              <p className="text-gray-600 text-sm">
                {new Date(booking.start_date).toLocaleDateString("fr-FR")} -{" "}
                {new Date(booking.end_date).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Montant total à payer</p>
            <p className="text-2xl font-bold text-orange-600">
              {booking.total_price.toLocaleString()} FCFA
            </p>
          </div>
        </div>

        {/* Choix du moyen de paiement */}
        <h2 className="font-semibold mb-3">
          Choisissez le moyen de paiement
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { key: "orange", label: "Orange Money", available: item.owner?.orange_money_number },
            { key: "wave", label: "Wave", available: item.owner?.wave_number },
            { key: "mtn", label: "MTN Money", available: item.owner?.mtn_money_number },
            { key: "moov", label: "Moov Money", available: item.owner?.moov_money_number },
          ]
            .filter((method) => method.available)
            .map((method) => (
              <button
                key={method.key}
                onClick={() => setPaymentProvider(method.key as any)}
                className={`p-4 border-2 rounded-lg font-semibold transition ${
                  paymentProvider === method.key
                    ? "border-orange-600 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {method.label}
              </button>
            ))}
        </div>

        {/* Numéro du propriétaire */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <p className="text-sm text-blue-800 mb-2">
            <strong>📱 Étape 1 :</strong> Envoyez le paiement au numéro :
          </p>
          <p className="font-bold text-xl text-blue-900">
            {getSelectedNumber()}
          </p>
        </div>

        {/* Numéro de transaction */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <strong>✍️ Étape 2 :</strong> Numéro de transaction
          </label>
          <input
            type="text"
            value={transactionNumber}
            onChange={(e) => setTransactionNumber(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-orange-500 focus:outline-none"
            placeholder="Ex: 0501122565"
          />
          <p className="text-xs text-gray-500 mt-1">
            Le numéro de transaction reçu après le paiement
          </p>
        </div>

        {/* Bouton de confirmation */}
        <button
          onClick={handlePayment}
          disabled={processing || !transactionNumber.trim()}
          className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
        >
          {processing ? "Envoi en cours..." : "Confirmer le paiement"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          Après confirmation, vous pourrez uploader la capture d'écran de votre transaction
        </p>
      </div>
    </div>
  );
}