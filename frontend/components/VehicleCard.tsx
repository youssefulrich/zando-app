"use client";

import Link from "next/link";

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

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const primaryImage =
    vehicle.images?.find((i) => i.is_primary)?.image ||
    vehicle.images?.[0]?.image ||
    "https://via.placeholder.com/600x400?text=Vehicle";

  return (
    <Link href={`/vehicles/${vehicle.id}`}>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden">
        {/* Image */}
        <img
          src={primaryImage}
          alt={vehicle.title}
          className="h-48 w-full object-cover"
        />

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg truncate">
            {vehicle.brand} {vehicle.model} ({vehicle.year})
          </h3>

          <p className="text-gray-500 text-sm">📍 {vehicle.city}</p>

          <div className="flex justify-between text-sm text-gray-600">
            <span>👥 {vehicle.seats} places</span>
            <span>⚙️ {vehicle.transmission}</span>
            <span>⛽ {vehicle.fuel_type}</span>
          </div>

          <div className="pt-2 font-bold text-orange-600 text-lg">
            {vehicle.price_per_day.toLocaleString()} FCFA
            <span className="text-sm text-gray-500 font-normal"> / jour</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
