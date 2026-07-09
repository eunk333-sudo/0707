"use client";

import { useState } from "react";
import type { NarraCard } from "@/lib/types";

const TYPE_LABEL: Record<NarraCard["type"], string> = {
  brand_definition: "브랜드 정의",
  creative_direction: "크리에이티브 방향",
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
    <div className="relative rounded-xl border border-gold/20 bg-panel-strong p-6 flex flex-col gap-4 shadow-[0_0_40px_-12px_rgba(203,161,53,0.25)]">
      <div className="pointer-events-none absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gold">
            {TYPE_LABEL[card.type]}
          </span>
          {card.format && (
            <span className="text-[11px] rounded-full border border-gold/25 px-2 py-0.5 text-gold-bright/90">
              {card.format}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onSave && (
            <button
              onClick={onSave}
              disabled={saved}
              aria-label={saved ? "저장됨" : "저장"}
              className="text-xs font-medium rounded-md px-3.5 py-1.5 bg-gold text-void disabled:bg-white/10 disabled:text-faint hover:bg-gold-bright transition-colors"
            >
              📌
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
      <h3 className="font-semibold text-xl tracking-normal text-ink text-emboss-light">
        {card.title}
      </h3>
      <dl className="flex flex-col gap-4">
        {Object.entries(card.fields).map(([label, value]) => (
          <div key={label}>
            <dt className="text-[11px] uppercase tracking-[0.08em] text-muted mb-1.5">
              {label}
            </dt>
            <dd className="text-[15px] text-ink/75 leading-relaxed whitespace-pre-wrap">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
