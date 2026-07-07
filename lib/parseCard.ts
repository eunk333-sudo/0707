import type { NarraCard } from "@/lib/types";

const CARD_BLOCK_REGEX = /```narra-card\s*([\s\S]*?)```/;

export function extractCard(text: string): { card: NarraCard | null; text: string } {
  const match = text.match(CARD_BLOCK_REGEX);
  if (!match) {
    return { card: null, text };
  }

  const remaining = text.replace(CARD_BLOCK_REGEX, "").trim();

  try {
    const parsed = JSON.parse(match[1].trim()) as NarraCard;
    if (!parsed.type || !parsed.title || !parsed.fields) {
      return { card: null, text };
    }
    return { card: parsed, text: remaining };
  } catch {
    return { card: null, text };
  }
}
