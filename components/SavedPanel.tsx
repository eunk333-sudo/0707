import type { SavedAsset } from "@/lib/types";

export function SavedPanel({
  assets,
  onRemove,
}: {
  assets: SavedAsset[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gold/10">
        <h2 className="text-[11px] font-display uppercase tracking-[0.4em] text-gold/80">
          아카이브 ({assets.length})
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3">
        {assets.length === 0 && (
          <p className="font-serif italic text-[15px] text-muted leading-relaxed">
            마음에 드는 결과 카드의 저장 버튼을 누르면 이곳에 쌓입니다.
          </p>
        )}
        {assets
          .slice()
          .reverse()
          .map((asset) => (
            <div
              key={asset.id}
              className="rounded-lg border border-gold/15 bg-panel-strong p-4 flex flex-col gap-1.5 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold/70">
                    {asset.format ?? (asset.type === "brand_definition" ? "브랜드 정의" : "")}
                  </p>
                  <p className="text-sm font-medium text-ink mt-0.5">{asset.title}</p>
                </div>
                <button
                  onClick={() => onRemove(asset.id)}
                  className="text-xs text-faint hover:text-red-400 transition-colors shrink-0"
                >
                  삭제
                </button>
              </div>
              <p className="text-[11px] text-faint">
                {new Date(asset.savedAt).toLocaleString("ko-KR")}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
