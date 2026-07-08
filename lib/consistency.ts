import type { ConsistencyReport } from "@/lib/types";

export function scoreConsistency(): ConsistencyReport {
  return {
    narrative: 76,
    tone: 76,
    emotion: 82,
    message: 68,
    improvement: "브랜드가 전달하려는 감정보다 고급스러움이 과도하게 표현되었습니다.",
    suggestion: "신뢰감을 높이기 위해 조명과 카피를 조금 더 차분하고 명확한 방향으로 수정하는 것을 추천합니다.",
  };
}
