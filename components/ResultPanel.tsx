import type { NarraCard } from "@/lib/types";
import { NarraCardView } from "@/components/NarraCardView";

export function ResultPanel({
  cards,
  savedKeys,
  onSave,
}: {
  cards: NarraCard[];
  savedKeys: Set<number>;
  onSave: (index: number) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gold/10">
        <h2 className="text-[11px] font-display uppercase tracking-[0.4em] text-gold/80">
          세계관
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
        {cards.length === 0 && (
          <p className="font-serif italic text-[15px] text-muted leading-relaxed">
            대화가 진행되면 브랜드 정의와 결과물 카드가 이곳에 펼쳐집니다.
          </p>
        )}
        {cards.map((card, i) => (
          <NarraCardView
            key={i}
            card={card}
            onSave={() => onSave(i)}
            saved={savedKeys.has(i)}
          />
        ))}
      </div>
    </div>
  );
}
