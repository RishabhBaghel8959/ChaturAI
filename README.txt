ChaturAI – Your Intelligent Data Mentor
======================================

ChaturAI is an AI-powered assistant designed to help users interact with data,
ask intelligent questions, and receive meaningful responses using modern
Large Language Model (LLM) techniques and Data Science concepts.

The project is built as a full-stack, containerized application and is ready
for cloud deployment using Docker and Render.

--------------------------------------------------

FEATURES
--------
- AI-powered conversational interface
- Context-aware responses using LLM concepts
- Clean and modular backend architecture
- Modern frontend with responsive UI
- Fully Dockerized backend and frontend
- Production-ready cloud deployment setup
- Scalable design for AI, data, and analytics use cases

--------------------------------------------------

TECH STACK
----------

Backend:
- Python
- FastAPI
- Uvicorn
- RESTful APIs

Frontend:
- React
- Vite
- Tailwind CSS

LLM & AI CONCEPTS USED:
- Large Language Models (LLMs)
- Prompt Engineering
- Context Injection
- Vector Embeddings
- Semantic Similarity
- Retrieval-Augmented Generation (RAG)
- AI-assisted Question Answering

DATA SCIENCE CONCEPTS:
- Text preprocessing
- Data normalization
- Feature extraction
- Similarity search
- Data-driven insights
- Basic NLP pipelines

DATABASE & STORAGE:
- SQLite (local persistence)
- Relational database concepts
- Vector data storage (design-ready)
- Database abstraction layer
- Scalable DB architecture for future upgrades
  (PostgreSQL / Vector DBs)

DevOps / Deployment:
- Docker
- Docker Compose (local development)
- Render (Docker-based cloud deployment)
- Git & GitHub

--------------------------------------------------

PROJECT STRUCTURE
-----------------

ChaturAI/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   └── db/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.txt

--------------------------------------------------

RUN LOCALLY USING DOCKER
-----------------------

1. Clone the repository:

   git clone https://github.com/<your-username>/ChaturAI.git
   cd ChaturAI

2. Build and run containers:

   docker compose up --build

3. Open in browser:

   Frontend: http://localhost:5173
   Backend API Docs: http://localhost:8000/docs

--------------------------------------------------

DEPLOYMENT (RENDER)
-------------------

This project is designed to be deployed on Render using Docker.

Backend:
- Service Type: Web Service
- Runtime: Docker
- Root Directory: backend
- Port: 8000

Frontend:
- Service Type: Web Service
- Runtime: Docker
- Root Directory: frontend
- Port: 80

Environment variables are configured directly from the Render dashboard.

--------------------------------------------------

ENVIRONMENT VARIABLES
---------------------

Example (Backend):

OPENAI_API_KEY=your_api_key_here
DATABASE_URL=your_database_url_here

NOTE:
Never commit .env files to GitHub.

--------------------------------------------------

FUTURE ENHANCEMENTS
-------------------
- Advanced vector databases (FAISS, ChromaDB, Pinecone)
- Full RAG pipeline with document ingestion
- Authentication and role-based access
- Analytics dashboard for AI insights
- PostgreSQL integration
- Scalable cloud architecture

--------------------------------------------------

AUTHOR
------

Rishabh Singh Baghel
B.Tech CSE (AI & ML)
Focused on AI, Data Science, and real-world problem solving.

--------------------------------------------------

SUPPORT
-------
If you find this project useful, consider giving it a star on GitHub.
