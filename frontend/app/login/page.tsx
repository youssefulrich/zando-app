"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("auth/login/", {
        username,
        password,
      });

      // Sauvegardez dans localStorage ET cookies
      const token = res.data.tokens.access;
      const refreshToken = res.data.tokens.refresh;
      
      localStorage.setItem("token", token);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // Sauvegardez aussi dans les cookies pour le middleware
      Cookies.set('token', token, { expires: 7 }); // 7 jours
      Cookies.set('user', JSON.stringify(res.data.user), { expires: 7 });

      alert("Connexion réussie ✅");
      router.push("/");
      router.refresh(); // Force le rafraîchissement
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Identifiants invalides");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-96 space-y-4">
        <h1 className="text-2xl font-bold text-center">Connexion</h1>

        <input
          placeholder="Username ou Email"
          className="w-full border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:bg-gray-400"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <p className="text-center text-sm">
          Pas de compte ?{" "}
          <a href="/register" className="text-orange-600 hover:underline">
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  );
}