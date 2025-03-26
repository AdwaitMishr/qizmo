from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from adaptive_engine import determine_next_set_difficulty, evaluate_response
import asyncpg
import random
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.db_pool = await asyncpg.create_pool(dsn="postgresql://user:password@localhost:5432/quiz_db")
    db = await app.state.db_pool.acquire()
    await load_questions(db)
    await app.state.db_pool.release(db)
    yield
    await app.state.db_pool.close()

app = FastAPI(title="Adaptive Quiz Difficulty Adjustor Service", lifespan=lifespan)

async def get_db():
    async with app.state.db_pool.acquire() as db:
        yield db

class StudentResponse(BaseModel):
    question_id: int
    selected_option: str

class NextQuestionsInput(BaseModel):
    attempt_id: int
    current_difficulty: str
    responses: list[StudentResponse]
    max_questions: int 

question_bank = {}
used_questions = set()

async def load_questions(db):
    global question_bank
    query = 'SELECT id, difficulty FROM questions'
    rows = await db.fetch(query)

    question_bank = {"easy": [], "medium": [], "hard": []}
    
    for row in rows:
        difficulty = row["difficulty"]
        question_bank[difficulty].append(row["id"])

async def fetch_question_details(question_id: int, db):
    query = 'SELECT "correctOption", "errorMetric" FROM questions WHERE id = $1'
    result = await db.fetchrow(query, question_id)
    
    return dict(result) if result else None

async def calculate_current_score(responses, db):
    total_score = 0.0
    for response in responses:
        question_data = await fetch_question_details(response.question_id, db)
        if not question_data:
            continue

        correct_answer = question_data["correctOption"]
        error_metric = question_data["errorMetric"]

        score, _ = evaluate_response(response.selected_option, correct_answer, {"A": error_metric, "B": error_metric, "C": error_metric, "D": error_metric})
        total_score += score

    return total_score

def sample_questions(current_score, current_difficulty, max_questions):
    global used_questions
    difficulties = ["easy", "medium", "hard"]
    tier_index = difficulties.index(current_difficulty)

    if 2 <= current_score <= 4:
        ratio = {"same": 0.6, "above": 0.2, "below": 0.2}
    elif current_score < 2:
        ratio = {"same": 0.2, "above": 0.1, "below": 0.7}
    else:
        ratio = {"same": 0.4, "above": 0.5, "below": 0.1}

    num_same = round(max_questions * ratio["same"])
    num_above = round(max_questions * ratio["above"])
    num_below = round(max_questions * ratio["below"])

    same_tier = [q for q in question_bank[difficulties[tier_index]] if q not in used_questions]
    above_tier = [q for q in question_bank[difficulties[min(tier_index + 1, 2)]] if q not in used_questions]
    below_tier = [q for q in question_bank[difficulties[max(tier_index - 1, 0)]] if q not in used_questions]

    selected_questions = (
        random.sample(same_tier, min(len(same_tier), num_same)) +
        random.sample(above_tier, min(len(above_tier), num_above)) +
        random.sample(below_tier, min(len(below_tier), num_below))
    )

    for q in selected_questions:
        used_questions.add(q)

    return selected_questions

@app.get("/")
async def read_root():
    return {"message": "Adaptive Quiz Difficulty Adjustor Service is running."}

@app.post("/get_next_questions")
async def get_next_questions(data: NextQuestionsInput, db=Depends(get_db)):
    try:
        if data.current_difficulty not in ["easy", "medium", "hard"]:
            raise HTTPException(status_code=400, detail="Invalid difficulty level")

        if data.max_questions <= 0:
            raise HTTPException(status_code=400, detail="Max questions must be greater than 0")

        current_score = await calculate_current_score(data.responses, db)
        next_difficulty = determine_next_set_difficulty(current_score, data.current_difficulty)
        selected_questions = sample_questions(current_score, next_difficulty, data.max_questions)

        if not selected_questions:
            raise HTTPException(status_code=500, detail="No available questions in any difficulty tier.")

        return {
            "computed_score": current_score,
            "next_difficulty": next_difficulty,
            "question_ids": selected_questions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
