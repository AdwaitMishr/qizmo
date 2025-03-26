"""
adaptive_engine.py

This module implements core business logic for the adaptive quiz engine.
It includes functions to evaluate a student's response and determine the next
set of questions' difficulty level.

Evaluation Modes:
1. **Detailed Mode** (when teachers provide an error metric for each option):
   - Full points (1.0) for a correct answer.
   - Partial points: (1 - error_metric) * 0.75 (rounded to 2 decimal places) for a "careless" mistake.
   - No points (0.0) for a "conceptual" error (if error_metric >= 0.5).

2. **Basic Mode** (when no error_metrics are provided):
   - Full points (1.0) for a correct answer.
   - No points (0.0) for any incorrect answer.
"""

from typing import Dict, Tuple

def evaluate_response(
    response: str,
    correct_answer: str, 
    error_metrics: Dict[str, float] = None
) -> Tuple[float, str]:
    """
    Evaluates a student's answer and classifies the type of error (if any).

    Parameters:
    - response (str): The option selected by the student (e.g., "A", "B", "C", "D").
    - correct_answer (str): The correct option for the question.
    - error_metrics (Dict[str, float], optional): A dictionary mapping each option to its error metric score.
                       Example: { 'A': 0.0, 'B': 0.3, 'C': 0.8, 'D': 0.2 }
                       If not provided, defaults to basic scoring (1 for correct, 0 for incorrect).

    Returns:
    - Tuple[float, str]: 
         - score (float): 
             - 1.0 for correct,
             - Partial points: (1 - error_metric) * 0.75 (if error_metric < 0.5),
             - 0.0 for conceptual error (if error_metric >= 0.5),
             - 0.0 in basic mode.
         - error_type (str): "none" if correct, "careless" for a minor mistake, "conceptual" for a misunderstanding,
                             or "incorrect" in basic mode.
    """
    if not error_metrics:
        return (1.0, "none") if response == correct_answer else (0.0, "incorrect")

    if response == correct_answer:
        return 1.0, "none"
    
    error_metric = error_metrics.get(response, 1.0)
    
    if error_metric < 0.5:
        return round((1 - error_metric) * 0.75, 2), "careless"
    else:
        return 0.0, "conceptual"

def determine_next_set_difficulty(
    current_set_score: float,
    current_difficulty: str
) -> str:
    """
    Determines the next set of question difficulty based on the student's score.

    Parameters:
    - current_set_score (float): The total score for the first three questions in the current set (range 0 to 3.0).
    - current_difficulty (str): The current difficulty tier, which can be "easy", "medium", or "hard".
    
    Returns:
    - str: The next difficulty tier for the upcoming questions:
        - If current_set_score > 4: Move one tier up (unless already "hard").
        - If current_set_score is between 2 and 4: Stay in the same tier.
        - If current_set_score < 2: Move one tier down (unless already "easy").
    """
    tiers = ["easy", "medium", "hard"]
    
    current_index = tiers.index(current_difficulty) if current_difficulty in tiers else 0

    if current_set_score > 4 and current_index < len(tiers) - 1:
        return tiers[current_index + 1]  
    elif current_set_score < 2 and current_index > 0:
        return tiers[current_index - 1]  
    return current_difficulty  
