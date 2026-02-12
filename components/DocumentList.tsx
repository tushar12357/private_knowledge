"use client";

import { useEffect, useRef, useState } from "react";

export default function DocumentList() {
  const [docs, setDocs] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  async function loadMore() {
    if (loading || !hasMore) return;

    setLoading(true);

    const url = new URL("/api/documents", window.location.origin);
    url.searchParams.set("limit", "5");
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url.toString());
    const data = await res.json();

    setDocs((prev) => [...prev, ...data.documents]);
    setCursor(data.nextCursor);
    setHasMore(data.hasMore);
    setLoading(false);
  }

  // initial load
  useEffect(() => {
    loadMore();
  }, []);

  // intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loaderRef.current, cursor, hasMore]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="font-semibold mb-3 text-slate-700">
        Uploaded Documents
      </h2>

      <ul className="space-y-2">
        {docs.map((doc) => (
          <li
            key={doc.id}
            className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
          >
            <span className="font-medium">
              {doc.name}
            </span>
            <span className="text-xs text-slate-500">
              {new Date(doc.created_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>

      {/* Loader */}
      {hasMore && (
        <div
          ref={loaderRef}
          className="py-3 text-center text-sm text-slate-500"
        >
          {loading ? "Loading more…" : "Scroll to load more"}
        </div>
      )}

      {!hasMore && (
        <p className="text-center text-sm text-slate-400 py-3">
          No more documents
        </p>
      )}
    </div>
  );
}
