"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function NewResidencePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    neighborhood: "",   // ✅ AJOUT
    type: "",
    address: "",
    price_per_night: "",
    bedrooms: "",
    bathrooms: "",
    guests: "",
    has_wifi: false,
    has_ac: false,
    has_kitchen: false,
    has_pool: false,
    has_parking: false,
    is_available: true,
  });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, type, value, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e: any) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value.toString());
      });

      // ✅ CORRECTION ICI
      images.forEach((img) => {
        form.append("uploaded_images", img);
      });

      await api.post("residences/", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Résidence créée avec succès 🏠");
      router.push("/owner/residences");

    } catch (err: any) {
      console.log("ERREUR COMPLETE:", err.response?.data);
      alert(JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  const price = Number(formData.price_per_night) || 0;
  const commission = price * 0.1;
  const finalPrice = price * 1.1;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8">
        Ajouter une Résidence
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Titre */}
        <div>
          <label className="block mb-2 font-medium">Titre</label>
          <input
            type="text"
            name="title"
            required
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            name="description"
            rows={5}
            required
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Décrivez votre logement..."
          />
        </div>

        {/* Localisation */}
        <div className="grid grid-cols-2 gap-6">
          <input
            name="city"
            placeholder="Ville"
            required
            onChange={handleChange}
            className="border rounded-lg p-3"
          />
          <input
            name="address"
            placeholder="Adresse"
            required
            onChange={handleChange}
            className="border rounded-lg p-3"
          />
        </div>
          <input
            name="neighborhood"
            placeholder="Quartier"
            required
            onChange={handleChange}
            className="border rounded-lg p-3"
           />

           <select
            name="type"
            required
            onChange={handleChange}
            className="border rounded-lg p-3"
           >
            <option value="">Type de logement</option>
            <option value="apartment">Appartement</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
            <option value="house">Maison</option>
           </select>


        {/* Caractéristiques */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Caractéristiques
          </h2>

          <div className="grid grid-cols-2 gap-6">

            <input
              type="number"
              name="bedrooms"
              placeholder="Nombre de chambres"
              required
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="number"
              name="bathrooms"
              placeholder="Salles de bain"
              required
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="number"
              name="guests"
              placeholder="Capacité (personnes)"
              required
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

          </div>
        </div>

        {/* Équipements */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Équipements
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <label className="flex items-center gap-2">
              <input type="checkbox" name="has_wifi" onChange={handleChange} />
              WiFi
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" name="has_ac" onChange={handleChange} />
              Climatisation
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" name="has_kitchen" onChange={handleChange} />
              Cuisine équipée
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" name="has_pool" onChange={handleChange} />
              Piscine
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" name="has_parking" onChange={handleChange} />
              Parking
            </label>

          </div>
        </div>

        {/* Prix */}
        <div>
          <label className="block mb-2 font-medium">
            Prix par nuit (FCFA)
          </label>
          <input
            type="number"
            name="price_per_night"
            required
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        {price > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border text-sm">
            <p>
              <strong>Commission Zando (10%) :</strong>{" "}
              {commission.toLocaleString()} FCFA
            </p>

            <p>
              <strong>Prix final client :</strong>{" "}
              {finalPrice.toLocaleString()} FCFA
            </p>

            <p className="text-green-600 font-semibold">
              Montant que vous recevrez :{" "}
              {price.toLocaleString()} FCFA
            </p>
          </div>
        )}

        {/* Photos */}
        <div>
          <label className="block mb-2 font-medium">
            Photos de la résidence
          </label>
          <input
            type="file"
            multiple
            required
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        {/* Bouton */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition"
        >
          {loading ? "Création..." : "Publier la résidence"}
        </button>
      </form>
    </div>
  );
}
