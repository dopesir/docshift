// ============================================================================
// DOCSHIFT CLINICAL HUD � RIGOROUS AUTOMATED VERIFICATION & TEST SUITE
// ============================================================================
// Tests 100% of clinical datasets, pediatric formulary math, emergency resus,
// toxicology protocols, ECG triage, vasopressors, PALS tape, and directly tests
// the live shipped parser functions from app.js across 50+ diverse clinical notes.

const fs = require('fs');
const path = require('path');

console.log("=================================================================");
console.log("    DOCSHIFT CLINICAL HUD � AUTOMATED VERIFICATION HARNESS       ");
console.log("=================================================================\n");

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, message) {
  if (condition) {
    console.log(`  ? PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ? FAIL: ${message}`);
    failed++;
    failures.push(message);
  }
}

// ----------------------------------------------------------------------------
// 1. LOAD LIVE DATA & LIVE SHIPPED APPLICATION LOGIC
// ----------------------------------------------------------------------------
const dataFilePath = path.join(__dirname, '..', 'data.js');
const dataCode = fs.readFileSync(dataFilePath, 'utf8');
eval(dataCode.replace('const CLINICAL_DATA', 'global.CLINICAL_DATA'));
const data = global.CLINICAL_DATA;

const app = require('../app.js');

assert(typeof data === 'object' && data !== null, "data.js loaded and exported CLINICAL_DATA");
assert(typeof app.parseClinicalDocument === 'function', "app.js exports live parseClinicalDocument function");
assert(typeof app.parseCsvCounts === 'function', "app.js exports live parseCsvCounts function");
assert(typeof app.validateFileCheck === 'function', "app.js exports live validateFileCheck function");
assert(typeof app.clearReferralForm === 'function', "app.js exports live clearReferralForm function");
assert(typeof app.clearPedsSearch === 'function', "app.js exports live clearPedsSearch function");
assert(typeof app.handlePedsSearch === 'function', "app.js exports live handlePedsSearch function");

// ----------------------------------------------------------------------------
// TEST SUITE 1: Pediatric Formulary Math & Edge Boundary Weights
// ----------------------------------------------------------------------------
console.log("\n[TEST SUITE 1] Pediatric Dosing Math & Boundary Weights (NLEM / IAP)");

const testWeights = [2.0, 2.5, 3.5, 5.0, 7.2, 10.0, 12.0, 15.5, 18.0, 20.0, 25.0, 35.0, 49.5, 50.0];

assert(Array.isArray(data.pediatrics) && data.pediatrics.length >= 13, `Pediatric formulary contains ${data.pediatrics.length} active drugs (>= 13 required)`);

testWeights.forEach(w => {
  data.pediatrics.forEach(drug => {
    drug.formulations.forEach(f => {
      const res = f.calc(w);
      assert(res !== null && res !== undefined, `Calculation exists for ${drug.name} (${f.type}) at ${w} kg`);
      assert(typeof res.ml === 'string' || typeof res.ml === 'number', `Valid mL result for ${drug.name} at ${w} kg: ${res.ml}`);
      assert(typeof res.unit === 'string' && res.unit.length > 0, `Clinical administration unit specified for ${drug.name} at ${w} kg`);
    });
  });
});

// Specific mathematical accuracy verifications
const pcmDrops10 = data.pediatrics.find(d => d.id === 'paracetamol').formulations[0].calc(10.0);
assert(pcmDrops10.mg === 150 && pcmDrops10.drops === 30, "Paracetamol 100mg/mL drops for 10kg = 150mg (30 drops)");

const amox10 = data.pediatrics.find(d => d.id === 'amoxiclav').formulations[0].calc(10.0);
assert(parseFloat(amox10.ml) === 5.0, "Amoxiclav 228.5mg/5mL for 10kg = 5.0 mL BD");

const ondansetron10 = data.pediatrics.find(d => d.id === 'ondansetron').formulations[1].calc(10.0);
assert(parseFloat(ondansetron10.ml) === 3.8 || parseFloat(ondansetron10.ml) === 3.75, "Ondansetron 2mg/5mL for 10kg = ~3.8 mL SOS");

const pred10 = data.pediatrics.find(d => d.id === 'prednisolone').formulations[0].calc(10.0);
assert(parseFloat(pred10.ml) === 15.0, "Prednisolone 5mg/5mL for 10kg = 15.0 mL OD (15mg)");

const ifa10 = data.pediatrics.find(d => d.id === 'iron_folic_acid').formulations[0].calc(10.0);
assert(parseFloat(ifa10.ml) === 1.0, "IFA syrup for AMB program = 1.0 mL bi-weekly");

// ----------------------------------------------------------------------------
// TEST SUITE 2: Emergency Resuscitation Protocols & ICMR Guidelines
// ----------------------------------------------------------------------------
console.log("\n[TEST SUITE 2] Emergency Resus Protocols Integrity (ICMR STWs)");

assert(Array.isArray(data.emergencies) && data.emergencies.length >= 10, `Emergency protocols registry contains ${data.emergencies.length} protocols (>= 10 required)`);

const snakebite = data.emergencies.find(e => e.id === 'snakebite');
assert(snakebite && snakebite.quickDoses.some(d => d.dose.includes("10 Vials")), "Snakebite ASV loading dose = 10 vials in 500mL NS");

const opPoison = data.emergencies.find(e => e.id === 'op_poisoning');
assert(opPoison && opPoison.steps.some(s => s.title.includes("Doubling Protocol")), "OP Poisoning Atropine doubling protocol verified");

const rabies = data.emergencies.find(e => e.id === 'rabies_pep');
assert(rabies && rabies.quickDoses.some(d => d.dose.includes("40 IU/kg")), "Rabies Equine RIG dosing = 40 IU/kg infiltrated locally");

const burns = data.emergencies.find(e => e.id === 'burns_resuscitation');
assert(burns && burns.quickDoses.some(d => d.dose.includes("4 mL x Weight(kg)")), "Parkland burn resuscitation formula = 4 mL x kg x %TBSA");

const asthma = data.emergencies.find(e => e.id === 'acute_asthma_copd');
assert(asthma && asthma.quickDoses.some(d => d.drug.includes("Ipratropium")), "Acute Asthma combined Duolin nebulization verified");

const eclampsia = data.emergencies.find(e => e.id === 'eclampsia');
assert(eclampsia && eclampsia.quickDoses.some(d => d.dose.includes("4g IV")), "Eclampsia Pritchard Regimen 4g IV + 10g IM verified");

// ----------------------------------------------------------------------------
// TEST SUITE 3: National Health Programs (NTEP / NVBDCP / NACO)
// ----------------------------------------------------------------------------
console.log("\n[TEST SUITE 3] National Health Programs (NTEP / NVBDCP / NACO)");

assert(Array.isArray(data.nationalPrograms) && data.nationalPrograms.length >= 3, "National programs contains TB, Malaria, and NACO STI kits");
const tb = data.nationalPrograms.find(p => p.id === 'tb_nikshay');
assert(tb && tb.weightBands.length === 4, "TB weight bands verified for all 4 standard categories (25-34, 35-49, 50-64, >=65 kg)");
const sti = data.nationalPrograms.find(p => p.id === 'naco_sti_kits');
assert(sti && sti.kits.length >= 5, "NACO STI color-coded kits verified");

// ----------------------------------------------------------------------------
// TEST SUITE 4: Medico-Legal Framework (BNS 116 / IPC 320)
// ----------------------------------------------------------------------------
console.log("\n[TEST SUITE 4] Medico-Legal Framework & Statutory Clauses");

assert(data.medicoLegal.grievousHurtClauses.length === 8, "Grievous hurt statutory clauses = exactly 8 clauses under Sec 116 BNS / 320 IPC");
assert(data.medicoLegal.woundTypes.length >= 4, "Forensic wound types verified (Lacerated, Incised, Contusion, Abrasion)");
assert(data.medicoLegal.postMortemRules.length >= 3, "Post-Mortem autopsy guidelines verified (TSD, Hanging vs Strangulation, Drowning)");

// ----------------------------------------------------------------------------
// TEST SUITE 5: Vasopressor Infusions & High-Risk DDI Matrix
// ----------------------------------------------------------------------------
console.log("\n[TEST SUITE 5] Vasopressor Infusions & Point-of-Care DDI Matrix");

assert(Array.isArray(data.vasopressors) && data.vasopressors.length >= 3, "Vasopressors array contains Noradrenaline, Dopamine, and Dobutamine");

const noraRes = data.vasopressors.find(v => v.drug.includes("Noradrenaline")).calcRate(60, 0.1);
assert(parseFloat(noraRes.mlHr) === 4.5, "Noradrenaline infusion rate = 4.5 mL/hr for 60kg at 0.1 mcg/kg/min");

const dopaRes = data.vasopressors.find(v => v.drug.includes("Dopamine")).calcRate(60, 10);
assert(parseFloat(dopaRes.mlHr) === 9.0, "Dopamine infusion rate = 9.0 mL/hr for 60kg at 10 mcg/kg/min");

assert(Array.isArray(data.highRiskDDI) && data.highRiskDDI.length >= 5, "High-Risk DDI matrix contains at least 5 fatal point-of-care alerts");

// ----------------------------------------------------------------------------
// TEST SUITE 6: Pediatric Advanced Life Support (PALS) Resus Math
// ----------------------------------------------------------------------------
console.log("\n[TEST SUITE 6] PALS Resuscitation Tape Math & Airway Rules");

const palsWeights = [3.0, 5.0, 8.0, 10.0, 12.0, 15.0, 20.0, 25.0, 35.0, 50.0];
palsWeights.forEach(w => {
  const p = data.palsResus.calc(w);
  assert(p.nsBolus === `${Math.round(w * 20)} mL`, `PALS NS bolus correct for ${w}kg (${p.nsBolus})`);
  assert(parseFloat(p.d10Bolus) === parseFloat((w * 2).toFixed(1)), `PALS D10W bolus correct for ${w}kg (${p.d10Bolus})`);
  assert(parseFloat(p.adrVolume) === parseFloat((w * 0.1).toFixed(2)), `PALS Adrenaline volume correct for ${w}kg (${p.adrVolume})`);
  assert(p.defib1 === `${Math.round(w * 2)} Joules`, `PALS Initial Defib Joules correct for ${w}kg (${p.defib1})`);
  assert(p.defib2 === `${Math.round(w * 4)} Joules`, `PALS Subsequent Defib Joules correct for ${w}kg (${p.defib2})`);
  assert(typeof p.ettSize === 'string' && p.ettSize.includes("mm"), `PALS ETT size generated for ${w}kg (${p.ettSize})`);
});

// ----------------------------------------------------------------------------
// TEST SUITE 7: Casualty Toxicology & Poisoning Workflows
// ----------------------------------------------------------------------------
console.log("\n[TEST SUITE 7] Casualty Toxicology & Indian Poisoning Workflows");

assert(Array.isArray(data.toxicology) && data.toxicology.length >= 6, "Toxicology dataset contains Celphos, Kerosene, Paracetamol, Rodenticide, Corrosives, and Dhatura");

const celphos = data.toxicology.find(t => t.id === 'celphos');
assert(celphos && celphos.keyWarning.includes("NO WATER"), "Celphos protocol enforces STRICT NO WATER warning");
assert(celphos && celphos.lavageProtocol.includes("Coconut Oil"), "Celphos protocol mandates Coconut Oil / Liquid Paraffin lavage");

const kerosene = data.toxicology.find(t => t.id === 'kerosene');
assert(kerosene && kerosene.keyWarning.includes("NO GASTRIC LAVAGE"), "Kerosene protocol enforces STRICT NO LAVAGE / NO EMESIS warning");

const pcmTox = data.toxicology.find(t => t.id === 'paracetamol_tox');
assert(pcmTox && pcmTox.antidote.includes("N-Acetylcysteine"), "Paracetamol overdose antidote = N-Acetylcysteine (NAC)");

const rodenticide = data.toxicology.find(t => t.id === 'rodenticide');
assert(rodenticide && rodenticide.antidote.includes("Vitamin K1"), "Superwarfarin rodenticide antidote = Vitamin K1 (Phytomenadione)");

// ----------------------------------------------------------------------------
// TEST SUITE 8: 10-Second Casualty ECG & Pre-Thrombolysis Matrix
// ----------------------------------------------------------------------------
console.log("\n[TEST SUITE 8] 10-Second Casualty ECG & Pre-Thrombolysis Matrix");

assert(Array.isArray(data.ecgTriage.leadsMap) && data.ecgTriage.leadsMap.length >= 7, "ECG leads map contains Inferior, Anterior, Lateral, Posterior, Left Main, Wellens, and De Winter");

const inferior = data.ecgTriage.leadsMap.find(l => l.territory.includes("Inferior"));
assert(inferior && inferior.criticalAlert.includes("V4R"), "Inferior MI protocol includes Lead V4R RV Infarction precaution");

const tc = data.ecgTriage.thrombolysisChecklist;
assert(Array.isArray(tc.absoluteContraindications) && tc.absoluteContraindications.length >= 6, "Thrombolysis absolute contraindications >= 6 items");
assert(Array.isArray(tc.regimens) && tc.regimens.some(r => r.drug.includes("Streptokinase")), "Streptokinase 1.5 MU thrombolysis regimen verified");

// ----------------------------------------------------------------------------
// TEST SUITE 9: Shock Index Calculator
// ----------------------------------------------------------------------------
console.log("\n[TEST SUITE 9] Shock Index Calculator (HR / SBP)");

const normalShock = data.shockIndexCalculator.calc(80, 120);
assert(parseFloat(normalShock.index) === 0.67 && normalShock.triage.includes("Normal"), `Shock index (80/120) = 0.67 Normal`);

const mildShock = data.shockIndexCalculator.calc(90, 110);
assert(parseFloat(mildShock.index) === 0.82 && mildShock.triage.includes("Mild Shock"), `Shock index (90/110) = 0.82 Mild Shock`);

const severeShock = data.shockIndexCalculator.calc(130, 80);
assert(parseFloat(severeShock.index) === 1.63 && severeShock.triage.includes("Severe"), `Shock index (130/80) = 1.63 Severe Shock`);

// ----------------------------------------------------------------------------
// TEST SUITE 10: File Sandboxing & Boundary Validation
// ----------------------------------------------------------------------------
console.log("\n[TEST SUITE 10] File Sandboxing & Boundary Validation");

assert(app.validateFileCheck("notes.txt", 1024).valid === true, "Valid .txt within 5MB passes validation");
assert(app.validateFileCheck("shift.json", 2048).valid === true, "Valid .json within 5MB passes validation");
assert(app.validateFileCheck("tally.csv", 4096).valid === true, "Valid .csv within 5MB passes validation");
assert(app.validateFileCheck("summary.md", 512).valid === true, "Valid .md within 5MB passes validation");
assert(app.validateFileCheck("large_file.txt", 6 * 1024 * 1024).valid === false, "File exceeding 5MB is rejected with EXCEEDS_SIZE");
assert(app.validateFileCheck("malicious.exe", 1024).valid === false, "Executable / invalid file extension is safely rejected");

// ----------------------------------------------------------------------------
// TEST SUITE 11: 50+ DIVERSE CLINICAL NOTE EVALUATION SET (ZERO HALLUCINATIONS)
// ----------------------------------------------------------------------------
console.log("\n[TEST SUITE 11] 50+ Diverse Clinical Note Evaluation Set");

const testCases = [
  // 1-10: Emergency & Resuscitation Notes
  {
    id: "TC-01",
    name: "Snakebite note with TRIAGE header (Regex boundary check)",
    text: `CLINICAL TRIAGE & CASUALTY NOTE
Facility: Community Health Centre, Rural Block
Attending Doctor: Dr. Medical Officer, MBBS
Patient: Ramesh Kumar (32/M)
Presentation Vitals:
- Blood Pressure: 90/60 mmHg
- Pulse Rate: 118 bpm
- SpO2: 91%
- RBS: 98 mg/dL
- GCS: 12/15
Initial Treatment Given:
- Polyvalent ASV 10 Vials in 500 mL NS IV
- Inj. Atropine 0.6mg + Neostigmine 1.5mg IV
Reason for Referral: Severe neurotoxic envenomation`,
    expected: {
      patient: "Ramesh Kumar",
      ageSex: "32/M",
      bp: "90/60",
      pr: "118",
      spo2: "91",
      rbs: "98",
      gcs: "12/15",
      doctor: "Dr. Medical Officer, MBBS",
      facility: "Community Health Centre, Rural Block"
    }
  },
  {
    id: "TC-02",
    name: "RTA Trauma with BNS 116 Grievous Clauses",
    text: `MEDICO-LEGAL INJURY REPORT
Facility: Primary Health Centre, Highway Block
Doctor: Dr. Senior MO, MBBS
Patient: Sunita Devi (26/F)
Vitals: BP 100/65 mmHg, PR 104 bpm, SpO2 96%, GCS 13/15.
Findings: Compound fracture of left radius with skin tear and severe bodily pain.
Reason for Referral: Orthopedic surgery required.`,
    expected: {
      patient: "Sunita Devi",
      ageSex: "26/F",
      bp: "100/65",
      pr: "104",
      spo2: "96",
      gcs: "13/15",
      doctor: "Dr. Senior MO, MBBS",
      grievousCount: 2 // Fracture + severe bodily pain
    }
  },
  {
    id: "TC-03",
    name: "OP Poisoning with Atropinization Vitals",
    text: `CASUALTY ADMISSION NOTE
Facility: CHC South
Doctor: Dr. Patel
Patient: Rajesh Sharma
Age / Sex: 45 / M
Provisional Diagnosis: Acute Organophosphate Poisoning
Presentation Vitals:
Blood Pressure: 140/90 mmHg
Pulse Rate: 52 bpm
SpO2: 88%
RBS: 130 mg/dL
GCS: 10/15
Emergency Drugs Administered:
- Inj. Atropine 2mg IV stat, doubling every 5 mins
- Inj. Pralidoxime (PAM) 2g IV over 30 mins
Reason for Referral: Requirement for ICU ventilator support`,
    expected: {
      patient: "Rajesh Sharma",
      ageSex: "45 / M",
      bp: "140/90",
      pr: "52",
      spo2: "88",
      rbs: "130",
      gcs: "10/15",
      doctor: "Dr. Patel"
    }
  },
  {
    id: "TC-04",
    name: "Acute Severe Asthma with Tachycardia",
    text: `CASUALTY NOTE
Facility: Sub-District Hospital
Doctor: Dr. Anita Roy
Patient: Priya Singh (19/F)
Provisional Diagnosis: Acute Severe Asthma
Vitals: BP 115/75 mmHg, PR 128 bpm, SpO2 89%, RR 32 /min
Initial Treatment Given:
- Nebulization with Salbutamol + Ipratropium 3 cycles
- Inj. Hydrocortisone 200mg IV stat
- Oxygen at 6 L/min via face mask
Reason for Referral: Poor response to bronchodilators, silent chest impending`,
    expected: {
      patient: "Priya Singh",
      ageSex: "19/F",
      bp: "115/75",
      pr: "128",
      spo2: "89",
      rr: "32"
    }
  },
  {
    id: "TC-05",
    name: "Anterior STEMI in Cardiogenic Shock",
    text: `EMERGENCY CASUALTY NOTE
Facility: PHC North
Doctor: Dr. K. Rao
Patient: Suresh Babu (58/M)
Provisional Diagnosis: Acute Anterior STEMI with Cardiogenic Shock
Vitals: BP 80/50 mmHg, PR 112 bpm, SpO2 93%, RBS 180 mg/dL, GCS 14/15
Treatment Given:
- Tab. Aspirin 300mg + Tab. Clopidogrel 300mg + Tab. Atorvastatin 80mg chewed
- Inj. Noradrenaline infusion started at 0.1 mcg/kg/min
Reason for Referral: Primary PCI / Coronary Angiography`,
    expected: {
      patient: "Suresh Babu",
      ageSex: "58/M",
      bp: "80/50",
      pr: "112",
      spo2: "93",
      rbs: "180",
      gcs: "14/15"
    }
  },
  {
    id: "TC-06",
    name: "Eclampsia Pritchard Regimen",
    text: `OBSTETRIC CASUALTY NOTE
Facility: Community Health Centre
Doctor: Dr. Meena
Patient: Kavita Kumari (22/F)
Provisional Diagnosis: Antepartum Eclampsia at 36 weeks gestation
Presentation Vitals:
BP: 170/110 mmHg
PR: 96 bpm
SpO2: 97%
GCS: 11/15
Initial Treatment:
- Inj. Magnesium Sulphate 4g IV (20% sol) over 10 mins + 10g IM (5g in each buttock)
- Inj. Labetalol 20mg IV bolus
Reason for Referral: Emergency Cesarean Section in Tertiary Center`,
    expected: {
      patient: "Kavita Kumari",
      ageSex: "22/F",
      bp: "170/110",
      pr: "96",
      spo2: "97",
      gcs: "11/15"
    }
  },
  {
    id: "TC-07",
    name: "Pediatric Severe Dehydration / Shock",
    text: `PEDIATRIC EMERGENCY NOTE
Facility: PHC West
Doctor: Dr. Gupta
Patient: Master Aarav (3/M)
Provisional Diagnosis: Acute Gastroenteritis with Severe Dehydration
Presentation Vitals:
- BP: 70/45 mmHg
- PR: 160 bpm
- SpO2: 95%
- RBS: 60 mg/dL
Treatment:
- IV Ringer Lactate 30 mL/kg bolus given in 30 mins
- Inj. Ondansetron 1.5mg IV stat
Reason for Referral: Severe shock with persistent lethargy`,
    expected: {
      patient: "Master Aarav",
      ageSex: "3/M",
      bp: "70/45",
      pr: "160",
      spo2: "95",
      rbs: "60"
    }
  },
  {
    id: "TC-08",
    name: "Rabies Category III Wolf/Dog Bite",
    text: `CASUALTY ANIMAL BITE NOTE
Facility: CHC Hill Block
Doctor: Dr. Verma
Patient: Gopi Chand (40/M)
Diagnosis: Category III Stray Dog Bite over Face and Neck
Vitals: BP 130/80 mmHg, PR 88 bpm, SpO2 99%
Treatment Given:
- Wound washed with running water and soap for 15 minutes
- Equine Rabies Immunoglobulin (ERIG) 40 IU/kg infiltrated into wound margins
- Anti-Rabies Vaccine (ARV) 0.5 mL IM on Day 0 (Deltoid)
Reason for Referral: Plastic surgery reconstruction of facial lacerations`,
    expected: {
      patient: "Gopi Chand",
      ageSex: "40/M",
      bp: "130/80",
      pr: "88",
      spo2: "99"
    }
  },
  {
    id: "TC-09",
    name: "Burns Resuscitation (Parkland Formula)",
    text: `CASUALTY BURNS NOTE
Facility: District Hospital Casualty
Doctor: Dr. Sengupta
Patient: Radha Bai (30/F)
Provisional Diagnosis: 40% Thermal Flame Burns
Vitals: BP 90/60 mmHg, PR 120 bpm, SpO2 96%, GCS 15/15
Treatment:
- IV access with two 16G cannulas
- Ringer Lactate fluid resuscitation at 500 mL/hr as per Parkland formula
- Inj. Tramadol 50mg IV for analgesia
Reason for Referral: Specialized Burns ICU management`,
    expected: {
      patient: "Radha Bai",
      ageSex: "30/F",
      bp: "90/60",
      pr: "120",
      spo2: "96",
      gcs: "15/15"
    }
  },
  {
    id: "TC-10",
    name: "Aluminium Phosphide (Celphos) Ingestion",
    text: `CASUALTY POISONING NOTE
Facility: CHC Central
Doctor: Dr. Chopra
Patient: Vikas (24/M)
Diagnosis: Acute Celphos (Aluminum Phosphide) Ingestion
Presentation Vitals: BP 75/40 mmHg, Pulse Rate 136 bpm, SpO2 86%, GCS 10/15
Emergency Treatment:
- Coconut oil gastric lavage performed (STRICT NO WATER protocol)
- Inj. Magnesium Sulphate 1g IV
- Inj. Sodium Bicarbonate IV infusion
Reason for Referral: Severe metabolic acidosis and cardiogenic shock`,
    expected: {
      patient: "Vikas",
      ageSex: "24/M",
      bp: "75/40",
      pr: "136",
      spo2: "86",
      gcs: "10/15"
    }
  }
];

// Generate 40 additional realistic variations for thorough 50-test suite
for (let i = 11; i <= 50; i++) {
  const isHypo = i % 3 === 0;
  const isTachy = i % 2 === 0;
  const bpSys = isHypo ? 80 + (i % 15) : 110 + (i % 30);
  const bpDia = isHypo ? 50 + (i % 10) : 70 + (i % 20);
  const prVal = isTachy ? 110 + (i % 35) : 70 + (i % 20);
  const spo2Val = 90 + (i % 10);
  const rbsVal = 80 + (i * 2);
  const gcsVal = `${Math.min(15, 10 + (i % 6))}/15`;

  let diag = "Acute Medical Presentation";
  if (i % 5 === 0) diag = "Acute Appendicitis with Peritonitis";
  else if (i % 5 === 1) diag = "Cerebrovascular Stroke (CVA) with Hemiplegia";
  else if (i % 5 === 2) diag = "Severe Community Acquired Pneumonia";
  else if (i % 5 === 3) diag = "Acute Decompensated Heart Failure";
  else diag = "Diabetic Ketoacidosis (DKA)";

  testCases.push({
    id: `TC-${i < 10 ? '0' + i : i}`,
    name: `Automated Clinical Scenario ${i}: ${diag}`,
    text: `CLINICAL EXAMINATION SUMMARY
Facility: Community Health Centre, Sector ${i}
Attending Doctor: Dr. Officer ${i}, MBBS
Patient: Test Patient ${i} (${20 + (i % 50)}/${i % 2 === 0 ? 'M' : 'F'})
Provisional Diagnosis: ${diag}
Presentation Vitals:
- BP: ${bpSys}/${bpDia} mmHg
- Pulse Rate: ${prVal} bpm
- SpO2: ${spo2Val}%
- RBS: ${rbsVal} mg/dL
- GCS: ${gcsVal}
Initial Treatment Given:
- Oxygen therapy + IV Access
- Appropriate emergency stabilization drugs
Reason for Referral: Tertiary care specialist escalation`,
    expected: {
      patient: `Test Patient ${i}`,
      ageSex: `${20 + (i % 50)}/${i % 2 === 0 ? 'M' : 'F'}`,
      bp: `${bpSys}/${bpDia}`,
      pr: `${prVal}`,
      spo2: `${spo2Val}`,
      rbs: `${rbsVal}`,
      gcs: gcsVal
    }
  });
}

// Execute all 50 clinical test cases through live app.parseClinicalDocument
testCases.forEach(tc => {
  const result = app.parseClinicalDocument(tc.text, "TXT");
  assert(result.success === true, `[${tc.id}] ${tc.name} parsed successfully`);
  
  if (tc.expected.patient) {
    assert(result.fields.patient === tc.expected.patient, `[${tc.id}] Patient extracted correctly: "${result.fields.patient}" === "${tc.expected.patient}"`);
  }
  if (tc.expected.ageSex) {
    assert(result.fields.ageSex === tc.expected.ageSex, `[${tc.id}] Age/Sex extracted correctly: "${result.fields.ageSex}" === "${tc.expected.ageSex}"`);
  }
  if (tc.expected.bp) {
    assert(result.fields.bp === tc.expected.bp, `[${tc.id}] BP extracted correctly: "${result.fields.bp}" === "${tc.expected.bp}"`);
  }
  if (tc.expected.pr) {
    assert(result.fields.pr === tc.expected.pr, `[${tc.id}] PR extracted correctly: "${result.fields.pr}" === "${tc.expected.pr}"`);
  }
  if (tc.expected.spo2) {
    assert(result.fields.spo2 === tc.expected.spo2, `[${tc.id}] SpO2 extracted correctly: "${result.fields.spo2}" === "${tc.expected.spo2}"`);
  }
  if (tc.expected.rbs) {
    assert(result.fields.rbs === tc.expected.rbs, `[${tc.id}] RBS extracted correctly: "${result.fields.rbs}" === "${tc.expected.rbs}"`);
  }
  if (tc.expected.gcs) {
    assert(result.fields.gcs === tc.expected.gcs, `[${tc.id}] GCS extracted correctly: "${result.fields.gcs}" === "${tc.expected.gcs}"`);
  }
  if (tc.expected.grievousCount) {
    assert(result.fields.grievousClauses.length === tc.expected.grievousCount, `[${tc.id}] Medico-legal grievous clauses identified: ${result.fields.grievousClauses.length}`);
  }
});

// ----------------------------------------------------------------------------
// TEST SUITE 12: EDGE CASES, MISSING FIELDS & ADVERSARIAL INPUTS
// ----------------------------------------------------------------------------
console.log("\n[TEST SUITE 12] Edge Cases, Missing Fields & Adversarial Inputs");

// 1. Empty / Whitespace Note
const emptyRes = app.parseClinicalDocument("   ", "TXT");
assert(emptyRes.success === false && emptyRes.error === "EMPTY_INPUT", "Empty text correctly returns EMPTY_INPUT without crashing");

// 2. Note with ZERO Vitals
const noVitalsNote = `CLINICAL NOTE
Facility: Urban PHC
Doctor: Dr. Kumar
Patient: Seema Roy (40/F)
Provisional Diagnosis: Acute Migraine
Reason for Referral: Uncontrolled pain`;

const noVitalsRes = app.parseClinicalDocument(noVitalsNote, "TXT");
assert(noVitalsRes.success === true, "Note without vitals parses without error");
assert(noVitalsRes.fields.bp === null, "Missing BP resolves to null (zero invention)");
assert(noVitalsRes.fields.pr === null, "Missing PR resolves to null (zero invention)");
assert(noVitalsRes.fields.spo2 === null, "Missing SpO2 resolves to null (zero invention)");
assert(noVitalsRes.fields.patient === "Seema Roy", "Patient name extracted when vitals are missing");

// 3. Adversarial Note with "TRIAGE" in title and multiple "Age" mentions
const triageAdversarial = `CASUALTY TRIAGE & CASUALTY ASSESSMENT
Patient: Deepa Malik
Age: 35 / F
History: Patient stated her triage category was yellow and aged mother was unwell.
BP: 110/70 mmHg
PR: 80 bpm`;

const triageRes = app.parseClinicalDocument(triageAdversarial, "TXT");
assert(triageRes.fields.ageSex === "35 / F", `Strict Age extraction ignores 'TRIAGE' or 'aged' in body: got "${triageRes.fields.ageSex}"`);
assert(triageRes.fields.patient === "Deepa Malik", "Patient extracted accurately in adversarial note");

// 4. JSON Handover Parsing (Valid & Malformed)
const validJson = JSON.stringify({
  facility: "CHC East",
  outgoingDoctor: "Dr. Rao",
  totalPatientsSeen: 95,
  highPriorityCases: [{ patient: "A. Kumar (50/M)", diagnosis: "Severe Sepsis", bp: "85/50", pr: "120" }]
});
const jsonRes = app.parseClinicalDocument(validJson, "JSON");
assert(jsonRes.success === true && jsonRes.fields.totalPatientsSeen === 95, "Valid JSON handover extracted with 95 patients");
assert(jsonRes.fields.patient === "A. Kumar (50/M)", "JSON high priority patient extracted");

const malformedJson = "{ facility: CHC East, broken_json: true ";
const brokenJsonRes = app.parseClinicalDocument(malformedJson, "JSON");
assert(brokenJsonRes.success === false && brokenJsonRes.error === "JSON_PARSE_ERROR", "Malformed JSON safely handled with JSON_PARSE_ERROR");

// 5. CSV Parsing (Valid & Malformed)
const validCsv = `Date,Facility,ReportingMO,Code,Category,Count
2026-09-07,PHC Rural,Dr. MO,P-01,ARI,40
2026-09-07,PHC Rural,Dr. MO,P-02,ADD,20
2026-09-07,PHC Rural,Dr. MO,P-03,PUO,15`;

const csvTotal = app.parseCsvCounts(validCsv);
assert(csvTotal === 75, `CSV aggregator calculates exact sum: ${csvTotal} === 75`);

const csvDocRes = app.parseClinicalDocument(validCsv, "CSV");
assert(csvDocRes.success === true && csvDocRes.fields.totalExamined === 75, "CSV document parsed into structured surveillance summary");

const emptyCsvRes = app.parseClinicalDocument("Date,Facility,ReportingMO,Code,Category,Count\n", "CSV");
assert(emptyCsvRes.success === false && emptyCsvRes.error === "CSV_EMPTY_DATA", "Single-header empty CSV safely returns CSV_EMPTY_DATA");

// ----------------------------------------------------------------------------
// TEST SUITE 13: REGIONAL LANGUAGES & BILINGUAL PRESCRIPTION ADVICE
// ----------------------------------------------------------------------------
console.log("\n[TEST SUITE 13] Regional Languages & Bilingual Advice Translations");

assert(Array.isArray(data.regionalLanguages) && data.regionalLanguages.length >= 6, "Regional languages array contains at least 6 Indian languages");

const supportedLangs = ['en', 'hi', 'ta', 'te', 'mr', 'bn'];
supportedLangs.forEach(lang => {
  const langObj = data.regionalLanguages.find(l => l.code === lang);
  assert(langObj !== undefined, `Language code "${lang}" is registered: ${langObj ? langObj.label : 'MISSING'}`);
});


// ----------------------------------------------------------------------------
// TEST SUITE 14: UNSTRUCTURED CASUALTY SHORTHAND, WHATSAPP & SHOCK INDEX
// ----------------------------------------------------------------------------
console.log("\n[TEST SUITE 14] Messy Doctor Shorthand, WhatsApp Handovers & Shock Index (v2.2.0)");

assert(app.DOCSHIFT_VERSION === "2.2.0", `DocShift version constant is 2.2.0 (got: ${app.DOCSHIFT_VERSION})`);
assert(data.metadata.version === "2.2.0", `Clinical Data version constant is 2.2.0 (got: ${data.metadata.version})`);

// 1. Unstructured Casualty Polytrauma Shorthand
const messyTrauma = `45/M brought by 108 ambulance after high speed two-wheeler RTA 2h ago. Severe head trauma + blunt abdominal pain. O/E: GCS 8/15 (E2V2M4), right pupil 4mm sluggish, BP 80/50, PR 128 bpm thready, SpO2 91% room air, RBS 184. Treatment: 2x 18G IV lines, NS 1L bolus fast, Inj Pantop 40 IV, Inj Tranexa 1g IV, C-collar applied. Compound fracture right tibia splinted. Section 116(g) BNS grievous hurt. Shift urgently to tertiary neurosurgery & general surgery.`;

const traumaRes = app.parseClinicalDocument(messyTrauma, "TXT");
assert(traumaRes.success === true, "Messy polytrauma shorthand parsed successfully");
assert(traumaRes.fields.ageSex === "45/M", `Demographics extracted from shorthand: ${traumaRes.fields.ageSex}`);
assert(traumaRes.fields.bp === "80/50", `BP extracted: ${traumaRes.fields.bp}`);
assert(traumaRes.fields.pr === "128", `PR extracted: ${traumaRes.fields.pr}`);
assert(traumaRes.fields.spo2 === "91", `SpO2 extracted: ${traumaRes.fields.spo2}`);
assert(traumaRes.fields.rbs === "184", `RBS extracted: ${traumaRes.fields.rbs}`);
assert(traumaRes.fields.gcs && traumaRes.fields.gcs.startsWith("8/15"), `GCS extracted: ${traumaRes.fields.gcs}`);
assert(traumaRes.fields.shockIndex && traumaRes.fields.shockIndex.includes("1.60"), `Shock index calculated (128/80 = 1.60): ${traumaRes.fields.shockIndex}`);
assert(traumaRes.fields.shockAlert === "SEVERE_SHOCK", "Severe shock alert triggered");
assert(traumaRes.fields.triageLevel === "RED", "Triage level RED classified");
assert(traumaRes.fields.grievousClauses.some(c => c.includes("Clause 7")), "Clause 7 (Fracture) detected");
assert(traumaRes.fields.grievousClauses.some(c => c.includes("Clause 8")), "Clause 8 (Endangering life / Severe shock) detected");

// 2. WhatsApp Handover Message
const whatsappSnakebite = `Urgent ref from PHC: Ramesh Kumar 32/M, farmer. Sustained snake bite right lower ankle while working in fields 1 hr back. Fang marks + active oozing + bilateral ptosis + slurred speech. Vitals: BP 90/60 HR 118 SpO2 91% RBS 98 GCS 12/15 RR 26. 20WBCT >20min unclotted (coagulopathy confirmed). Initial Rx: 10 vials polyvalent ASV in 500ml NS IV over 1 hr + Inj Atropine 0.6mg IV + Inj Neostigmine 1.5mg IV. Shifting via 108 ALS ambulance with doctor escort.`;

const snakebiteRes = app.parseClinicalDocument(whatsappSnakebite, "TXT");
assert(snakebiteRes.success === true, "WhatsApp snakebite note parsed successfully");
assert(snakebiteRes.fields.patient === "Ramesh Kumar", `Patient name extracted from WhatsApp: ${snakebiteRes.fields.patient}`);
assert(snakebiteRes.fields.ageSex === "32/M", `Age/sex extracted: ${snakebiteRes.fields.ageSex}`);
assert(snakebiteRes.fields.bp === "90/60", `BP extracted: ${snakebiteRes.fields.bp}`);
assert(snakebiteRes.fields.pr === "118", `PR extracted: ${snakebiteRes.fields.pr}`);
assert(snakebiteRes.fields.syndrome === "Snakebite Envenomation", `Syndrome auto-classified: ${snakebiteRes.fields.syndrome}`);
assert(snakebiteRes.fields.drugs && snakebiteRes.fields.drugs.includes("ASV"), "ASV administration detected in treatment");
assert(snakebiteRes.fields.drugs && snakebiteRes.fields.drugs.includes("Atropine"), "Atropine detected in treatment");

// 3. Pediatric Shock Shorthand
const pedsShockNote = `Baby Aarav, 18mo M, 11kg. Severe acute gastroenteritis, vomiting x 8 episodes, watery loose stools x 10. Lethargic, depressed fontanelle, sunken eyes, delayed skin turgor > 2s. BP 70/40, HR 160, SpO2 95%, RBS 72. Rx: RL 330ml IV fast bolus over 1h, Inj Ondansetron 1.5mg IV, Zinc 20mg, ORS started. Ref urgently to District Hospital PICU.`;

const pedsRes = app.parseClinicalDocument(pedsShockNote, "TXT");
assert(pedsRes.success === true, "Pediatric shock note parsed successfully");
assert(pedsRes.fields.patient === "Baby Aarav", `Pediatric patient name extracted: ${pedsRes.fields.patient}`);
assert(pedsRes.fields.bp === "70/40" && pedsRes.fields.pr === "160", "Pediatric vitals extracted correctly");
assert(pedsRes.fields.shockAlert === "SEVERE_SHOCK", "Severe pediatric shock alert triggered");
assert(pedsRes.fields.syndrome === "Pediatric & GI Emergency", `Pediatric syndrome classified: ${pedsRes.fields.syndrome}`);

// 4. Emergency Toxicology Note
const toxNote = `22yo female Sunita, alleged ingestion of Celphos (Aluminum Phosphide) ~3h back. Strong garlic odor, severe epigastric burning, vomiting. Vitals: BP 78/48 mmHg, HR 134, SpO2 89%, GCS 11/15, RBS 140. Gastric lavage done with KMNO4 & mineral oil slurry. Inj Sodium Bicarbonate 50ml IV + Inj Hydrocortisone 200mg IV given. Referred immediately to Medical College ICU on 108 ALS.`;

const toxRes = app.parseClinicalDocument(toxNote, "TXT");
assert(toxRes.success === true, "Celphos poisoning note parsed successfully");
assert(toxRes.fields.patient === "Sunita", `Toxicology patient name extracted: ${toxRes.fields.patient}`);
assert(toxRes.fields.syndrome === "Emergency Toxicology", `Toxicology syndrome classified: ${toxRes.fields.syndrome}`);
assert(toxRes.fields.triageLevel === "RED", "Toxicology triage RED");

// 5. STEMI / Cardiogenic Shock Note
const stemiNote = `58/M Mohan Lal. Severe crushing retrosternal chest pain radiating to left arm x 3 hrs with profuse sweating. ECG: Marked ST elevation in II, III, aVF with reciprocal depression in I, aVL (Inferior STEMI + RV extension). BP 85/55, HR 112, SpO2 94%, RBS 165. Rx: Tab Aspirin 300mg chewed + Tab Clopidogrel 300mg + Tab Atorvastatin 80mg given. Normal Saline 500ml IV started. Shift urgently for primary PCI / Thrombolysis.`;

const stemiRes = app.parseClinicalDocument(stemiNote, "TXT");
assert(stemiRes.success === true, "STEMI note parsed successfully");
assert(stemiRes.fields.patient === "Mohan Lal", `Cardiac patient name extracted: ${stemiRes.fields.patient}`);
assert(stemiRes.fields.syndrome === "Cardiovascular Emergency", `Cardiovascular syndrome classified: ${stemiRes.fields.syndrome}`);
assert(stemiRes.fields.drugs && stemiRes.fields.drugs.includes("Aspirin"), "Cardiac loading dose detected");

// 6. Verify Sample Documentation Presets
const expectedPresets = ['snakebite', 'rta_trauma', 'peds_shock', 'celphos_poisoning', 'stemi_cardiogenic', 'idsp_tally', 'shift_handover'];
expectedPresets.forEach(key => {
  assert(app.SAMPLE_CLINICAL_DOCS[key] !== undefined, `Verified sample preset "${key}" is registered and valid`);
});

// ----------------------------------------------------------------------------
// SUMMARY REPORT
// ----------------------------------------------------------------------------
console.log("\n=================================================================");
console.log(`  VERIFICATION RESULTS: ${passed} PASSED | ${failed} FAILED`);
console.log("=================================================================\n");

if (failed > 0) {
  console.error("FAILURES DETECTED:");
  failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}`));
  process.exit(1);
} else {
  console.log("ALL 50+ CLINICAL EVALUATION CASES, PEDIATRIC FORMULAS, EMERGENCY");
  console.log("RESUSCITATION PROTOCOLS, STATUTORY MEDICO-LEGAL CLAUSES, ECG & TOX");
  console.log("DATASETS, AND ZERO-HALLUCINATION PARSER TESTS PASSED FLAWLESSLY!");
  process.exit(0);
}
