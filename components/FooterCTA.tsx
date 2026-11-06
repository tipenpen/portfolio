"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Copy, Check, Mail } from "lucide-react";
import { ProfileData, SocialLink } from "@/lib/portfolio-data";

export default function FooterCTA({
  profile,
  socials = [],
}: {
  profile?: ProfileData;
  socials?: SocialLink[];
}) {
  const footerRef = useRef<HTMLDivElement>(null);
  const magneticButtonRef = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  const email = profile?.email || "hello@tipen.dev";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setCurrentTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Footer headline masked line reveal on scroll
        gsap.from(".footer-line-inner", {
          yPercent: 100,
          duration: 1.1,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        // CTA Actions reveal on scroll
        gsap.from(".footer-cta-fade", {
          opacity: 0,
          y: 40,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".footer-cta-group",
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });

        // Social cards reveal on scroll
        gsap.from(".footer-social-card", {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".footer-social-group",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });

        // Magnetic Button Physics with gsap.quickTo
        const btn = magneticButtonRef.current;
        if (btn) {
          const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
          const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });

          const handleMouseMove = (e: MouseEvent) => {
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) * 0.45;
            const deltaY = (e.clientY - centerY) * 0.45;
            xTo(deltaX);
            yTo(deltaY);
          };

          const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
          };

          btn.addEventListener("mousemove", handleMouseMove);
          btn.addEventListener("mouseleave", handleMouseLeave);

          return () => {
            btn.removeEventListener("mousemove", handleMouseMove);
            btn.removeEventListener("mouseleave", handleMouseLeave);
          };
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".footer-line-inner", ".footer-cta-fade", ".footer-social-card"], {
          opacity: 1,
          yPercent: 0,
          y: 0,
        });
      });
    },
    { scope: footerRef, dependencies: [socials] }
  );

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="relative pt-24 sm:pt-36 pb-12 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.07] overflow-hidden"
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

      {/* Top Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-zinc-500 pb-12 border-b border-white/[0.07]">
        <div className="flex items-center gap-2">
          <span className="text-zinc-300 font-medium">KONSULTASI &amp; KERJA SAMA</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            JAKARTA &bull; {currentTime || "09:30:00"} WIB
          </span>
        </div>
      </div>

      {/* Oversized Headline in Formal Indonesian */}
      <div className="py-16 sm:py-24">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-4">
          Inisiasi Kerja Sama
        </span>
        <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-[#FAFAFA] uppercase leading-[0.9]">
          <div className="overflow-hidden">
            <div className="footer-line-inner">{profile?.footerTitle || "Memiliki Rencana"}</div>
          </div>
          <div className="overflow-hidden">
            <div className="footer-line-inner text-zinc-500 hover:text-white transition-colors duration-500">
              {profile?.footerTitleHighlight || "Pengembangan Website?"}
            </div>
          </div>
        </h2>

        {/* Action Buttons */}
        <div className="footer-cta-group mt-12 sm:mt-16 flex flex-wrap items-center gap-6">
          <a
            ref={magneticButtonRef}
            href={`mailto:${email}`}
            className="footer-cta-fade group relative inline-flex items-center gap-4 rounded-full bg-white px-8 py-5 text-sm sm:text-base font-bold text-black transition-colors duration-300 hover:bg-zinc-200 shadow-[0_0_50px_rgba(255,255,255,0.15)]"
          >
            <span>{profile?.footerBtnText || "Mulai Sesi Konsultasi"}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </a>

          <button
            onClick={copyEmail}
            className="footer-cta-fade inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-[#121215] px-6 py-5 text-xs sm:text-sm text-zinc-300 transition-all duration-300 hover:border-white/30 hover:text-white"
          >
            <Mail className="h-4 w-4 text-zinc-400" />
            <span>{email}</span>
            {copied ? (
              <span className="flex items-center gap-1 text-emerald-400 font-sans">
                <Check className="h-3.5 w-3.5" /> Tersalin ke Papan Klip
              </span>
            ) : (
              <Copy className="h-3.5 w-3.5 text-zinc-500 hover:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Social Network Directory (Dynamic from CMS) */}
      <div className="footer-social-group mt-16 pt-12 border-t border-white/[0.07] grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-6 space-y-4">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            Kanal Komunikasi Resmi
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {socials.map((item) => (
              <a
                key={item.id || item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-card group flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between text-zinc-400 group-hover:text-white transition-colors">
                  <span className="text-xs font-semibold">{item.name}</span>
                  <ArrowUpRight className="h-3 w-3 text-zinc-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 truncate">
                  {item.handle}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Colophon & Copyright */}
        <div className="md:col-span-6 flex flex-col md:items-end justify-between gap-4 font-mono text-xs text-zinc-500">
          <div>
            <span>PENGEMBANG WEBSITE PROFESIONAL &bull; JAKARTA</span>
          </div>
          <p className="text-zinc-600 text-[11px] text-left md:text-right">
            {profile?.copyright || "© 2026 TIPEN. SELURUH HAK CIPTA DILINDUNGI."}
          </p>
        </div>
      </div>
    </footer>
  );
}
