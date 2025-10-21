# Legal AI Chatbot Backend

This module provides a fine-tuning friendly backend for the Vietnamese legal chatbot.

## Training data preparation

1. Export the current dataset (defaults to `backend/data/vi-law-qa-3161.csv`).
2. Use the `LegalChatbotService.export_training_corpus()` helper to produce instruction-style examples for fine-tuning providers.
3. Split the dataset with `split_dataset` to create evaluation sets. See `backend/tests/legal_ai/test_data.py` for examples.

## Fine-tuning workflow

- Configure `LEGAL_AI_PROVIDER_BASE_URL` and `LEGAL_AI_API_KEY` with your OpenAI-compatible provider.
- Upload the instruction data to the provider and fine-tune a compact chat model.
- Update `LEGAL_AI_MODEL_ID` with the deployed fine-tuned model identifier.

## Inference service

- The `/legal-ai/query` endpoint requires an authenticated user and returns:
  - The model answer.
  - A confidence score derived from TF-IDF similarity.
  - Related question suggestions from the dataset when confidence is low.
  - A standardized disclaimer and (placeholder) list of source links.
- Low confidence requests trigger a fallback message and suggestions.
- `/legal-ai/health` reports the model identifier and dataset readiness.

## Switching to retrieval-augmented generation

The `LegalChatbotService` isolates the knowledge base and LLM client so it can be swapped for a RAG pipeline:

1. Replace `LegalKnowledgeBase` with a vector store-backed retriever.
2. Swap `LLMClient` for an inference client that can consume retrieved context.
3. Keep the route and schemas unchanged to preserve mobile client compatibility.

## Observability

The chatbot logs structured events (`legal_ai.answer`, `legal_ai.request`) that include session ids, confidence scores, and latency to aid monitoring.