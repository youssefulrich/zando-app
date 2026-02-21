"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  user_type: string;
  city?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 h-32"></div>
          
          {/* Avatar */}
          <div className="relative px-6 pb-6">
            <div className="flex items-end -mt-16">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-4xl font-bold text-orange-600">
                  {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                </span>
              </div>
              <div className="ml-6 pb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="text-gray-500">{user.user_type}</p>
              </div>
            </div>

            {/* Informations */}
            <div className="mt-8 space-y-4">
              <div className="border-b pb-4">
                <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom d'utilisateur</p>
                    <p className="font-medium">{user.username}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  
                  {user.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  )}
                  
                  {user.city && (
                    <div>
                      <p className="text-sm text-gray-500">Ville</p>
                      <p className="font-medium">{user.city}</p>
                    </div>
                  )}
                </div>
              </div>

              <button className="w-full md:w-auto bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition">
                Modifier le profil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}