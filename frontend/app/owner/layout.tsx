"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
}

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOwnerAccess();
  }, []);

  const checkOwnerAccess = async () => {
    try {
      const userStr = localStorage.getItem("user");

      if (!userStr) {
        router.push("/login");
        return;
      }

      const userData = JSON.parse(userStr);

      if (
        ![
          "proprietaire_vehicule",
          "proprietaire_residence",
          "proprietaire",
          "admin",
        ].includes(userData.user_type)
      ) {
        alert("Accès réservé aux propriétaires");
        router.push("/");
        return;
      }

      setUser(userData);
    } catch (err) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const canManageVehicles =
    user &&
    ["proprietaire_vehicule", "proprietaire", "admin"].includes(
      user.user_type
    );

  const canManageResidences =
    user &&
    ["proprietaire_residence", "proprietaire", "admin"].includes(
      user.user_type
    );

  const navigation = [
    {
      name: "Dashboard",
      href: "/owner/dashboard",
      icon: "📊",
      visible: true,
    },
    {
      name: "Mes Véhicules",
      href: "/owner/vehicles",
      icon: "🚗",
      visible: canManageVehicles,
    },
    {
      name: "Mes Résidences",
      href: "/owner/residences",
      icon: "🏠",
      visible: canManageResidences,
    },
    {
      name: "Réservations",
      href: "/owner/bookings",
      icon: "📅",
      visible: true,
    },
    {
      name: "Gains",
      href: "/owner/earnings",
      icon: "💰",
      visible: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

            <div className="flex items-center gap-3">

              <Link
                href="/"
                className="text-2xl font-bold text-orange-600"
              >
                Zando
              </Link>

              <span className="text-xs md:text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
                Espace Propriétaire
              </span>

            </div>

            <div className="flex items-center justify-between md:justify-end gap-4">

              <span className="text-sm text-gray-600">
                {user?.first_name} {user?.last_name}
              </span>

              <Link
                href="/"
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                Voir le site →
              </Link>

            </div>

          </div>

        </div>
      </header>


      {/* CONTENU */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">


          {/* SIDEBAR */}
          <aside className="w-full md:w-64">

            <nav className="bg-white rounded-lg shadow-md p-4 md:sticky md:top-24">

              <ul className="space-y-2">

                {navigation
                  .filter((item) => item.visible)
                  .map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                            isActive
                              ? "bg-orange-50 text-orange-600 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-xl">
                            {item.icon}
                          </span>

                          <span>
                            {item.name}
                          </span>

                        </Link>
                      </li>
                    );
                  })}
              </ul>


              {/* TYPE COMPTE */}
              <div className="mt-6 pt-4 border-t">

                <div className="text-xs text-gray-500 mb-2">
                  Type de compte
                </div>

                <div className="text-sm font-medium text-orange-600">

                  {user?.user_type ===
                    "proprietaire_vehicule" &&
                    "🚗 Véhicules"}

                  {user?.user_type ===
                    "proprietaire_residence" &&
                    "🏠 Résidences"}

                  {user?.user_type ===
                    "proprietaire" &&
                    "🚗🏠 Tout"}

                  {user?.user_type ===
                    "admin" &&
                    "⚙️ Admin"}

                </div>

              </div>

            </nav>

          </aside>


          {/* MAIN */}
          <main className="flex-1">

            {children}

          </main>


        </div>

      </div>

    </div>
  );
}