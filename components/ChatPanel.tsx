import { useEffect, useRef } from "react";

export interface DisplayMessage {
  role: "user" | "assistant";
  text: string;
  hasCard?: boolean;
}

const FORMAT_OPTIONS = [
  "브랜드필름",
  "광고",
  "키비주얼",
  "홈페이지 히어로 이미지",
  "SNS 콘텐츠",
  "무드보드",
];

export function ChatPanel({
  messages,
  input,
  onInputChange,
  onSend,
  loading,
  showFormatOptions,
  onPickFormat,
  error,
}: {
  messages: DisplayMessage[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  loading: boolean;
  showFormatOptions: boolean;
  onPickFormat: (format: string) => void;
  error: string | null;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gold/10">
        <h2 className="text-[11px] font-display uppercase tracking-[0.4em] text-gold/80">
          탐험
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
        {messages.length === 0 && (
          <p className="font-serif italic text-[15px] text-muted leading-relaxed max-w-md">
            어떤 브랜드를 만들고 싶나요?
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[88%] px-5 py-3 text-[13.5px] leading-relaxed whitespace-pre-wrap border ${
              m.role === "user"
                ? "self-end rounded-2xl rounded-br-sm bg-gold/10 border-gold/25 text-ink"
                : "self-start rounded-2xl rounded-bl-sm bg-panel-strong border-white/5 text-ink/90"
            }`}
          >
            {m.text || (m.hasCard ? "결과 카드를 생성했어요 →" : "")}
          </div>
        ))}
        {loading && (
          <div className="max-w-[88%] self-start rounded-2xl rounded-bl-sm bg-panel-strong border border-white/5 px-5 py-3 text-[13.5px] text-muted">
            <span className="inline-flex gap-1">
              <span className="animate-pulse">·</span>
              <span className="animate-pulse [animation-delay:150ms]">·</span>
              <span className="animate-pulse [animation-delay:300ms]">·</span>
            </span>{" "}
            세계관을 그리는 중
          </div>
        )}
        {error && (
          <div className="max-w-[88%] self-start rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 px-5 py-3 text-[13.5px]">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {showFormatOptions && (
        <div className="px-6 pb-3 flex flex-wrap gap-2">
          {FORMAT_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => onPickFormat(f)}
              className="text-xs tracking-wide rounded-full border border-gold/25 text-gold-bright/90 px-3.5 py-1.5 hover:bg-gold/10 hover:border-gold/50 transition-colors"
            >
              {f}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-gold/10">
        {messages.length === 0 && (
          <p className="px-6 pt-3 text-[11px] text-ink/65 leading-relaxed">
            대충 말씀하셔도 괜찮아요. 예: &ldquo;깔끔하고 조용한 브랜드, 애플 같은 느낌,
            무채색&rdquo;
          </p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSend();
          }}
          className="px-6 py-5 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={loading}
            className="flex-1 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-ink placeholder:text-faint focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-full bg-gold text-void px-6 py-2.5 text-sm font-semibold tracking-wide disabled:bg-white/10 disabled:text-faint hover:bg-gold-bright transition-colors"
          >
            보내기
          </button>
        </form>
      </div>
    </div>
  );
}
