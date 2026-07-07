import type { ChatMessage } from "@/lib/types";

const VIDEO_FORMATS = ["브랜드필름", "광고"];
const ALL_FORMATS = [
  "브랜드필름",
  "광고",
  "키비주얼",
  "홈페이지 히어로 이미지",
  "SNS 콘텐츠",
  "무드보드",
];

function findChosenFormat(userMessages: string[]): string | null {
  for (let i = userMessages.length - 1; i >= 0; i--) {
    const found = ALL_FORMATS.find((f) => userMessages[i].includes(f));
    if (found) return found;
  }
  return null;
}

function hasAskedTool(assistantMessages: string[]): boolean {
  return assistantMessages.some((m) => m.includes("클링") && m.includes("영상 생성"));
}

export function mockRespond(messages: ChatMessage[]): string {
  const userTexts = messages.filter((m) => m.role === "user").map((m) => m.content);
  const assistantTexts = messages.filter((m) => m.role === "assistant").map((m) => m.content);
  const count = userTexts.length;
  const lastUser = userTexts[count - 1] ?? "";

  if (count === 1) {
    return "그 세계, 선명하게 그려지네요. 그 브랜드는 사람들에게 어떤 감정을 전달했으면 하나요? 예를 들어 편안함, 긴장감, 설렘 같은 것 중에 가까운 게 있을까요?";
  }

  if (count === 2) {
    return "그 감정, 좋네요. 마지막으로 하나만 더 물어볼게요 — 사람들이 이 브랜드를 떠올릴 때 가장 기억했으면 하는 장면이나 단어가 있나요?";
  }

  if (count === 3) {
    return [
      "충분히 그려졌어요. 지금까지 나눈 이야기를 브랜드 정의로 정리해볼게요.",
      "",
      "```narra-card",
      JSON.stringify({
        type: "brand_definition",
        title: "브랜드 정의",
        fields: {
          "핵심 키워드": "조용함, 무채색, 건축적, 절제된 여백 (mock 예시)",
          "브랜드 성격": "차분하고 확신에 찬, 말을 아끼는 브랜드",
          "톤앤무드": "미니멀, 낮은 채도, 자연광",
          "브랜드 내러티브": `사용자가 남긴 힌트: "${lastUser}"를 중심으로, 불필요한 장식을 걷어내고 본질만 남기는 세계관 (mock 예시)`,
          "핵심 감정": "안정감과 신뢰",
        },
      }),
      "```",
      "",
      "이제 이 브랜드를 어떤 형태로 표현해볼까요? 브랜드필름, 광고, 키비주얼, 홈페이지 히어로 이미지, SNS 콘텐츠, 무드보드 중에서 골라주세요.",
    ].join("\n");
  }

  const chosenFormat = findChosenFormat(userTexts);

  if (count === 4 && chosenFormat && VIDEO_FORMATS.includes(chosenFormat) && !hasAskedTool(assistantTexts)) {
    return "영상으로 담아보면 좋겠네요. 원하시는 AI 영상 생성 에이전트가 있으신가요? 클링은 정적이고 사실적인 무드, 런웨이는 실험적이고 다이나믹한 무드, 시드니스는 부드럽고 감성적인 무드에 강점이 있어요. 잘 모르시면 '몰라요'라고 해주셔도 괜찮아요.";
  }

  const fields: Record<string, string> =
    chosenFormat && VIDEO_FORMATS.includes(chosenFormat)
      ? {
          "시놉시스": "여백이 많은 공간, 한 사람이 천천히 움직이며 제품/브랜드와 조용히 마주하는 장면으로 시작해 절제된 카피 한 줄로 마무리 (mock 예시)",
          "카피": "말보다 여백이 많은 브랜드. (mock 예시)",
          "영상 프롬프트": "Minimal architectural space, soft natural light, muted grayscale palette, slow deliberate camera movement, single subject, negative space emphasis (mock 예시)",
        }
      : {
          "시놉시스": `${chosenFormat ?? "선택한 포맷"}에 맞춘 절제된 구도의 비주얼 컨셉 (mock 예시)`,
          "카피": "말보다 여백이 많은 브랜드. (mock 예시)",
          "이미지 프롬프트": "Minimal architectural composition, muted grayscale tones, soft natural light, generous negative space (mock 예시)",
        };

  return [
    `${chosenFormat ?? "선택하신 포맷"}으로 결과물을 정리했어요.`,
    "",
    "```narra-card",
    JSON.stringify({
      type: "result",
      title: `${chosenFormat ?? "결과"} 기획안`,
      format: chosenFormat ?? undefined,
      fields,
    }),
    "```",
  ].join("\n");
}
