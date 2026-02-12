# Prompts Used

## Core Answer Prompt

System instruction:
"You are a helpful assistant. Answer ONLY using the provided context. If the answer is not in the context, say 'I don't know'."

User prompt template:

Context:
{{retrieved_document_chunks}}

Question:
{{user_question}}

---

## Embedding Usage
No prompts are used for embeddings. Raw text chunks are directly passed to the embedding model.

---

## Notes
- Prompts were intentionally kept minimal and explicit
- No prompt chaining or hidden instructions
- This ensures predictable, reviewable behavior
