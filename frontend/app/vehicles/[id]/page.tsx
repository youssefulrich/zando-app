"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

interface Vehicle {
  id: number;
  title: string;
  brand: string;
  model: string;
  year: number;
  city: string;
  price_per_day: number;
  seats: number;
  transmission: string;
  fuel_type: string;
  description?: string;
  images: Array<{ image: string; is_primary?: boolean }>;
  owner?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Formulaire de réservation
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const res = await api.get(`vehicles/${vehicleId}/`);
      setVehicle(res.data);
    } catch (err) {
      console.error("Erreur:", err);
      alert("Véhicule introuvable");
      router.push("/vehicles");
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

  const calculateTotalPrice = () => {
    if (!vehicle) return 0;
    return calculateTotalDays() * vehicle.price_per_day;
  };

const handleBooking = async (e: React.FormEvent) => {
  e.preventDefault();


  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }
  if (!startDate || !endDate) {
    alert("Veuillez sélectionner les dates");
    return;
  }

  if (new Date(startDate) >= new Date(endDate)) {
    alert("La date de fin doit être après la date de début");
    return;
  }

  try {
    setSubmitting(true);

    const bookingData = {
      vehicle: parseInt(vehicleId as string),
      start_date: startDate,
      end_date: endDate,
    };

    const res = await api.post("bookings/", bookingData);

    router.push(`/checkout/${res.data.id}`);

  } catch (err: any) {
    console.error(err);
    alert("Erreur lors de la réservation");
  } finally {
    setSubmitting(false);
  }
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!vehicle) {
    return null;
  }

  const images = vehicle.images || [];
  const primaryImage = images.find((img) => img.is_primary) || images[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Bouton retour */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-orange-600"
        >
          ← Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Galerie d'images */}
          <div className="lg:col-span-2 space-y-4">
            {/* Image principale */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <img
                src={images[selectedImage]?.image || primaryImage?.image || "https://via.placeholder.com/800x600"}
                alt={vehicle.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Miniatures */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index
                        ? "border-orange-600"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img.image}
                      alt={`Image ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Détails */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h1 className="text-3xl font-bold mb-4">
                {vehicle.brand} {vehicle.model} ({vehicle.year})
              </h1>

              <div className="flex items-center space-x-6 text-gray-600 mb-6">
                <span className="flex items-center">
                  📍 {vehicle.city}
                </span>
                <span className="flex items-center">
                  👥 {vehicle.seats} places
                </span>
                <span className="flex items-center">
                  ⚙️ {vehicle.transmission}
                </span>
                <span className="flex items-center">
                  ⛽ {vehicle.fuel_type}
                </span>
              </div>

              {vehicle.description && (
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {vehicle.description}
                  </p>
                </div>
              )}

              {vehicle.owner && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-semibold mb-3">Propriétaire</h2>
                  <p className="text-gray-700">
                    {vehicle.owner.first_name} {vehicle.owner.last_name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Formulaire de réservation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-4">
              <div className="mb-6">
                <p className="text-3xl font-bold text-orange-600">
                  {vehicle.price_per_day.toLocaleString()} FCFA
                  <span className="text-lg text-gray-500 font-normal">
                    {" "}
                    / jour
                  </span>
                </p>
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  />
                </div>

                {startDate && endDate && (
                  <div className="bg-orange-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Durée</span>
                      <span className="font-semibold">
                        {calculateTotalDays()} jour(s)
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Prix par jour</span>
                      <span className="font-semibold">
                        {vehicle.price_per_day.toLocaleString()} FCFA
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-orange-600 text-lg">
                        {calculateTotalPrice().toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !startDate || !endDate}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {submitting ? "Réservation en cours..." : "Réserver maintenant"}
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                Vous ne serez pas débité maintenant
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}