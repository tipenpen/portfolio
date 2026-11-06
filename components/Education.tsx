"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GraduationCap, Calendar, Award } from "lucide-react";
import { EducationItem } from "@/lib/portfolio-data";

export default function Education({
  education = [],
}: {
  education?: EducationItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Section header reveal on scroll
        gsap.from(".edu-header-fade", {
          opacity: 0,
          y: 40,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        // Individual Education Cards Reveal on Scroll
        const cards = gsap.utils.toArray<HTMLElement>(".edu-card");
        cards.forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          });
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".edu-header-fade", ".edu-card"], {
          opacity: 1,
          y: 0,
        });
      });
    },
    { scope: containerRef, dependencies: [education] }
  );

  if (!education || education.length === 0) return null;

  return (
    <section
      id="education"
      ref={containerRef}
      className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.07]"
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

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-16">
        <div>
          <div className="edu-header-fade flex items-center gap-2 font-mono text-xs text-zinc-500 uppercase tracking-widest mb-3">
            <GraduationCap className="h-4 w-4 text-emerald-400" />
            <span>LATAR BELAKANG AKADEMIK</span>
          </div>
          <h2 className="edu-header-fade text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-[#FAFAFA] uppercase">
            Riwayat Pendidikan
          </h2>
        </div>
        <p className="edu-header-fade max-w-md text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
          Pondasi formal dan rekam jejak akademik dalam bidang teknologi informasi dan rekayasa perangkat lunak.
        </p>
      </div>

      {/* Education Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {education.map((item, idx) => (
          <div
            key={item.id}
            className="edu-card group relative rounded-3xl border border-white/[0.08] bg-[#121215] p-6 sm:p-8 transition-colors duration-500 hover:border-white/20 shadow-xl overflow-hidden"
          >
            {/* Corner accent */}
            <div className="pointer-events-none absolute top-3 left-3 font-mono text-[10px] text-zinc-700 select-none">
              +
            </div>
            <div className="pointer-events-none absolute top-3 right-3 font-mono text-[10px] text-zinc-700 select-none">
              +
            </div>

            {/* Top Period & Tag */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] font-mono text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>{item.period}</span>
              </span>
              <span className="text-zinc-500 text-[11px]">
                PENDIDIKAN {String(idx + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Institution & Degree */}
            <div className="mt-5 space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                {item.institution}
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 font-medium">
                {item.degree}
              </p>
            </div>

            {/* Description */}
            <p className="mt-4 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              {item.description}
            </p>

            {/* Achievements / Highlights */}
            {item.achievements && item.achievements.length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-wrap gap-2">
                {item.achievements.map((ach) => (
                  <span
                    key={ach}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs text-zinc-300"
                  >
                    <Award className="h-3 w-3 text-emerald-400" />
                    <span>{ach}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

