"use client";

import { useState } from "react";

export default function UploadBox() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function uploadFile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = (e.currentTarget.file as any).files[0];
    if (!file) return;

    setLoading(true);
    setMsg("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) setMsg("Document indexed successfully");
    else setMsg(data.error || "Upload failed");
  }

  return (
    <form
      onSubmit={uploadFile}
      className="rounded-xl border border-dashed border-slate-300 p-5 text-center space-y-3"
    >
      <p className="font-medium">Upload a document</p>
      <input
        type="file"
        name="file"
        accept=".txt"
        className="block mx-auto text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-white text-sm hover:bg-slate-800 disabled:opacity-50"
      >
        {loading ? "Indexing..." : "Upload"}
      </button>
      {msg && <p className="text-sm text-slate-600">{msg}</p>}
    </form>
  );
}
