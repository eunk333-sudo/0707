import type { NarraCard } from "@/lib/types";

export function ResultPanel({
  card,
  saved,
  onSave,
}: {
  card: NarraCard | null;
  saved?: boolean;
  onSave?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gold/10">
        <h2 className="text-base font-bold uppercase tracking-[0.1em] text-gold/90 text-emboss">
          DNA
        </h2>
        <button
          type="button"
          onClick={() => onSave?.()}
          aria-label={card ? (saved ? "저장됨" : "수집") : "저장할 카드가 없습니다"}
          disabled={!card || !onSave}
          className="relative inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#1c0c2a] border border-gold/25 px-3 text-gold shadow-[0_0_18px_rgba(203,161,53,0.18)] transition hover:bg-[#2a1245] hover:text-gold-bright disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 7V6a4 4 0 0 1 8 0v1" />
            <path d="M6 10c0-2 1-4 6-4s6 2 6 4v8a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4v-8z" />
            <path d="M9 14h6" />
          </svg>
          <span className="text-sm font-semibold text-white">+1</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {card ? (
          <div className="space-y-6">
            <dl className="space-y-5">
              {Object.entries(card.fields)
                .filter(([label]) => label !== "타깃")
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-sm font-semibold uppercase tracking-[0.08em] text-gold mb-2">
                      {label}
                    </dt>
                    <dd className="text-base text-ink/80 leading-relaxed whitespace-pre-wrap">
                      {value}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>
        ) : (
          <p className="font-serif italic text-lg text-muted leading-relaxed">
            아직 브랜드를 충분히 파악하지 못했어요. 대화를 계속 이어가 보세요.
          </p>
        )}
      </div>
    </div>
  );
}
