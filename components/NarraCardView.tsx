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
  return (
    <div className="relative rounded-xl border border-gold/20 bg-panel-strong p-6 flex flex-col gap-4 shadow-[0_0_40px_-12px_rgba(203,161,53,0.25)]">
      <div className="pointer-events-none absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-display uppercase tracking-[0.3em] text-gold">
            {TYPE_LABEL[card.type]}
          </span>
          {card.format && (
            <span className="text-[11px] rounded-full border border-gold/25 px-2 py-0.5 text-gold-bright/90">
              {card.format}
            </span>
          )}
        </div>
        {onSave && (
          <button
            onClick={onSave}
            disabled={saved}
            className="text-xs font-medium rounded-md px-3.5 py-1.5 bg-gold text-void disabled:bg-white/10 disabled:text-faint hover:bg-gold-bright transition-colors"
          >
            {saved ? "저장됨" : "저장"}
          </button>
        )}
      </div>
      <h3 className="font-display text-xl tracking-wide text-ink text-emboss-light">
        {card.title}
      </h3>
      <dl className="flex flex-col gap-4">
        {Object.entries(card.fields).map(([label, value]) => (
          <div key={label}>
            <dt className="text-[11px] uppercase tracking-[0.25em] text-muted mb-1.5">
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
