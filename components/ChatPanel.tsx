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
  const isHero = messages.length === 0;
  const glowing = input.trim().length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (isHero) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-6 py-5 border-b border-gold/10">
          <h2 className="text-base font-display font-bold uppercase tracking-[0.4em] text-gold/90 text-emboss">
            탐험
          </h2>
        </div>

        <div className="relative flex-1 flex items-center justify-center px-6 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, #000000 0%, rgba(6,3,10,0.96) 22%, rgba(30,12,45,0.55) 42%, rgba(88,28,135,0.18) 58%, transparent 76%), radial-gradient(circle at 50% 45%, transparent 36%, rgba(232,199,102,0.22) 38.5%, transparent 41%)",
            }}
          />

          <div className="relative flex flex-col items-center gap-7 w-full max-w-xl">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.5em] text-faint">
                Brand Narrative OS
              </p>
              <h1 className="mt-2 font-display text-4xl tracking-[0.28em] text-gold-bright [text-shadow:0_2px_0_rgba(0,0,0,0.55),0_1px_0_rgba(255,235,180,0.5),0_0_40px_rgba(232,199,102,0.4)]">
                NARRA
              </h1>
            </div>

            <p className="font-serif italic text-xl text-ink text-center leading-relaxed">
              당신의 브랜드는 어떤 세계를 꿈꾸고 있나요?
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSend();
              }}
              className="relative w-full"
            >
              <input
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="메시지를 입력하세요..."
                disabled={loading}
                autoFocus
                className={`w-full rounded-full border bg-white/[0.04] pl-6 pr-14 py-4 text-base text-ink placeholder:text-faint focus:outline-none transition-shadow duration-300 disabled:opacity-50 ${
                  glowing
                    ? "border-gold/70 shadow-[0_0_10px_rgba(232,199,102,0.5),0_0_45px_rgba(232,199,102,0.35),0_0_90px_rgba(232,199,102,0.15)]"
                    : "border-white/10 focus:border-gold/40 focus:ring-1 focus:ring-gold/30"
                }`}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="보내기"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-gold text-void disabled:bg-white/10 disabled:text-faint hover:bg-gold-bright transition-colors"
              >
                →
              </button>
            </form>

            <p className="text-[11px] text-ink/65 text-center leading-relaxed">
              대충 말씀하셔도 괜찮아요. 예: &ldquo;깔끔하고 조용한 브랜드, 애플 같은 느낌,
              무채색&rdquo;
            </p>

            {error && (
              <p className="text-[13px] text-red-300 text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, #000000 0%, rgba(6,3,10,0.9) 20%, rgba(30,12,45,0.4) 45%, rgba(88,28,135,0.12) 65%, transparent 85%), radial-gradient(circle at 50% 40%, transparent 46%, rgba(232,199,102,0.1) 48%, transparent 51%)",
        }}
      />

      <div className="relative px-6 py-5 border-b border-gold/10">
        <h2 className="text-base font-display font-bold uppercase tracking-[0.4em] text-gold/90 text-emboss">
          탐험
        </h2>
      </div>

      <div className="relative flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[88%] px-5 py-3 text-[15px] leading-relaxed whitespace-pre-wrap border ${
              m.role === "user"
                ? "self-end rounded-2xl rounded-br-sm bg-gold/10 border-gold/25 text-ink/75"
                : "self-start rounded-2xl rounded-bl-sm bg-panel-strong border-white/5 text-ink/75"
            }`}
          >
            {m.text || (m.hasCard ? "결과 카드를 생성했어요 →" : "")}
          </div>
        ))}
        {loading && (
          <div className="max-w-[88%] self-start rounded-2xl rounded-bl-sm bg-panel-strong border border-white/5 px-5 py-3 text-[15px] text-muted">
            <span className="inline-flex gap-1">
              <span className="animate-pulse">·</span>
              <span className="animate-pulse [animation-delay:150ms]">·</span>
              <span className="animate-pulse [animation-delay:300ms]">·</span>
            </span>{" "}
            세계관을 그리는 중
          </div>
        )}
        {error && (
          <div className="max-w-[88%] self-start rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 px-5 py-3 text-[15px]">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {showFormatOptions && (
        <div className="relative px-6 pb-3 flex flex-wrap gap-2">
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        className="relative px-6 py-5 border-t border-gold/10 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="메시지를 입력하세요..."
          disabled={loading}
          className={`flex-1 rounded-full border bg-white/[0.04] px-5 py-3.5 text-base text-ink placeholder:text-faint focus:outline-none transition-shadow duration-300 disabled:opacity-50 ${
            glowing
              ? "border-gold/70 shadow-[0_0_10px_rgba(232,199,102,0.5),0_0_40px_rgba(232,199,102,0.35),0_0_80px_rgba(232,199,102,0.15)]"
              : "border-white/10 focus:border-gold/40 focus:ring-1 focus:ring-gold/30"
          }`}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-full bg-gold text-void px-7 py-3.5 text-sm font-semibold tracking-wide disabled:bg-white/10 disabled:text-faint hover:bg-gold-bright transition-colors"
        >
          보내기
        </button>
      </form>
    </div>
  );
}
