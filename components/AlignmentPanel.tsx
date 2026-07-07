export function AlignmentPanel({ hasSaved }: { hasSaved: boolean }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gold/10">
        <h2 className="text-base font-display font-bold uppercase tracking-[0.4em] text-gold/90 text-emboss">
          브랜드 정합성
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3">
        {!hasSaved && (
          <p className="font-serif italic text-lg text-muted leading-relaxed">
            결과를 저장하면 브랜드 내러티브와의 일치도를 확인할 수 있습니다.
          </p>
        )}
        {hasSaved && (
          <div className="rounded-lg border border-gold/15 bg-panel-strong p-4 flex flex-col gap-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold/70">
              브랜드 정체성
            </p>
            <p className="font-display text-3xl text-gold-bright text-emboss">85%</p>
            <p className="text-[13px] text-ink/75 leading-relaxed mt-1">
              가장 최근 저장한 결과 기준 일치도 (mock)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
