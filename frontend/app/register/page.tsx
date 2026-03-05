"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    phone: "",
    user_type: "client",

    // Paiements
    wave_number: "",
    orange_money_number: "",
    mtn_money_number: "",
    moov_money_number: "",
  });

  const [accountType, setAccountType] = useState<"client" | "owner">("client");

  const [ownerType, setOwnerType] = useState<
    | "proprietaire_vehicule"
    | "proprietaire_residence"
    | "proprietaire_event"
    | "proprietaire"
  >("proprietaire");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const finalUserType =
      accountType === "client" ? "client" : ownerType;

    // Validation paiement propriétaire
    if (
      accountType === "owner" &&
      !formData.wave_number &&
      !formData.orange_money_number &&
      !formData.mtn_money_number &&
      !formData.moov_money_number
    ) {
      setError("Veuillez renseigner au moins un moyen de paiement.");
      setLoading(false);
      return;
    }

    try {
      await api.post("auth/register/", {
        ...formData,
        user_type: finalUserType,
      });

      alert("✅ Inscription réussie !");
      router.push("/login");

    } catch (err: any) {
      const errorMsg =
        err.response?.data?.email?.[0] ||
        err.response?.data?.username?.[0] ||
        err.response?.data?.password?.[0] ||
        err.response?.data?.detail ||
        "Erreur lors de l'inscription";

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">

        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-orange-600">
            Zando
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Créer un compte
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* TYPE COMPTE */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAccountType("client")}
              className={`p-4 border-2 rounded-lg ${
                accountType === "client"
                  ? "border-orange-600 bg-orange-50"
                  : "border-gray-200"
              }`}
            >
              👤 Client
            </button>

            <button
              type="button"
              onClick={() => setAccountType("owner")}
              className={`p-4 border-2 rounded-lg ${
                accountType === "owner"
                  ? "border-orange-600 bg-orange-50"
                  : "border-gray-200"
              }`}
            >
              🏢 Propriétaire
            </button>
          </div>

          {/* TYPE OWNER */}
          {accountType === "owner" && (
            <select
              value={ownerType}
              onChange={(e) =>
                setOwnerType(e.target.value as any)
              }
              className="w-full border p-3 rounded-lg"
            >
              <option value="proprietaire_vehicule">
                Véhicules uniquement
              </option>

              <option value="proprietaire_residence">
                Résidences uniquement
              </option>

              <option value="proprietaire_event">
                Événements uniquement
              </option>

              <option value="proprietaire">
                Tout (véhicules + résidences + événements)
              </option>
            </select>
          )}

          {/* INFOS PERSONNELLES */}
          <input
            type="text"
            placeholder="Prénom"
            required
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Nom"
            required
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Nom d'utilisateur"
            required
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="tel"
            placeholder="Téléphone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            required
            value={formData.password_confirm}
            onChange={(e) =>
              setFormData({ ...formData, password_confirm: e.target.value })
            }
            className="w-full border p-3 rounded-lg"
          />

          {/* PAIEMENTS */}
          {accountType === "owner" && (
            <div className="border-t pt-6 space-y-3">
              <h3 className="font-semibold">
                Moyens de paiement
              </h3>
              <p className="text-sm text-gray-500">
                Renseignez au moins un numéro.
              </p>

              <input
                type="text"
                placeholder="Numéro Wave"
                value={formData.wave_number}
                onChange={(e) =>
                  setFormData({ ...formData, wave_number: e.target.value })
                }
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="text"
                placeholder="Numéro Orange Money"
                value={formData.orange_money_number}
                onChange={(e) =>
                  setFormData({ ...formData, orange_money_number: e.target.value })
                }
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="text"
                placeholder="Numéro MTN Money"
                value={formData.mtn_money_number}
                onChange={(e) =>
                  setFormData({ ...formData, mtn_money_number: e.target.value })
                }
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="text"
                placeholder="Numéro Moov Money"
                value={formData.moov_money_number}
                onChange={(e) =>
                  setFormData({ ...formData, moov_money_number: e.target.value })
                }
                className="w-full border p-3 rounded-lg"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-orange-600 font-semibold">
            Se connecter
          </Link>
        </p>

      </div>
    </div>
  );
}