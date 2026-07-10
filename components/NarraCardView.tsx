"use client";

import { useState } from "react";
import type { NarraCard } from "@/lib/types";

const TYPE_LABEL: Record<NarraCard["type"], string> = {
  brand_definition: "브랜드 정의",
  creative_direction: "크리에이티브 디렉션",
  result: "결과물",
};

export function NarraCardView({
  card,
  onSave,
  saved,
}: {
  card: NarraCard;
  onSave?: () => void;
  saved?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const promptText =
    card.title === "AI 프롬프트"
      ? card.fields["프롬프트"] ?? card.fields["AI Prompt"] ?? ""
      : "";

  async function handleCopy() {
    if (!promptText) return;
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  return (
    <div className="relative rounded-2xl border border-violet-500/10 p-5 flex flex-col gap-4" style={{ background: 'rgba(16,12,44,0.84)' }}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[12px] uppercase tracking-[0.08em] text-violet-200/70">
            {TYPE_LABEL[card.type]}
          </span>
          {card.type !== "brand_definition" && card.format && (
            <span className="text-[11px] rounded-full border border-violet-500/30 px-2 py-0.5 text-violet-200/80">
              {card.format}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onSave && (
            <button
              onClick={() => onSave()}
              aria-label={saved ? "저장됨" : "수집"}
              className="relative inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#1c0c2a] border border-gold/25 px-3 text-gold shadow-[0_0_18px_rgba(203,161,53,0.18)] transition hover:bg-[#2a1245] hover:text-gold-bright disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 7V6a4 4 0 0 1 8 0v1" />
                <path d="M6 10c0-2 1-4 6-4s6 2 6 4v8a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4v-8z" />
                <path d="M9 14h6" />
              </svg>
              <span className="text-sm font-semibold text-white">+1</span>
            </button>
          )}
          {promptText && (
            <button
              type="button"
              onClick={handleCopy}
              disabled={copied}
              aria-label="프롬프트 복사"
              className="text-xs font-medium rounded-md px-3.5 py-1.5 bg-white/10 text-gold hover:bg-gold/10 disabled:text-faint disabled:bg-white/5 transition-colors"
            >
              {copied ? "복사됨" : "복사"}
            </button>
          )}
        </div>
      </div>
      {card.type !== "brand_definition" && card.title !== TYPE_LABEL[card.type] && (
        <h3 className="font-semibold text-lg tracking-normal text-white/90">
          {card.title}
        </h3>
      )}
      <dl className="flex flex-col gap-4">
        {Object.entries(card.fields)
          .filter(([label]) => label !== "타깃")
          .map(([label, value]) => (
            <div key={label}>
              <dt className="text-[12px] font-semibold uppercase tracking-[0.08em] text-violet-200/70 mb-1.5">
                {label}
              </dt>
              <dd className="text-[14px] text-white/80 leading-relaxed whitespace-pre-wrap">
                {value}
              </dd>
            </div>
          ))}
      </dl>
    </div>
  );
}
