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

  function handleSelectStep(step: WorkflowStepId) {
    if (step === "ai_prompt") {
      const existingAiPrompt = cards.some((c) => c.type === "result" && c.title === "AI 프롬프트");
      if (!existingAiPrompt) {
        const aiPromptCard: NarraCard = {
          type: "result",
          title: "AI 프롬프트",
          fields: {
            "AI Prompt": `A cinematic journey through an infinite universe where gravity no longer exists. A lone figure slowly drifts through deep cosmic darkness, surrounded by vast nebulae, distant galaxies, and countless shimmering stars. Every movement feels weightless, elegant, and almost sacred, evoking a profound sense of awe and wonder. The character gently reaches out toward a distant star, fingertips nearly touching its radiant light, creating an emotionally powerful moment of aspiration and transcendence.

The environment is immense and boundless, with layered galaxies, celestial dust, volumetric cosmic clouds, subtle particle fields, and soft gravitational distortions that enhance the scale of the universe. The atmosphere is silent yet emotionally overwhelming, balancing loneliness with hope.

Lighting is cinematic and ethereal, featuring soft bloom, delicate lens flares, volumetric light rays, subtle rim lighting, and natural reflections from surrounding starlight. Deep blacks contrast with luminous blues, violets, silvers, and warm stellar highlights, creating an elegant high-end science fiction aesthetic.

Camera language is slow, deliberate, and immersive. Begin with an ultra-wide establishing shot revealing the endless universe, followed by a graceful orbital camera movement. Slowly dolly forward into a medium shot before transitioning into an intimate close-up of the hand reaching toward the star. Finish with a majestic pull-back that reveals the overwhelming scale of space and the fragile beauty of the lone traveler.
Ultra-realistic cinematic rendering, IMAX scale, premium science-fiction visual language, emotional storytelling, elegant pacing, atmospheric depth, volumetric lighting, realistic zero-gravity physics, subtle slow motion, high dynamic range, soft film grain, Unreal Engine 5 quality, 8K, masterpiece, award-winning commercial film aesthetic.`,
          },
        };
        setCards((c) => [...c, aiPromptCard]);
        setDisplay((d) => [
          ...d,
          {
            role: "assistant",
            text: "결과물이 생성되었습니다.\n**영화 트레일러, 애플 비전 프로 광고, 인터스텔라, 듄, Love Death + Robots** 계열의 시네마틱 무드까지 커버하는 프롬프트로 생성 해보았습니다.",
          },
        ]);
      }
    }
    setActiveStep(step);
  }

  function handleSaveCard(index: number) {
    const card = cards[index];
    if (!card) return;

    const consistencyReport = scoreConsistency();

    savedAssetsStore.write([
      ...saved,
      { ...card, id: `${Date.now()}-${index}`, savedAt: Date.now(), consistencyReport },
    ]);
    setSavedKeys((keys) => new Set(keys).add(index));
    // If user saved the brand definition, auto-generate the discovery cards (mock)
    if (card.type === "brand_definition") {
      const brandTitle = card.title || "브랜드 정의";
      const creative: NarraCard = {
        type: "creative_direction",
        title: "크리에이티브 디렉션",
        fields: {
          "핵심 컨셉": `${brandTitle}을(를) 시네마틱하고 서사적으로 표현`,
          "톤 앤 무드": "경외감 · 고요함 · 골드 포인트",
          "핵심 메시지": "손끝에 닿은 은하",
        },
      };

      const brief: NarraCard = {
        type: "result",
        title: "Brief",
        fields: {
          "컨셉 요약": `${brandTitle}의 시네마틱 브리프 (mock)`,
          "목표": "브랜드 인지도 확장 및 감성적 연결",
          "핵심 산출물": "브랜드 필름, 키비주얼, 무드보드",
        },
      };

      const aiPrompt: NarraCard = {
        type: "result",
        title: "AI 프롬프트",
        fields: {
          "프롬프트": `Cinematic zero-gravity scene, ${brandTitle}, dramatic rim light, photorealistic (mock)`,
        },
      };

      setCards((c) => [...c, creative, brief, aiPrompt]);
    }
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

  const brandCardIndex = (() => {
    for (let i = cards.length - 1; i >= 0; i--) {
      if (cards[i].type === "brand_definition") return i;
    }
    return -1;
  })();
  const brandCard = brandCardIndex >= 0 ? cards[brandCardIndex] : null;

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <IntroModal open={introOpen} onClose={() => setIntroOpen(false)} />
      <div className="shrink-0 px-6 py-2 border-b border-gold/10 bg-void/40">
        <p className="text-[12px] text-gold/70">최은강 모험가님</p>
      </div>
      <main className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[240px_240px_1fr_280px] divide-y md:divide-y-0 md:divide-x divide-gold/10">
        <div className="min-h-0">
          <ResultPanel
            card={brandCard}
            saved={brandCardIndex >= 0 && savedKeys.has(brandCardIndex)}
            onSave={brandCardIndex >= 0 ? () => handleSaveCard(brandCardIndex) : undefined}
          />
        </div>
        <div className="min-h-0">
          <DiscoveryPanel
            step={activeStep}
            completedSteps={completedSteps}
            onSelectStep={handleSelectStep}
            card={activeCard}
            saved={activeCardIndex >= 0 && savedKeys.has(activeCardIndex)}
            onSave={activeCardIndex >= 0 ? () => handleSaveCard(activeCardIndex) : undefined}
            showFormatOptions={showFormatOptions}
            onPickFormat={handlePickFormat}
          />
        </div>
        <div className="min-h-0 bg-panel/40">
          <ChatPanel
            messages={display}
            input={input}
            onInputChange={setInput}
            onSend={() => sendMessage(input)}
            loading={loading}
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
