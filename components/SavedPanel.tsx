"use client";

import { useState, useSyncExternalStore } from "react";
import { GemIcon, getGemAccentColor } from "@/components/GemIcon";
import { gemLevelStore } from "@/lib/gemLevelStore";
import { subjectOf } from "@/lib/subject";
import type { ConsistencyReport, SavedAsset } from "@/lib/types";

const MAX_GEM_TIER = 5;

interface SavedGroup {
  subject: string;
  count: number;
  ids: string[];
  latest: SavedAsset;
}

function groupBySubject(assets: SavedAsset[]): SavedGroup[] {
  const map = new Map<string, SavedGroup>();
  for (const asset of assets) {
    const subject = subjectOf(asset.title);
    const existing = map.get(subject);
    if (existing) {
      existing.count += 1;
      existing.ids.push(asset.id);
      if (asset.savedAt > existing.latest.savedAt) existing.latest = asset;
    } else {
      map.set(subject, { subject, count: 1, ids: [asset.id], latest: asset });
    }
  }
  return [...map.values()].sort((a, b) => b.latest.savedAt - a.latest.savedAt);
}

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
const STACK_STEP = 46;

export function SavedPanel({
  assets,
  onRemove,
}: {
  assets: SavedAsset[];
  onRemove: (ids: string[]) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCopied, setModalCopied] = useState(false);
  const gemLevels = useSyncExternalStore(
    gemLevelStore.subscribe,
    gemLevelStore.getSnapshot,
    gemLevelStore.getServerSnapshot,
  );

  const groups = groupBySubject(assets);
  const selectedAsset = assets.find((a) => a.id === selectedId) ?? null;

  function openModal(assetId: string) {
    setSelectedId(assetId);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  async function handleCopyModal() {
    if (!selectedAsset) return;
    const text = `${subjectOf(selectedAsset.title)}\n\n${Object.entries(selectedAsset.fields)
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
        {groups.length > 0 && (
          <div
            className="relative mt-4"
            style={{ height: `${CARD_HEIGHT + (groups.length - 1) * STACK_STEP + 20}px` }}
          >
            {groups.map((group, i) => {
              const selected = group.ids.includes(selectedId ?? "");
              const level = gemLevels[group.subject] ?? group.count;
              const overflow = Math.max(0, level - MAX_GEM_TIER);
              const accentColor = getGemAccentColor(group.subject);
              return (
                <div
                  key={group.subject}
                  onClick={() => openModal(group.latest.id)}
                  className={`absolute inset-x-0 h-[56px] cursor-pointer overflow-hidden rounded-xl border pl-3 pr-10 flex items-center gap-3 transition-all duration-300 ease ${
                    selected
                      ? "border-gold/45 shadow-[0_18px_40px_-14px_rgba(203,161,53,0.55)]"
                      : "border-gold/15 hover:border-gold/30 shadow-[0_6px_16px_-8px_rgba(0,0,0,0.65)]"
                  }`}
                  style={{
                    top: `${i * STACK_STEP}px`,
                    transform: selected ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(0.99)",
                    zIndex: selected ? 100 : groups.length - i,
                    background: selected ? "rgba(20,16,7,0.96)" : "rgba(9,8,6,0.93)",
                  }}
                >
                  <span
                    className="absolute inset-y-0 left-0 w-1"
                    style={{ backgroundColor: accentColor, opacity: 0.8 }}
                  />
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
                    <GemIcon subject={group.subject} level={level} />
                    {overflow > 0 && (
                      <span className="absolute -bottom-1 -right-1 rounded-full border border-gold/40 bg-[#1c0c2a] px-1 text-[9px] font-bold leading-[14px] text-gold-bright">
                        +{overflow}
                      </span>
                    )}
                  </span>
                  <span className="text-[13px] font-medium text-ink/80 min-w-0 flex-1 truncate">
                    {group.subject}
                  </span>
                  <span className="text-[11px] text-faint shrink-0 whitespace-nowrap">
                    {new Date(group.latest.savedAt).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(group.ids);
                      if (selected) {
                        setSelectedId(null);
                      }
                    }}
                    aria-label="삭제"
                    title="삭제"
                    className="absolute top-2 right-2 text-faint hover:text-red-400 transition-colors text-sm leading-none p-2 rounded-md h-8 w-8 flex items-center justify-center hover:bg-white/5"
                  >
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="2" y1="2" x2="14" y2="14" />
                      <line x1="14" y1="2" x2="2" y2="14" />
                    </svg>
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
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4 py-8"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-3xl overflow-y-auto relative rounded-3xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(6,6,16,0.98) 0%, rgba(12,8,34,0.97) 35%, rgba(28,16,56,0.94) 60%, rgba(16,10,44,0.96) 82%, rgba(6,5,14,0.99) 100%)',
              border: '1px solid rgba(108,79,176,0.12)',
              boxShadow: '0 40px 110px rgba(0,0,0,0.72), 0 12px 40px rgba(54,30,120,0.12)',
              // Capped to roughly the size of the "브랜드 정의" card (our shortest,
              // most representative one) — longer cards (e.g. AI 프롬프트) scroll
              // inside this box instead of growing the modal past it.
              maxHeight: 'min(600px, calc(100vh - 4rem))',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* film-grain overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-6" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay'
            }} />
            <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-violet-500/8 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-10 h-56 w-56 rounded-full bg-sky-400/8 blur-3xl" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.08em] text-gold/70">저장된 카드</p>
                <h3 className="mt-2 text-3xl font-semibold text-ink tracking-wide text-emboss-light">{subjectOf(selectedAsset.title)}</h3>
                <div className="mt-1 h-0.5 w-24 rounded-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyModal}
                  aria-label="카드 복사"
                  className="rounded-md border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-ink/80 hover:bg-white/20 transition-colors"
                >
                  {modalCopied ? "복사됨" : "복사"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="닫기"
                  className="rounded-full border border-white/15 bg-white/10 h-10 w-10 text-lg text-ink/80 hover:bg-white/20 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {Object.entries(selectedAsset.fields).map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-violet-500/10 p-5" style={{ background: 'rgba(16,12,44,0.84)' }}>
                  <p className="text-[12px] uppercase tracking-[0.08em] text-violet-200/70 mb-2">
                    {label}
                  </p>
                  <p className="mt-2 text-[16px] leading-relaxed text-white/80 whitespace-pre-wrap">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <span className="text-[11px] text-faint">
                {new Date(selectedAsset.savedAt).toLocaleString("ko-KR")}
              </span>
            </div>
            {/* Consistency report removed from modal — preserved in the panel footer only */}
          </div>
        </div>
      )}
    </div>
  );
}
