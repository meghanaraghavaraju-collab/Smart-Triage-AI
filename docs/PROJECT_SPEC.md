# Smart Triage AI – Healthcare Patient Triage System
## Project Specifications & Requirements

### 1. Vision & Overview
Smart Triage AI is an enterprise-grade clinical decision support and patient triage web application designed for emergency departments (ED), urgent care clinics, and outpatient hospitals. It combines validated clinical triage frameworks (such as the Emergency Severity Index - ESI) with OpenAI-powered clinical symptom analysis and vital signs risk scoring to assist triage nurses and medical staff in prioritizing incoming patients, preventing triage delays, and directing patients to the most appropriate hospital department.

---

### 2. Functional Modules
1. **Authentication & Role-Based Access Control (RBAC)**
   - Roles: Triage Nurse, Emergency Physician, Department Admin, System Admin
   - Secure JWT-based authentication with bcrypt password hashing
   - Session management and audit logging

2. **Executive Medical Dashboard**
   - Active emergency triage queue with live priority indicators
   - Real-time statistics: Total Patients Today, High Risk / Critical cases, Average Wait Time, Bed Occupancy
   - Queue filtering by risk tier (Critical/High, Urgent/Medium, Routine/Low) and department

3. **Patient Registration & Intake**
   - Rapid patient intake: Full Name, Age, Gender, MRN (Medical Record Number), Emergency Contact
   - Chief complaint, arrival mode (Ambulance, Walk-in, Wheelchair), arrival timestamp
   - Known medical history, chronic conditions, and allergy tags

4. **Patient Assessment & Symptom Analysis**
   - Guided clinical symptom input form (onset, severity 1-10, duration, pain location)
   - Natural language symptom description processing with AI assistance
   - Red-flag symptom detection (e.g., chest pain with radiation, stroke symptoms, respiratory distress)

5. **Vital Signs Monitoring & Early Warning Scoring**
   - Heart Rate (BPM), Blood Pressure (Systolic/Diastolic mmHg), Respiratory Rate (breaths/min), Oxygen Saturation (SpO2 %), Body Temperature (°C / °F), Pain Score (0-10)
   - Automated Early Warning Score (NEWS2 / MEWS) calculation
   - Immediate physiological alert triggers for abnormal vital signs

6. **AI-Assisted Triage Prediction & Risk Stratification**
   - OpenAI API integration for clinical assessment and summarization
   - Risk stratification:
     - **High Risk (ESI Level 1-2 / Critical)**: Immediate resuscitation or emergent care needed
     - **Medium Risk (ESI Level 3 / Urgent)**: Potentially serious condition, multiple resources needed
     - **Low Risk (ESI Level 4-5 / Routine)**: Non-urgent, single or no resources needed
   - AI-generated clinical rationale, recommended immediate interventions, and precautions

7. **Hospital Department Recommendation**
   - Smart routing to specialized hospital departments:
     - Emergency / Trauma
     - Cardiology
     - Neurology / Stroke Unit
     - Pulmonology
     - Orthopedics
     - Pediatrics
     - General Medicine / Outpatient
   - Estimated resource requirements (Lab work, CT/X-Ray, IV access)

8. **Patient Medical History & Longitudinal Records**
   - Comprehensive timeline of past assessments and triage visits
   - Previous vital signs trendlines and diagnostic history
   - Downloadable summary notes for physician handoff

9. **Reports & Healthcare Analytics**
   - Daily, weekly, and monthly triage distribution charts (Chart.js)
   - Department load distribution and bottleneck analytics
   - AI accuracy review and triage concordance metrics

---

### 3. Design System & UX Standards
- **Color Palette**: Clinical Medical Blue (`#026bc9`, `#0c3d6f`, `#f0f7ff`), Pure White (`#ffffff`), Slate neutrals (`#f8fafc`, `#64748b`), and universal clinical triage status accents:
  - Critical / High Risk: Crimson Red (`#ef4444`)
  - Urgent / Medium Risk: Amber Gold (`#f59e0b`)
  - Routine / Low Risk: Emerald Green (`#10b981`)
- **Typography**: Inter / system-ui, high contrast, accessible (WCAG AA compliant)
- **Layout**: Clean responsive dual-sidebar & content layout optimized for desktop medical workstations, tablets, and mobile triage carts.
