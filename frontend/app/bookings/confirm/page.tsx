// app/bookings/confirm/page.tsx
// Remplacez tout le contenu par ceci :

import { Suspense } from "react";
import BookingConfirmContent from "./BookingConfirmContent";

export default function BookingConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    }>
      <BookingConfirmContent />
    </Suspense>
  );
}