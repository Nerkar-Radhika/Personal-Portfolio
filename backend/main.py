import json
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel, Field
from pypdf import PdfReader


# =========================
# Environment
# =========================

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY is missing from the .env file")

client = Groq(api_key=api_key)

model = "openai/gpt-oss-120b"


# =========================
# FastAPI
# =========================

app = FastAPI(
    title="Radhika's Personal AI Chatbot",
    description="AI assistant representing Radhika using her resume and project knowledge.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Paths
# =========================

BASE_DIR = Path(__file__).resolve().parent

RESUME_PATH = BASE_DIR / "Radhika_Nerkar_Resume.pdf"

KNOWLEDGE_DIR = BASE_DIR / "knowledge"


# =========================
# Models
# =========================

class Experience(BaseModel):
    company: str | None = None
    role: str | None = None
    duration: str | None = None
    description: str | None = None
    skills_used: list[str] = Field(default_factory=list)


class Resume(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None

    total_experience_years: float | None = None

    skills: list[str] = Field(default_factory=list)
    experiences: list[Experience] = Field(default_factory=list)
    education: list[str] = Field(default_factory=list)
    projects: list[str] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)


class ChatRequest(BaseModel):
    question: str


# =========================
# Global Data
# =========================

resume_data: Resume | None = None

project_knowledge: list[dict] = []

conversation_history: list[dict] = []


# =========================
# PDF
# =========================

def read_pdf(file_path: Path) -> str:

    if not file_path.exists():
        raise FileNotFoundError(
            f"Resume file not found: {file_path}"
        )

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text


# =========================
# Resume Parsing
# =========================

def parse_resume(resume_text: str) -> Resume:

    schema = Resume.model_json_schema()

    system_prompt = f"""
You are an expert resume parser.

Extract information from the resume based on its meaning.

Return ONLY valid JSON matching this schema:

{schema}

Rules:

1. Do not invent information.
2. Missing values should be null.
3. Missing lists should be empty.
4. Include internships inside experiences.
5. Extract skills from the entire resume.
6. Extract only projects actually mentioned in the resume.
"""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": resume_text
            }
        ],
        response_format={
            "type": "json_object"
        }
    )

    data = json.loads(
        response.choices[0].message.content
    )

    return Resume(**data)


# =========================
# Project Knowledge
# =========================

def load_project_knowledge():

    global project_knowledge

    project_knowledge = []

    if not KNOWLEDGE_DIR.exists():
        print("Knowledge directory not found.")
        return

    for file_path in KNOWLEDGE_DIR.glob("*.json"):

        try:

            with open(
                file_path,
                "r",
                encoding="utf-8"
            ) as file:

                project = json.load(file)

            project_knowledge.append(project)

            print(
                f"Loaded project knowledge: {file_path.name}"
            )

        except json.JSONDecodeError:

            print(
                f"Could not read JSON file: {file_path.name}"
            )


# =========================
# Build AI Messages
# =========================

def build_messages(
    question: str,
    resume: Resume,
    projects: list[dict]
):
    # Keep project context compact to reduce token usage
    project_context = json.dumps(
        projects,
        ensure_ascii=False,
        separators=(",", ":")
    )

    # Keep resume JSON compact as well
    resume_context = resume.model_dump_json(
    exclude_none=True
)

    # Only keep the most recent conversation messages.
    # This prevents the prompt from growing indefinitely.
    recent_history = conversation_history[-6:]

    system_prompt = f"""
You are an AI assistant representing a job candidate named Radhika.

Answer questions from recruiters, interviewers,
or visitors to Radhika's portfolio.

========================
RESUME
========================

{resume_context}

========================
PROJECT KNOWLEDGE
========================

{project_context}

========================
RULES
========================

1. Answer ONLY using the provided resume,
   project knowledge, and conversation history.

2. Use recent conversation history to understand
   follow-up questions such as:
   "it", "its", "that project", "that model", etc.

3. Never hallucinate.

4. Never invent projects, technologies,
   results, accuracy, dataset sizes, achievements,
   education, or experience.

5. If the requested information is unavailable,
   say:
   "I don't have enough information to answer that."

6. Be extremely concise and recruiter-friendly.

7. DEFAULT RESPONSE LENGTH:
   - Maximum 80 words.
   - Prefer 40–60 words.
   - Never write a long paragraph.

8. For simple questions:
   - Answer in 1–3 short sentences.

9. For questions about skills, experience, projects, or
   "why should we hire you":
   - Use maximum 4 bullet points.
   - Each bullet should be one short sentence.
   - Maximum 80 words total.

10. For project questions:
    - Give only the most important information.
    - Mention the project purpose, key technologies,
      and one important result if available.
    - Do not explain the entire project unless explicitly asked.

11. For "Why should we hire you?":
    - Give exactly 4 concise bullet points.
    - Focus on technical skills, project impact,
      practical experience, and strengths.
    - Maximum 70 words.

12. Never repeat the same information in different words.

13. Never provide resume-like paragraphs.

14. Never provide unnecessary background or explanations.

15. Use Markdown only when it improves readability.

16. Use **bold** only for important names, technologies,
    projects, companies, or results.

17. Do not use a heading unless the answer genuinely
    benefits from one.

18. If the question can be answered in one sentence,
    answer in one sentence.

19. If information is unavailable, say:
    "I don't have enough information to answer that."

20. Answer directly. Do not begin with phrases like:
    "Certainly", "Sure", "Absolutely", or
    "Here is a detailed explanation."

21. Never exceed 80 words unless the user explicitly asks
    for a detailed answer.

22. Only provide a detailed answer when the user explicitly
    asks for "detailed", "explain in detail", or similar.
"""

    messages = [
        {
            "role": "system",
            "content": system_prompt
        }
    ]

    # Add only recent conversation history
    messages.extend(recent_history)

    # Add current question
    messages.append(
        {
            "role": "user",
            "content": question
        }
    )

    return messages


# =========================
# Normal Chat
# =========================

def ask_candidate(
    question: str,
    resume: Resume,
    projects: list[dict]
):

    messages = build_messages(
        question,
        resume,
        projects
    )

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=180
    )

    answer = response.choices[0].message.content

    conversation_history.append(
        {
            "role": "user",
            "content": question
        }
    )

    conversation_history.append(
        {
            "role": "assistant",
            "content": answer
        }
    )

    return answer


# =========================
# Streaming Chat
# =========================

def stream_candidate(
    question: str,
    resume: Resume,
    projects: list[dict]
):

    messages = build_messages(
        question,
        resume,
        projects
    )

    stream = client.chat.completions.create(
        model=model,
        messages=messages,
        stream=True
    )

    full_answer = ""

    for chunk in stream:

        content = chunk.choices[0].delta.content

        if content:

            full_answer += content

            yield content

    # Save conversation after streaming finishes

    conversation_history.append(
        {
            "role": "user",
            "content": question
        }
    )

    conversation_history.append(
        {
            "role": "assistant",
            "content": full_answer
        }
    )


# =========================
# Startup
# =========================

@app.on_event("startup")
def load_application_data():

    global resume_data

    print("\n==============================")
    print("Starting Personal AI Chatbot")
    print("==============================")

    print("\nLoading resume...")

    resume_text = read_pdf(RESUME_PATH)

    resume_data = parse_resume(resume_text)

    print("Resume loaded successfully!")

    print("\nLoading project knowledge...")

    load_project_knowledge()

    print(
        f"\nTotal project files loaded: "
        f"{len(project_knowledge)}"
    )

    print("\nApplication startup complete!")
    print("==============================\n")


# =========================
# Home
# =========================

@app.get("/")
def home():

    return {
        "message":
        "Radhika's Personal AI Chatbot is running!"
    }


# =========================
# Resume
# =========================

@app.get("/resume")
def get_resume():

    if resume_data is None:

        raise HTTPException(
            status_code=500,
            detail="Resume has not been loaded yet."
        )

    return resume_data.model_dump()


# =========================
# Projects
# =========================

@app.get("/projects")
def get_projects():

    return {
        "projects": project_knowledge
    }


# =========================
# Normal Chat
# =========================

@app.post("/chat")
def chat(request: ChatRequest):

    if resume_data is None:

        raise HTTPException(
            status_code=500,
            detail="Resume has not been loaded yet."
        )

    answer = ask_candidate(
        request.question,
        resume_data,
        project_knowledge
    )

    return {
        "answer": answer
    }


# =========================
# Streaming Chat
# =========================

@app.post("/chat/stream")
def chat_stream(request: ChatRequest):

    if resume_data is None:

        raise HTTPException(
            status_code=500,
            detail="Resume has not been loaded yet."
        )

    return StreamingResponse(
        stream_candidate(
            request.question,
            resume_data,
            project_knowledge
        ),
        media_type="text/plain"
    )