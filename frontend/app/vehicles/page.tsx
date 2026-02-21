"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import VehicleCard from "@/components/VehicleCard";

/* ================= TYPES ================= */

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
  images: Array<{ image: string; is_primary?: boolean }>;
}

/* ================= COMPONENT ================= */

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ================= HERO TEXT ANIMATION ================= */

  const texts = [
    "Découvrez Zando",
    "La meilleure plateforme de location",
    "Trouvez la voiture idéale",
    "Réservez en quelques secondes",
  ];

  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const current = texts[index];
    let i = 0;

    const typing = setInterval(() => {
      setDisplayed(current.slice(0, i));
      i++;

      if (i > current.length) {
        clearInterval(typing);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % texts.length);
        }, 1200);
      }
    }, 40);

    return () => clearInterval(typing);
  }, [index]);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("vehicles/");
      setVehicles(res.data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={fetchVehicles}
          className="bg-orange-600 text-white px-6 py-3 rounded-xl"
        >
          Réessayer
        </button>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HERO ================= */}
      <section className="relative h-[55vh] flex items-center justify-center text-white">

        {/* image */}
        <div className="absolute inset-0 bg-[url('/hero-car.jpg')] bg-cover bg-center" />

        {/* overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center px-6">

          <h1 className="text-4xl md:text-5xl font-bold mb-4 h-[60px]">
            {displayed}
            <span className="animate-pulse">|</span>
          </h1>

          <p className="text-gray-200 mb-6">
            Voitures • SUV • Minibus • Moto partout en Côte d’Ivoire
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        <p className="mb-8 text-gray-600 font-medium">
          {vehicles.length} véhicule(s) disponible(s)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
