# Smart Triage AI – Healthcare Patient Triage System

Smart Triage AI is a web-based healthcare patient triage system designed to assist in assessing patient urgency using patient symptoms, vital signs, rule-based logic, and AI-assisted analysis.

## Project Overview

The system helps organize patient information, assess urgency levels, and support healthcare staff in prioritizing patients.

## Features

- Patient registration and management
- Patient symptom and vital sign assessment
- AI-assisted patient triage
- Rule-based triage assessment
- Emergency Severity Index (ESI) level support
- Patient history management
- Department routing
- Dashboard and analytics
- Medical blue and white user interface

## Technologies Used

**Frontend**
- React.js
- Vite
- Tailwind CSS

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose

**AI Integration**
- OpenAI API

## Project Structure

```text
Smart-Triage-AI/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Live Demo

- **Frontend:** https://smart-triage-ai-omega.vercel.app/
- **Backend API:** https://smart-triage-ai-g10k.onrender.com/

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/meghanaraghavaraju-collab/Smart-Triage-AI.git
cd Smart-Triage-AI
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure your environment variables using the provided `.env.example` file.

Start the backend:

```bash
npm start
```

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in your terminal.

## API Endpoints

| Module | Endpoint |
|---|---|
| Authentication | `/api/auth` |
| Patients | `/api/patients` |
| Triage | `/api/triage` |
| Departments | `/api/departments` |
| Analytics | `/api/analytics` |
| Health Check | `/health` |

## Important Note

Smart Triage AI is an educational and decision-support project. Its assessments are not a substitute for professional medical judgment, clinical diagnosis, or emergency medical care. The system has not been established as a clinically validated medical device.

## Author

**Meghana Raghavaraju**

GitHub: https://github.com/meghanaraghavaraju-collab