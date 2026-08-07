import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue, Barlow, DM_Mono } from "next/font/google";
import "../styles/globals.css";
import Background3D from "../components/shared/Background3D";
import FocusRail from "../components/shared/ui/FocusRail";
import LenisProvider from "../components/shared/LenisProvider";
import Nav from "../components/shared/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

const barlow = Barlow({
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Interview Agent",
  description: "A premium client interface for AI Interview Agent evaluation and feedback.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${barlow.variable} ${dmMono.variable} min-h-screen antialiased`}
    >
      <body className="min-h-screen flex flex-col relative overflow-x-hidden">
        <LenisProvider>
          {/* Persistent animated 3D canvas background wrapper */}
          <Background3D />
          {/* Global UI Focus Rail design motif */}
          <FocusRail />
          {/* Persistent top navigation bar */}
          <Nav />
          <div className="relative z-10 flex flex-col flex-1 pt-16">{children}</div>
        </LenisProvider>
      </body>
    </html>
  );
}
