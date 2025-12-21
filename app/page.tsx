'use client';

import { useLenis } from "@/lib/use-lenis";
import { LandingPage } from "@/components/landing-page";

export default function Page() {
  useLenis();

  return <LandingPage />;
}
