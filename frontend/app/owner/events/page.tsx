"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Calendar, MapPin, PlusCircle } from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  image?: string;
}

export default function OwnerEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("events/my-events/");
      setEvents(res.data);
    } catch (err: any) {
      setError("Impossible de charger les événements.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Chargement des événements...</p>
      </div>
    );
  }

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mes Événements</h1>
          <p className="text-gray-500">
            Gérez vos événements et suivez vos performances
          </p>
        </div>

        <Link
          href="/owner/events/create"
          className="flex items-center gap-2 bg-pink-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-pink-700 transition"
        >
          <PlusCircle size={20} />
          Créer un événement
        </Link>
      </div>

      {/* ERREUR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* LISTE VIDE */}
      {events.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <Calendar size={40} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Aucun événement pour le moment
          </h3>
          <p className="text-gray-500 mb-6">
            Crée ton premier événement et commence à vendre des tickets.
          </p>

          <Link
            href="/owner/events/create"
            className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition"
          >
            Créer mon premier événement
          </Link>
        </div>
      ) : (
        /* GRID EVENTS */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-5">
                <h3 className="text-lg font-bold mb-2">
                  {event.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="text-sm text-gray-500 space-y-1 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {event.location}
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date(event.start_date).toLocaleDateString()} -{" "}
                    {new Date(event.end_date).toLocaleDateString()}
                  </div>
                </div>

                <Link
                  href={`/owner/events/${event.id}`}
                  className="block text-center bg-gray-100 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Voir détails
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}