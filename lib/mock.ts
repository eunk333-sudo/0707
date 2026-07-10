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

// Fixed exploration sequence. A real LLM later replaces this whole list —
// the turn-counting structure around it doesn't need to change.
const EXPLORATION_QUESTIONS = [
  "사람들에게 어떤 감정을 전달하고 싶나요?",
  "그 세계는 어떤 컬러와 텍스쳐가 떠오르나요?",
  "어떤 사람들이 당신의 세계에 오래 머무르길 원하나요?",
  "당신의 꿈꾸는 세계의 키워드는 무엇인가요?",
  "좋습니다. 마지막으로 사람들이 이 세계를 떠올릴 때 가장 기억했으면 하는 장면을 자유롭게 말씀해주세요.",
];

function buildSceneKeywords(text: string) {
  const parts = text
    .split(/[,\.\/，。、\s]+/)
    .filter(Boolean)
    .map((word) => word.replace(/[^가-힣a-zA-Z0-9]+/g, ""));
  return parts.slice(0, 4).join(", ") || "서정적, 몰입감, 서사적, 감성적";
}

function createBrandDefinitionMock(lastUser: string) {
  const cleaned = lastUser.trim();
  const keywords = buildSceneKeywords(cleaned);
  return [
    "당신의 브랜드 DNA가 생성되었습니다.",
    "",
    "```narra-card",
    JSON.stringify({
      type: "brand_definition",
      title: "브랜드 정의",
      fields: {
        "핵심 키워드": `${keywords} (mock 예시)`,
        "브랜드 성격": "감성적이고 영화적인, 몰입감을 주는 브랜드",
        "Tone & Manner": "드라마틱한 조명, 고요하면서도 강렬한 무드, 섬세한 디테일",
        "브랜드 내러티브": `사용자가 말한 장면 "${cleaned}"을 기반으로 한 서사적 브랜드 이야기 (mock 예시)`,
        "핵심 감정": "경외감, 설렘, 여운",
      },
    }),
    "```",
  ].join("\n");
}

export function mockRespond(messages: ChatMessage[]): string {
  const userTexts = messages.filter((m) => m.role === "user").map((m) => m.content);
  const assistantTexts = messages.filter((m) => m.role === "assistant").map((m) => m.content);
  const count = userTexts.length;
  const lastUser = userTexts[count - 1] ?? "";

  if (count === 1) {
    return createBrandDefinitionMock(lastUser);
  }

  if (count >= 1 && count <= EXPLORATION_QUESTIONS.length) {
    return EXPLORATION_QUESTIONS[count - 1];
  }

  if (count === EXPLORATION_QUESTIONS.length + 1) {
    return [
      "당신의 세계가 첫번째 정의를 가졌습니다.",
      "당신이 찾아낸 세계의 \"크리에이티브 디렉션\"이 발견되었습니다.",
      "",
      "```narra-card",
      JSON.stringify({
        type: "brand_definition",
        title: "브랜드 정의",
        fields: {
          "핵심 키워드": "무중력, 광활한 우주, 경외감, 시네마틱 스케일 (mock 예시)",
          "브랜드 성격": "압도적이면서도 섬세한, 경외감을 자아내는 브랜드",
          "톤앤무드": "깊은 우주의 어둠, 은하의 빛, 시네마틱 조명과 부드러운 블룸 효과",
          "브랜드 내러티브": `사용자가 남긴 힌트: "${lastUser}"를 중심으로, 무중력 속에서 손끝으로 별을 향해 뻗는 순간의 경외감을 담은 세계관 (mock 예시)`,
          "핵심 감정": "경외감과 초월감",
          "타깃": `"${userTexts[1] ?? "새로운 감각을 찾는 사람들"}" 힌트를 바탕으로, 새로운 감각과 확장된 경험을 갈망하는 사람들 (mock 예시)`,
        },
      }),
      "```",
      "",
      "당신의 세계가 첫번째 정의를 가졌습니다.",
    ].join("\n");
  }

  const chosenFormat = findChosenFormat(userTexts);

  if (
    count === EXPLORATION_QUESTIONS.length + 2 &&
    chosenFormat &&
    VIDEO_FORMATS.includes(chosenFormat) &&
    !hasAskedTool(assistantTexts)
  ) {
    return "영상으로 담아보면 좋겠네요. 원하시는 AI 영상 생성 에이전트가 있으신가요? 클링은 정적이고 사실적인 무드, 런웨이는 실험적이고 다이나믹한 무드, 시드니스는 부드럽고 감성적인 무드에 강점이 있어요. 잘 모르시면 '몰라요'라고 해주셔도 괜찮아요.";
  }

  const fields: Record<string, string> =
    chosenFormat && VIDEO_FORMATS.includes(chosenFormat)
      ? {
          "로그라인":
            "중력을 벗어난 순간, 인류는 처음으로 자신의 손끝이 우주보다 크다는 것을 깨닫는다. (mock 예시)",
          "샷 리스트":
            "1. 익스트림 와이드샷 – 칠흑 같은 우주에 떠 있는 인물 실루엣, 로우 앵글\n2. 미디엄샷 – 무중력 속 서서히 회전하는 몸, 오빗 카메라 워킹\n3. 클로즈업 – 손끝이 은하를 향해 뻗는 순간, 슬로우 줌\n4. 익스트림 클로즈업 – 손가락과 은하 빛이 맞닿는 디테일샷\n5. 탑샷 – 거대한 지구가 프레임 상단을 압도하는 마무리 컷 (mock 예시)",
          "카메라 & 렌즈":
            "ARRI ALEXA 35 느낌, 아나모픽 렌즈, 얕은 심도와 부드러운 렌즈 플레어, 드론샷과 슬로우 줌을 병행 (mock 예시)",
          "조명 & 색보정":
            "림 라이트와 볼류메트릭 라이트로 은하의 빛을 강조, 골드 톤과 딥 블루 톤의 대비, 하이컨트라스트 시네마틱 룩 (mock 예시)",
          "VFX & 미술":
            "은하 주변으로 흩날리는 빛 입자 파티클, 우주복 표면의 질감 디테일, 성운이 홀로그램처럼 번지는 표현 (mock 예시)",
          "사운드 & 음악":
            "웅장한 오케스트라 스트링, Rise와 Whoosh 임팩트 사운드, 심장박동으로 긴장감 고조, BPM 68의 느린 빌드업 (mock 예시)",
          "카피": "손끝에 닿은 은하. (mock 예시)",
          "영상 프롬프트":
            "Cinematic zero-gravity scene shot on ARRI ALEXA 35, anamorphic lens with shallow depth of field, young woman in profile slowly orbiting while reaching toward a glowing spiral galaxy, rim light and volumetric light, gold and deep-blue color grade, massive Earth looming above the horizon, light-particle VFX, orchestral swell with rise and whoosh sound design, IMAX aesthetic, photorealistic, 8K (mock 예시)",
        }
      : {
          "컨셉 요약": `무중력 속에서 손끝으로 은하에 닿는 순간을 압도적 스케일로 포착한 ${chosenFormat ?? "선택한 포맷"} 비주얼 (mock 예시)`,
          "카메라 & 구도":
            "로우 앵글의 익스트림 와이드샷, 85mm 망원 렌즈, 얕은 심도로 인물과 은하만 선명하게 (mock 예시)",
          "조명 & 색감":
            "림 라이트와 골든아워 조명의 혼합, 골드 톤과 딥 블루 톤의 대비, 하이컨트라스트 시네마틱 룩 (mock 예시)",
          "미술 & 텍스처":
            "우주복 표면 질감, 성운이 홀로그램처럼 번지는 표현, 미니멀한 심볼로 배치된 브랜드 로고 (mock 예시)",
          "카피": "손끝에 닿은 은하. (mock 예시)",
          "이미지 프롬프트":
            "Cinematic zero-gravity composition, low angle extreme wide shot, 85mm lens, shallow depth of field, figure reaching toward a glowing spiral galaxy, rim light mixed with golden-hour light, gold and deep-blue color grade, massive Earth looming above, photorealistic, 8K (mock 예시)",
        };

  return [
    `${chosenFormat ?? "선택하신 포맷"}으로 결과물을 정리했어요.`,
    "",
    "```narra-card",
    JSON.stringify({
      type: "result",
      title: "Brief",
      format: chosenFormat ?? undefined,
      fields,
    }),
    "```",
  ].join("\n");
}
