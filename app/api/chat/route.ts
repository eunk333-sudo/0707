import { NextResponse } from "next/server";
import { mockRespond } from "@/lib/mock";
import type { ChatMessage } from "@/lib/types";

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: ChatMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages가 비어있습니다." }, { status: 400 });
  }

  return NextResponse.json({ content: mockRespond(messages) });
}
