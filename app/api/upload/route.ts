import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { chunkText } from "@/lib/chunker";
import { createEmbedding } from "@/lib/embeddings";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const text = await file.text();

  // 1. Insert document
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .insert({ name: file.name })
    .select()
    .single();

  if (docError) {
    return NextResponse.json({ error: docError.message }, { status: 500 });
  }

  // 2. Chunk + embed

  const chunks = chunkText(text);

  // 3. Embed + store
  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk);

    await supabase.from("chunks").insert({
      document_id: doc.id,
      content: chunk,
      embedding,
    });
  }

  return NextResponse.json({ success: true });
}
