from __future__ import annotations
import numpy as np

from dataclasses import dataclass
from typing import Sequence
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from src.legal_ai.data import LegalQAExample


@dataclass(frozen=True)
class Suggestion:
    question: str
    answer: str
    score: float


class LegalKnowledgeBase:
    def __init__(self, examples: Sequence[LegalQAExample]) -> None:
        self._examples = list(examples)
        self._vectorizer: TfidfVectorizer | None = None
        self._matrix: np.ndarray | None = None
        if self._examples:
            questions = [example.question for example in self._examples]
            self._vectorizer = TfidfVectorizer(
                analyzer="word",
                ngram_range=(1, 2),
                min_df=1,
            )
            self._matrix = self._vectorizer.fit_transform(questions)

    @property
    def empty(self) -> bool:
        return not self._examples

    def __len__(self) -> int:
        return len(self._examples)

    def similarity_scores(self, query: str) -> np.ndarray:
        if not self._examples or not self._vectorizer or self._matrix is None:
            return np.array([])
        query_vec = self._vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self._matrix)
        return similarities.flatten()

    def best_score(self, query: str) -> float:
        scores = self.similarity_scores(query)
        if scores.size == 0:
            return 0.0
        return float(scores.max())

    def suggestions(self, query: str, limit: int) -> list[Suggestion]:
        scores = self.similarity_scores(query)
        if scores.size == 0:
            return []
        order = np.argsort(scores)[::-1][:limit]
        return [
            Suggestion(
                question=self._examples[idx].question,
                answer=self._examples[idx].answer,
                score=float(scores[idx]),
            )
            for idx in order
        ]