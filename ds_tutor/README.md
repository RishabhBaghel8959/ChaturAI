# DS Tutor

An intelligent, interactive tutor for data science students. Provides Q&A, resource recommendations, and code examples via an API and CLI. Optional LLM integration with OpenAI.

## Quickstart

1. Create venv and install deps:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r ds_tutor/requirements.txt
```

2. Run API:
```bash
uvicorn app.main:app --reload --port 8000 --app-dir ds_tutor
```

3. Health check:
```bash
curl http://127.0.0.1:8000/health
```

4. Query endpoint:
```bash
curl -X POST http://127.0.0.1:8000/api/tutor/query \
  -H 'Content-Type: application/json' \
  -d '{"question":"How to split train and test in sklearn?"}'
```

5. CLI usage:
```bash
python ds_tutor/cli.py ask "Show logistic regression example"
```

## Optional LLM

Set environment variables (or create `.env` in project root):
```
OPENAI_API_KEY=sk-...
DEFAULT_MODEL=gpt-4o-mini
USE_LLM=true
```

## Features
- Intent routing: QA, resources, code
- Curated knowledge base for common DS topics
- Code snippet templates (pandas, sklearn, matplotlib, seaborn)
- Optional OpenAI responses for richer explanations

## Notes
- Works offline with rule-based logic and curated content
- LLM adds depth if configured