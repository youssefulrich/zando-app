"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // ✅ Installer lucide-react si nécessaire

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
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ✅ État menu mobile

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove("token");
    router.push("/login");
    router.refresh();
  };

  const initials = (f?: string, l?: string) =>
    `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();

  // ✅ Vérifier si propriétaire
  const isOwner = user && [
    'proprietaire_vehicule',
    'proprietaire_residence',
    'proprietaire',
    'admin'
  ].includes(user.user_type);

  // ✅ Fermer le menu mobile quand on clique sur un lien
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="text-2xl font-extrabold tracking-tight text-orange-600"
        >
          Zando
        </Link>

        {/* ✅ MENU DESKTOP (caché sur mobile) */}
        <div className="hidden md:flex gap-6 font-medium text-gray-700">
          <Link href="/residences" className="hover:text-orange-600">
            Résidences
          </Link>
          <Link href="/vehicles" className="hover:text-orange-600">
            Véhicules
          </Link>
          <Link href="#" className="hover:text-orange-600">
            Restaurant
          </Link>
          <Link href="#" className="hover:text-orange-600">
            Evenements
          </Link>
        </div>

        {/* USER & HAMBURGER */}
        <div className="flex items-center gap-3">
          {/* ✅ Bouton Mon Espace (desktop) */}
          {isOwner && (
            <Link
              href="/owner/dashboard"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Mon Espace</span>
            </Link>
          )}

          {/* ✅ BOUTON HAMBURGER (mobile uniquement) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* USER DESKTOP */}
          {user ? (
            <div className="hidden md:block relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 rounded-full bg-orange-600 text-white flex items-center justify-center font-semibold"
              >
                {initials(user.first_name, user.last_name)}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border">
                  <div className="p-3 border-b text-sm">
                    <p className="font-semibold">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-gray-500 text-xs">{user.email}</p>
                  </div>

                  {isOwner && (
                    <Link
                      href="/owner/dashboard"
                      className="md:hidden flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Espace Propriétaire
                    </Link>
                  )}

                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-50">
                    Mon profil
                  </Link>

                  <Link href="/bookings" className="block px-4 py-2 hover:bg-gray-50">
                    Mes réservations
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex gap-3">
              <Link href="/login" className="px-4 py-2 font-medium">
                Connexion
              </Link>
              <Link
                href="/register"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ✅ MENU MOBILE (slide-in) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 border-t">
          <div className="p-6 space-y-4">
            
            {/* Navigation */}
            <div className="space-y-2">
              <Link
                href="/residences"
                onClick={closeMobileMenu}
                className="block py-3 px-4 rounded-lg hover:bg-gray-100 font-medium"
              >
                Résidences
              </Link>
              <Link
                href="/vehicles"
                onClick={closeMobileMenu}
                className="block py-3 px-4 rounded-lg hover:bg-gray-100 font-medium"
              >
                Véhicules
              </Link>
              <Link
                href="#"
                onClick={closeMobileMenu}
                className="block py-3 px-4 rounded-lg hover:bg-gray-100 font-medium"
              >
                Restaurant
              </Link>
              <Link
                href="#"
                onClick={closeMobileMenu}
                className="block py-3 px-4 rounded-lg hover:bg-gray-100 font-medium"
              >
                Evenements
              </Link>
            </div>

            {user ? (
              <>
                {/* Mon Espace (mobile) */}
                {isOwner && (
                  <Link
                    href="/owner/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 py-3 px-4 bg-orange-50 text-orange-700 rounded-lg font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Mon Espace
                  </Link>
                )}

                {/* User info */}
                <div className="border-t pt-4">
                  <p className="px-4 font-semibold mb-3">
                    {user.first_name} {user.last_name}
                  </p>
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="block py-3 px-4 rounded-lg hover:bg-gray-100"
                  >
                    Mon profil
                  </Link>
                  <Link
                    href="/bookings"
                    onClick={closeMobileMenu}
                    className="block py-3 px-4 rounded-lg hover:bg-gray-100"
                  >
                    Mes réservations
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="w-full text-left py-3 px-4 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    Se déconnecter
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-3 border-t pt-4">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="block py-3 px-4 text-center border-2 border-gray-300 rounded-lg font-medium"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="block py-3 px-4 text-center bg-orange-600 text-white rounded-lg font-medium"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}