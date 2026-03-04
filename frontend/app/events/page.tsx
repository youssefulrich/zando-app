"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Ticket,
  TrendingUp,
  Search,
  Filter,
  Star,
  Heart,
  Share2,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  time: string;
  price: number;
  capacity: number;
  category: string;
  featured: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://zando-backend.onrender.com';
      const res = await fetch(`${API_URL}/api/events/`);
      
      if (!res.ok) throw new Error('Erreur de chargement');
      
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Erreur fetch événements:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", label: "Tous", icon: Sparkles },
    { id: "concert", label: "Concerts", icon: Users },
    { id: "festival", label: "Festivals", icon: Star },
    { id: "sport", label: "Sports", icon: TrendingUp },
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative h-[60vh] bg-gradient-to-br from-purple-100 to-pink-200 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="h-64 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">

      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
            alt="Événements"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-pink-900/70 to-red-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Animated Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-6 text-white">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">120+ événements ce mois-ci</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Vivez des
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              moments inoubliables
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Concerts • Festivals • Sports • Soirées
            <span className="block mt-2">partout en Côte d'Ivoire 🇨🇮</span>
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un événement, artiste ou lieu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/95 backdrop-blur-xl rounded-2xl pl-14 pr-6 py-5 text-gray-900 placeholder:text-gray-500 font-medium shadow-2xl border border-white/20 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                  ${selectedCategory === cat.id
                    ? "bg-white text-purple-600 shadow-xl"
                    : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                  }
                `}
              >
                <cat.icon className="w-5 h-5" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">120+</div>
              <div className="text-sm text-gray-300">Événements</div>
            </div>
            <div className="text-center border-x border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">50k+</div>
              <div className="text-sm text-gray-300">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">4.8★</div>
              <div className="text-sm text-gray-300">Note moyenne</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ================= CONTENT SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Événements à venir
            </h2>
            <p className="text-gray-600 flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              <span className="font-medium text-purple-600">{filteredEvents.length}</span>
              {filteredEvents.length > 1 ? "événements trouvés" : "événement trouvé"}
            </p>
          </div>
        </div>

        {/* Results */}
        {filteredEvents.length === 0 ? (
          
          /* Empty State */
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Aucun événement trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier votre recherche ou catégorie
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>

        ) : (
          
          /* Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Featured Badge */}
                    {event.featured && (
                      <div className="absolute top-4 left-4 flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        <Star className="w-3 h-3 fill-current" />
                        À LA UNE
                      </div>
                    )}

                    {/* Actions */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                        <Heart className="w-4 h-4 text-gray-700" />
                      </button>
                      <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                        <Share2 className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                      <span className="text-lg font-bold text-purple-600">
                        {event.price ? `${event.price.toLocaleString()} FCFA` : "Gratuit"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    
                    {/* Category Badge */}
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold mb-3">
                      <Sparkles className="w-3 h-3" />
                      {event.category || "Concert"}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {event.title}
                    </h3>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span>{new Date(event.date).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}</span>
                      </div>

                      {event.time && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-purple-500" />
                          <span>{event.time}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-purple-500" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>

                      {event.capacity && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-purple-500" />
                          <span>{event.capacity} places</span>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/events/${event.id}`}
                      className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all group/btn"
                    >
                      <span>Réserver maintenant</span>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ================= CTA SECTION ================= */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calendar className="w-16 h-16 text-purple-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Organisez votre événement
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Vous organisez un concert, festival ou événement ? Publiez-le sur Zando !
          </p>
          <Link
            href="/events/create"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Créer un événement
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}