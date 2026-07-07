"use client";

import { useState, useSyncExternalStore } from "react";
import { AlignmentPanel } from "@/components/AlignmentPanel";
import { ChatPanel, type DisplayMessage } from "@/components/ChatPanel";
import { IntroModal } from "@/components/IntroModal";
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
  const [introOpen, setIntroOpen] = useState(true);

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
    <div className="h-screen overflow-hidden">
      <IntroModal open={introOpen} onClose={() => setIntroOpen(false)} />
      <main className="h-full grid grid-cols-1 md:grid-cols-[15%_70%_15%] divide-y md:divide-y-0 md:divide-x divide-gold/10">
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
        <div className="min-h-0 bg-panel/60 flex flex-col divide-y divide-gold/10">
          <div className="flex-[3] min-h-0">
            <SavedPanel assets={saved} onRemove={handleRemoveSaved} />
          </div>
          <div className="flex-[2] min-h-0">
            <AlignmentPanel hasSaved={saved.length > 0} />
          </div>
        </div>
      </main>
    </div>
  );
}
