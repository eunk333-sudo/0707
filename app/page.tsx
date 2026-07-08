"use client";

import { useState, useSyncExternalStore } from "react";
import { ChatPanel, type DisplayMessage } from "@/components/ChatPanel";
import { DiscoveryPanel } from "@/components/DiscoveryPanel";
import { IntroModal } from "@/components/IntroModal";
import { ResultPanel } from "@/components/ResultPanel";
import { SavedPanel } from "@/components/SavedPanel";
import { scoreConsistency } from "@/lib/consistency";
import { extractCard } from "@/lib/parseCard";
import { savedAssetsStore } from "@/lib/savedAssetsStore";
import { WORKFLOW_STEPS, type ChatMessage, type NarraCard, type WorkflowStepId } from "@/lib/types";

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
  const [activeStep, setActiveStep] = useState<WorkflowStepId>("explore");

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
          setActiveStep("explore");
        } else if (card.type === "creative_direction") {
          setActiveStep("creative");
        } else if (card.type === "result") {
          setFormatChosen(false);
          setActiveStep("brief");
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

    const consistencyReport = card.type === "result" ? scoreConsistency() : undefined;

    savedAssetsStore.write([
      ...saved,
      { ...card, id: `${Date.now()}-${index}`, savedAt: Date.now(), consistencyReport },
    ]);
    setSavedKeys((keys) => new Set(keys).add(index));
  }

  function handleRemoveSaved(id: string) {
    savedAssetsStore.write(saved.filter((a) => a.id !== id));
  }

  const showFormatOptions = brandDefined && !formatChosen;

  const completedSteps = new Set(
    WORKFLOW_STEPS.filter((s) => s.cardType && cards.some((c) => c.type === s.cardType)).map((s) => s.id),
  );
  const activeStepMeta = WORKFLOW_STEPS.find((s) => s.id === activeStep)!;
  const activeCardIndex = activeStepMeta.cardType
    ? (() => {
        for (let i = cards.length - 1; i >= 0; i--) {
          if (cards[i].type === activeStepMeta.cardType) return i;
        }
        return -1;
      })()
    : -1;
  const activeCard = activeCardIndex >= 0 ? cards[activeCardIndex] : null;

  return (
    <div className="h-screen overflow-hidden">
      <IntroModal open={introOpen} onClose={() => setIntroOpen(false)} />
      <main className="h-full grid grid-cols-1 md:grid-cols-[160px_240px_1fr_280px] divide-y md:divide-y-0 md:divide-x divide-gold/10">
        <div className="min-h-0">
          <ResultPanel activeStep={activeStep} completedSteps={completedSteps} onSelectStep={setActiveStep} />
        </div>
        <div className="min-h-0">
          <DiscoveryPanel
            step={activeStep}
            card={activeCard}
            saved={activeCardIndex >= 0 && savedKeys.has(activeCardIndex)}
            onSave={activeCardIndex >= 0 ? () => handleSaveCard(activeCardIndex) : undefined}
          />
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
            currentStepLabel={activeStepMeta.label}
          />
        </div>
        <div className="min-h-0 bg-panel/60">
          <SavedPanel assets={saved} onRemove={handleRemoveSaved} />
        </div>
      </main>
    </div>
  );
}
