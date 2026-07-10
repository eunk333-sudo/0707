"use client";

import { useState } from "react";
import { WORKFLOW_STEPS, type NarraCard, type WorkflowStepId } from "@/lib/types";
import { NarraCardView } from "@/components/NarraCardView";

const NAV_STEPS = WORKFLOW_STEPS.filter((s) => s.id !== "explore");

const PLACEHOLDER_STEPS: Record<string, string> = {
  expansion: "PDF · 브랜드 필름 · 커머셜 · 킥오프 · 파트너 초대 — 곧 지원 예정이에요.",
};

const FORMAT_OPTIONS = [
  "브랜드필름",
  "키비주얼",
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
  onSave?: (overrideTitle?: string) => void;
  showFormatOptions?: boolean;
  onPickFormat?: (format: string) => void;
}) {
  const [promptType, setPromptType] = useState<"image" | "video">("image");
  const placeholder = PLACEHOLDER_STEPS[step];

  const activePromptText =
    promptType === "image" ? card?.fields["이미지 프롬프트"] ?? "" : card?.fields["영상 프롬프트"] ?? "";

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
            <div key={s.id} className="flex flex-col gap-1">
              <button
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
              {s.id === "ai_prompt" && active && (
                <div className="flex flex-col gap-1 pl-4">
                  {(["image", "video"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setPromptType(type)}
                      className={`text-left rounded-lg px-3 py-2 text-[12px] tracking-normal transition-colors ${
                        promptType === type
                          ? "bg-gold/10 text-gold-bright border border-gold/20"
                          : "text-faint hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      {type === "image" ? "이미지 프롬프트" : "영상 프롬프트"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
        {step === "explore" && (
          <p className="font-serif italic text-lg text-muted leading-relaxed">
            발견이 끝나면 여정을 이어서 진행할 수 있어요.
          </p>
        )}
        {step === "assets" && (
          <div className="flex flex-col gap-4">
            <p className="font-serif italic text-lg text-muted leading-relaxed">
              브랜드 자산은 다음과 같이 정리됩니다.
            </p>
            <div className="rounded-2xl border border-violet-500/10 p-5" style={{ background: 'rgba(16,12,44,0.84)' }}>
              <p className="text-[12px] uppercase tracking-[0.08em] text-violet-200/70 mb-3">브랜드 자산 구성</p>
              <div className="text-sm text-white/80 opacity-90 space-y-4">
                <div>
                  <p className="font-semibold text-violet-200/90 mb-2">디지털 에셋</p>
                  <ul className="list-disc list-inside space-y-1 text-white/70 pl-2">
                    <li>포토카드</li>
                    <li>로고 (PNG) (SVG)</li>
                    <li>SNS 프로필 이미지</li>
                    <li>스티커</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-violet-200/90 mb-2">브랜드 Key Visual</p>
                  <ul className="list-disc list-inside space-y-1 text-white/70 pl-2">
                    <li>메인 Key Visual</li>
                    <li>캠페인 Key Visual</li>
                    <li>SUBJECT Key Visual</li>
                    <li>시즌 Key Visual</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-violet-200/90 mb-2">브랜드 Moodboard</p>
                  <ul className="list-disc list-inside space-y-1 text-white/70 pl-2">
                    <li>레퍼런스 이미지</li>
                    <li>컬러 팔레트</li>
                    <li>조명/아트 스타일</li>
                    <li>텍스처</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-violet-200/90 mb-2">브랜드 Presentation Visual</p>
                  <ul className="list-disc list-inside space-y-1 text-white/70 pl-2">
                    <li>IR Deck 비주얼</li>
                    <li>인포그래픽</li>
                    <li>프로세스 다이어그램</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        {step === "brief" && showFormatOptions && (
          <div className="space-y-4 text-sm text-faint opacity-90">
            <p className="font-semibold">출력 형식을 선택해보세요.</p>
            <div className="flex flex-wrap gap-2">
              {FORMAT_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onPickFormat?.(option)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-ink transition hover:border-gold/40 hover:bg-gold/10"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === "ai_prompt" && (
          <div className="rounded-2xl border border-violet-500/10 p-5" style={{ background: 'rgba(16,12,44,0.84)' }}>
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-[12px] uppercase tracking-[0.08em] text-violet-200/70">
                {promptType === "image" ? "이미지 프롬프트" : "영상 프롬프트"}
              </p>
              {onSave && (
                <button
                  onClick={() => onSave(promptType === "image" ? "이미지 프롬프트" : "영상 프롬프트")}
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
            </div>
            {activePromptText ? (
              <p className="text-[14px] leading-relaxed text-white/80 whitespace-pre-wrap">
                {activePromptText}
              </p>
            ) : (
              <p className="font-serif italic text-lg text-muted leading-relaxed">
                아직 이 단계의 결과가 없어요. 대화를 계속 이어가 보세요.
              </p>
            )}
          </div>
        )}
        {step !== "assets" && step !== "explore" && step !== "ai_prompt" && step !== "expansion" && !card && placeholder && (
          <p className="font-serif italic text-lg text-muted leading-relaxed">{placeholder}</p>
        )}
        {step !== "assets" && step !== "explore" && !placeholder && !card && (
          <p className="font-serif italic text-lg text-muted leading-relaxed">
            아직 이 단계의 결과가 없어요. 대화를 계속 이어가 보세요.
          </p>
        )}
        {step === "expansion" && placeholder && (
          <div className="flex flex-col gap-4">
            <p className="font-serif italic text-lg text-muted leading-relaxed">{placeholder}</p>
            <div className="rounded-2xl border border-violet-500/10 p-5" style={{ background: 'rgba(16,12,44,0.84)' }}>
              <p className="text-[12px] uppercase tracking-[0.08em] text-violet-200/70 mb-3">킥오프 미팅 체크리스트</p>
              <div className="text-[14px] leading-relaxed text-white/80 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-gold-bright">•</span>
                  <span>왜 만드는가? (목적)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-bright">•</span>
                  <span>누구에게 보여줄 것인가? (타깃)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-bright">•</span>
                  <span>어떤 메시지를 전달할 것인가?</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-bright">•</span>
                  <span>어디에 사용할 것인가? (IR, 홈페이지, SNS, 전시, 공연, 버추얼PD 등)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-bright">•</span>
                  <span>제작 범위</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-bright">•</span>
                  <span>일정</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-bright">•</span>
                  <span>예산</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {step !== "assets" && step !== "explore" && step !== "ai_prompt" && step !== "expansion" && !placeholder && card && (
          <NarraCardView card={card} onSave={onSave} saved={saved} />
        )}
      </div>
    </div>
  );
}
