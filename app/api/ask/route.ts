import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createEmbedding } from "@/lib/embeddings";
import { buildPrompt } from "@/lib/prompt";
import { generateAnswer } from "@/lib/hf-llm";

export async function POST(req: Request) {
  const { question } = await req.json();

  if (!question) {
    return NextResponse.json(
      { error: "Question is required" },
      { status: 400 }
    );
  }

  // 1. Embed question
  const questionEmbedding = await createEmbedding(question);

  // 2. Similarity search
  const { data: chunks, error } = await supabase.rpc("match_chunks", {
    query_embedding: questionEmbedding,
    match_count: 5,
  });

  if (error || !chunks || chunks.length === 0) {
    return NextResponse.json({
      answer: "I don't know",
      sources: [],
    });
  }

  // 3. Build context
  const context = chunks.map((c: any) => c.content).join("\n\n");

  // 4. Generate answer (HF)
  const prompt = buildPrompt(context, question);
  const answer = await generateAnswer(prompt);

  return NextResponse.json({
    answer,
    sources: chunks,
  });
}
