# Smart Triage AI – System Architecture & Technical Design

## 1. High-Level Architecture

```
[ Client Layer (React + Vite + Tailwind CSS + Chart.js) ]
                         │
                         ▼ (HTTPS / REST API / JWT Auth)
[ Application Backend (Node.js + Express.js) ]
     │                         │                         │
     ▼                         ▼                         ▼
[ Authentication & RBAC ]  [ Triage Rule Engine ]  [ OpenAI Clinical Agent ]
     │                         │                         │
     └─────────────────────────┼─────────────────────────┘
                               ▼
            [ MongoDB Database (Mongoose ODM) ]
             ├── Users & Staff
             ├── Patients
             ├── Triage Assessments
             ├── Vital Signs History
             └── Department Logs
```

## 2. Technology Stack Details

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 + Vite | High-performance SPA with fast HMR |
| **Styling & Theme** | Tailwind CSS | Clean Medical Blue & White design system |
| **Icons** | Lucide React | Medical and healthcare iconography |
| **Data Visualization** | Chart.js + react-chartjs-2 | Real-time vital trends and triage department analytics |
| **Backend Runtime** | Node.js | Scalable asynchronous I/O runtime |
| **Web Server Framework** | Express.js | RESTful API routes, middlewares, error handling |
| **Database** | MongoDB + Mongoose | Flexible NoSQL schema for medical records and logs |
| **AI Engine** | OpenAI API (GPT-4o) | Structured clinical risk prediction and triage recommendations |
| **Security & Auth** | JWT, bcryptjs, Helmet, CORS | HIPAA-compliant sensitive data handling principles |

## 3. Directory Layout
```
Smart-Triage-AI/
├── frontend/               # React + Vite + Tailwind CSS Web Application
│   ├── public/             # Static public assets and medical icons
│   ├── src/
│   │   ├── assets/         # Medical logos and vector graphics
│   │   ├── components/     # Reusable UI & medical widgets
│   │   │   ├── common/     # Buttons, Cards, Badges, Modals, Inputs
│   │   │   ├── layout/     # Header/Navbar, Sidebar, Page Shell
│   │   │   ├── dashboard/  # Triage stats, live queue, department load
│   │   │   ├── triage/     # Assessment forms, AI prediction widgets, vital monitors
│   │   │   └── charts/     # Vital signs & risk breakdown charts
│   │   ├── context/        # Auth, Patient, and Notification context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── mockData/       # Mock clinical data for rapid development & testing
│   │   ├── pages/          # Application views / routed screens
│   │   ├── services/       # API client services (axios / fetch)
│   │   ├── App.jsx         # Root component with routing and active view state
│   │   ├── index.css       # Medical theme styles & Tailwind imports
│   │   └── main.jsx        # React entrypoint
│   ├── package.json        # Frontend dependencies & build scripts
│   ├── tailwind.config.js  # Medical color palette & design tokens
│   ├── postcss.config.js   # PostCSS configuration
│   └── vite.config.js      # Vite build configuration
├── backend/                # Node.js + Express REST API Server
│   ├── src/
│   │   ├── config/         # Database and OpenAI API configurations
│   │   ├── controllers/    # Request handlers (auth, patients, triage, analytics)
│   │   ├── middleware/     # Auth, role check, input validation, error handling
│   │   ├── models/         # Mongoose schemas (User, Patient, TriageRecord, Department)
│   │   ├── routes/         # Express router endpoints
│   │   ├── services/       # OpenAI integration & clinical scoring logic (NEWS2/ESI)
│   │   └── server.js       # Express server initialization
│   ├── package.json        # Backend dependencies & scripts
│   └── .env.example        # Environment variable template
├── database/               # Database schemas, seeders, and migration scripts
│   ├── schemas/            # Data dictionaries and schema definitions
│   └── seeds/              # Initial clinical sample data and demo accounts
└── docs/                   # System documentation, wireframes, and API specs
    ├── ARCHITECTURE.md     # Architecture and data flow
    └── PROJECT_SPEC.md     # Functional requirements and clinical logic
```
