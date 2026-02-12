"use client";

import { useEffect, useState } from "react";
import UploadBox from "@/components/UploadBox";
import ChatBox from "@/components/ChatBox";
import SourceCard from "@/components/SourceCard";
import DocumentList from "@/components/DocumentList";

export default function HomePage() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [docRefreshKey, setDocRefreshKey] = useState(0);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setCheckingAuth(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (checkingAuth) {
    return (
      <div className="text-center py-10 text-slate-500">
        Checking authentication…
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-0 right-0 text-sm px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
      >
        Logout
      </button>

      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Private Knowledge Q&A
        </h1>
        <p className="text-slate-600">
          Upload documents. Ask questions. Get answers with sources.
        </p>
      </header>

      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <UploadBox onUploadSuccess={() => setDocRefreshKey((k) => k + 1)} />

        <ChatBox
          onResult={(res) => {
            setAnswer(res.answer);
            setSources(res.sources);
          }}
        />

        {answer && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="font-semibold mb-2 text-slate-800">Answer</h2>
            <p className="leading-relaxed">{answer}</p>
          </div>
        )}
      </div>

      {sources.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-slate-700">Sources</h2>
          <div className="grid gap-3">
            {sources.map((s, i) => (
              <SourceCard key={i} source={s} />
            ))}
          </div>
        </div>
      )}

      <DocumentList refreshKey={docRefreshKey} />
    </div>
  );
}
