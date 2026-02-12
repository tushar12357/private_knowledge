export default async function StatusPage() {
  const res = await fetch("/api/status", {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">System Status</h1>

      <ul className="space-y-2">
        <li>Backend: {data.backend ? "OK" : "FAIL"}</li>
        <li>Supabase: {data.supabase ? "OK" : "FAIL"}</li>
        <li>LLM: {data.llm ? "OK" : "FAIL"}</li>
      </ul>
    </main>
  );
}
