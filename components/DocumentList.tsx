"use client";

import { useEffect, useRef, useState } from "react";

export default function DocumentList({ refreshKey }: { refreshKey: number }) {
  const [docs, setDocs] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  async function loadMore(reset = false) {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);

    const url = new URL("/api/documents", window.location.origin);
    url.searchParams.set("limit", "5");
    if (!reset && cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url.toString());
    const data = await res.json();

    setDocs(prev => reset ? data.documents : [...prev, ...data.documents]);
    setCursor(data.nextCursor);
    setHasMore(data.hasMore);
    setLoading(false);
  }

  // initial + refresh
  useEffect(() => {
    setDocs([]);
    setCursor(null);
    setHasMore(true);
    loadMore(true);
  }, [refreshKey]);

  // infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries[0].isIntersecting && loadMore(),
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [cursor, hasMore]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="font-semibold mb-3 text-slate-700">
        Uploaded Documents
      </h2>

      <ul className="space-y-2">
        {docs.map(doc => (
          <li
            key={doc.id}
            className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
          >
            <span className="font-medium">{doc.name}</span>
            <span className="text-xs text-slate-500">
              {new Date(doc.created_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div ref={loaderRef} className="py-3 text-center text-sm text-slate-500">
          {loading ? "Loading more…" : "Scroll to load more"}
        </div>
      )}
    </div>
  );
}
