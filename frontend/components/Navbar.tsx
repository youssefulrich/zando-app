"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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
    <nav className="sticky top-0 z-50 bg-white shadow-md">

      {/* ===== MAIN BAR ===== */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="text-2xl font-extrabold text-orange-600">
          Zando
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6 font-medium text-gray-700">
          <Link href="/residences" className="hover:text-orange-600">
            Résidences
          </Link>
          <Link href="/vehicles" className="hover:text-orange-600">
            Véhicules
          </Link>
          <Link href="#">Restaurant</Link>
          <Link href="/events">Evenements</Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* SEARCH (Desktop) */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-transparent outline-none text-sm w-40"
            />
          </div>

          {/* USER DESKTOP */}
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
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border">
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
              <div className="hidden md:flex gap-3">
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

          {/* HAMBURGER MOBILE */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ===== MOBILE SEARCH ===== */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 shadow-inner">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button className="bg-black text-white rounded-full p-2 ml-2">
            →
          </button>
        </div>
      </div>

      {/* ===== MOBILE DROPDOWN ===== */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white px-6 py-6 space-y-5 border-t shadow-lg">
          <Link href="/residences" onClick={() => setMobileMenuOpen(false)}>
            Résidences
          </Link>

          <Link href="/vehicles" onClick={() => setMobileMenuOpen(false)}>
            Véhicules
          </Link>

          <Link href="#">Restaurant</Link>
          <Link href="/events">Evenements</Link>

          <hr />

          {user ? (
            <>
              {isOwner && (
                <Link
                  href="/owner/dashboard"
                  className="text-orange-600 font-medium"
                >
                  Espace Propriétaire
                </Link>
              )}

              <Link href="/profile">Mon profil</Link>
              <Link href="/bookings">Mes réservations</Link>

              <button onClick={handleLogout} className="text-red-600">
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
      </div>
    </nav>
  );
}