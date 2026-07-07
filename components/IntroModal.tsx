"use client";

import { useEffect } from "react";

export function IntroModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-void/85 backdrop-blur-sm px-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-gold/25 bg-abyss px-10 py-14 text-center shadow-[0_0_100px_-16px_rgba(203,161,53,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(232,199,102,0.14) 0%, transparent 55%), radial-gradient(circle at 50% 100%, rgba(88,28,135,0.25) 0%, transparent 60%)",
          }}
        />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 h-8 w-8 flex items-center justify-center rounded-full text-faint hover:text-ink hover:bg-white/5 transition-colors"
        >
          ✕
        </button>

        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.5em] text-faint">
            Brand Narrative OS
          </p>
          <h2 className="mt-3 font-display text-2xl tracking-[0.3em] text-gold-bright text-emboss">
            NARRA
          </h2>

          <p className="mx-auto mt-8 max-w-md font-serif italic text-[26px] sm:text-[30px] leading-[1.35] text-ink text-emboss-light">
            What <span className="text-gold-bright">world</span> do you want
            your brand to be remembered as?
          </p>

          <button
            onClick={onClose}
            className="mt-10 rounded-full bg-gold text-void px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-gold-bright transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
