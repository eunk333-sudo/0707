import { WORKFLOW_STEPS, type NarraCard, type WorkflowStepId } from "@/lib/types";
import { NarraCardView } from "@/components/NarraCardView";

const NAV_STEPS = WORKFLOW_STEPS.filter((s) => s.id !== "explore");

const PLACEHOLDER_STEPS: Record<string, string> = {
  expansion: "PDF · 브랜드 필름 · 커머셜 · 킥오프 · 파트너 초대 — 곧 지원 예정이에요.",
};

const FORMAT_OPTIONS = [
  "브랜드필름",
  "광고",
  "키비주얼",
  "홈페이지 히어로 이미지",
  "SNS 콘텐츠",
  "무드보드",
];

export function DiscoveryPanel({
  step,
  completedSteps,
  onSelectStep,
  card,
  saved,
  onSave,
  showFormatOptions,
  onPickFormat,
}: {
  step: WorkflowStepId;
  completedSteps: Set<WorkflowStepId>;
  onSelectStep: (id: WorkflowStepId) => void;
  card: NarraCard | null;
  saved?: boolean;
  onSave?: () => void;
  showFormatOptions?: boolean;
  onPickFormat?: (format: string) => void;
}) {
  const placeholder = PLACEHOLDER_STEPS[step];

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gold/10">
        <h2 className="text-base font-bold uppercase tracking-[0.1em] text-gold/90 text-emboss">
          발견
        </h2>
      </div>
      <div className="px-3 py-4 flex flex-col gap-1 border-b border-gold/10">
        {NAV_STEPS.map((s) => {
          const active = s.id === step;
          const done = completedSteps.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => onSelectStep(s.id)}
              className={`text-left rounded-lg px-3 py-2.5 text-[13px] tracking-normal transition-colors ${
                active
                  ? "bg-gold/15 text-gold-bright border border-gold/30"
                  : done
                    ? "text-ink/75 hover:bg-white/5 border border-transparent"
                    : "text-faint hover:bg-white/5 border border-transparent"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
        {step === "explore" && (
          <p className="font-serif italic text-lg text-muted leading-relaxed">
            브랜드 탐험이 끝나면 다음 단계를 이어서 진행할 수 있어요.
          </p>
        )}
        {step === "assets" && showFormatOptions && onPickFormat && (
          <div className="flex flex-col gap-3">
            <p className="font-serif italic text-lg text-muted leading-relaxed">
              이 브랜드를 어떤 형태로 표현해볼까요?
            </p>
            <div className="flex flex-wrap gap-2">
              {FORMAT_OPTIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => onPickFormat(f)}
                  className="text-xs tracking-normal rounded-full border border-gold/25 text-gold-bright/90 px-3.5 py-1.5 hover:bg-gold/10 hover:border-gold/50 transition-colors"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === "assets" && !showFormatOptions && (
          <p className="font-serif italic text-lg text-muted leading-relaxed">
            브랜드 자산(이미지·영상) 생성은 다음 업데이트에서 만나보실 수 있어요.
          </p>
        )}
        {step !== "assets" && step !== "explore" && placeholder && (
          <p className="font-serif italic text-lg text-muted leading-relaxed">{placeholder}</p>
        )}
        {step !== "assets" && step !== "explore" && !placeholder && !card && (
          <p className="font-serif italic text-lg text-muted leading-relaxed">
            아직 이 단계의 결과가 없어요. 대화를 계속 이어가 보세요.
          </p>
        )}
        {step !== "assets" && step !== "explore" && !placeholder && card && (
          <NarraCardView card={card} onSave={onSave} saved={saved} />
        )}
      </div>
    </div>
  );
}
