"use client";

import { useState, useSyncExternalStore } from "react";
import { ChatPanel, type DisplayMessage } from "@/components/ChatPanel";
import { ResultPanel } from "@/components/ResultPanel";
import { SavedPanel } from "@/components/SavedPanel";
import { extractCard } from "@/lib/parseCard";
import { savedAssetsStore } from "@/lib/savedAssetsStore";
import type { ChatMessage, NarraCard } from "@/lib/types";

export default function Home() {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [display, setDisplay] = useState<DisplayMessage[]>([]);
  const [cards, setCards] = useState<NarraCard[]>([]);
  const [savedKeys, setSavedKeys] = useState<Set<number>>(new Set());
  const saved = useSyncExternalStore(
    savedAssetsStore.subscribe,
    savedAssetsStore.getSnapshot,
    savedAssetsStore.getServerSnapshot,
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brandDefined, setBrandDefined] = useState(false);
  const [formatChosen, setFormatChosen] = useState(false);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    setError(null);
    const nextHistory: ChatMessage[] = [...history, { role: "user", content: text }];
    setHistory(nextHistory);
    setDisplay((d) => [...d, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextHistory }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "요청에 실패했습니다.");
      }

      const raw: string = data.content;
      const { card, text: stripped } = extractCard(raw);

      setHistory((h) => [...h, { role: "assistant", content: raw }]);
      setDisplay((d) => [...d, { role: "assistant", text: stripped, hasCard: !!card }]);

      if (card) {
        setCards((c) => [...c, card]);
        if (card.type === "brand_definition") {
          setBrandDefined(true);
        }
        if (card.type === "result") {
          setFormatChosen(false);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function handlePickFormat(format: string) {
    setFormatChosen(true);
    sendMessage(`${format}로 만들어줘.`);
  }

  function handleSaveCard(index: number) {
    const card = cards[index];
    if (!card) return;
    savedAssetsStore.write([
      ...saved,
      { ...card, id: `${Date.now()}-${index}`, savedAt: Date.now() },
    ]);
    setSavedKeys((keys) => new Set(keys).add(index));
  }

  function handleRemoveSaved(id: string) {
    savedAssetsStore.write(saved.filter((a) => a.id !== id));
  }

  const showFormatOptions = brandDefined && !formatChosen;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="relative shrink-0 border-b border-gold/15 px-6 py-8 text-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_140%_at_50%_0%,rgba(203,161,53,0.10),transparent_70%)]" />
        <p className="relative text-xs uppercase tracking-[0.55em] text-faint text-emboss-light">
          Brand Narrative OS
        </p>
        <h1 className="relative mt-3 font-display text-5xl sm:text-6xl tracking-[0.28em] text-gold-bright [text-shadow:0_2px_0_rgba(0,0,0,0.55),0_1px_0_rgba(255,235,180,0.5),0_0_40px_rgba(232,199,102,0.4)]">
          NARRA
        </h1>
        <p className="relative mt-3 font-serif italic text-xl text-muted tracking-wide text-emboss-light">
          Every Brand Has Its Own World.
        </p>
      </header>

      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_360px] divide-y lg:divide-y-0 lg:divide-x divide-gold/10">
        <div className="min-h-0">
          <ResultPanel cards={cards} savedKeys={savedKeys} onSave={handleSaveCard} />
        </div>
        <div className="min-h-0 bg-panel/40">
          <ChatPanel
            messages={display}
            input={input}
            onInputChange={setInput}
            onSend={() => sendMessage(input)}
            loading={loading}
            showFormatOptions={showFormatOptions}
            onPickFormat={handlePickFormat}
            error={error}
          />
        </div>
        <div className="min-h-0 bg-panel/60">
          <SavedPanel assets={saved} onRemove={handleRemoveSaved} />
        </div>
      </main>
    </div>
  );
}
