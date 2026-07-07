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

export interface SavedAsset extends NarraCard {
  id: string;
  savedAt: number;
}
