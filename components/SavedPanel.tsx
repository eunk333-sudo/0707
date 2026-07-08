"use client";

import { useState } from "react";
import type { ConsistencyReport, SavedAsset } from "@/lib/types";

const AXES: { key: keyof Omit<ConsistencyReport, "narrative" | "improvement" | "suggestion">; label: string }[] = [
  { key: "tone", label: "Tone Consistency" },
  { key: "emotion", label: "Emotion Consistency" },
  { key: "message", label: "Message Consistency" },
];

function BrandAlignment({ report }: { report: ConsistencyReport }) {
  return (
    <div className="mt-3 rounded-lg border border-gold/15 bg-void/40 p-4 flex flex-col gap-3">
      <div>
        <p className="text-[11px] uppercase tracking-[0.08em] text-gold/70">브랜드 정합성 검토(AI)</p>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[13px] text-ink/70">Narrative Match</span>
          <span className="font-display text-lg text-gold-bright">{report.narrative}%</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-gold/10 pt-3">
        {AXES.map(({ key, label }) => (
          <div key={key}>
            <div className="flex items-center justify-between text-[11px] text-ink/60">
              <span>{label}</span>
              <span>{report[key]}%</span>
            </div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gold" style={{ width: `${report[key]}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 border-t border-gold/10 pt-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.05em] text-faint">개선 포인트</p>
          <p className="mt-0.5 text-[12px] text-ink/75 leading-relaxed">{report.improvement}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.05em] text-faint">수정 제안</p>
          <p className="mt-0.5 text-[12px] text-ink/75 leading-relaxed">{report.suggestion}</p>
        </div>
      </div>
    </div>
  );
}

const COLLAPSED_HEIGHT = 56;
const EXPANDED_MAX_HEIGHT = 440;
const STACK_STEP = 28;

export function SavedPanel({
  assets,
  onRemove,
}: {
  assets: SavedAsset[];
  onRemove: (id: string) => void;
}) {
  const [liftedId, setLiftedId] = useState<string | null>(null);

  const displayList = assets.slice().reverse();

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gold/10">
        <h2 className="text-base font-bold uppercase tracking-[0.1em] text-gold/90 text-emboss">
          아카이브 ({assets.length})
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {assets.length === 0 && (
          <p className="font-serif italic text-lg text-muted leading-relaxed">
            마음에 드는 결과 카드의 저장 버튼을 누르면 이곳에 쌓입니다.
          </p>
        )}
        {assets.length > 0 && (
          <div
            className="relative mt-4"
            style={{ height: `${COLLAPSED_HEIGHT + (displayList.length - 1) * STACK_STEP + 20}px` }}
          >
            {displayList.map((asset, i) => {
              const lifted = asset.id === liftedId;
              const version = assets.findIndex((a) => a.id === asset.id) + 1;
              return (
                <div
                  key={asset.id}
                  onClick={() => setLiftedId(lifted ? null : asset.id)}
                  className={`absolute inset-x-0 cursor-pointer overflow-hidden rounded-xl border transition-all duration-300 ease ${
                    lifted
                      ? "border-gold/40 bg-panel-strong shadow-[0_20px_44px_-14px_rgba(203,161,53,0.5)]"
                      : "border-gold/15 bg-panel-strong hover:border-gold/30 shadow-[0_4px_10px_-6px_rgba(0,0,0,0.5)]"
                  }`}
                  style={{
                    top: `${i * STACK_STEP}px`,
                    maxHeight: lifted ? `${EXPANDED_MAX_HEIGHT}px` : `${COLLAPSED_HEIGHT}px`,
                    transform: lifted ? "translateY(-12px) scale(1.02)" : "translateY(0) scale(0.99)",
                    zIndex: lifted ? 100 : displayList.length - i,
                  }}
                >
                  {lifted ? (
                    <div className="px-4 py-3 flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gold-bright">
                          Version {version}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(asset.id);
                          }}
                          aria-label="삭제"
                          className="text-faint hover:text-red-400 transition-colors text-sm leading-none"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-[15px] font-medium text-ink/85 leading-snug">{asset.title}</p>
                      <p className="text-[10px] text-faint">
                        {new Date(asset.savedAt).toLocaleString("ko-KR")}
                      </p>
                    </div>
                  ) : (
                    <div className="h-[56px] px-4 flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gold-bright shrink-0">
                        Version {version}
                      </span>
                      <span className="h-3 w-px bg-gold/20 shrink-0" />
                      <span className="text-[13px] font-medium text-ink/80 min-w-0 flex-1 truncate">
                        {asset.title}
                      </span>
                      <span className="h-3 w-px bg-gold/20 shrink-0" />
                      <span className="text-[10px] text-faint shrink-0 whitespace-nowrap">
                        {new Date(asset.savedAt).toLocaleString("ko-KR")}
                      </span>
                    </div>
                  )}
                  {lifted && asset.consistencyReport && (
                    <div className="px-4 pb-4">
                      <BrandAlignment report={asset.consistencyReport} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
