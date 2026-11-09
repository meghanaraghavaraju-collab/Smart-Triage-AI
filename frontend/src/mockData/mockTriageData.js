// Realistic mock data reflecting clinical triage protocols (ESI Levels 1-5)

export const MOCK_STATS = {
  totalPatientsToday: 142,
  criticalPatients: 9,
  urgentPatients: 34,
  routinePatients: 99,
  averageWaitMinutes: 18,
  availableBeds: 28,
  totalBeds: 40,
  aiConfidenceAvg: 94.6,
};

export const MOCK_DEPARTMENTS = [
  { id: 'dep-1', name: 'Emergency & Trauma', code: 'ED', capacity: 18, occupied: 15, waitTime: '12 min', status: 'High Load' },
  { id: 'dep-2', name: 'Cardiology Center', code: 'CARD', capacity: 12, occupied: 9, waitTime: '25 min', status: 'Moderate' },
  { id: 'dep-3', name: 'Neurology / Stroke Unit', code: 'NEURO', capacity: 10, occupied: 6, waitTime: '15 min', status: 'Normal' },
  { id: 'dep-4', name: 'Pulmonology & Respiratory', code: 'PULM', capacity: 14, occupied: 11, waitTime: '30 min', status: 'Moderate' },
  { id: 'dep-5', name: 'Orthopedics & Fracture', code: 'ORTHO', capacity: 16, occupied: 8, waitTime: '20 min', status: 'Normal' },
  { id: 'dep-6', name: 'Pediatrics Urgent Care', code: 'PED', capacity: 20, occupied: 14, waitTime: '35 min', status: 'Moderate' },
  { id: 'dep-7', name: 'General Outpatient & Triage', code: 'OPD', capacity: 25, occupied: 12, waitTime: '10 min', status: 'Normal' },
];

export const MOCK_PATIENTS = [
  {
    id: 'PT-9821',
    mrn: 'MRN-2026-0419',
    name: 'Eleanor Vance',
    age: 63,
    gender: 'Female',
    arrivalTime: '10 min ago',
    arrivalMode: 'Ambulance',
    chiefComplaint: 'Crushing central chest pain radiating to left jaw, diaphoresis & dyspnea',
    riskLevel: 'HIGH', // Critical
    esiLevel: 1,
    aiConfidence: 98,
    department: 'Cardiology Center',
    vitals: {
      heartRate: 118,
      bloodPressure: '168/102',
      respiratoryRate: 24,
      spo2: 91,
      temperature: 37.4,
      painScore: 9,
    },
    status: 'In Triage',
    allergies: ['Penicillin', 'Sulfa drugs'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
    aiRationale: 'Presentation consistent with Acute Coronary Syndrome (STEMI / NSTEMI). SpO2 below normal (91%), tachycardic and hypertensive with severe radiating pain. Immediate EKG and cardiac enzyme panel advised.',
    recommendedActions: ['Stat 12-lead ECG within 10 min', 'High-flow Oxygen via nasal cannula', 'Sublingual Nitroglycerin (if systolic > 100)', 'Cardiology consultation stat']
  },
  {
    id: 'PT-9822',
    mrn: 'MRN-2026-0420',
    name: 'Marcus Brody',
    age: 42,
    gender: 'Male',
    arrivalTime: '22 min ago',
    arrivalMode: 'Walk-in',
    chiefComplaint: 'Acute onset severe right lower quadrant abdominal pain with fever and nausea',
    riskLevel: 'MEDIUM', // Urgent
    esiLevel: 3,
    aiConfidence: 92,
    department: 'Emergency & Trauma',
    vitals: {
      heartRate: 94,
      bloodPressure: '130/84',
      respiratoryRate: 18,
      spo2: 98,
      temperature: 38.6,
      painScore: 7,
    },
    status: 'Assessed',
    allergies: ['None known'],
    chronicConditions: ['None'],
    aiRationale: 'Fever (38.6°C), persistent localized right iliac fossa tenderness with McBurney sign positive. Suspected acute appendicitis or acute mesenteric adenitis. Surgical review and ultrasound needed.',
    recommendedActions: ['NPO status (fasting)', 'Abdominal ultrasound / CT abdomen', 'IV Access + IV hydration', 'Complete Blood Count (WBC evaluation)']
  },
  {
    id: 'PT-9823',
    mrn: 'MRN-2026-0421',
    name: 'David Chen',
    age: 29,
    gender: 'Male',
    arrivalTime: '45 min ago',
    arrivalMode: 'Walk-in',
    chiefComplaint: 'Inversion ankle sprain playing soccer, moderate swelling and difficulty bearing weight',
    riskLevel: 'LOW', // Routine
    esiLevel: 4,
    aiConfidence: 96,
    department: 'Orthopedics & Fracture',
    vitals: {
      heartRate: 74,
      bloodPressure: '120/78',
      respiratoryRate: 15,
      spo2: 99,
      temperature: 36.8,
      painScore: 4,
    },
    status: 'Waiting Room',
    allergies: ['Ibuprofen'],
    chronicConditions: ['None'],
    aiRationale: 'Stable hemodynamics with localized peripheral musculoskeletal injury. Low acute systemic risk. Ottawa Ankle Rules indicate ankle X-ray series warranted.',
    recommendedActions: ['RICE protocol (Rest, Ice, Compression, Elevation)', 'Left ankle 3-view radiographic imaging', 'Paracetamol for analgesia', 'Temporary splinting if indicated']
  },
  {
    id: 'PT-9824',
    mrn: 'MRN-2026-0422',
    name: 'Sophia Martinez',
    age: 71,
    gender: 'Female',
    arrivalTime: '15 min ago',
    arrivalMode: 'Ambulance',
    chiefComplaint: 'Sudden onset facial asymmetry, slurred speech and left arm weakness started 40 min ago',
    riskLevel: 'HIGH', // Critical
    esiLevel: 1,
    aiConfidence: 99,
    department: 'Neurology / Stroke Unit',
    vitals: {
      heartRate: 88,
      bloodPressure: '185/110',
      respiratoryRate: 20,
      spo2: 95,
      temperature: 37.1,
      painScore: 2,
    },
    status: 'Code Stroke Active',
    allergies: ['Aspirin'],
    chronicConditions: ['Atrial Fibrillation', 'Hyperlipidemia'],
    aiRationale: 'Acute focal neurological deficit within 4.5-hour thrombolytic window. High likelihood of acute ischemic stroke. Emergency Code Stroke pathway activated.',
    recommendedActions: ['Immediate non-contrast head CT scan', 'Blood glucose check stat', 'Notify interventional neurology team', 'Maintain strict head of bed elevation 30°']
  },
  {
    id: 'PT-9825',
    mrn: 'MRN-2026-0423',
    name: 'Aisha Al-Mansoor',
    age: 35,
    gender: 'Female',
    arrivalTime: '35 min ago',
    arrivalMode: 'Walk-in',
    chiefComplaint: 'Moderate wheezing, dry cough and shortness of breath for past 6 hours, history of asthma',
    riskLevel: 'MEDIUM', // Urgent
    esiLevel: 3,
    aiConfidence: 89,
    department: 'Pulmonology & Respiratory',
    vitals: {
      heartRate: 102,
      bloodPressure: '126/82',
      respiratoryRate: 23,
      spo2: 94,
      temperature: 37.0,
      painScore: 3,
    },
    status: 'Under Inhalation',
    allergies: ['Latex'],
    chronicConditions: ['Bronchial Asthma'],
    aiRationale: 'Acute asthma exacerbation with moderate respiratory rate elevation and borderline SpO2 (94%). Responding to initial bronchodilator therapy.',
    recommendedActions: ['Nebulized Salbutamol + Ipratropium bromide', 'Peak Expiratory Flow (PEF) assessment', 'Oral Prednisolone 40mg', 'Continuous pulse oximetry']
  }
];

export const MOCK_HOURLY_TRIAGE = {
  labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
  datasets: [
    {
      label: 'Critical / High Risk',
      data: [2, 1, 3, 5, 4, 7, 8, 3],
      backgroundColor: '#ef4444',
      borderColor: '#dc2626',
    },
    {
      label: 'Urgent / Medium Risk',
      data: [5, 4, 7, 12, 14, 16, 15, 8],
      backgroundColor: '#f59e0b',
      borderColor: '#d97706',
    },
    {
      label: 'Routine / Low Risk',
      data: [6, 5, 11, 24, 28, 31, 22, 14],
      backgroundColor: '#10b981',
      borderColor: '#059669',
    }
  ]
};
