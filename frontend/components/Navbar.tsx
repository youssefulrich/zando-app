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

  // ✅ Vérifier si propriétaire (adapté aux termes français)
  const isOwner = user && [
    'proprietaire_vehicule',
    'proprietaire_residence',
    'proprietaire',  // = both
    'admin'
  ].includes(user.user_type);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-orange-600"
        >
          Zando
        </Link>

        {/* MENU */}
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

        {/* USER */}
        <div className="flex items-center gap-3">
          {/* ✅ BOUTON ESPACE PROPRIÉTAIRE */}
          {isOwner && (
            <Link
              href="/owner/dashboard"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition font-medium"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>Mon Espace</span>
            </Link>
          )}

          {user ? (
            <div className="relative">
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

                  {/* ✅ LIEN ESPACE PROPRIÉTAIRE dans dropdown (mobile) */}
                  {isOwner && (
                    <Link
                      href="/owner/dashboard"
                      className="md:hidden flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 font-medium"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Espace Propriétaire
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-50"
                  >
                    Mon profil
                  </Link>

                  <Link
                    href="/bookings"
                    className="block px-4 py-2 hover:bg-gray-50"
                  >
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
    </nav>
  );
}