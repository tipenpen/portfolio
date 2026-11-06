import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tipen — Pembuat Website Modern",
  description:
    "Portofolio Tipen, pembuat website yang rapi, cepat dibuka, dan nyaman digunakan di HP maupun laptop.",
  keywords: [
    "Jasa Pembuatan Website",
    "Web Developer",
    "Pembuat Website",
    "Toko Online",
    "Tipen",
  ],
};

export const viewport: Viewport = {
  themeColor: "#09090B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${sans.variable} ${mono.variable} dark bg-[#09090B] text-[#FAFAFA] scroll-smooth`}
    >
      <body className="min-h-screen bg-[#09090B] text-[#FAFAFA] font-sans antialiased selection:bg-zinc-800 selection:text-white">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
