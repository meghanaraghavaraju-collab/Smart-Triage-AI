import { getOpenAIClient } from '../config/openai.js';
import { evaluateClinicalTriage } from './triageRuleEngine.js';

export const runAITriagePrediction = async (params) => {
  const {
    patientName = 'Patient',
    age = 30,
    gender = 'Unknown',
    selectedSymptoms = [],
    symptomSeverity = 'Moderate',
    symptomDuration = '1-4 hours',
    chiefComplaint = '',
    vitals = {},
    medicalHistory = [],
    additionalNotes = '',
  } = params;

  // Run the clinical heuristic & safety rule engine
  const clinicalBaseline = evaluateClinicalTriage(params);

  const client = getOpenAIClient();

  // If no OpenAI client available, baseline rule engine is authoritative
  if (!client) {
    return clinicalBaseline;
  }

  try {
    const prompt = `
You are a clinical decision support AI assistant specialized in Emergency Severity Index (ESI v4) patient triage.

Incoming Patient Assessment:
- Name: ${patientName}, Age: ${age}, Gender: ${gender}
- Selected Symptoms: ${selectedSymptoms.join(', ') || 'None specified'}
- Symptom Severity: ${symptomSeverity}
- Symptom Duration: ${symptomDuration}
- Chief Complaint: "${chiefComplaint}"
- Vital Signs:
  - Heart Rate: ${vitals.heartRate} bpm
  - Blood Pressure: ${vitals.systolicBP || vitals.bloodPressure?.split('/')[0] || 120}/${vitals.diastolicBP || vitals.bloodPressure?.split('/')[1] || 80} mmHg
  - Respiratory Rate: ${vitals.respiratoryRate} /min
  - SpO2: ${vitals.spo2}%
  - Body Temperature: ${vitals.temperature}°C
  - Pain Score: ${vitals.painScore || 0}/10
- Medical History / Comorbidities: ${medicalHistory.join(', ') || 'None'}
- Additional Notes: "${additionalNotes}"

Return ONLY a valid JSON object with the following fields:
{
  "symptomSummary": "Concise summary of presenting symptoms and acuity",
  "urgencyCategory": "HIGH" | "MEDIUM" | "LOW",
  "esiLevel": 1 | 2 | 3 | 4 | 5,
  "importantRiskFactors": ["Risk factor 1", "Risk factor 2"],
  "recommendedNextSteps": ["Clinical action 1", "Diagnostic test 2", "Immediate order 3"],
  "suggestedDepartment": "Emergency & Trauma" | "Cardiology Center" | "Neurology / Stroke Unit" | "Pulmonology & Respiratory" | "Orthopedics & Fracture" | "Pediatrics Urgent Care" | "General Outpatient & Triage",
  "aiConfidence": number between 85 and 99,
  "aiRationale": "Comprehensive clinical rationale for the classification and department recommendation"
}
`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a certified emergency clinical decision support assistant. Return strictly parseable JSON. Do NOT provide definitive medical diagnoses, only triage priority stratification.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const aiOutput = JSON.parse(response.choices[0].message.content);

    // SAFETY ENFORCEMENT: Never allow a low AI score to override emergency warning signs
    let finalUrgency = (aiOutput.urgencyCategory || 'LOW').toUpperCase();
    let finalEsi = Number(aiOutput.esiLevel) || 4;
    let finalDepartment = aiOutput.suggestedDepartment || clinicalBaseline.suggestedDepartment;
    let isEscalated = clinicalBaseline.isEmergencyEscalation;
    let escalationReason = clinicalBaseline.escalationReason;

    if (clinicalBaseline.isEmergencyEscalation && finalUrgency !== 'HIGH') {
      console.warn(`[Triage Safety Override] AI predicted ${finalUrgency}, but clinical red flags require HIGH urgency. Safety override active.`);
      finalUrgency = 'HIGH';
      finalEsi = clinicalBaseline.esiLevel;
      finalDepartment = clinicalBaseline.suggestedDepartment;
      isEscalated = true;
      escalationReason = `CRITICAL SAFETY OVERRIDE: ${clinicalBaseline.escalationReason} (AI model suggested ${aiOutput.urgencyCategory}, overridden by clinical protocol).`;
    }

    // Combine risk factors uniquely
    const combinedRiskFactors = Array.from(new Set([
      ...(clinicalBaseline.riskFactors || []),
      ...(aiOutput.importantRiskFactors || [])
    ]));

    // Combine recommended next steps
    const combinedNextSteps = Array.from(new Set([
      ...(clinicalBaseline.recommendedNextSteps || []),
      ...(aiOutput.recommendedNextSteps || [])
    ]));

    return {
      symptomSummary: aiOutput.symptomSummary || clinicalBaseline.symptomSummary,
      urgencyCategory: finalUrgency,
      riskLevel: finalUrgency,
      esiLevel: finalEsi,
      riskFactors: combinedRiskFactors,
      recommendedNextSteps: combinedNextSteps,
      recommendedActions: combinedNextSteps,
      suggestedDepartment: finalDepartment,
      department: finalDepartment,
      aiConfidence: aiOutput.aiConfidence || clinicalBaseline.aiConfidence,
      aiRationale: isEscalated 
        ? `${escalationReason} | AI Clinical Notes: ${aiOutput.aiRationale}`
        : (aiOutput.aiRationale || clinicalBaseline.aiRationale),
      isEmergencyEscalation: isEscalated,
      escalationReason: escalationReason,
      safetyDisclaimer: clinicalBaseline.safetyDisclaimer,
      informationSufficiency: clinicalBaseline.informationSufficiency,
    };
  } catch (error) {
    console.warn(`[OpenAI Triage Service] Inference failed: ${error.message}. Using clinical rule engine fallback.`);
    return clinicalBaseline;
  }
};
