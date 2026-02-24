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
  const [menuOpen, setMenuOpen] = useState(false);
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

  const isOwner = user && [
    "proprietaire_vehicule",
    "proprietaire_residence",
    "proprietaire",
    "admin"
  ].includes(user.user_type);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b">

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-bold text-orange-600"
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

          <Link href="#" className="hover:text-orange-600">
            Restaurant
          </Link>

          <Link href="#" className="hover:text-orange-600">
            Evènements
          </Link>

        </div>



        {/* DROITE */}
        <div className="flex items-center gap-3">

          {/* ESPACE PROPRIETAIRE */}
          {isOwner && (
            <Link
              href="/owner/dashboard"
              className="hidden md:block bg-orange-100 px-4 py-2 rounded-lg text-orange-700"
            >
              Mon Espace
            </Link>
          )}


          {/* USER */}
          {user ? (
            <div className="relative">

              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 rounded-full bg-orange-600 text-white flex items-center justify-center"
              >
                {initials(user.first_name, user.last_name)}
              </button>


              {showDropdown && (

                <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-xl border">

                  <div className="p-3 border-b text-sm">
                    <p className="font-semibold">
                      {user.first_name} {user.last_name}
                    </p>

                    <p className="text-gray-500 text-xs">
                      {user.email}
                    </p>
                  </div>


                  {isOwner && (

                    <Link
                      href="/owner/dashboard"
                      className="block px-4 py-2 text-orange-600"
                    >
                      Espace propriétaire
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
                    className="w-full text-left px-4 py-2 text-red-600"
                  >
                    Déconnexion
                  </button>

                </div>

              )}

            </div>

          ) : (

            <div className="hidden md:flex gap-3">

              <Link href="/login">
                Connexion
              </Link>

              <Link
                href="/register"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg"
              >
                S'inscrire
              </Link>

            </div>

          )}



          {/* BOUTON MENU MOBILE */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>


        </div>
      </div>



      {/* MENU MOBILE */}
      {menuOpen && (

        <div className="md:hidden bg-white border-t p-4 space-y-3">

          <Link
            href="/residences"
            className="block"
          >
            Résidences
          </Link>

          <Link
            href="/vehicles"
            className="block"
          >
            Véhicules
          </Link>

          <Link
            href="#"
            className="block"
          >
            Restaurant
          </Link>

          <Link
            href="#"
            className="block"
          >
            Evènements
          </Link>


          {isOwner && (

            <Link
              href="/owner/dashboard"
              className="block text-orange-600 font-semibold"
            >
              Mon espace
            </Link>

          )}

        </div>

      )}

    </nav>
  );
}