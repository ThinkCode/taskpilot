import os


DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql+asyncpg://localhost/taskpilot")
OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3.2")
