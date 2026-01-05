import { authClient } from '@/lib/auth/client'; 
import { NeonAuthUIProvider } from '@neondatabase/auth/react'; 
import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { ConditionalHeader } from "@/components/conditional-header";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Willis Concierge",
  description: "Airport ",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NeonAuthUIProvider
          authClient={authClient} 
          redirectTo="/dashboard"
          emailOTP
        >
          <ToastProvider>
            <ConditionalHeader />
            <main>
              {children}
            </main>
          </ToastProvider>
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
