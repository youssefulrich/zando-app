"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Car, 
  Home as HomeIcon, 
  Calendar, 
  DollarSign,
  ArrowLeft,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  Shield,
  Menu,
  X
} from "lucide-react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
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
      icon: LayoutDashboard,
      visible: true,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      name: "Mes Véhicules",
      href: "/owner/vehicles",
      icon: Car,
      visible: canManageVehicles,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      name: "Mes Résidences",
      href: "/owner/residences",
      icon: HomeIcon,
      visible: canManageResidences,
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      name: "Réservations",
      href: "/owner/bookings",
      icon: Calendar,
      visible: true,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      name: "Gains",
      href: "/owner/earnings",
      icon: DollarSign,
      visible: true,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50"
    },
  ];

  const accountTypes = {
    proprietaire_vehicule: {
      label: "Véhicules",
      icon: Car,
      color: "from-blue-500 to-cyan-500"
    },
    proprietaire_residence: {
      label: "Résidences",
      icon: HomeIcon,
      color: "from-orange-500 to-red-500"
    },
    proprietaire: {
      label: "Complet",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500"
    },
    admin: {
      label: "Admin",
      icon: Shield,
      color: "from-gray-700 to-gray-900"
    }
  };

  const currentAccountType = user?.user_type ? accountTypes[user.user_type as keyof typeof accountTypes] : null;

  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-orange-600 animate-pulse" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left Side */}
            <div className="flex items-center gap-4">
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <span className="text-xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Zando
                  </span>
                  <div className="text-xs text-gray-500 font-medium">Espace Propriétaire</div>
                </div>
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              
              {/* Account Type Badge */}
              {currentAccountType && (
                <div className={`hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${currentAccountType.color} rounded-xl text-white shadow-lg`}>
                  <currentAccountType.icon className="w-4 h-4" />
                  <span className="text-sm font-semibold">{currentAccountType.label}</span>
                </div>
              )}

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                  {initials}
                </div>
              </div>

              {/* Back to Site */}
              <Link
                href="/"
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour au site</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">

          {/* ================= SIDEBAR DESKTOP ================= */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              
              {/* Navigation */}
              <nav className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 space-y-1">
                {navigation
                  .filter((item) => item.visible)
                  .map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`
                          group flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden
                          ${isActive
                            ? `${item.bgColor} ${item.color} font-semibold shadow-md`
                            : "text-gray-700 hover:bg-gray-50"
                          }
                        `}
                      >
                        {/* Active Indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-red-500 rounded-r-full"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}

                        <item.icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <span className="flex-1">{item.name}</span>
                        
                        {isActive && (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Link>
                    );
                  })}
              </nav>

              {/* Account Info Card */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate text-sm">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                  </div>
                </div>

                {/* Account Type */}
                {currentAccountType && (
                  <div className={`flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm mb-3`}>
                    <currentAccountType.icon className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold text-gray-900">
                      Compte {currentAccountType.label}
                    </span>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-white/50 rounded-lg transition-colors text-sm text-gray-700"
                  >
                    <User className="w-4 h-4" />
                    <span>Mon profil</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-white/50 rounded-lg transition-colors text-sm text-gray-700"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Paramètres</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors text-sm text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* ================= SIDEBAR MOBILE ================= */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-40"
                  style={{ top: '64px' }}
                />

                {/* Sidebar Panel */}
                <motion.aside
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="fixed left-0 top-16 bottom-0 w-80 bg-white shadow-2xl md:hidden z-50 overflow-y-auto"
                >
                  <div className="p-4 space-y-4">
                    
                    {/* User Info Mobile */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                          {initials}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">
                            {user?.first_name} {user?.last_name}
                          </p>
                          <p className="text-xs text-gray-600">{user?.email}</p>
                        </div>
                      </div>

                      {currentAccountType && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm">
                          <currentAccountType.icon className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-semibold text-gray-900">
                            {currentAccountType.label}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Navigation Mobile */}
                    <nav className="space-y-1">
                      {navigation
                        .filter((item) => item.visible)
                        .map((item) => {
                          const isActive = pathname === item.href;

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                ${isActive
                                  ? `${item.bgColor} ${item.color} font-semibold`
                                  : "text-gray-700 hover:bg-gray-50"
                                }
                              `}
                            >
                              <item.icon className="w-5 h-5" />
                              <span className="flex-1">{item.name}</span>
                              {isActive && <ChevronRight className="w-4 h-4" />}
                            </Link>
                          );
                        })}
                    </nav>

                    {/* Quick Actions Mobile */}
                    <div className="border-t pt-4 space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700"
                      >
                        <User className="w-5 h-5" />
                        <span>Mon profil</span>
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700"
                      >
                        <Settings className="w-5 h-5" />
                        <span>Paramètres</span>
                      </Link>
                      <Link
                        href="/"
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Retour au site</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl text-red-600"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* ================= MAIN CONTENT ================= */}
          <main className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}