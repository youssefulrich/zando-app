"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const isOwner =
    user &&
    ["proprietaire_vehicule", "proprietaire_residence", "proprietaire", "admin"].includes(
      user.user_type
    );

  return (
    <nav className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-orange-600"
        >
          Zando
        </Link>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex gap-6 font-medium text-gray-700">
          <Link href="/residences" className="hover:text-orange-600">
            Résidences
          </Link>
          <Link href="/vehicles" className="hover:text-orange-600">
            Véhicules
          </Link>
          <Link href="#">Restaurant</Link>
          <Link href="#">Evenements</Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* Hamburger Mobile */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

          {/* Desktop user */}
          <div className="hidden md:block">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-9 h-9 rounded-full bg-orange-600 text-white flex items-center justify-center font-semibold"
                >
                  {initials(user.first_name, user.last_name)}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border z-50">
                    <div className="p-3 border-b text-sm">
                      <p className="font-semibold">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>

                    {isOwner && (
                      <Link
                        href="/owner/dashboard"
                        className="block px-4 py-2 text-orange-600 hover:bg-orange-50"
                      >
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
              <div className="flex gap-3">
                <Link href="/login">Connexion</Link>
                <Link
                  href="/register"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full h-screen bg-white z-[9999] p-6 space-y-6 text-lg">
          <Link href="/residences" onClick={() => setMobileMenuOpen(false)}>
            Résidences
          </Link>

          <Link href="/vehicles" onClick={() => setMobileMenuOpen(false)}>
            Véhicules
          </Link>

          <Link href="#">Restaurant</Link>
          <Link href="#">Evenements</Link>

          <hr />

          {user ? (
            <>
              {isOwner && (
                <Link
                  href="/owner/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-orange-600 font-medium"
                >
                  Espace Propriétaire
                </Link>
              )}

              <Link href="/profile">Mon profil</Link>
              <Link href="/bookings">Mes réservations</Link>

              <button
                onClick={handleLogout}
                className="text-red-600 text-left"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Connexion</Link>
              <Link
                href="/register"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg inline-block"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}