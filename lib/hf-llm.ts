import axios from "axios";

// Use the top-level router v1 endpoint — NOT model-specific paths
const HF_LLM_URL = "https://router.huggingface.co/v1/chat/completions";

// This model is available via nebius/together providers on the free tier
const HF_MODEL = "Qwen/Qwen2.5-72B-Instruct";

export async function generateAnswer(prompt: string): Promise<string> {
  const response = await axios.post(
    HF_LLM_URL,
    {
      model: HF_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.2,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 60_000,
    }
  );

  return response.data.choices?.[0]?.message?.content ?? "I don't know";
}