"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function NewVehiclePage() {
  const router = useRouter();
  const COMMISSION_RATE = 0.1;

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    year: "",
    type: "",
    transmission: "",
    fuel_type: "",
    seats: "",
    doors: "",
    color: "",
    plate_number: "",
    city: "",
    pickup_location: "",
    description: "",
    price_per_day: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

      images.forEach((img) => {
        form.append("uploaded_images", img);
      });

      await api.post("vehicles/", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Véhicule ajouté avec succès 🚗");
      router.push("/owner/vehicles");

    } catch (err: any) {
      console.log(err.response?.data);
      alert(JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  const price = Number(formData.price_per_day) || 0;
  const commission = price * COMMISSION_RATE;
  const ownerGets = price - commission;

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Ajouter un Véhicule</h1>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Infos principales */}
        <div className="grid grid-cols-3 gap-6">

          <input name="title" placeholder="Titre de l'annonce" required onChange={handleChange} className="border p-3 rounded-lg" />

          <input name="brand" placeholder="Marque" required onChange={handleChange} className="border p-3 rounded-lg" />

          <input name="model" placeholder="Modèle" required onChange={handleChange} className="border p-3 rounded-lg" />

          <input type="number" name="year" placeholder="Année" required onChange={handleChange} className="border p-3 rounded-lg" />

          <select name="type" required onChange={handleChange} className="border p-3 rounded-lg">
            <option value="">Type</option>
            <option value="citadine">Citadine</option>
            <option value="berline">Berline</option>
            <option value="suv">SUV/4x4</option>
            <option value="minibus">Minibus</option>
            <option value="pickup">Pick-up</option>
            <option value="moto">Moto</option>
          </select>

          <select name="transmission" required onChange={handleChange} className="border p-3 rounded-lg">
            <option value="">Transmission</option>
            <option value="manuelle">Manuelle</option>
            <option value="automatique">Automatique</option>
          </select>

          <select name="fuel_type" required onChange={handleChange} className="border p-3 rounded-lg">
            <option value="">Carburant</option>
            <option value="essence">Essence</option>
            <option value="diesel">Diesel</option>
            <option value="hybride">Hybride</option>
            <option value="electrique">Électrique</option>
          </select>

          <input type="number" name="seats" placeholder="Places" required onChange={handleChange} className="border p-3 rounded-lg" />

          <input type="number" name="doors" placeholder="Portes" required onChange={handleChange} className="border p-3 rounded-lg" />

          <input name="color" placeholder="Couleur" required onChange={handleChange} className="border p-3 rounded-lg" />

          <input name="plate_number" placeholder="Immatriculation" required onChange={handleChange} className="border p-3 rounded-lg" />

          <select name="city" required onChange={handleChange} className="border p-3 rounded-lg">
            <option value="">Ville</option>
            <option value="abidjan">Abidjan</option>
            <option value="yamoussoukro">Yamoussoukro</option>
            <option value="bouake">Bouaké</option>
            <option value="san_pedro">San-Pédro</option>
            <option value="korhogo">Korhogo</option>
            <option value="daloa">Daloa</option>
            <option value="man">Man</option>
          </select>

        </div>

        {/* Localisation */}
        <textarea
          name="pickup_location"
          placeholder="Lieu de récupération"
          required
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        {/* Description */}
        <textarea
          name="description"
          rows={4}
          required
          placeholder="Décrivez le véhicule..."
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        {/* Prix */}
        <input
          type="number"
          name="price_per_day"
          placeholder="Prix par jour (FCFA)"
          required
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        {price > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            <p>Commission Zando (10%) : {commission.toLocaleString()} FCFA</p>
            <p className="font-bold text-green-600">
              Vous recevez : {ownerGets.toLocaleString()} FCFA
            </p>
          </div>
        )}

        {/* Images */}
        <input
          type="file"
          multiple
          required
          onChange={handleImageChange}
          className="w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold"
        >
          {loading ? "Création..." : "Publier le véhicule"}
        </button>
      </form>
    </div>
  );
}
