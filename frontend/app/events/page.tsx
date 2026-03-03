"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/events/")
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-10 grid md:grid-cols-3 gap-6">
      {events.map((event: any) => (
        <div key={event.id} className="border rounded-lg p-4">
          <img src={event.image} className="h-48 w-full object-cover rounded" />
          <h2 className="text-xl font-bold mt-2">{event.title}</h2>
          <p>{event.location}</p>
          <Link href={`/events/${event.id}`} className="text-orange-600">
            Voir détails
          </Link>
        </div>
      ))}
    </div>
  );
}