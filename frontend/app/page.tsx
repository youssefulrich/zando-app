"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Car, 
  Home, 
  Calendar, 
  Shield, 
  Zap, 
  Users, 
  Star,
  TrendingUp,
  Award,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Search
} from "lucide-react";

/* ================================================= */
/* ================= HOME ========================== */
/* ================================================= */

export default function HomePage() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  return (
    <main className="bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-x-hidden">
      <Hero opacity={opacity} scale={scale} />
      <TrustedBy />
      <Stats />
      <Services />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}

/* ================================================= */
/* ================= HERO ========================== */
/* ================================================= */

function Hero({ opacity, scale }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const slides = [
    {
      title: "Trouvez votre",
      highlight: "résidence idéale",
      subtitle: "Des milliers de logements vérifiés partout en Côte d'Ivoire",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
      cta: "Explorer les logements",
      href: "/residences",
      color: "from-orange-600 to-red-600"
    },
    {
      title: "Louez la",
      highlight: "voiture parfaite",
      subtitle: "Des véhicules récents et assurés disponibles 24/7",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d",
      cta: "Voir les véhicules",
      href: "/vehicles",
      color: "from-blue-600 to-indigo-600"
    },
    {
      title: "Vivez des",
      highlight: "moments uniques",
      subtitle: "Découvrez les meilleurs événements et expériences",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      cta: "Découvrir les événements",
      href: "/events",
      color: "from-purple-600 to-pink-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = slides[currentIndex];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      
      {/* Background Images avec transition */}
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentIndex ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
        </motion.div>
      ))}

      {/* Animated Blobs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content */}
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        style={{ opacity, scale }}
      >
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8"
        >
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-medium">La plateforme #1 en Côte d'Ivoire</span>
        </motion.div>

        {/* Title with animation */}
        <motion.h1
          key={currentIndex}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 leading-tight"
        >
          {current.title}
          <span className={`block mt-2 bg-gradient-to-r ${current.color} bg-clip-text text-transparent`}>
            {current.highlight}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          key={`subtitle-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto"
        >
          {current.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href={current.href}
            className={`
              group inline-flex items-center gap-3 px-8 py-5 rounded-2xl font-bold text-lg
              bg-gradient-to-r ${current.color} text-white
              shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300
            `}
          >
            {current.cta}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-8 py-5 rounded-2xl font-semibold text-lg bg-white/10 backdrop-blur-md border-2 border-white/20 text-white hover:bg-white/20 transition-all"
          >
            En savoir plus
          </Link>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16"
        >
          {[
            { icon: Home, value: "1000+", label: "Logements" },
            { icon: Car, value: "500+", label: "Véhicules" },
            { icon: Users, value: "10k+", label: "Clients" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="w-8 h-8 text-white/80 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-white/60 rounded-full" />
        </div>
      </motion.div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 right-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              w-3 h-3 rounded-full transition-all
              ${index === currentIndex ? 'bg-white w-8' : 'bg-white/40'}
            `}
          />
        ))}
      </div>
    </section>
  );
}

/* ================================================= */
/* ================= TRUSTED BY ==================== */
/* ================================================= */

function TrustedBy() {
  const partners = [
    { name: "Orange Money", logo: "🟠" },
    { name: "Wave", logo: "🌊" },
    { name: "MTN", logo: "📱" },
    { name: "Moov", logo: "📞" },
  ];

  return (
    <section className="py-16 border-y border-gray-200 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
          Paiements sécurisés par
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12">
          {partners.map((partner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 text-2xl font-bold text-gray-400"
            >
              <span className="text-4xl">{partner.logo}</span>
              <span>{partner.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================= */
/* ================= STATS ========================= */
/* ================================================= */

function Stats() {
  const stats = [
    { icon: Home, value: "1,000+", label: "Logements disponibles", color: "text-orange-600" },
    { icon: Car, value: "500+", label: "Véhicules en location", color: "text-blue-600" },
    { icon: Calendar, value: "120+", label: "Événements par mois", color: "text-purple-600" },
    { icon: Users, value: "10,000+", label: "Clients satisfaits", color: "text-green-600" },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================= */
/* ================= SERVICES ====================== */
/* ================================================= */

function Services() {
  const services = [
    {
      icon: Home,
      title: "Résidences",
      desc: "Appartements, villas, studios - trouvez votre chez-vous idéal",
      features: ["Vérifiés", "Assurés", "Support 24/7"],
      color: "from-orange-500 to-red-500",
      href: "/residences"
    },
    {
      icon: Car,
      title: "Véhicules",
      desc: "Voitures, SUV, minibus - louez en quelques clics",
      features: ["Récents", "Propres", "Flexibles"],
      color: "from-blue-500 to-indigo-500",
      href: "/vehicles"
    },
    {
      icon: Calendar,
      title: "Événements",
      desc: "Concerts, festivals, soirées - vivez des moments uniques",
      features: ["Variés", "Abordables", "Mémorables"],
      color: "from-purple-500 to-pink-500",
      href: "/events"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
          >
            Tout ce dont vous avez besoin
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            Une plateforme complète pour simplifier votre quotidien
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <Link href={service.href}>
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all h-full">
                  
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.color} mb-6 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-6">{service.desc}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-gray-900 font-semibold group-hover:gap-4 transition-all">
                    <span>Découvrir</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================= */
/* ================= HOW IT WORKS ================== */
/* ================================================= */

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Explorez",
      desc: "Parcourez nos milliers d'annonces vérifiées",
      icon: Search
    },
    {
      number: "02",
      title: "Réservez",
      desc: "Choisissez et réservez en quelques clics",
      icon: CheckCircle2
    },
    {
      number: "03",
      title: "Payez",
      desc: "Paiement sécurisé par Orange Money, Wave, MTN",
      icon: Shield
    },
    {
      number: "04",
      title: "Profitez",
      desc: "Récupérez et vivez votre expérience",
      icon: Star
    }
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600">
            Simple, rapide et sécurisé
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              {/* Connector Line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-orange-200 to-blue-200" />
              )}

              {/* Circle */}
              <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-blue-500 rounded-full mb-6 shadow-xl">
                <step.icon className="w-10 h-10 text-white" />
              </div>

              {/* Number */}
              <div className="text-6xl font-black text-gray-100 mb-2">{step.number}</div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              
              {/* Description */}
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================= */
/* ================= TESTIMONIALS ================== */
/* ================================================= */

function Testimonials() {
  const testimonials = [
    {
      name: "Aya Kouassi",
      role: "Cliente résidence",
      avatar: "👩🏾",
      text: "Service impeccable ! J'ai trouvé mon appartement en moins de 24h. Interface moderne et équipe réactive.",
      rating: 5
    },
    {
      name: "Koffi Yao",
      role: "Location véhicule",
      avatar: "👨🏾",
      text: "Louer une voiture n'a jamais été aussi simple. Paiement sécurisé et véhicule impeccable !",
      rating: 5
    },
    {
      name: "Fatou Diarra",
      role: "Événements",
      avatar: "👩🏿",
      text: "J'ai découvert des événements incroyables grâce à Zando. La plateforme est intuitive et les prix sont top !",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Ils nous font confiance
          </h2>
          <div className="flex items-center justify-center gap-2 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-current" />
            ))}
            <span className="ml-2 text-gray-600 font-semibold">4.9/5 sur 2000+ avis</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(test.rating)].map((_, idx) => (
                  <Star key={idx} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 mb-6 italic">"{test.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="text-4xl">{test.avatar}</div>
                <div>
                  <div className="font-bold text-gray-900">{test.name}</div>
                  <div className="text-sm text-gray-500">{test.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================= */
/* ================= CTA =========================== */
/* ================================================= */

function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <Award className="w-16 h-16 text-white mx-auto mb-6" />
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Prêt à commencer ?
          </h2>
          
          <p className="text-xl text-white/90 mb-10">
            Rejoignez des milliers d'utilisateurs satisfaits et découvrez une nouvelle façon de louer
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-5 bg-white text-orange-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
            >
              Créer un compte gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              href="/residences"
              className="inline-flex items-center gap-2 px-8 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all"
            >
              Explorer maintenant
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================= */
/* ================= FOOTER ======================== */
/* ================================================= */

function Footer() {
  const links = {
    "Entreprise": ["À propos", "Carrières", "Blog", "Presse"],
    "Services": ["Résidences", "Véhicules", "Événements", "Restaurant"],
    "Support": ["Centre d'aide", "Contact", "FAQ", "Conditions"],
    "Suivez-nous": ["Facebook", "Instagram", "Twitter", "LinkedIn"]
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top */}
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
              Zando
            </h3>
            <p className="text-gray-400 mb-6">
              La plateforme #1 pour la location en Côte d'Ivoire
            </p>
            <div className="flex gap-4">
              {["🟠", "🌊", "📱"].map((icon, i) => (
                <div key={i} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-bold mb-4">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Zando. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="#" className="hover:text-white">Confidentialité</Link>
            <Link href="#" className="hover:text-white">Conditions</Link>
            <Link href="#" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}