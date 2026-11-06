"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { ProjectItem } from "@/lib/portfolio-data";

export default function SelectedWorks({
  projects = [],
}: {
  projects?: ProjectItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  const displayProjects = projects.length > 0 ? projects : [];

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();

      // Desktop & Tablet: Pinned Horizontal Scrub Animation
      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current;
        const container = containerRef.current;
        if (!track || !container || displayProjects.length === 0) return;

        const totalWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        const xDist = totalWidth - viewportWidth + 96;

        const scrubTween = gsap.to(track, {
          x: -xDist,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${Math.max(xDist * 1.25, 2000)}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setScrollProgress(self.progress);
              const idx = Math.min(
                displayProjects.length - 1,
                Math.floor(self.progress * displayProjects.length)
              );
              setActiveProjectIndex(idx);
            },
          },
        });

        // Parallax image movement inside panels while scrubbing
        const panelImages = gsap.utils.toArray<HTMLElement>(".panel-image");
        panelImages.forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: 12 },
            {
              xPercent: -12,
              ease: "none",
              scrollTrigger: {
                trigger: img.closest(".project-panel"),
                containerAnimation: scrubTween,
                start: "left right",
                end: "right left",
                scrub: 1,
              },
            }
          );
        });
      });

      // Mobile / Tablet Vertical fallback with ScrollTrigger reveal
      mm.add("(max-width: 1023px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".project-panel");
        panels.forEach((panel) => {
          gsap.from(panel, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        });
      });
    },
    { scope: containerRef, dependencies: [displayProjects] }
  );

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative bg-[#09090B] text-[#FAFAFA] border-t border-white/[0.08]"
    >
      {/* Top Header */}
      <div className="pt-20 lg:pt-16 pb-6 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.07]">
        <div>
          <div className="flex items-center gap-2.5 font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>KARYA PILIHAN</span>
            <span className="text-zinc-700">|</span>
            <span className="hidden sm:inline">GULIR KE KANAN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white uppercase">
            Portofolio Proyek
          </h2>
        </div>

        {/* Live Scrub Indicator */}
        <div className="flex items-center gap-6 font-mono text-xs text-zinc-400">
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-zinc-500">PROGRES:</span>
            <div className="w-32 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75 ease-out"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="text-white font-semibold">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>

          <div className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3.5 py-1 text-white">
            {activeProjectIndex + 1} dari {displayProjects.length}
          </div>
        </div>
      </div>

      {/* Track Container: Desktop Horizontal Pin Scrub & Mobile Stack */}
      <div className="relative overflow-hidden min-h-screen flex items-center py-10 lg:py-0">
        <div
          ref={trackRef}
          className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 sm:px-6 md:px-12 w-full lg:w-max items-center"
        >
          {displayProjects.map((project, idx) => (
            <div
              key={project.id}
              className="project-panel group relative w-full lg:w-[780px] shrink-0 rounded-3xl border border-white/[0.08] bg-[#121215] p-6 sm:p-10 transition-colors duration-500 hover:border-white/25 overflow-hidden shadow-2xl"
            >
              {/* Corner crosshairs */}
              <div className="pointer-events-none absolute top-3 left-4 font-mono text-[10px] text-zinc-700 select-none">
                +
              </div>
              <div className="pointer-events-none absolute top-3 right-4 font-mono text-[10px] text-zinc-700 select-none">
                +
              </div>
              <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] text-zinc-700 select-none">
                +
              </div>
              <div className="pointer-events-none absolute bottom-3 right-4 font-mono text-[10px] text-zinc-700 select-none">
                +
              </div>

              {/* Panel Top Meta Bar */}
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.06] font-mono text-xs text-zinc-500">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-white/10 text-white font-semibold text-[11px]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="text-zinc-300 font-medium">
                    {project.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{project.year}</span>
                  <span className="text-zinc-700">&bull;</span>
                  <span className="text-emerald-400">{project.client}</span>
                </div>
              </div>

              {/* Large Visual Window */}
              <div className="relative mt-6 h-64 sm:h-80 md:h-96 w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-black">
                <div className="panel-image relative h-full w-[120%] -left-[10%]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 780px"
                    priority={idx === 0}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                    {project.title}
                  </h3>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-110 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Description & Simple Highlights */}
              <div className="mt-6 space-y-4">
                <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                  {project.description}
                </p>

                {/* Highlights Grid */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.06]">
                  {project.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-2.5"
                    >
                      <span className="block font-mono text-[9px] text-zinc-500 uppercase">
                        {spec.label}
                      </span>
                      <span className="font-mono text-xs font-semibold text-zinc-200 mt-0.5 block truncate">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-xs text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* End Card */}
          <div className="shrink-0 w-full lg:w-[420px] rounded-3xl border border-white/[0.08] bg-[#121215] p-8 sm:p-10 flex flex-col justify-between h-[420px] lg:h-[580px] shadow-2xl">
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-white">
                <MessageCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block">
                AKHIR DAFTAR
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Tertarik Mengembangkan Website Serupa?
              </h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Tersedia untuk pembuatan profil perusahaan, platform e-commerce, maupun website kebutuhan profesional Anda.
                Mari diskusikan rencana Anda.
              </p>
            </div>

            <a
              href="#contact"
              className="group inline-flex items-center justify-between rounded-2xl bg-white px-6 py-4 text-sm font-bold text-black transition-colors hover:bg-zinc-200"
            >
              <span>Mulai Sesi Konsultasi</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
