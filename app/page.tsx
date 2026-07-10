"use client";

import { useState, useSyncExternalStore } from "react";
import { ChatPanel, type DisplayMessage } from "@/components/ChatPanel";
import { DiscoveryPanel } from "@/components/DiscoveryPanel";
import { IntroModal } from "@/components/IntroModal";
import { ResultPanel } from "@/components/ResultPanel";
import { SavedPanel } from "@/components/SavedPanel";
import { scoreConsistency } from "@/lib/consistency";
import { gemLevelStore } from "@/lib/gemLevelStore";
import { extractCard } from "@/lib/parseCard";
import { savedAssetsStore } from "@/lib/savedAssetsStore";
import { subjectOf } from "@/lib/subject";
import { WORKFLOW_STEPS, type ChatMessage, type NarraCard, type SavedAsset, type WorkflowStepId } from "@/lib/types";

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

  const IMAGE_PROMPT_TEXT = `A cinematic still image of an infinite universe where gravity no longer exists. A lone figure floats motionless in deep cosmic darkness, surrounded by vast nebulae, distant galaxies, and countless shimmering stars, one arm gently reaching toward a distant star, fingertips almost touching its radiant light — a single frozen moment of aspiration and transcendence.

The composition is a wide, symmetrical frame with the figure small against the immense, boundless environment: layered galaxies, celestial dust, volumetric cosmic clouds, and soft gravitational distortions that emphasize scale. The mood is silent yet emotionally overwhelming, balancing loneliness with hope.

Lighting is cinematic and ethereal — soft bloom, delicate lens flares, volumetric light rays, subtle rim lighting, and natural reflections from surrounding starlight. Deep blacks contrast with luminous blues, violets, silvers, and warm stellar highlights, creating an elegant high-end science-fiction aesthetic.

Ultra-realistic rendering, IMAX-scale composition, premium science-fiction visual language, atmospheric depth, volumetric lighting, realistic zero-gravity physics, high dynamic range, soft film grain, Unreal Engine 5 quality, 8K, masterpiece, award-winning concept art.`;

  const VIDEO_PROMPT_TEXT = `A cinematic journey through an infinite universe where gravity no longer exists. A lone figure slowly drifts through deep cosmic darkness, surrounded by vast nebulae, distant galaxies, and countless shimmering stars. Every movement feels weightless, elegant, and almost sacred, evoking a profound sense of awe and wonder. The character gently reaches out toward a distant star, fingertips nearly touching its radiant light, creating an emotionally powerful moment of aspiration and transcendence.

The environment is immense and boundless, with layered galaxies, celestial dust, volumetric cosmic clouds, subtle particle fields, and soft gravitational distortions that enhance the scale of the universe. The atmosphere is silent yet emotionally overwhelming, balancing loneliness with hope.

Lighting is cinematic and ethereal, featuring soft bloom, delicate lens flares, volumetric light rays, subtle rim lighting, and natural reflections from surrounding starlight. Deep blacks contrast with luminous blues, violets, silvers, and warm stellar highlights, creating an elegant high-end science fiction aesthetic.

Camera language is slow, deliberate, and immersive. Begin with an ultra-wide establishing shot revealing the endless universe, followed by a graceful orbital camera movement. Slowly dolly forward into a medium shot before transitioning into an intimate close-up of the hand reaching toward the star. Finish with a majestic pull-back that reveals the overwhelming scale of space and the fragile beauty of the lone traveler.

Ultra-realistic cinematic rendering, IMAX scale, premium science-fiction visual language, emotional storytelling, elegant pacing, atmospheric depth, volumetric lighting, realistic zero-gravity physics, subtle slow motion, high dynamic range, soft film grain, Unreal Engine 5 quality, 8K, masterpiece, award-winning commercial film aesthetic.`;

  function createBrandDirectionCard() {
    return {
      type: "creative_direction" as const,
      title: "크리에이티브 디렉션",
      fields: {
        Concept: "장면을 기반으로 한 서사적 콘셉트",
        Mood: "경외감, 고요함, 골드 하이라이트 중심의 몰입감",
        "Key Visual": "무중력 상태에서 손끝이 은하를 향하는 순간의 장면",
        Color: "딥 퍼플, 골드 포인트, 블랙과 네이비 대비",
        Lighting: "소프트 빛과 림 라이트가 교차하는 시네마틱 라이팅",
        "Art Direction": "미니멀하면서도 고급스러운 우주 미학",
        "Camera Direction": "로우 앵글 익스트림 와이드부터 손 클로즈업까지",
      },
    };
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    setError(null);
    const nextHistory: ChatMessage[] = [...history, { role: "user", content: text }];
    setHistory(nextHistory);
    setDisplay((d) => [...d, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const resPromise = fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextHistory }),
      });
      const [res] = await Promise.all([
        resPromise,
        new Promise((resolve) => setTimeout(resolve, 1200)),
      ]);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "요청에 실패했습니다.");
      }

      const raw: string = data.content;
      const { card, text: stripped } = extractCard(raw);

      setHistory((h) => [...h, { role: "assistant", content: raw }]);
      setDisplay((d) => [...d, { role: "assistant", text: stripped, hasCard: !!card }]);

      if (card) {
        setCards((c) => {
          const nextCards = [...c, card];
          if (
            raw.includes("당신의 세계가 첫번째 정의를 가졌습니다.") &&
            raw.includes("크리에이티브 디렉션") &&
            !nextCards.some((item) => item.type === "creative_direction")
          ) {
            nextCards.push(createBrandDirectionCard());
          }
          return nextCards;
        });
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

  function getNextSavedTitle(cardTitle: string, existingAssets: SavedAsset[]) {
    const normalizedTopic = cardTitle.trim().replace(/\s+\d{2}$/u, "").trim();
    const topic = normalizedTopic || "카드";
    const sameTopicCount = existingAssets.filter((asset) => {
      const assetTitle = asset.title.trim();
      if (assetTitle === topic) return true;
      const match = assetTitle.match(/^(.*?)(?:\s+\d{2})$/u);
      return match?.[1].trim() === topic;
    }).length;

    return `${topic} ${String(sameTopicCount + 1).padStart(2, "0")}`;
  }

  function handleSelectStep(step: WorkflowStepId) {
    if (step === "creative") {
      const existingBrandDirection = cards.some((c) => c.type === "creative_direction");
      if (!existingBrandDirection) {
        setCards((c) => [...c, createBrandDirectionCard()]);
      }
    }
    if (step === "ai_prompt") {
      const existingAiPrompt = cards.some((c) => c.type === "result" && c.title === "AI 프롬프트");
      if (!existingAiPrompt) {
        const aiPromptCard: NarraCard = {
          type: "result",
          title: "AI 프롬프트",
          fields: {
            "이미지 프롬프트": IMAGE_PROMPT_TEXT,
            "영상 프롬프트": VIDEO_PROMPT_TEXT,
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
  function handleSaveCard(index: number, overrideTitle?: string) {
    const card = cards[index];
    if (!card) return;

    const consistencyReport = scoreConsistency();
    const rawTitle = overrideTitle ?? card.title;
    const topic = subjectOf(rawTitle) || "카드";

    gemLevelStore.increment(topic);

    // Overwrite the existing inventory entry for this subject if one exists
    // (e.g. once the API makes a tab's content evolve, re-saving should
    // replace the old version rather than pile up duplicates).
    const existingIndex = saved.findIndex((a) => subjectOf(a.title) === topic);
    if (existingIndex >= 0) {
      const existing = saved[existingIndex];
      const nextSaved = [...saved];
      nextSaved[existingIndex] = {
        ...card,
        title: existing.title,
        id: existing.id,
        savedAt: Date.now(),
        consistencyReport,
      };
      savedAssetsStore.write(nextSaved);
    } else {
      const nextTitle = getNextSavedTitle(rawTitle, saved);
      savedAssetsStore.write([
        ...saved,
        {
          ...card,
          title: nextTitle,
          id: `${Date.now()}-${index}`,
          savedAt: Date.now(),
          consistencyReport,
        },
      ]);
    }
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
          "이미지 프롬프트": IMAGE_PROMPT_TEXT,
          "영상 프롬프트": VIDEO_PROMPT_TEXT,
        },
      };

      setCards((c) => [...c, creative, brief, aiPrompt]);
    }
  }

  function handleRemoveSaved(ids: string[]) {
    const idSet = new Set(ids);
    const removed = saved.filter((a) => idSet.has(a.id));
    savedAssetsStore.write(saved.filter((a) => !idSet.has(a.id)));

    if (removed.length > 0) {
      setSavedKeys((keys) => {
        const nextKeys = new Set(keys);
        for (const asset of removed) {
          const idPieces = asset.id.split("-");
          const parsedIndex = Number(idPieces[idPieces.length - 1]);
          if (!Number.isNaN(parsedIndex)) {
            nextKeys.delete(parsedIndex);
          }
        }
        return nextKeys;
      });
    }
  }

  const showFormatOptions = brandDefined && !formatChosen;

  const completedSteps = new Set(
    WORKFLOW_STEPS.filter((s) =>
      s.cardType
        ? cards.some((c) => c.type === s.cardType && (!s.cardTitle || c.title === s.cardTitle))
        : false,
    ).map((s) => s.id),
  );
  const activeStepMeta = WORKFLOW_STEPS.find((s) => s.id === activeStep)!;
  const activeCardIndex = activeStepMeta.cardType
    ? (() => {
        for (let i = cards.length - 1; i >= 0; i--) {
          if (cards[i].type === activeStepMeta.cardType) {
            if (!activeStepMeta.cardTitle || cards[i].title === activeStepMeta.cardTitle) {
              return i;
            }
          }
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
      <main className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[240px_1fr_240px_280px] divide-y md:divide-y-0 md:divide-x divide-gold/10">
        <div className="min-h-0">
          <ResultPanel
            card={brandCard}
            saved={brandCardIndex >= 0 && savedKeys.has(brandCardIndex)}
            onSave={brandCardIndex >= 0 ? () => handleSaveCard(brandCardIndex) : undefined}
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
        <div className="min-h-0">
          <DiscoveryPanel
            step={activeStep}
            completedSteps={completedSteps}
            onSelectStep={handleSelectStep}
            card={activeCard}
            saved={activeCardIndex >= 0 && savedKeys.has(activeCardIndex)}
            onSave={
              activeCardIndex >= 0
                ? (overrideTitle?: string) => handleSaveCard(activeCardIndex, overrideTitle)
                : undefined
            }
            showFormatOptions={showFormatOptions}
            onPickFormat={handlePickFormat}
          />
        </div>
        <div className="min-h-0 bg-panel/60">
          <SavedPanel assets={saved} onRemove={handleRemoveSaved} />
        </div>
      </main>
    </div>
  );
}
