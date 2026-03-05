"use client";

import { useState } from "react";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            date,
            location,
            price,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Erreur lors de la création");
      }

      alert("Événement créé avec succès !");
    } catch (error) {
      alert("Erreur lors de la création de l'événement");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-8">
          Ajouter un événement
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Titre</label>
            <input
              type="text"
              className="w-full border rounded-xl p-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              className="w-full border rounded-xl p-3"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Date</label>
            <input
              type="datetime-local"
              className="w-full border rounded-xl p-3"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Lieu</label>
            <input
              type="text"
              className="w-full border rounded-xl p-3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Prix (FCFA)</label>
            <input
              type="number"
              className="w-full border rounded-xl p-3"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 transition"
          >
            Créer l’événement
          </button>
        </form>
      </div>
    </div>
  );
}