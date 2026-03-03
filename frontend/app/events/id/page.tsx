"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function EventDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    api.get(`/events/${id}/`)
      .then(res => setEvent(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const buyTicket = async (ticketTypeId: number) => {
    try {
      await api.post(`/events/buy/${ticketTypeId}/`, { quantity: 1 });
      alert("Ticket acheté !");
    } catch {
      router.push("/login");
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p>{event.description}</p>

      {event.ticket_types.map((ticket: any) => (
        <div key={ticket.id} className="mt-4">
          <p>{ticket.name} - {ticket.price} FCFA</p>
          <button
            onClick={() => buyTicket(ticket.id)}
            className="bg-orange-600 text-white px-4 py-2 rounded"
          >
            Acheter
          </button>
        </div>
      ))}
    </div>
  );
}