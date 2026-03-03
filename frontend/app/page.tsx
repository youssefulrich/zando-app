"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Typewriter from "@/components/Typewriter";

/* ================================================= */
/* ================= HOME ========================== */
/* ================================================= */

export default function Home() {
  return (
    <main className="bg-gray-50 overflow-x-hidden">
      <Hero />
      <Stats />
      <Features />
      <TopEvents />
      <TopResidences />
      <Footer />
    </main>
  );
}

/* ================================================= */
/* ================= HERO ========================== */
/* ================================================= */

function Hero() {
  const images = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setIndex((p) => (p + 1) % images.length);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  return (
    <section
      className="relative h-[90vh] flex items-center justify-center text-white bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${images[index]})` }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative text-center max-w-3xl px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          <Typewriter
            words={[
              "Découvrez Zando",
              "Trouvez votre résidence idéale",
              "Louez la voiture parfaite",
              "Réservez vos événements",
              "Tout en 2 minutes",
            ]}
          />
        </h1>

        <p className="mb-10 opacity-90">
          Logements • Véhicules • Événements • Tout en un seul endroit
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/residences" className="bg-orange-600 px-8 py-4 rounded-xl">
            Trouver un logement
          </Link>

          <Link href="/vehicles" className="bg-white text-black px-8 py-4 rounded-xl">
            Louer un véhicule
          </Link>

          <Link href="/events" className="bg-yellow-500 px-8 py-4 rounded-xl">
            Voir les événements
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================================================= */
/* ================= STATS ========================= */
/* ================================================= */

function Stats() {
  const items = [
    { label: "Logements", value: "500+" },
    { label: "Véhicules", value: "300+" },
    { label: "Événements", value: "120+" },
    { label: "Clients", value: "10k+" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 text-center gap-10">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <h3 className="text-3xl font-bold text-orange-600">{item.value}</h3>
            <p className="text-gray-600">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ================================================= */
/* ================= FEATURES ====================== */
/* ================================================= */

function Features() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
      {[
        ["Résidences", "Appartements, villas, hôtels", "🏠", "/residences"],
        ["Véhicules", "SUV, voitures, motos", "🚗", "/vehicles"],
        ["Événements", "Concerts, festivals, soirées", "🎉", "/events"],
      ].map(([t, d, i, l], idx) => (
        <Card key={idx} title={t} desc={d} icon={i} link={l} />
      ))}
    </section>
  );
}

/* ================================================= */
/* ================= EVENTS ======================== */
/* ================================================= */

function TopEvents() {
  const events = [
    {
      id: 1,
      title: "Afro Beach Party",
      date: "12 Avril 2025",
      location: "Abidjan",
      price: "10 000 FCFA",
    },
    {
      id: 2,
      title: "Concert Live Urbain",
      date: "25 Avril 2025",
      location: "Yamoussoukro",
      price: "15 000 FCFA",
    },
    {
      id: 3,
      title: "Festival Afro Culture",
      date: "10 Mai 2025",
      location: "Bouaké",
      price: "8 000 FCFA",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <h2 className="text-3xl font-bold text-center mb-10">
        Événements à venir 🎉
      </h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6">
        {events.map((event) => (
          <motion.div
            key={event.id}
            whileHover={{ y: -6 }}
            className="bg-gray-50 rounded-2xl shadow-md p-6"
          >
            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-2">📍 {event.location}</p>
            <p className="text-gray-500 mb-2">📅 {event.date}</p>
            <p className="text-orange-600 font-semibold mb-4">
              💳 {event.price}
            </p>

            <Link
              href={`/events/${event.id}`}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              Réserver
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ================================================= */
/* ================= TOP RESIDENCES ================ */
/* ================================================= */

function TopResidences() {
  const demo = [1, 2, 3];

  return (
    <section className="py-20 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-10">
        Top Résidences 🔥
      </h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6">
        {demo.map((i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6 }}
            className="bg-white rounded-2xl shadow-lg h-64 flex items-center justify-center"
          >
            Résidence {i}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ================================================= */
/* ================= CARD ========================== */
/* ================================================= */

function Card({ title, desc, icon, link }: any) {
  return (
    <motion.div whileHover={{ y: -6 }}>
      <Link
        href={link}
        className="bg-white p-10 rounded-2xl shadow-md block text-center"
      >
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-gray-600">{desc}</p>
      </Link>
    </motion.div>
  );
}

/* ================================================= */
/* ================= FOOTER ======================== */
/* ================================================= */

function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-10 text-center">
      ©️ {new Date().getFullYear()} Zando • Paiement sécurisé • Support 24/7
    </footer>
  );
}