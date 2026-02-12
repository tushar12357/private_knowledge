"use client";

import { useState } from "react";

export default function ChatBox({
  onResult,
}: {
  onResult: (res: any) => void;
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask() {
    if (!question) return;

    setLoading(true);
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setLoading(false);
    onResult(data);
  }

  return (
    <div className="space-y-3">
      <label className="font-medium">Ask a question</label>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
        rows={3}
        placeholder="What does this document say about…"
      />
      <div className="flex justify-end">
        <button
          onClick={ask}
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white text-sm hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? "Thinking…" : "Ask"}
        </button>
      </div>
    </div>
  );
}
