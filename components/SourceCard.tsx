export default function SourceCard({ source }: { source: any }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
      <p className="text-xs text-slate-500 mb-1">
        Document ID
      </p>
      <p className="text-xs font-mono text-slate-600 mb-2">
        {source.document_id}
      </p>
      <p className="italic text-slate-700">
        “{source.content}”
      </p>
    </div>
  );
}
