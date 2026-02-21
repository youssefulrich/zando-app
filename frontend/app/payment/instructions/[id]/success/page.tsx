"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  
  const [payment, setPayment] = useState<any>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (paymentId) {
      fetchPayment();
    }
  }, [paymentId]);

  const fetchPayment = async () => {
    try {
      const res = await api.get(`payments/${paymentId}/`);
      setPayment(res.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer les détails du paiement");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const handleUploadProof = async () => {
    if (!proofFile) {
      alert("Veuillez sélectionner une capture d'écran");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("payment_proof", proofFile);

      await api.patch(`payments/${paymentId}/upload_proof/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Preuve de paiement envoyée avec succès !");
      router.push("/bookings");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erreur lors de l'envoi");
    } finally {
      setUploading(false);
    }
  };

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Confirmation */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Paiement créé avec succès !
            </h1>
            <p className="text-gray-600">
              Votre demande de paiement a été enregistrée
            </p>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-bold text-lg mb-4">Détails du paiement</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Référence :</span>
                <span className="font-semibold">{payment.transaction_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Montant :</span>
                <span className="font-semibold text-orange-600">
                  {payment.amount.toLocaleString()} FCFA
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Méthode :</span>
                <span className="font-semibold uppercase">{payment.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Statut :</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  En attente de vérification
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Upload de preuve */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">
            Étape suivante : Envoyer la preuve de paiement
          </h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>📸 Important :</strong> Pour valider votre réservation, 
              veuillez envoyer une capture d'écran de votre transaction 
              {payment.payment_method === 'wave' && ' Wave'}
              {payment.payment_method === 'orange_money' && ' Orange Money'}
              {payment.payment_method === 'mtn_money' && ' MTN Money'}.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capture d'écran de la transaction
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-orange-50 file:text-orange-700
                hover:file:bg-orange-100
                cursor-pointer"
            />
            {proofFile && (
              <p className="mt-2 text-sm text-green-600">
                ✓ Fichier sélectionné : {proofFile.name}
              </p>
            )}
          </div>

          <button
            onClick={handleUploadProof}
            disabled={!proofFile || uploading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-400"
          >
            {uploading ? "Envoi en cours..." : "Envoyer la preuve de paiement"}
          </button>

          <p className="mt-4 text-sm text-gray-500 text-center">
            Vous pouvez aussi envoyer la preuve plus tard depuis{" "}
            <button
              onClick={() => router.push("/bookings")}
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              Mes réservations
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}