"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { 
  Menu, 
  X, 
  Search, 
  Home,
  Car,
  Calendar,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));

    // Detect scroll for navbar style change
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove("token");
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  const initials = (f?: string, l?: string) =>
    `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();

  const isOwner =
    user &&
    ["proprietaire_vehicule", "proprietaire_residence", "proprietaire", "admin"].includes(
      user.user_type
    );

  const navLinks = [
    { href: "/residences", label: "Résidences", icon: Home },
    { href: "/vehicles", label: "Véhicules", icon: Car },
    { href: "/events", label: "Événements", icon: Calendar },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled 
            ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50" 
            : "bg-white/95 backdrop-blur-md shadow-sm"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* ===== LOGO ===== */}
            <Link 
              href="/" 
              className="flex items-center gap-2 group"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Zando
              </span>
            </Link>

            {/* ===== DESKTOP NAVIGATION ===== */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-2 rounded-xl font-medium transition-all
                    flex items-center gap-2
                    ${isActive(link.href)
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                    }
                  `}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                  
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* ===== RIGHT SIDE ===== */}
            <div className="flex items-center gap-3">

              {/* SEARCH BAR (Desktop) */}
              <div className="hidden lg:flex items-center bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 transition-colors group">
                <Search size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="bg-transparent outline-none text-sm w-40 ml-2 placeholder:text-gray-400"
                />
                <kbd className="hidden xl:inline-flex h-5 px-1.5 items-center gap-1 rounded border bg-white font-mono text-[10px] font-medium text-gray-400">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>

              {/* USER SECTION */}
              {user ? (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-lg">
                      {initials(user.first_name, user.last_name)}
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0" 
                          onClick={() => setShowDropdown(false)}
                        />
                        
                        {/* Dropdown */}
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                        >
                          {/* User Info */}
                          <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-b border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {initials(user.first_name, user.last_name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 truncate">
                                  {user.first_name} {user.last_name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                              </div>
                            </div>
                            
                            {/* Badge Type */}
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              {user.user_type === "proprietaire" && "Propriétaire"}
                              {user.user_type === "proprietaire_vehicule" && "Propriétaire véhicules"}
                              {user.user_type === "proprietaire_residence" && "Propriétaire résidences"}
                              {user.user_type === "client" && "Client"}
                              {user.user_type === "admin" && "Admin"}
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="p-2">
                            {isOwner && (
                              <Link
                                href="/owner/dashboard"
                                onClick={() => setShowDropdown(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 text-orange-600 font-medium transition-colors group"
                              >
                                <Building2 className="w-5 h-5" />
                                <span>Espace Propriétaire</span>
                                <Sparkles className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                            )}

                            <Link
                              href="/profile"
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                              <User className="w-5 h-5 text-gray-500" />
                              <span>Mon profil</span>
                            </Link>

                            <Link
                              href="/bookings"
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                              <Calendar className="w-5 h-5 text-gray-500" />
                              <span>Mes réservations</span>
                            </Link>

                            <Link
                              href="/settings"
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                              <Settings className="w-5 h-5 text-gray-500" />
                              <span>Paramètres</span>
                            </Link>
                          </div>

                          {/* Logout */}
                          <div className="p-2 border-t border-gray-100">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 font-medium transition-colors"
                            >
                              <LogOut className="w-5 h-5" />
                              <span>Se déconnecter</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 font-medium text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* ===== MOBILE MENU ===== */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
                style={{ top: '64px' }}
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden bg-white border-t border-gray-200 shadow-2xl"
              >
                <div className="p-4 space-y-2 max-h-[calc(100vh-64px)] overflow-y-auto">
                  
                  {/* Search Mobile */}
                  <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
                    <Search size={18} className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="flex-1 bg-transparent outline-none text-sm"
                    />
                  </div>

                  {/* Navigation Links */}
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
                        ${isActive(link.href)
                          ? "bg-orange-50 text-orange-600"
                          : "hover:bg-gray-50"
                        }
                      `}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  ))}

                  {/* User Section Mobile */}
                  {user ? (
                    <>
                      <div className="my-4 border-t border-gray-200" />
                      
                      {/* User Info */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-lg">
                          {initials(user.first_name, user.last_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>

                      {isOwner && (
                        <Link
                          href="/owner/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-50 text-orange-600 font-medium"
                        >
                          <Building2 className="w-5 h-5" />
                          Espace Propriétaire
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50"
                      >
                        <User className="w-5 h-5 text-gray-500" />
                        Mon profil
                      </Link>

                      <Link
                        href="/bookings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50"
                      >
                        <Calendar className="w-5 h-5 text-gray-500" />
                        Mes réservations
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-medium"
                      >
                        <LogOut className="w-5 h-5" />
                        Se déconnecter
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="my-4 border-t border-gray-200" />
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 text-center font-medium hover:bg-gray-50 rounded-xl"
                      >
                        Connexion
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 text-center bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold shadow-lg"
                      >
                        S'inscrire
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer to prevent content jump */}
      <div className="h-16" />
    </>
  );
}