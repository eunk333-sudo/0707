"use client";

import { useState } from "react";
import type { ConsistencyReport, SavedAsset } from "@/lib/types";

const AXES: { key: keyof Omit<ConsistencyReport, "narrative" | "improvement" | "suggestion">; label: string }[] = [
  { key: "tone", label: "Tone Consistency" },
  { key: "emotion", label: "Emotion Consistency" },
  { key: "message", label: "Message Consistency" },
];

function BrandAlignmentBody({ report }: { report: ConsistencyReport }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-ink/70">Narrative Match</span>
        <span className="font-display text-lg text-gold-bright">{report.narrative}%</span>
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

const CARD_HEIGHT = 56;
const STACK_STEP = 48;

export function SavedPanel({
  assets,
  onRemove,
}: {
  assets: SavedAsset[];
  onRemove: (id: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCopied, setModalCopied] = useState(false);

  const displayList = assets.slice().reverse();
  const selectedAsset = displayList.find((a) => a.id === selectedId) ?? null;

  function openModal(assetId: string) {
    setSelectedId(assetId);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  async function handleCopyModal() {
    if (!selectedAsset) return;
    const text = `${selectedAsset.title}\n\n${Object.entries(selectedAsset.fields)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n\n")}`;
    await navigator.clipboard.writeText(text);
    setModalCopied(true);
    window.setTimeout(() => setModalCopied(false), 1600);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gold/10">
        <h2 className="text-base font-bold uppercase tracking-[0.1em] text-gold/90 text-emboss">
          인벤토리 ({assets.length})
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
            style={{ height: `${CARD_HEIGHT + (displayList.length - 1) * STACK_STEP + 20}px` }}
          >
            {displayList.map((asset, i) => {
              const selected = asset.id === selectedId;
              const version = assets.findIndex((a) => a.id === asset.id) + 1;
              return (
                <div
                  key={asset.id}
                  onClick={() => openModal(asset.id)}
                  className={`absolute inset-x-0 h-[56px] cursor-pointer overflow-hidden rounded-xl border pl-4 pr-6 flex items-center gap-2 transition-all duration-300 ease ${
                    selected
                      ? "border-gold/45 bg-panel-strong shadow-[0_18px_40px_-14px_rgba(203,161,53,0.55)]"
                      : "border-gold/15 bg-panel-strong hover:border-gold/30 shadow-[0_4px_10px_-6px_rgba(0,0,0,0.5)]"
                  }`}
                  style={{
                    top: `${i * STACK_STEP}px`,
                    transform: selected ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(0.99)",
                    zIndex: selected ? 100 : displayList.length - i,
                  }}
                >
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(asset.id);
                      if (selectedId === asset.id) {
                        setSelectedId(null);
                      }
                    }}
                    aria-label="삭제"
                    className="shrink-0 text-faint hover:text-red-400 transition-colors text-sm leading-none p-2 rounded-md h-8 w-8 flex items-center justify-center hover:bg-white/5"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-gold/10 px-6 py-5">
        <p className="text-[11px] uppercase tracking-[0.08em] text-gold/70">브랜드 정합성 검토(AI)</p>
        <div className="mt-3">
          {selectedAsset?.consistencyReport ? (
            <BrandAlignmentBody report={selectedAsset.consistencyReport} />
          ) : (
            <p className="text-[12px] text-faint leading-relaxed">
              {selectedAsset
                ? "이 카드는 정합성 데이터가 없어요."
                : "위 카드를 선택하면 정합성을 확인할 수 있어요."}
            </p>
          )}
        </div>
      </div>

      {modalOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="w-full max-w-3xl relative rounded-3xl p-6" style={{
            background: 'linear-gradient(180deg, rgba(8,6,10,0.96), rgba(4,3,5,0.94))',
            border: '1px solid rgba(232,199,102,0.06)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.75), 0 8px 30px rgba(203,161,53,0.06)'
          }}>
            {/* subtle starfield overlay (night-sky) */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(232,199,102,0.9) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.85) 1px, transparent 1px)',
                backgroundSize: '180px 180px, 60px 60px',
                backgroundPosition: '10px 20px, 40px 80px',
                opacity: 0.12,
                mixBlendMode: 'screen',
                filter: 'blur(0.4px)'
              }}
            />
            {/* film-grain overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay'
            }} />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.08em] text-gold/70">저장된 카드</p>
                <h3 className="mt-2 text-3xl font-semibold text-ink tracking-wide text-emboss-light">{selectedAsset.title}</h3>
                <div className="mt-1 h-0.5 w-24 rounded-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyModal}
                  aria-label="카드 복사"
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-ink/70 hover:bg-white/10 transition-colors"
                >
                  {modalCopied ? "복사됨" : "복사"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-ink/70 hover:bg-white/10 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {Object.entries(selectedAsset.fields).map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/6 p-4" style={{ background: 'rgba(0,0,0,0.95)' }}>
                  <p className="text-[11px] uppercase tracking-[0.08em] text-faint">
                    {label}
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/95 whitespace-pre-wrap">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            {/* Consistency report removed from modal — preserved in the panel footer only */}
          </div>
        </div>
      )}
    </div>
  );
}
