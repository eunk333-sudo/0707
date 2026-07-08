import type { NarraCard, WorkflowStepId } from "@/lib/types";
import { NarraCardView } from "@/components/NarraCardView";

const PLACEHOLDER_STEPS: Record<string, string> = {
  assets: "브랜드 자산(이미지·영상) 생성은 다음 업데이트에서 만나보실 수 있어요.",
  expansion: "PDF · 브랜드 필름 · 커머셜 · 킥오프 · 파트너 초대 — 곧 지원 예정이에요.",
};

export function DiscoveryPanel({
  step,
  card,
  saved,
  onSave,
}: {
  step: WorkflowStepId;
  card: NarraCard | null;
  saved?: boolean;
  onSave?: () => void;
}) {
  const placeholder = PLACEHOLDER_STEPS[step];

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gold/10">
        <h2 className="text-base font-display font-bold uppercase tracking-[0.4em] text-gold/90 text-emboss">
          발견
        </h2>
        <p className="mt-1 text-[11px] text-faint">AI가 지금까지 이해한 브랜드</p>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
        {placeholder && (
          <p className="font-serif italic text-lg text-muted leading-relaxed">{placeholder}</p>
        )}
        {!placeholder && !card && (
          <p className="font-serif italic text-lg text-muted leading-relaxed">
            아직 브랜드를 충분히 파악하지 못했어요. 대화를 계속 이어가 보세요.
          </p>
        )}
        {!placeholder && card && <NarraCardView card={card} onSave={onSave} saved={saved} />}
      </div>
    </div>
  );
}
