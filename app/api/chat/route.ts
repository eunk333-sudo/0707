import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { NARRA_SYSTEM_PROMPT } from "@/lib/systemPrompt";
import { mockRespond } from "@/lib/mock";
import type { ChatMessage } from "@/lib/types";

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  const { messages } = (await req.json()) as { messages: ChatMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages가 비어있습니다." }, { status: 400 });
  }

  if (!apiKey) {
    // No API key configured yet — use a deterministic mock so the UX flow
    // can still be exercised end-to-end. Add ANTHROPIC_API_KEY to .env.local
    // to switch to real Claude responses.
    return NextResponse.json({ content: mockRespond(messages) });
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1500,
      system: NARRA_SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ content: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
