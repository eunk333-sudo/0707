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
        {step === "assets" && (
          <div className="flex flex-col gap-3">
            <p className="font-serif italic text-lg text-muted leading-relaxed">
              브랜드 자산은 다음과 같이 정리됩니다.
            </p>
            <div className="mt-4 text-sm text-faint opacity-80">
              <ul className="list-disc list-inside space-y-4">
                <li>
                  <span className="font-semibold">디지털 에셋</span>
                  <ul className="mt-2 list-disc list-inside pl-4 space-y-1">
                    <li>포토카드</li>
                    <li>로고 (PNG) (SVG)</li>
                    <li>SNS 프로필 이미지</li>
                    <li>스티커</li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">브랜드 Key Visual</span>
                  <ul className="mt-2 list-disc list-inside pl-4 space-y-1">
                    <li>메인 Key Visual</li>
                    <li>캠페인 Key Visual</li>
                    <li>SUBJECT Key Visual</li>
                    <li>시즌 Key Visual</li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">브랜드 Moodboard</span>
                  <ul className="mt-2 list-disc list-inside pl-4 space-y-1">
                    <li>레퍼런스 이미지</li>
                    <li>컬러 팔레트</li>
                    <li>조명/아트 스타일</li>
                    <li>텍스처</li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">브랜드 Presentation Visual</span>
                  <ul className="mt-2 list-disc list-inside pl-4 space-y-1">
                    <li>IR Deck 비주얼</li>
                    <li>인포그래픽</li>
                    <li>프로세스 다이어그램</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        )}
        {step !== "assets" && step !== "explore" && placeholder && (
          <>
            <p className="font-serif italic text-lg text-muted leading-relaxed">{placeholder}</p>
            {step === "expansion" && (
              <div className="mt-6 text-sm text-faint leading-relaxed opacity-70">
                <p className="font-semibold mb-2">브랜치 NARRA ・ 킥오프 미팅</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>왜 만드는가? (목적)</li>
                  <li>누구에게 보여줄 것인가? (타깃)</li>
                  <li>어떤 메시지를 전달할 것인가?</li>
                  <li>어디에 사용할 것인가? (IR, 홈페이지, SNS, 전시, 공연, 버추얼PD등)</li>
                  <li>제작 범위</li>
                  <li>일정</li>
                  <li>예산</li>
                </ul>
              </div>
            )}
          </>
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
