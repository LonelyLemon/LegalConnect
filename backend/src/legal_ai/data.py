from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

import pandas as pd
from sklearn.model_selection import train_test_split


@dataclass(frozen=True)
class LegalQAExample:
    question: str
    answer: str


def load_dataset(path: Path) -> pd.DataFrame:

    if not path.exists():
        return pd.DataFrame(columns=["question", "answer"])
    
    df = pd.read_csv(path)
    expected_columns = {"question", "answer"}

    if not expected_columns.issubset(set(df.columns)):
        raise ValueError(
            f"Dataset must include columns {expected_columns}, found {set(df.columns)}"
        )
    
    return df


def clean_dataset(df: pd.DataFrame) -> pd.DataFrame:

    if df.empty:
        return df.copy()
    
    cleaned = df.copy()
    cleaned["question"] = cleaned["question"].astype(str).str.strip()
    cleaned["answer"] = cleaned["answer"].astype(str).str.strip()
    cleaned = cleaned.replace({"": None}).dropna(subset=["question", "answer"])
    cleaned = cleaned.drop_duplicates(subset=["question"], keep="first")
    cleaned = cleaned.reset_index(drop=True)

    return cleaned


def split_dataset(examples: pd.DataFrame,
                  *,
                  test_size: float = 0.1,
                  random_state: int = 42
                  ) -> tuple[pd.DataFrame, pd.DataFrame]:
    
    if examples.empty:
        return examples.copy(), examples.copy()
    train_df, eval_df = train_test_split(
        examples,
        test_size=test_size,
        random_state=random_state,
        shuffle=True,
    )
    return train_df.reset_index(drop=True), eval_df.reset_index(drop=True)


def iter_examples(df: pd.DataFrame) -> Iterable[LegalQAExample]:

    for row in df.itertuples(index=False):
        yield LegalQAExample(question=row.question, answer=row.answer)


def build_instruction_examples(df: pd.DataFrame) -> list[dict[str, str]]:

    instructions = []

    for example in iter_examples(df):
        instructions.append(
            {
                "role": "user",
                "content": example.question,
                "response": example.answer,
            }
        )
        
    return instructions