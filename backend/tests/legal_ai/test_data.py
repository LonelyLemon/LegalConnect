import pandas as pd

from src.legal_ai.data import build_instruction_examples, clean_dataset, split_dataset


def test_clean_dataset_and_build_examples() -> None:
    raw = pd.DataFrame(
        [
            {"question": "  A?  ", "answer": "B."},
            {"question": "A?", "answer": "Duplicate should be dropped."},
            {"question": "", "answer": "Missing question"},
            {"question": "Valid?", "answer": "  Trim me.  "},
        ]
    )

    cleaned = clean_dataset(raw)
    assert len(cleaned) == 2
    assert cleaned.iloc[0]["question"] == "A?"
    assert cleaned.iloc[0]["answer"] == "B."
    assert cleaned.iloc[1]["answer"] == "Trim me."

    instructions = build_instruction_examples(cleaned)
    assert instructions == [
        {"role": "user", "content": "A?", "response": "B."},
        {"role": "user", "content": "Valid?", "response": "Trim me."},
    ]


def test_split_dataset_respects_test_size() -> None:
    df = pd.DataFrame(
        [{"question": f"Q{i}", "answer": f"A{i}"} for i in range(10)]
    )

    train, test = split_dataset(df, test_size=0.2, random_state=0)
    assert len(train) == 8
    assert len(test) == 2
    # Ensure no overlap
    assert set(train["question"]).isdisjoint(set(test["question"]))