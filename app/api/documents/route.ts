import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const limit = Number(searchParams.get("limit") ?? 5);
  const cursor = searchParams.get("cursor"); // ISO timestamp

  let query = supabase
    .from("documents")
    .select("id, name, created_at")
    .order("created_at", { ascending: false })
    .limit(limit + 1); // fetch 1 extra to detect next page

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const hasMore = data.length > limit;
  const documents = hasMore ? data.slice(0, limit) : data;
  const nextCursor = hasMore
    ? documents[documents.length - 1].created_at
    : null;

  return NextResponse.json({
    documents,
    nextCursor,
    hasMore,
  });
}
