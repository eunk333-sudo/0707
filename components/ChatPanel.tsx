import { useEffect, useRef, useState } from "react";

export interface DisplayMessage {
  role: "user" | "assistant";
  text: string;
  hasCard?: boolean;
}

const THINKING_STATES = [
  "Understanding Brand...",
  "Finding Narrative...",
  "Connecting Emotion...",
  "Building World...",
];

export function ChatPanel({
  messages,
  input,
  onInputChange,
  onSend,
  loading,
  error,
  currentStepLabel,
}: {
  messages: DisplayMessage[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  loading: boolean;
  error: string | null;
  currentStepLabel?: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isHero = messages.length === 0;
  const glowing = input.trim().length > 0;
  const [thinkingIndex, setThinkingIndex] = useState(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setThinkingIndex((i) => (i + 1) % THINKING_STATES.length);
    }, 900);
    return () => clearInterval(id);
  }, [loading]);

  if (isHero) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-6 py-5 border-b border-gold/10">
          <h2 className="text-base font-bold uppercase tracking-[0.1em] text-gold/90 text-emboss">
            여정
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

            {currentStepLabel && (
              <p className="text-[11px] uppercase tracking-[0.08em] text-gold/80 -mb-2">
                {currentStepLabel}
              </p>
            )}
            <p className="font-serif italic text-xl text-ink text-center leading-relaxed">
              당신의 세계는 어떤 이야기로 기억되고 싶나요?
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSend();
              }}
              className="relative w-full"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="대충 말해도 괜찮아요. NARRA가 함께 정리해드릴게요."
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
        <h2 className="text-base font-bold uppercase tracking-[0.1em] text-gold/90 text-emboss">
          여정
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
            {THINKING_STATES[thinkingIndex]}
          </div>
        )}
        {error && (
          <div className="max-w-[88%] self-start rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 px-5 py-3 text-[15px]">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="relative border-t border-gold/10">
        {currentStepLabel && (
          <p className="px-6 pt-4 text-[11px] uppercase tracking-[0.08em] text-gold/80">
            {currentStepLabel}
          </p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSend();
          }}
          className="px-6 pt-2 pb-5 flex gap-2"
        >
        <input
          ref={inputRef}
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
          className="rounded-full bg-gold text-void px-7 py-3.5 text-sm font-semibold tracking-normal disabled:bg-white/10 disabled:text-faint hover:bg-gold-bright transition-colors"
        >
          보내기
        </button>
        </form>
      </div>
    </div>
  );
}
