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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-void/80 backdrop-blur-sm px-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-gold/25 bg-abyss p-10 text-center shadow-[0_0_80px_-12px_rgba(203,161,53,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full text-faint hover:text-ink hover:bg-white/5 transition-colors"
        >
          ✕
        </button>

        <p className="text-[10px] uppercase tracking-[0.5em] text-faint">
          Brand Narrative OS
        </p>
        <h2 className="mt-3 font-display text-2xl tracking-[0.2em] text-gold-bright text-emboss">
          NARRA
        </h2>
        <p className="mt-6 font-serif italic text-xl text-ink leading-relaxed">
          당신의 브랜드는 사람들에게 어떤 세계로 기억되고 싶나요?
        </p>

        <button
          onClick={onClose}
          className="mt-8 rounded-full bg-gold text-void px-7 py-3 text-sm font-semibold tracking-wide hover:bg-gold-bright transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
