import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { chunkText } from "@/lib/chunker";
import { createEmbedding } from "@/lib/embeddings";
import { getUserId } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  const user = getUserId(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const text = await file.text();

  // upload to cloudinary
  const buffer = Buffer.from(await file.arrayBuffer());

  const upload = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: `private_knowledge/${user}`,
        resource_type: "raw",
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    ).end(buffer);
  });

  // insert document
  const { data: doc, error } = await supabase
    .from("documents")
    .insert({
      name: file.name,
      user_id: user,
      file_url: upload.secure_url, // ✅ DIRECT LINK
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // chunk + embed
  const chunks = chunkText(text);

  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk);
    await supabase.from("chunks").insert({
      document_id: doc.id,
      content: chunk,
      embedding,
      user_id: user,
    });
  }

  return NextResponse.json({ success: true });
}
