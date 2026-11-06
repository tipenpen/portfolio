"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Sparkles } from "lucide-react";
import { PreloaderData } from "@/lib/portfolio-data";

const DEFAULT_MESSAGES = [
  "Memuat halaman...",
  "Menyiapkan portofolio...",
  "Menata tata letak antarmuka...",
  "Hampir siap...",
  "Selamat datang!",
];

export default function Preloader({
  preloader,
  onComplete,
}: {
  preloader?: PreloaderData;
  onComplete?: () => void;
}) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const messages =
    preloader?.messages && preloader.messages.length > 0
      ? preloader.messages
      : DEFAULT_MESSAGES;

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 380);

    const counter = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        clearInterval(statusInterval);
        gsap.to(preloaderRef.current, {
          yPercent: -100,
          duration: 1.0,
          ease: "expo.inOut",
          onComplete: () => {
            setIsDone(true);
            document.body.style.overflow = "";
            onComplete?.();
          },
        });
      },
    });

    tl.to(counter, {
      val: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => {
        setCount(Math.round(counter.val));
      },
    });

    return () => {
      clearInterval(statusInterval);
      document.body.style.overflow = "";
    };
  }, [onComplete, messages.length]);

  if (isDone) return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#09090B] text-[#FAFAFA] p-6 sm:p-12 select-none overflow-hidden"
    >
      {/* Corner crosshairs */}
      <div className="pointer-events-none absolute top-4 left-4 font-mono text-xs text-zinc-700">
        +
      </div>
      <div className="pointer-events-none absolute top-4 right-4 font-mono text-xs text-zinc-700">
        +
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-xs text-zinc-700">
        +
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 font-mono text-xs text-zinc-700">
        +
      </div>

      {/* Top Preloader Status Bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 font-mono text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="text-zinc-300 font-semibold tracking-wider">
            TIPEN &bull; PORTOFOLIO
          </span>
        </div>
        <div>
          <span>JAKARTA, INDONESIA</span>
        </div>
      </div>

      {/* Center Preloader Visual */}
      <div className="my-auto max-w-2xl mx-auto w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-1.5 text-xs text-zinc-400">
          <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
          <span>{preloader?.badge || "WEB DEVELOPER"}</span>
        </div>

        {/* Counter */}
        <div className="font-mono text-7xl sm:text-9xl font-black tracking-tighter text-white tabular-nums">
          {count < 10 ? `00${count}` : count < 100 ? `0${count}` : count}
          <span className="text-zinc-600 text-3xl sm:text-5xl font-light ml-1">%</span>
        </div>

        {/* Progress Track Line */}
        <div className="w-full max-w-md mx-auto h-[2px] bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-75 ease-out"
            style={{ width: `${count}%` }}
          />
        </div>

        {/* Status Line */}
        <p className="text-xs sm:text-sm text-zinc-400 tracking-wide h-6">
          {messages[statusIndex]}
        </p>
      </div>

      {/* Bottom Metadata Bar */}
      <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 font-mono text-xs text-zinc-600">
        <div>{preloader?.footerText || "DESAIN BERSIH • CEPAT • NYAMAN"}</div>
        <div>&copy; 2026 TIPEN</div>
      </div>
    </div>
  );
}
