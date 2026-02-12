import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const supabaseCheck = await supabase
    .from("documents")
    .select("id")
    .limit(1);

  return NextResponse.json({
    backend: true,
    supabase: !supabaseCheck.error,
    llm: true, // HF inference API
  });
}
