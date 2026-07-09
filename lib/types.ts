export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface NarraCard {
  type: "brand_definition" | "creative_direction" | "result";
  title: string;
  format?: string;
  fields: Record<string, string>;
}

export interface ConsistencyReport {
  narrative: number;
  tone: number;
  emotion: number;
  message: number;
  improvement: string;
  suggestion: string;
}

export interface SavedAsset extends NarraCard {
  id: string;
  savedAt: number;
  consistencyReport?: ConsistencyReport;
}

// Workflow steps for the left-hand nav (see ③④ in the master patch). The
// brief/AI-프롬프트 steps intentionally reuse the existing "result" card type
// instead of splitting NarraCard into more variants — the mock already emits
// one rich "result" card covering both concepts.
export type WorkflowStepId = "explore" | "creative" | "brief" | "ai_prompt" | "assets" | "expansion";

export interface WorkflowStep {
  id: WorkflowStepId;
  label: string;
  cardType: NarraCard["type"] | null;
  cardTitle?: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { id: "explore", label: "브랜드 탐험", cardType: "brand_definition" },
  { id: "creative", label: "크리에이티브 디렉션", cardType: "creative_direction" },
  { id: "brief", label: "크리에이티브 브리프", cardType: "result", cardTitle: "Brief" },
  { id: "ai_prompt", label: "AI 프롬프트", cardType: "result", cardTitle: "AI 프롬프트" },
  { id: "assets", label: "브랜드 자산", cardType: null },
  { id: "expansion", label: "브랜드 확장", cardType: null },
];
