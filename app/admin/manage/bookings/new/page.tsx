"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NewBookingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new comprehensive bookings page
    router.replace('/admin/bookings');
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
      <p>You are being redirected to the new comprehensive bookings management page.</p>
    </div>
  );
}
