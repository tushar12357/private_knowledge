# AI Usage Notes

## Where AI Was Used
- Generating embeddings for document chunks
- Generating answers to user questions based on retrieved context
- Minor assistance during development for refactoring and debugging

## Where AI Was NOT Used
- Core system architecture decisions
- Database schema design
- Pagination and infinite scroll logic
- RAG flow design and source attribution logic

## Models & Providers

### Embeddings
- **Provider**: Hugging Face
- **Model**: `sentence-transformers/all-MiniLM-L6-v2`
- **Reason**:
  - Free tier
  - Stable and well-known for semantic search
  - Good balance of quality and performance

### LLM (Answer Generation)
- **Provider**: Hugging Face Inference API
- **Reason**:
  - Avoids paid APIs
  - Sufficient for grounded Q&A
  - Works well with strict prompting

## Prompt Discipline
The system prompt enforces:
- Answers only from provided context
- Explicit “I don’t know” when information is missing
- No hallucination or external knowledge

This was manually verified with negative test cases.

## Verification
All AI-generated outputs were tested manually to ensure:
- Answers are grounded
- Sources match returned chunks
- Incorrect questions do not produce fabricated answers
