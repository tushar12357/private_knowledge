export function chunkText(text: string) {
  const chunkSize = 500;
  const overlap = 100;

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;
    chunks.push(text.slice(start, end));
    start = end - overlap;
  }

  return chunks;
}
