import axios from "axios";

const HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const HF_EMBEDDINGS_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}/pipeline/feature-extraction`;

export async function createEmbedding(text: string): Promise<number[]> {
  const response = await axios.post(
    HF_EMBEDDINGS_URL,
    { inputs: text },
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 60_000,
    }
  );

  const data = response.data;

  // Nested: number[][] → unwrap
  if (Array.isArray(data) && Array.isArray(data[0])) {
    return data[0];
  }

  // Flat: number[] → return directly ✅ this is what HF is actually returning
  if (Array.isArray(data) && typeof data[0] === "number") {
    return data;
  }

  throw new Error(`Unexpected HF response shape: ${JSON.stringify(data)}`);
}