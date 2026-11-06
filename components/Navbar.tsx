"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileData } from "@/lib/portfolio-data";

const NAV_LINKS = [
  { name: "Tentang", href: "#about" },
  { name: "Pendidikan", href: "#education" },
  { name: "Portofolio", href: "#projects" },
  { name: "Kontak", href: "#contact" },
];

export default function Navbar({ profile }: { profile?: ProfileData }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 py-4 transition-all duration-500"
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between transition-all duration-500 border",
          isScrolled
            ? "max-w-4xl rounded-full bg-[#121215]/80 backdrop-blur-xl border-white/[0.08] px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
            : "max-w-7xl rounded-2xl bg-transparent border-transparent px-2 py-2"
        )}
      >
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-[#FAFAFA]"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-white/10 border border-white/20 text-[11px] font-mono font-medium transition-transform duration-300 group-hover:scale-105">
              T
            </span>
            <span className="tracking-tight text-white font-medium">
              TIPEN <span className="text-zinc-500 font-mono text-xs font-normal">&bull; WEB DEVELOPER</span>
            </span>
          </Link>

          {/* Live Availability Badge */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </span>
            <span>{profile?.availability || "Tersedia untuk proyek baru"}</span>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 backdrop-blur-sm">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="group relative rounded-full px-4 py-1.5 text-xs text-zinc-400 transition-colors duration-200 hover:text-white"
            >
              <span>{link.name}</span>
            </a>
          ))}
          <Link
            href="/admin"
            className="group relative flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-zinc-500 transition-colors duration-200 hover:text-emerald-400"
            title="Kelola Konten Portofolio"
          >
            <Shield className="h-3 w-3" />
            <span>CMS</span>
          </Link>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#contact"
            className="group relative inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-[#18181B] px-4 py-2 text-xs font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-black"
          >
            <span>Hubungi Saya</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-black" />
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Buka menu navigasi"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-300 md:hidden transition-colors hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mt-3 md:hidden max-w-5xl mx-auto rounded-2xl border border-white/[0.08] bg-[#121215]/95 backdrop-blur-2xl p-5 shadow-2xl">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-400 w-fit mb-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </span>
              <span>{profile?.availability || "Tersedia untuk proyek baru"}</span>
            </div>
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <span>{link.name}</span>
              </a>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-emerald-400 transition-colors hover:bg-white/[0.05]"
            >
              <span>Panel CMS</span>
              <Shield className="h-3.5 w-3.5" />
            </Link>
            <div className="pt-3 border-t border-white/[0.06]">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black"
              >
                <span>Hubungi Saya</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
