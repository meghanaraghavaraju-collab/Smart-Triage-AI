# Smart Triage AI – Backend Service

The backend is built with **Node.js**, **Express.js**, **MongoDB (Mongoose)**, and the **OpenAI API**.

## Planned Architecture
- **Authentication**: JWT token-based auth with bcryptjs for medical staff (Nurses, Doctors, Admins).
- **Clinical Triage Logic**: Algorithmic ESI (Emergency Severity Index) and Early Warning Score (NEWS2) engine paired with OpenAI GPT-4o for natural language symptom evaluation.
- **RESTful Endpoints**:
  - `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
  - `GET /api/patients`, `POST /api/patients`, `GET /api/patients/:id`
  - `POST /api/triage/assess` (calculates score and invokes OpenAI clinical evaluation)
  - `GET /api/triage/queue` (active prioritized emergency triage queue)
  - `GET /api/analytics/overview` (triage metrics, wait times, department breakdown)

Full backend implementation will be built in the subsequent phase after frontend architecture approval.
