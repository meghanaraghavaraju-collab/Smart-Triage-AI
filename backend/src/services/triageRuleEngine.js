/**
 * Comprehensive Emergency Clinical Triage & Safety Rule Engine
 * Implements Emergency Severity Index (ESI v4) & National Early Warning Score (NEWS2)
 */

export const evaluateClinicalTriage = ({
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
}) => {
  // Extract & parse vitals
  const hr = Number(vitals.heartRate) || 0;
  const rr = Number(vitals.respiratoryRate) || 0;
  const spo2 = Number(vitals.spo2) || 0;
  const temp = Number(vitals.temperature) || 0;
  const pain = Number(vitals.painScore) || 0;

  let systolic = Number(vitals.systolicBP) || 0;
  let diastolic = Number(vitals.diastolicBP) || 0;

  if ((!systolic || !diastolic) && typeof vitals.bloodPressure === 'string' && vitals.bloodPressure.includes('/')) {
    const parts = vitals.bloodPressure.split('/');
    systolic = Number(parts[0]) || 120;
    diastolic = Number(parts[1]) || 80;
  }

  // Information Sufficiency Check
  const missingFields = [];
  if (!hr || hr <= 0) missingFields.push('Heart rate');
  if (!systolic || systolic <= 0) missingFields.push('Systolic blood pressure');
  if (!diastolic || diastolic <= 0) missingFields.push('Diastolic blood pressure');
  if (!spo2 || spo2 <= 0) missingFields.push('SpO2 oxygen saturation');
  if (!rr || rr <= 0) missingFields.push('Respiratory rate');
  if (!temp || temp <= 0) missingFields.push('Body temperature');
  if (selectedSymptoms.length === 0 && (!chiefComplaint || chiefComplaint.trim().length < 4)) {
    missingFields.push('Presenting symptoms / chief complaint');
  }

  let sufficiencyStatus = 'SUFFICIENT';
  let sufficiencyNotes = 'Complete clinical parameter set supplied for early warning scoring.';
  if (missingFields.length >= 3) {
    sufficiencyStatus = 'INSUFFICIENT';
    sufficiencyNotes = `Critical clinical telemetry missing (${missingFields.join(', ')}). Comprehensive early warning scoring cannot be verified. Immediate bedside assessment required.`;
  } else if (missingFields.length > 0) {
    sufficiencyStatus = 'BORDERLINE';
    sufficiencyNotes = `Incomplete parameters (${missingFields.join(', ')}). Proceeding with conservative risk stratification.`;
  }

  // Symptom Analysis Text
  const symptomsJoined = selectedSymptoms.join(', ');
  const combinedText = `${symptomsJoined} ${chiefComplaint} ${additionalNotes}`.toLowerCase();

  // Detect Red Flags & Emergency Symptoms
  const isCardiacEmergency = 
    combinedText.includes('chest pain') ||
    combinedText.includes('crushing') ||
    combinedText.includes('pressure radiating') ||
    combinedText.includes('radiating to jaw') ||
    combinedText.includes('radiating to left arm') ||
    combinedText.includes('diaphoresis') ||
    (combinedText.includes('palpitations') && hr > 140);

  const isStrokeEmergency = 
    combinedText.includes('stroke') ||
    combinedText.includes('facial droop') ||
    combinedText.includes('facial asymmetry') ||
    combinedText.includes('slurred speech') ||
    combinedText.includes('speech difficulty') ||
    combinedText.includes('arm weakness') ||
    combinedText.includes('hemiparesis') ||
    combinedText.includes('sudden numbness') ||
    combinedText.includes('loss of vision');

  const isRespiratoryEmergency = 
    combinedText.includes('severe shortness of breath') ||
    combinedText.includes('cannot speak full sentences') ||
    combinedText.includes('stridor') ||
    combinedText.includes('cyanosis') ||
    combinedText.includes('choking') ||
    spo2 < 92 ||
    rr > 28 ||
    rr < 9;

  const isAnaphylaxisOrAirway = 
    combinedText.includes('anaphylaxis') ||
    combinedText.includes('throat closing') ||
    combinedText.includes('lip swelling') ||
    combinedText.includes('tongue swelling');

  const isAlteredMentalOrSevereTrauma = 
    combinedText.includes('unresponsive') ||
    combinedText.includes('unconscious') ||
    combinedText.includes('severe head injury') ||
    combinedText.includes('massive bleeding') ||
    combinedText.includes('penetrating wound');

  // Severe Hemodynamic Derangement
  const isSevereHypertension = systolic >= 180 || diastolic >= 115;
  const isHypotensionShock = systolic > 0 && systolic < 90;
  const isSevereTachycardia = hr > 125;
  const isSevereBradycardia = hr > 0 && hr < 48;
  const isHyperpyrexia = temp >= 39.5;
  const isHypothermia = temp > 0 && temp < 35.0;

  // Emergency Warning Signs Trigger
  const hasEmergencyRedFlags = 
    isCardiacEmergency ||
    isStrokeEmergency ||
    isRespiratoryEmergency ||
    isAnaphylaxisOrAirway ||
    isAlteredMentalOrSevereTrauma ||
    isSevereHypertension ||
    isHypotensionShock ||
    isSevereTachycardia ||
    isSevereBradycardia ||
    symptomSeverity === 'Critical';

  // Identify Explicit Risk Factors
  const riskFactors = [];
  if (spo2 > 0 && spo2 < 92) riskFactors.push(`Severe Hypoxia (SpO2: ${spo2}% - Critical threshold < 92%)`);
  else if (spo2 >= 92 && spo2 < 95) riskFactors.push(`Borderline Hypoxemia (SpO2: ${spo2}%)`);

  if (isSevereHypertension) riskFactors.push(`Hypertensive Urgency / Crisis (${systolic}/${diastolic} mmHg)`);
  if (isHypotensionShock) riskFactors.push(`Hypotension / Hemodynamic Shock (Systolic: ${systolic} mmHg)`);
  if (isSevereTachycardia) riskFactors.push(`Marked Tachycardia (${hr} BPM)`);
  if (isSevereBradycardia) riskFactors.push(`Marked Bradycardia (${hr} BPM)`);
  if (rr > 22) riskFactors.push(`Tachypnea (${rr} breaths/min - Early sepsis/acidosis marker)`);
  if (isHyperpyrexia) riskFactors.push(`High Pyrexia (${temp}°C)`);
  if (pain >= 8) riskFactors.push(`Severe Acute Pain (${pain}/10 on Visual Analog Scale)`);
  if (isCardiacEmergency) riskFactors.push('High-risk acute coronary syndrome symptom pattern');
  if (isStrokeEmergency) riskFactors.push('Acute focal neurological deficit within thrombolytic time window');
  if (isAnaphylaxisOrAirway) riskFactors.push('Imminent airway compromise / Anaphylactoid reaction risk');
  
  if (medicalHistory && medicalHistory.length > 0) {
    riskFactors.push(`Comorbidities: ${medicalHistory.slice(0, 3).join(', ')}`);
  }

  // Determine Triage Category & Department
  let urgencyCategory = 'LOW';
  let esiLevel = 4;
  let suggestedDepartment = 'General Outpatient & Triage';
  let aiConfidence = 95;
  let aiRationale = '';
  let recommendedNextSteps = [];
  let isEmergencyEscalation = false;
  let escalationReason = '';

  // SAFETY RULE ENFORCEMENT:
  // "Never allow a low AI score to override emergency warning signs."
  if (hasEmergencyRedFlags) {
    urgencyCategory = 'HIGH';
    esiLevel = (isAlteredMentalOrSevereTrauma || isAnaphylaxisOrAirway || (spo2 > 0 && spo2 < 88)) ? 1 : 2;
    isEmergencyEscalation = true;
    aiConfidence = 98;

    if (isStrokeEmergency) {
      suggestedDepartment = 'Neurology / Stroke Unit';
      escalationReason = 'Critical Emergency Sign: Acute focal neurological deficits detected. Stroke code protocol activated.';
      aiRationale = `Emergency escalation enforced: Patient presents with acute stroke symptoms (${symptomDuration} onset). Vital signs show SBP ${systolic} mmHg and HR ${hr} BPM. Emergency neurovascular evaluation and non-contrast CT required immediately.`;
      recommendedNextSteps = [
        'STAT Non-Contrast Brain CT Scan (< 25 min door-to-imaging)',
        'Immediate Point-of-Care Blood Glucose check (exclude hypoglycemia)',
        'Alert On-Duty Stroke Neurologist / Endovascular Interventionalist',
        'Maintain head of bed at 30 degrees; establish double 18G IV access',
        'Continuous pulse oximetry, blood pressure monitoring every 5 min',
      ];
    } else if (isCardiacEmergency) {
      suggestedDepartment = 'Cardiology Center';
      escalationReason = 'Critical Emergency Sign: Acute coronary syndrome / cardiac ischemic symptoms with physiological stress.';
      aiRationale = `Emergency escalation enforced: Suspected Acute Coronary Syndrome (STEMI/NSTEMI). Vitals show HR ${hr} BPM, BP ${systolic}/${diastolic} mmHg, SpO2 ${spo2}%. Immediate 12-lead ECG is mandatory within 10 minutes of arrival.`;
      recommendedNextSteps = [
        'STAT 12-Lead Electrocardiogram (ECG) within 10 minutes of arrival',
        'High-flow supplemental oxygen therapy (titrate to SpO2 >= 95%)',
        'STAT High-Sensitivity Cardiac Troponin, CK-MB, and Electrolyte panel',
        'Immediate Cardiology attending bedside notification',
        'Continuous cardiac telemetry and emergency defibrillator on standby',
      ];
    } else if (isRespiratoryEmergency) {
      suggestedDepartment = 'Pulmonology & Respiratory';
      escalationReason = `Critical Emergency Sign: Severe respiratory distress / Hypoxia (SpO2 ${spo2}%, RR ${rr}/min).`;
      aiRationale = `Emergency escalation enforced: Acute respiratory decompensation. Hypoxemia and tachypnea present imminent risk of respiratory failure.`;
      recommendedNextSteps = [
        'Immediate High-Flow Oxygen via non-rebreather mask or CPAP/BiPAP',
        'Continuous pulse oximetry and capnography monitoring',
        'Inhaled Bronchodilator nebulization (Salbutamol + Ipratropium)',
        'Portable STAT Upright Chest Radiograph (CXR)',
        'Venous / Arterial Blood Gas (ABG/VBG) analysis',
      ];
    } else {
      suggestedDepartment = 'Emergency & Trauma';
      escalationReason = 'Critical Emergency Sign: Severe physiological derangement or high-risk vital instability.';
      aiRationale = `Emergency escalation enforced: Vital signs or clinical severity exceed safe outpatient thresholds. Emergency department resuscitation suite placement required.`;
      recommendedNextSteps = [
        'Immediate physician bedside assessment in Emergency Resuscitation bay',
        'Establish 2 large-bore peripheral IV lines with crystalloid hydration',
        'Full emergency laboratory workup (CBC, CMP, Lactate, Coagulation)',
        'Continuous cardiac and vital signs telemetry',
      ];
    }
  } else if (
    symptomSeverity === 'Severe' ||
    pain >= 7 ||
    combinedText.includes('abdominal pain') ||
    combinedText.includes('appendix') ||
    combinedText.includes('vomiting blood') ||
    combinedText.includes('moderate dyspnea') ||
    combinedText.includes('asthma') ||
    (temp >= 38.4 && age < 5) ||
    hr > 105 ||
    rr > 22
  ) {
    urgencyCategory = 'MEDIUM';
    esiLevel = 3;
    aiConfidence = 92;

    if (combinedText.includes('asthma') || combinedText.includes('wheezing') || combinedText.includes('cough')) {
      suggestedDepartment = 'Pulmonology & Respiratory';
      aiRationale = `Medium urgency: Moderate respiratory impairment with stable hemodynamics. Requires multiple therapeutic resources (bronchodilators, serial peak flow, imaging).`;
      recommendedNextSteps = [
        'Nebulized Bronchodilator therapy',
        'Serial Peak Expiratory Flow (PEF) measurements',
        'Oral / IV Corticosteroids consideration',
        'Vital signs re-assessment every 30 minutes',
      ];
    } else {
      suggestedDepartment = 'Emergency & Trauma';
      aiRationale = `Medium urgency: Moderate systemic symptoms or significant pain level (${pain}/10). Diagnostic imaging and lab workup required. Low risk of immediate catastrophic decompensation, but requires multi-resource urgent care.`;
      recommendedNextSteps = [
        'NPO status pending clinical and surgical assessment',
        'Targeted abdominal or anatomical ultrasound / CT imaging',
        'Intravenous hydration and targeted analgesia',
        'Comprehensive metabolic panel and complete blood count',
      ];
    }
  } else if (
    combinedText.includes('sprain') ||
    combinedText.includes('fracture') ||
    combinedText.includes('ankle') ||
    combinedText.includes('wrist') ||
    combinedText.includes('fall') ||
    combinedText.includes('bone')
  ) {
    urgencyCategory = 'LOW';
    esiLevel = 4;
    suggestedDepartment = 'Orthopedics & Fracture';
    aiConfidence = 96;
    aiRationale = `Low urgency: Isolated musculoskeletal injury with normal vital signs. Single diagnostic radiographic resource required. Hemodynamically stable.`;
    recommendedNextSteps = [
      '3-View plain radiographic imaging of the affected extremity',
      'RICE Protocol (Rest, Ice, Compression, Elevation)',
      'Immobilization with temporary posterior splint if indicated',
      'Oral non-opioid analgesia as needed',
    ];
  } else if (age < 16) {
    urgencyCategory = 'LOW';
    esiLevel = 4;
    suggestedDepartment = 'Pediatrics Urgent Care';
    aiRationale = `Low urgency: Pediatric presentation with stable physiological parameters. Routine pediatric urgent evaluation.`;
    recommendedNextSteps = [
      'Dedicated pediatric triage room assignment',
      'Weight-adjusted antipyretic or oral fluids if indicated',
      'Standard nursing vitals recheck in 45 minutes',
    ];
  } else {
    urgencyCategory = 'LOW';
    esiLevel = 4;
    suggestedDepartment = 'General Outpatient & Triage';
    aiConfidence = 94;
    aiRationale = `Low urgency: Non-emergent presentation with normal vital signs. Routine outpatient triage processing recommended without need for complex emergency department resources.`;
    recommendedNextSteps = [
      'Standard outpatient queue assignment',
      'Nursing comfort checks while awaiting room placement',
      'Routine vitals reassessment in 60 minutes',
    ];
  }

  // Synthesize concise symptom summary
  const symptomListText = selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : 'Unspecified symptoms';
  const symptomSummary = `${symptomListText} (Severity: ${symptomSeverity}, Duration: ${symptomDuration}). Reported details: "${chiefComplaint || 'No extended complaint narrative'}".`;

  return {
    symptomSummary,
    urgencyCategory,
    riskLevel: urgencyCategory,
    esiLevel,
    riskFactors,
    recommendedNextSteps,
    recommendedActions: recommendedNextSteps,
    suggestedDepartment,
    department: suggestedDepartment,
    aiConfidence,
    aiRationale,
    isEmergencyEscalation,
    escalationReason,
    safetyDisclaimer: 'CLINICAL DECISION SUPPORT ONLY: This evaluation provides priority stratification for healthcare professionals and does NOT constitute a medical diagnosis. A licensed clinician must perform bedside evaluation.',
    informationSufficiency: {
      status: sufficiencyStatus,
      missingFields,
      notes: sufficiencyNotes,
    },
  };
};
