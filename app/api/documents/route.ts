import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getUserId } from "@/lib/auth";

export async function GET(req: Request) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? 5);
  const cursor = searchParams.get("cursor");

  let query = supabase
    .from("documents")
.select("id, name, created_at, file_url")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const hasMore = data.length > limit;
  const documents = hasMore ? data.slice(0, limit) : data;
  const nextCursor = hasMore
    ? documents[documents.length - 1].created_at
    : null;

  return NextResponse.json({ documents, nextCursor, hasMore });
}

