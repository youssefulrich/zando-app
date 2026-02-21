"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { ArrowLeft, Upload, X } from "lucide-react";

interface PaymentDetails {
  id: number;
  transaction_id: string;
  amount: number;
  payment_method: string;
  status: string;
}

export default function PaymentInstructionsPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id;

  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [proof, setProof] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  const fetchPaymentDetails = async () => {
    try {
      const res = await api.get(`payments/${paymentId}/`);
      setPayment(res.data);
    } catch {
      toast("Impossible de charger le paiement");
      router.push("/bookings");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TOAST SIMPLE ================= */

  const toast = (msg: string) => {
    const el = document.createElement("div");
    el.innerText = msg;
    el.className =
      "fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-3 rounded-xl text-sm shadow-xl z-50";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  /* ================= FILE SELECT ================= */

  const handleFile = (file: File | null) => {
    if (!file) return;

    setProof(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ================= UPLOAD ================= */

  const handleUpload = async () => {
    if (!proof) return;

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("payment_proof", proof);
      formData.append("payment_reference", reference);

      await api.post(`payments/${paymentId}/upload_proof/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },

        onUploadProgress: (e: any) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      toast("✅ Preuve envoyée avec succès");
      router.push("/bookings");
    } catch {
      toast("❌ Erreur lors de l'envoi");
    } finally {
      setUploading(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!payment) return null;

  const amount = payment.amount.toLocaleString();

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* ===== HEADER STICKY ===== */}
      <div className="sticky top-0 bg-white border-b z-20">
        <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 py-3">
          <button
            onClick={() =>
              window.history.length > 1
                ? router.back()
                : router.push("/bookings")
            }
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="font-bold text-lg">Instructions de paiement</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* ===== INFOS ===== */}
        <Card>
          <p className="text-sm text-gray-500">Référence</p>
          <p className="font-mono font-semibold">{payment.transaction_id}</p>

          <p className="mt-3 text-sm text-gray-500">Montant</p>
          <p className="text-2xl font-bold text-orange-600">{amount} FCFA</p>
        </Card>

        {/* ===== ORANGE ===== */}
        <Instructions
          title="📱 Orange Money"
          steps={[
            "Composez #144#",
            "Transfert d'argent",
            "07 77 77 77 77",
            `${amount} FCFA`,
            payment.transaction_id,
          ]}
        />

        {/* ===== WAVE ===== */}
        <Instructions
          title="💳 Wave"
          steps={[
            "Ouvrez Wave",
            "Envoyer",
            "07 77 77 77 77",
            `${amount} FCFA`,
            payment.transaction_id,
          ]}
        />

        {/* ===== UPLOAD ===== */}
        <Card>
          <h2 className="font-semibold mb-4">📸 Preuve de paiement</h2>

          <input
            type="text"
            placeholder="Référence (optionnel)"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-3"
          />

          {/* UPLOAD */}
          <label className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 hover:bg-gray-50">
            <Upload size={18} />
            <span>Choisir une image</span>

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
            />
          </label>

          {/* PREVIEW */}
          {preview && (
            <div className="mt-4 relative">
              <img
                src={preview}
                className="rounded-xl max-h-64 object-cover w-full"
              />

              <button
                onClick={() => {
                  setProof(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* PROGRESS */}
          {uploading && (
            <div className="mt-4 h-2 bg-gray-200 rounded">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-orange-600 rounded transition-all"
              />
            </div>
          )}

          <button
            disabled={!proof || uploading}
            onClick={handleUpload}
            className="mt-5 w-full bg-orange-600 text-white py-3 rounded-xl font-semibold disabled:bg-gray-400"
          >
            {uploading ? `Envoi ${progress}%...` : "Envoyer la preuve"}
          </button>
        </Card>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Card({ children }: any) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">{children}</div>
  );
}

function Instructions({ title, steps }: any) {
  return (
    <Card>
      <h2 className="font-semibold mb-3">{title}</h2>
      <ol className="space-y-1 text-sm">
        {steps.map((s: string, i: number) => (
          <li key={i}>{i + 1}. {s}</li>
        ))}
      </ol>
    </Card>
  );
}
