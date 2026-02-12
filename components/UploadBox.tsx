"use client";

import { useRef, useState } from "react";

export default function UploadBox({
  onUploadSuccess,
}: {
  onUploadSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadFile(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setMsg("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setMsg("✅ Document uploaded successfully");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      onUploadSuccess();
    } else {
      setMsg(data.error || "Upload failed");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setFile(droppedFile);
  }

  return (
    <form
      onSubmit={uploadFile}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition
        ${dragActive ? "border-slate-900 bg-slate-50" : "border-slate-300"}
      `}
    >
      {/* Hidden input */}
      <input
        ref={fileRef}
        type="file"
        accept=".txt"
        hidden
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      {/* Icon */}
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        📄
      </div>

      {/* Text */}
      <p className="font-semibold text-slate-800">Upload a document</p>
      <p className="text-sm text-slate-500 mt-1">
        Drag & drop a file here or choose one
      </p>

      {/* Choose file */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
      >
        Choose file
      </button>

      {/* File preview */}
      {file && (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-100 px-4 py-2 text-sm">
          <span className="truncate font-medium">{file.name}</span>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="text-slate-500 hover:text-slate-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload button */}
      <button
        type="submit"
        disabled={loading || !file}
        className="mt-4 w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {loading ? "Uploading document..." : "Upload"}
      </button>

      {/* Status */}
      {msg && <p className="mt-3 text-sm text-slate-600">{msg}</p>}
    </form>
  );
}
