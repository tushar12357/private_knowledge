export function buildPrompt(context: string, question: string) {
  return `
You are a helpful assistant.

Answer the question ONLY using the context below.
If the answer is not in the context, say "I don't know".

Context:
${context}

Question:
${question}
`;
}
