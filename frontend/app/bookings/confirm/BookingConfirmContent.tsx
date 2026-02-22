"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

interface BookingDetails {
  id: number;
  booking_number: string;
  start_date: string;
  end_date: string;
  duration: number;
  subtotal: number;
  fees: number;
  total_price: number;
  status: string;
  item: {
    id: number;
    title: string;
    image: string;
    type: "vehicle" | "residence";
  };
}

export default function BookingConfirmContent() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("booking");

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] =
    useState<"full" | "partial" | "installments">("full");
  const [processing, setProcessing] = useState(false);


  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);


  const fetchBookingDetails = async () => {

    try {

      setLoading(true);

      const res = await api.get(`bookings/${bookingId}/`);

      let itemDetails;

      if (res.data.content_type) {

        const type = res.data.content_type.model;

        if (type === "vehicle") {

          const vehicleRes =
            await api.get(`vehicles/${res.data.object_id}/`);

          itemDetails = {
            id: vehicleRes.data.id,
            title:
              `${vehicleRes.data.brand} ${vehicleRes.data.model}`,
            image:
              vehicleRes.data.images?.[0]?.image ||
              "/placeholder.jpg",
            type: "vehicle" as const,
          };

        } else if (type === "residence") {

          const residenceRes =
            await api.get(`residences/${res.data.object_id}/`);

          itemDetails = {
            id: residenceRes.data.id,
            title: residenceRes.data.title,
            image:
              residenceRes.data.images?.[0]?.image ||
              "/placeholder.jpg",
            type: "residence" as const,
          };

        }
      }


      if (!itemDetails) {

        alert("Objet introuvable");

        router.push("/bookings");

        return;

      }


      setBooking({
        ...res.data,
        item: itemDetails,
      });

    }

    catch (err) {

      alert("Impossible de charger la réservation");

      router.push("/bookings");

    }

    finally {

      setLoading(false);

    }

  };


  const calculatePartialAmount = () => {
    if (!booking) return 0;
    return booking.total_price * 0.3;
  };


  const calculateInstallmentAmount = () => {
    if (!booking) return 0;
    return booking.total_price / 3;
  };


  const handlePayment = async () => {

    if (!booking) return;

    setProcessing(true);

    try {

      const amount =
        paymentMethod === "full"
          ? booking.total_price
          : paymentMethod === "partial"
          ? calculatePartialAmount()
          : calculateInstallmentAmount();

      await api.post(
        `bookings/${booking.id}/pay/`,
        {
          booking: booking.id,
          amount,
          payment_method: paymentMethod,
        }
      );


      alert("Paiement effectué 🎉");


      router.push(
        `/booking-success?booking=${booking.id}`
      );

    }

    catch (err) {

      alert("Erreur paiement");

    }

    finally {

      setProcessing(false);

    }

  };


  if (loading) {

    return (
      <div className="p-20 text-center">
        Chargement...
      </div>
    );

  }


  if (!booking) {

    return (
      <div className="p-20 text-center">
        Réservation introuvable
      </div>
    );

  }


  return (

    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Confirmer et payer
      </h1>

      <p className="mb-4">
        {booking.item.title}
      </p>

      <p className="mb-6">
        Total :
        <b>
          {" "}
          {booking.total_price.toLocaleString()} FCFA
        </b>
      </p>


      <button
        onClick={handlePayment}
        disabled={processing}
        className="bg-orange-600 text-white px-6 py-3 rounded"
      >

        {processing
          ? "Paiement..."
          : "Confirmer paiement"}

      </button>

    </div>

  );

}