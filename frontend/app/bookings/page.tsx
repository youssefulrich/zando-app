"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/api";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("/bookings/").then((res) => setBookings(res.data));
  }, []);

  const cancelBooking = async (id: number) => {
    await axios.patch(`/bookings/${id}/`, { status: "cancelled" });
    location.reload();
  };

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">Mes réservations</h1>

      {bookings.map((b: any) => (
        <div
          key={b.id}
          className="bg-white p-6 rounded-xl shadow flex justify-between"
        >
          <div>
            <p className="font-semibold">{b.booking_number}</p>
            <p>{b.start_date} → {b.end_date}</p>
            <p className="text-orange-600 font-bold">
              {b.total_price} FCFA
            </p>
          </div>

          {b.status === "pending" && (
            <button
              onClick={() => cancelBooking(b.id)}
              className="bg-red-500 text-white px-4 rounded-lg"
            >
              Annuler
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
