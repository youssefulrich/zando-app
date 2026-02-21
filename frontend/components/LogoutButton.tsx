// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Supprimez tout
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    Cookies.remove("token");
    Cookies.remove("user");
    
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Se déconnecter
    </button>
  );
}
