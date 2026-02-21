"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

interface Residence {
  id: number;
  title: string;
  description: string;
  city: string;
  neighborhood: string;
  address: string;
  type: string;
  price_per_night: number;
  cleaning_fee: number;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  surface_area: number;
  rating_average: number;
  reviews_count: number;
  owner: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  images: Array<{ id: number; image: string; is_primary: boolean }>;
  has_wifi: boolean;
  has_ac: boolean;
  has_tv: boolean;
  has_kitchen: boolean;
  has_pool: boolean;
  has_parking: boolean;
  has_security: boolean;
  has_generator: boolean;
  allow_pets: boolean;
  allow_smoking: boolean;
  min_nights: number;
}

export default function ResidenceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [residence, setResidence] = useState<Residence | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchResidence();
  }, [params.id]);

  const fetchResidence = async () => {
    try {
      setLoading(true);
      const res = await api.get(`residences/${params.id}/`);
      setResidence(res.data);
    } catch (err) {
      console.error("Erreur:", err);
      alert("Résidence introuvable");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };


  

const calculateTotalDays = () => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  return days === 0 ? 1 : days;
};

const calculateSubtotal = () => {
  if (!residence) return 0;
  const days = calculateTotalDays();
  const pricePerNight = Number(residence.price_per_night) || 0;
  return days * pricePerNight;
};

const calculateTotal = () => {
  if (!residence) return 0;
  const subtotal = calculateSubtotal();
  const cleaningFee = Number(residence.cleaning_fee) || 0;
  
  console.log("Debug calcul:", {
    subtotal,
    cleaningFee,
    total: subtotal + cleaningFee
  });
  
  return subtotal + cleaningFee;
};

const handleBooking = async () => {
  if (!startDate || !endDate) {
    alert("Veuillez sélectionner des dates");
    return;
  }

  if (new Date(startDate) >= new Date(endDate)) {
    alert("La date de départ doit être après la date d'arrivée");
    return;
  }

  if (guests > residence!.capacity) {
    alert(`Maximum ${residence!.capacity} voyageurs autorisés`);
    return;
  }

  try {
    setSubmitting(true);

    const res = await api.post("bookings/", {
      residence: residence!.id,
      start_date: startDate,
      end_date: endDate,
      guests: guests,
    });

    router.push(`/checkout/${res.data.id}`);
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la réservation");
  } finally {
    setSubmitting(false);
  }
};





  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!residence) return null;

  const primaryImage = residence.images?.find((img) => img.is_primary)?.image 
    || residence.images?.[0]?.image 
    || "https://via.placeholder.com/800x600?text=Residence";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Retour
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Titre et localisation */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{residence.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-1">
              ⭐ {residence.rating_average > 0 ? residence.rating_average.toFixed(1) : "Nouveau"}
            </span>
            <span>•</span>
            <span>{residence.reviews_count} avis</span>
            <span>•</span>
            <span>📍 {residence.neighborhood}, {residence.city}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Images et détails */}
          <div className="lg:col-span-2">
            {/* Galerie d'images */}
            <div className="mb-8">
              <div className="rounded-lg overflow-hidden mb-4">
                <img
                  src={residence.images?.[selectedImage]?.image || primaryImage}
                  alt={residence.title}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/800x600?text=Residence";
                  }}
                />
              </div>
              {residence.images && residence.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {residence.images.slice(0, 4).map((img, idx) => (
                    <img
                      key={img.id}
                      src={img.image}
                      alt={`Image ${idx + 1}`}
                      onClick={() => setSelectedImage(idx)}
                      className={`h-20 w-full object-cover rounded cursor-pointer ${
                        selectedImage === idx ? "ring-2 ring-orange-600" : ""
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{residence.description}</p>
            </div>

            {/* Caractéristiques */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Caractéristiques</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛏️</span>
                  <span>{residence.bedrooms} chambres</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚿</span>
                  <span>{residence.bathrooms} salles de bain</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  <span>{residence.capacity} personnes</span>
                </div>
                {residence.surface_area && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📐</span>
                    <span>{residence.surface_area} m²</span>
                  </div>
                )}
              </div>
            </div>

            {/* Équipements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Équipements</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {residence.has_wifi && <span className="flex items-center gap-2">✓ WiFi</span>}
                {residence.has_ac && <span className="flex items-center gap-2">✓ Climatisation</span>}
                {residence.has_tv && <span className="flex items-center gap-2">✓ Télévision</span>}
                {residence.has_kitchen && <span className="flex items-center gap-2">✓ Cuisine</span>}
                {residence.has_pool && <span className="flex items-center gap-2">✓ Piscine</span>}
                {residence.has_parking && <span className="flex items-center gap-2">✓ Parking</span>}
                {residence.has_security && <span className="flex items-center gap-2">✓ Sécurité</span>}
                {residence.has_generator && <span className="flex items-center gap-2">✓ Générateur</span>}
              </div>
            </div>
          </div>

          {/* Colonne droite - Réservation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">
                  {residence.price_per_night.toLocaleString()} FCFA
                  <span className="text-base font-normal text-gray-600"> / nuit</span>
                </div>
              </div>

              {/* Formulaire de réservation */}
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date d'arrivée
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de départ
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de voyageurs
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={residence.capacity}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: {residence.capacity} voyageurs
                  </p>
                </div>
              </div>

              {/* Calcul du prix */}
              {startDate && endDate && (
                <div className="border-t border-gray-200 pt-4 mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Sous-total ({calculateTotalDays()} nuit{calculateTotalDays() > 1 ? 's' : ''})
                    </span>
                    <span className="font-semibold">
                      {calculateSubtotal().toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frais de ménage</span>
                    <span className="font-semibold">
                      {residence.cleaning_fee.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-orange-600">
                      {calculateTotal().toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={submitting || !startDate || !endDate}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? "Réservation en cours..." : "Réserver"}
              </button>

              <p className="text-center text-sm text-gray-500 mt-3">
                Vous ne serez pas débité pour le moment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}