import type { NarraCard } from "@/lib/types";
import { NarraCardView } from "@/components/NarraCardView";

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
      <div className="px-6 py-5 border-b border-gold/10">
        <h2 className="text-base font-bold uppercase tracking-[0.1em] text-gold/90 text-emboss">
          브랜드 탐험
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {card ? (
          <NarraCardView card={card} onSave={onSave} saved={saved} />
        ) : (
          <p className="font-serif italic text-lg text-muted leading-relaxed">
            아직 브랜드를 충분히 파악하지 못했어요. 대화를 계속 이어가 보세요.
          </p>
        )}
      </div>
    </div>
  );
}
