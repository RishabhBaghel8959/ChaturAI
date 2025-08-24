# ChaturAI – Data Science Tutor (API + Web UI)

An intelligent, interactive tutor for data science students. It answers questions, recommends resources, provides code examples, and explains complex concepts. Includes a FastAPI backend and a modern React + Vite frontend.

## Features
- Intent-aware tutor: qa, resources, code, explain
- Curated DS resources and practical code snippets (pandas, sklearn, viz)
- Optional LLM responses via OpenAI for richer explanations
- Modern chat UI with dark/light mode, syntax highlighting, copy-to-clipboard
- Dev proxy to avoid CORS; production-ready build commands

## Quickstart

### 1) Backend (FastAPI)
Requirements: Python 3.11+

```bash
# Install deps
pip install -r ds_tutor/requirements.txt

# Run API (localhost:8000)
PYTHONPATH=ds_tutor uvicorn app.main:app --app-dir ds_tutor --host 127.0.0.1 --port 8000
```

Health check:
```bash
curl http://127.0.0.1:8000/health
```

Query API:
```bash
curl -s -X POST http://127.0.0.1:8000/api/tutor/query \
  -H 'Content-Type: application/json' \
  -d '{"question":"Recommend pandas resources"}'
```

CLI:
```bash
python ds_tutor/cli.py ask "Show logistic regression example"
```

### 2) Frontend (React + Vite)
Requirements: Node 18+

```bash
npm install
npm run dev
# open http://127.0.0.1:5173
```

The dev server proxies API requests to `http://127.0.0.1:8000`.

## Configuration
Optional LLM integration via environment variables. Create a `.env` file in the repo root or export envs.

```
OPENAI_API_KEY=sk-...
DEFAULT_MODEL=gpt-4o-mini
USE_LLM=true
```

- `OPENAI_API_KEY`: Your OpenAI key (leave unset to disable LLM calls)
- `DEFAULT_MODEL`: Model name for LLM answers
- `USE_LLM`: `true` to enable, `false` to disable

## Project Structure
```
.
├── ds_tutor/
│   ├── app/
│   │   ├── main.py                # FastAPI app entry
│   │   ├── config.py              # Settings (env)
│   │   ├── schemas.py             # Pydantic models
│   │   ├── core/
│   │   │   ├── intents.py         # Rule-based intent detection
│   │   │   └── knowledge_base.py  # Curated resources & code
│   │   ├── services/
│   │   │   ├── llm.py             # Optional OpenAI wrapper
│   │   │   └── tutor.py           # Tutor orchestration
│   │   └── routers/
│   │       └── tutor.py           # /api/tutor/query
│   ├── cli.py                     # Typer CLI
│   └── requirements.txt
│
├── src/                           # Frontend (React + Vite)
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles.css
│   └── components/
│       ├── TopBar.jsx
│       ├── Chat.jsx
│       ├── Message.jsx
│       ├── ResourceList.jsx
│       └── CodeBlock.jsx
│
├── index.html
├── package.json
├── vite.config.js                 # Dev proxy to backend
└── README.md
```

## API Reference
POST `/api/tutor/query`

Request
```json
{
  "question": "string",
  "intent": "qa | resources | code | explain"?,
  "topic": "string"?,
  "level": "beginner | intermediate | advanced"?,
  "framework": "string"?
}
```

Response
```json
{
  "intent": "qa | resources | code | explain",
  "answer": "string?",
  "code": "string?",
  "resources": [
    { "title": "string", "url": "string", "level": "...", "type": "..." }
  ]
}
```

## Development Tips
- Backend logs: run uvicorn with `--log-level debug`
- Frontend dev server uses hot reload; adjust `vite.config.js` proxy if backend host/port changes
- To add topics/snippets: edit `ds_tutor/app/core/knowledge_base.py`
- To refine explanations: edit `_rule_based_answer` in `ds_tutor/app/services/tutor.py`
- To change intents: `ds_tutor/app/core/intents.py`

## Testing
- Manual smoke tests:
```bash
curl http://127.0.0.1:8000/health
curl -s -X POST http://127.0.0.1:8000/api/tutor/query -H 'Content-Type: application/json' -d '{"question":"Explain bias-variance tradeoff"}'
```
- Frontend: open `http://127.0.0.1:5173` and ask a question

## Build & Deploy
- Frontend build:
```bash
npm run build
# output at dist/
```
- Serve `dist/` from any static host (Netlify/Vercel/NGINX). Point it to your API server.
- Backend deploy: any Python host (Docker, VM, Fly.io, Railway, etc.). Example systemd service:
```ini
[Service]
ExecStart=/usr/bin/env PYTHONPATH=/srv/ds_tutor uvicorn app.main:app --app-dir /srv/ds_tutor --host 0.0.0.0 --port 8000
WorkingDirectory=/srv
Restart=always
```

## Roadmap
- Conversation memory and personalization
- Retrieval-augmented generation (RAG) over course materials
- Streaming responses and typing indicators
- Unit tests and CI workflow

## License
MIT
