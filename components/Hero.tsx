"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CornerDownRight, Sparkles, Check } from "lucide-react";
import { ProfileData } from "@/lib/portfolio-data";

export default function Hero({ profile }: { profile?: ProfileData }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  const valueBadges =
    profile?.valueBadges && profile.valueBadges.length > 0
      ? profile.valueBadges
      : [
          "Tampilan Optimal di Seluler & Desktop",
          "Kecepatan Memuat Halaman Tinggi",
          "Struktur Bersih & Terpercaya",
        ];

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        // Meta tags fade in
        tl.from(".hero-meta", {
          opacity: 0,
          y: 20,
          duration: 0.9,
          stagger: 0.08,
          delay: 0.15,
        });

        // Masked line reveals: yPercent: 100 -> 0 inside overflow-hidden wrappers
        tl.from(
          ".hero-line-inner",
          {
            yPercent: 100,
            duration: 1.1,
            stagger: 0.08,
            ease: "expo.out",
          },
          "-=0.6"
        );

        // Subtitle & actions reveal
        tl.from(
          ".hero-fade",
          {
            opacity: 0,
            y: 24,
            duration: 1.0,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.7"
        );

        // Grid lines reveal
        tl.from(
          ".grid-line-h",
          {
            scaleX: 0,
            duration: 1.4,
            ease: "expo.out",
            transformOrigin: "left center",
          },
          "-=1.1"
        );

        // Scroll-driven exit parallax
        if (heroContentRef.current) {
          gsap.to(heroContentRef.current, {
            yPercent: -12,
            opacity: 0.25,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
        }

        // Pulse for scroll indicator
        gsap.to(".scroll-line", {
          y: 12,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".hero-meta", ".hero-line-inner", ".hero-fade", ".grid-line-h"], {
          opacity: 1,
          yPercent: 0,
          y: 0,
          scaleX: 1,
        });
      });
    },
    { scope: heroRef }
  );

  return (
    <section
      id="about"
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-12 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Corner crosshairs */}
      <div className="pointer-events-none absolute top-4 left-4 font-mono text-xs text-zinc-700 select-none">
        +
      </div>
      <div className="pointer-events-none absolute top-4 right-4 font-mono text-xs text-zinc-700 select-none">
        +
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-xs text-zinc-700 select-none">
        +
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 font-mono text-xs text-zinc-700 select-none">
        +
      </div>

      {/* Background Grid Lines */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="grid-line-h absolute top-32 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <div className="grid-line-h absolute bottom-24 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <div className="absolute top-0 bottom-0 left-8 sm:left-16 w-[1px] bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />
        <div className="absolute top-0 bottom-0 right-8 sm:right-16 w-[1px] bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />
      </div>

      <div ref={heroContentRef} className="relative z-10 flex flex-col h-full justify-between my-auto">
        {/* Top Simple Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-4 font-mono text-xs text-zinc-500">
          <div className="hero-meta flex items-center gap-2">
            <span className="text-zinc-300 font-medium">PORTOFOLIO {profile?.name ? profile.name.toUpperCase() : "TIPEN"}</span>
          </div>
          <div className="hero-meta flex items-center gap-6">
            <span>{profile?.location || "JAKARTA, INDONESIA"}</span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {profile?.availability || "TERSEDIA UNTUK PROYEK BARU"}
            </span>
          </div>
        </div>

        {/* Hero Headline Statement */}
        <div className="py-12 sm:py-20">
          <div className="hero-meta inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1 text-xs text-zinc-400 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
            <span>{profile?.greeting || "Halo, Saya Tipen"}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-[#FAFAFA] leading-[0.98] uppercase">
            <div className="overflow-hidden">
              <div className="hero-line-inner">{profile?.headline1 || "Merancang Website"}</div>
            </div>
            <div className="overflow-hidden">
              <div className="hero-line-inner text-zinc-400 flex flex-wrap items-baseline gap-x-4">
                <span>{profile?.headlineSub || "Elegan & Berkinerja Tinggi"}</span>
                <span className="text-xs sm:text-sm font-normal tracking-normal text-zinc-500 lowercase">
                  [{profile?.headlineSubTag || "rapi • cepat • responsif"}]
                </span>
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="hero-line-inner">{profile?.headlineEnd || "Untuk Segala Kebutuhan Digital."}</div>
            </div>
          </h1>

          {/* Bio in Formal Indonesian */}
          <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4 text-xs font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <CornerDownRight className="h-3.5 w-3.5 text-zinc-400" />
              <span>Profil Singkat</span>
            </div>
            <div className="hero-fade md:col-span-8 space-y-4">
              <p className="text-base sm:text-lg md:text-xl text-zinc-300 font-light leading-relaxed">
                {profile?.bio1 ||
                  "Saya adalah seorang pengembang website profesional yang berdedikasi membantu perusahaan, pelaku usaha, dan perorangan dalam mewujudkan kehadiran digital yang berkelas dan berkinerja tinggi."}
              </p>
              <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                {profile?.bio2 ||
                  "Setiap website dirancang dengan perhatian mendalam pada kejelasan informasi, kecepatan akses pada perangkat seluler maupun desktop, serta kemudahan navigasi bagi pengunjung."}
              </p>

              {/* Dynamic Value Badges */}
              <div className="pt-2 flex flex-wrap gap-2.5 text-xs text-zinc-300">
                {valueBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-400" /> {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hero-fade mt-10 sm:mt-14 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-xs sm:text-sm font-semibold text-black transition-all duration-300 hover:bg-zinc-200"
            >
              <span>{profile?.heroBtnPrimary || "Lihat Portofolio Proyek"}</span>
              <span className="text-xs text-zinc-500 group-hover:text-black transition-colors">
                &darr;
              </span>
            </a>
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-[#121215] px-7 py-3.5 text-xs sm:text-sm font-medium text-zinc-300 transition-all duration-300 hover:border-white/30 hover:text-white"
            >
              <span>{profile?.heroBtnSecondary || "Hubungi Saya"}</span>
            </a>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="flex items-center justify-between border-t border-white/[0.07] pt-4 font-mono text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            <span>GULIR KE BAWAH UNTUK MELIHAT PORTOFOLIO KARYA</span>
            <div className="h-4 w-4 rounded-full border border-zinc-700 flex items-center justify-center">
              <div className="scroll-line h-1.5 w-[1px] bg-zinc-400" />
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <span>{profile?.name ? profile.name.toUpperCase() : "TIPEN"} &bull; {profile?.brandSubtitle || "PENGEMBANG WEBSITE"}</span>
            <span>2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}
