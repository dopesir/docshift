// DOCSHIFT - Clinical Knowledge Base & Calculation Engine
// Version: 2.2.0 (Production Assistive Clinical Reference)
// Sources & Evidence Citations:
// 1. National List of Essential Medicines (NLEM 2022) / National Formulary of India (NFI)
// 2. Indian Academy of Pediatrics (IAP) Pediatric Drug Formulary (4th Edition)
// 3. Indian Council of Medical Research (ICMR) Standard Treatment Workflows (STWs, 2022)
// 4. National Snakebite & Rabies Guidelines (DGHS / NCDC, 2019-2022)
// 5. Bharatiya Nyaya Sanhita (BNS 2023) / Indian Penal Code (IPC 1860)

const CLINICAL_DATA = {
  metadata: {
    system: "DocShift Clinical Assistive Reference",
    version: "2.2.0",
    lastReviewed: "September 2026",
    citations: {
      pediatrics: "NLEM 2022 & IAP Drug Formulary (4th Ed)",
      emergencies: "ICMR Standard Treatment Workflows (2022) & DGHS National Guidelines",
      toxicology: "ICMR STWs & WHO Poisons Information Monograph",
      ecg: "ESC / ACC STEMI Guidelines & ICMR Emergency Protocols",
      medicoLegal: "Bharatiya Nyaya Sanhita (BNS 2023, Sections 114-116) / IPC 320",
      idsp: "Integrated Disease Surveillance Programme (IDSP Form P, NCDC)"
    },
    disclaimer: "Notice: DocShift is an assistive calculation and reference instrument for MBBS Medical Officers. It does not replace independent clinical judgment or formal institutional protocols. All dosages, clinical decisions, and referral summaries must be reviewed and verified by the attending Registered Medical Practitioner."
  },

  
  // PEDIATRIC & GOVERNMENT ESSENTIAL FORMULARY (NLEM 2022 / IAP / ICMR / NHM)
  pediatrics: [
    {
      id: "paracetamol",
      name: "Paracetamol (PCM / Acetaminophen / Calpol / Dolo)",
      category: "Antipyretics / Analgesics",
      rule: "15 mg/kg/dose",
      frequency: "Every 4 to 6 hours SOS (Max 60 mg/kg/day or 4 doses/24h)",
      indications: "Fever, mild-to-moderate pain, post-immunization pyrexia",
      notes: "Do not exceed 4g/day in adolescents. Caution in hepatic impairment.",
      keywords: "pcm calpol dolo crocin acetaminophen fever pain pyrexia antipyretic",
      formulations: [
        {
          type: "Drops",
          strength: "100 mg / 1 mL",
          calc: (w) => {
            const mg = w * 15;
            const ml = mg / 100;
            const drops = Math.round(ml * 20);
            return { mg: Math.round(mg), ml: ml.toFixed(1), drops: drops, unit: "drops (100mg/mL)" };
          }
        },
        {
          type: "Syrup (Regular)",
          strength: "120 mg / 5 mL (24 mg/mL)",
          calc: (w) => {
            const mg = w * 15;
            const ml = mg / 24;
            return { mg: Math.round(mg), ml: ml.toFixed(1), unit: "mL (120mg/5mL)" };
          }
        },
        {
          type: "Syrup (DS / Forte)",
          strength: "250 mg / 5 mL (50 mg/mL)",
          calc: (w) => {
            const mg = w * 15;
            const ml = mg / 50;
            return { mg: Math.round(mg), ml: ml.toFixed(1), unit: "mL (250mg/5mL)" };
          }
        }
      ]
    },
    {
      id: "amoxiclav",
      name: "Amoxicillin + Potassium Clavulanate (Amoxiclav / Augmentin)",
      category: "Antibiotics",
      rule: "30–45 mg/kg/day (based on Amoxicillin component) divided BD",
      frequency: "Twice daily (BD) with food for 5–7 days",
      indications: "Acute otitis media, community-acquired pneumonia, sinusitis, skin/soft tissue infections",
      notes: "Reconstituted syrup valid for 7 days in refrigerator. Shake well.",
      keywords: "amoxiclav augmentin clavulanate amox clav antibiotic cap pneumonia aom",
      formulations: [
        {
          type: "Dry Syrup (Regular)",
          strength: "228.5 mg / 5 mL (Amox 200mg + Clav 28.5mg)",
          calc: (w) => {
            const mgDose = w * 20;
            const ml = mgDose / 40;
            return { mg: Math.round(mgDose * 1.14), ml: ml.toFixed(1), unit: "mL BD (228.5mg/5mL)" };
          }
        },
        {
          type: "Dry Syrup (DS / Duo)",
          strength: "457 mg / 5 mL (Amox 400mg + Clav 57mg)",
          calc: (w) => {
            const mgDose = w * 20;
            const ml = mgDose / 80;
            return { mg: Math.round(mgDose * 1.14), ml: ml.toFixed(1), unit: "mL BD (457mg/5mL)" };
          }
        }
      ]
    },
    {
      id: "amoxicillin",
      name: "Amoxicillin (Plain / Novamox / Mox)",
      category: "Antibiotics",
      rule: "40–50 mg/kg/day divided TDS (High dose: 80–90 mg/kg/day)",
      frequency: "Three times daily (TDS) for 5–7 days",
      indications: "Uncomplicated streptococcal pharyngitis, mild CAP, otitis media, UTI",
      notes: "First-line empirical antibiotic for pediatric community-acquired pneumonia (ICMR).",
      keywords: "amoxicillin novamox mox amox cap pneumonia strep throat",
      formulations: [
        {
          type: "Syrup (125mg)",
          strength: "125 mg / 5 mL (25 mg/mL)",
          calc: (w) => {
            const mgDose = (w * 45) / 3;
            const ml = mgDose / 25;
            return { mg: Math.round(mgDose), ml: ml.toFixed(1), unit: "mL TDS (125mg/5mL)" };
          }
        },
        {
          type: "Syrup (250mg Forte)",
          strength: "250 mg / 5 mL (50 mg/mL)",
          calc: (w) => {
            const mgDose = (w * 45) / 3;
            const ml = mgDose / 50;
            return { mg: Math.round(mgDose), ml: ml.toFixed(1), unit: "mL TDS (250mg/5mL)" };
          }
        }
      ]
    },
    {
      id: "ondansetron",
      name: "Ondansetron (Emeset / Ondem / Vomikind)",
      category: "Antiemetics / GI",
      rule: "0.15 mg/kg/dose",
      frequency: "Single dose SOS 30 mins before ORS/feeds (Max 4 mg/dose, max TDS)",
      indications: "Acute gastroenteritis vomiting to facilitate oral rehydration therapy (ORT)",
      notes: "Do not give repeatedly if vomiting is due to intestinal obstruction/surgical abdomen.",
      keywords: "ondansetron emeset ondem vomikind vomiting nausea antiemetic gastroenteritis",
      formulations: [
        {
          type: "Drops",
          strength: "2 mg / 1 mL",
          calc: (w) => {
            const mg = Math.min(w * 0.15, 4);
            const ml = mg / 2;
            const drops = Math.round(ml * 20);
            return { mg: mg.toFixed(1), ml: ml.toFixed(2), drops: drops, unit: "drops (2mg/mL)" };
          }
        },
        {
          type: "Syrup",
          strength: "2 mg / 5 mL (0.4 mg/mL)",
          calc: (w) => {
            const mg = Math.min(w * 0.15, 4);
            const ml = mg / 0.4;
            return { mg: mg.toFixed(1), ml: ml.toFixed(1), unit: "mL SOS (2mg/5mL)" };
          }
        }
      ]
    },
    {
      id: "ibuprofen",
      name: "Ibuprofen (Ibugesic / Brufen)",
      category: "Antipyretics / Analgesics",
      rule: "10 mg/kg/dose",
      frequency: "Every 6 to 8 hours with feeds (Max 40 mg/kg/day)",
      indications: "Inflammatory pain, high fever refractory to paracetamol, juvenile arthritis",
      notes: "Contraindicated in children < 6 months, dengue/bleeding risk, and severe dehydration/renal impairment.",
      keywords: "ibuprofen brufen ibugesic pain nsaid fever inflammatory",
      formulations: [
        {
          type: "Syrup",
          strength: "100 mg / 5 mL (20 mg/mL)",
          calc: (w) => {
            if (w < 6) return { mg: 0, ml: "0 (Avoid <6kg)", unit: "Not advised <6kg" };
            const mg = w * 10;
            const ml = mg / 20;
            return { mg: Math.round(mg), ml: ml.toFixed(1), unit: "mL (100mg/5mL)" };
          }
        }
      ]
    },
    {
      id: "mefenamic_acid",
      name: "Mefenamic Acid (Meftal-P)",
      category: "Antipyretics / Analgesics",
      rule: "6.5 mg/kg/dose (Range: 4–8 mg/kg/dose TDS)",
      frequency: "Every 8 hours after meals (Max 25 mg/kg/day for max 5–7 days)",
      indications: "High grade refractory pyrexia, post-operative / dental pain, spasmodic dysmenorrhea",
      notes: "Contraindicated in active peptic ulcer, bleeding disorders, and dengue fever suspicion.",
      keywords: "mefenamic acid meftal p high fever nsaid colic analgesic",
      formulations: [
        {
          type: "Suspension",
          strength: "100 mg / 5 mL (20 mg/mL)",
          calc: (w) => {
            if (w < 8) return { mg: 0, ml: "0 (Avoid <6mo)", unit: "Avoid <6mo / <8kg" };
            const mg = Math.min(w * 6.5, 250);
            const ml = mg / 20;
            return { mg: Math.round(mg), ml: ml.toFixed(1), unit: "mL TDS (100mg/5mL)" };
          }
        },
        {
          type: "Drops",
          strength: "50 mg / 1 mL",
          calc: (w) => {
            if (w < 8) return { mg: 0, ml: "0", unit: "Avoid <6mo" };
            const mg = Math.min(w * 6.5, 250);
            const ml = mg / 50;
            const drops = Math.round(ml * 20);
            return { mg: Math.round(mg), ml: ml.toFixed(1), drops: drops, unit: "drops (50mg/mL)" };
          }
        }
      ]
    },
    {
      id: "diclofenac",
      name: "Diclofenac Sodium (Voveran / Dynapar)",
      category: "Antipyretics / Analgesics",
      rule: "1 mg/kg/dose (Adult: 50mg Tab BD/TDS, 75mg IM)",
      frequency: "Every 8 to 12 hours after food (Deep IM injection in gluteal region)",
      indications: "Acute musculoskeletal trauma, fractures, renal/ureteric colic, severe acute pain",
      notes: "Avoid IV push unless specific aqua formulation. Never give in active GI bleed or dengue.",
      keywords: "diclofenac voveran dynapar renal colic pain killer analgesic nsaid injection",
      formulations: [
        {
          type: "Injectable (Deep IM)",
          strength: "75 mg / 3 mL (25 mg/mL) or 75mg/1mL",
          calc: (w) => {
            const mg = Math.min(w * 1.0, 75);
            const ml = mg / 25;
            return { mg: Math.round(mg), ml: ml.toFixed(1), unit: "mL Deep IM (75mg/3mL)" };
          }
        },
        {
          type: "Tablet (Adult/Adolescent)",
          strength: "50 mg Tab",
          calc: (w) => {
            if (w < 35) return { mg: "Avoid", ml: "Use Syrup PCM", unit: "Adult/Adolescent Tab" };
            return { mg: "50 mg", ml: "1 Tab", unit: "PO after food BD" };
          }
        }
      ]
    },
    {
      id: "azithromycin",
      name: "Azithromycin (Azee / Azithral)",
      category: "Antibiotics",
      rule: "10 mg/kg/day OD",
      frequency: "Once daily (OD) 1 hour before or 2 hours after meals for 3 to 5 days",
      indications: "Atypical pneumonia, pertussis, enteric fever, acute streptococcal pharyngitis (penicillin allergic)",
      notes: "Give for 3 days (total 30 mg/kg) or 5 days (Day 1: 10 mg/kg, Days 2-5: 5 mg/kg).",
      keywords: "azithromycin azee azithral macrolide antibiotic typhoid pertussis cap",
      formulations: [
        {
          type: "Suspension (Regular)",
          strength: "100 mg / 5 mL (20 mg/mL)",
          calc: (w) => {
            const mg = Math.min(w * 10, 500);
            const ml = mg / 20;
            return { mg: Math.round(mg), ml: ml.toFixed(1), unit: "mL OD x 3-5d (100mg/5mL)" };
          }
        },
        {
          type: "Suspension (DS)",
          strength: "200 mg / 5 mL (40 mg/mL)",
          calc: (w) => {
            const mg = Math.min(w * 10, 500);
            const ml = mg / 40;
            return { mg: Math.round(mg), ml: ml.toFixed(1), unit: "mL OD x 3-5d (200mg/5mL)" };
          }
        }
      ]
    },
    {
      id: "cefixime",
      name: "Cefixime (Zifi / Cefolac / Taxim-O)",
      category: "Antibiotics",
      rule: "8–10 mg/kg/day divided BD",
      frequency: "Twice daily (BD) for 5–7 days (14 days for Enteric Fever)",
      indications: "Uncomplicated urinary tract infections, Enteric fever (Typhoid), otitis media, shigellosis",
      notes: "Safe in beta-lactamase producing organisms. Dose divided every 12 hours.",
      keywords: "cefixime zifi cefolac taxim o cephalosporin antibiotic typhoid uti",
      formulations: [
        {
          type: "Syrup (50mg)",
          strength: "50 mg / 5 mL (10 mg/mL)",
          calc: (w) => {
            const mgDose = (w * 8) / 2;
            const ml = mgDose / 10;
            return { mg: Math.round(mgDose), ml: ml.toFixed(1), unit: "mL BD (50mg/5mL)" };
          }
        },
        {
          type: "Syrup (100mg)",
          strength: "100 mg / 5 mL (20 mg/mL)",
          calc: (w) => {
            const mgDose = (w * 8) / 2;
            const ml = mgDose / 20;
            return { mg: Math.round(mgDose), ml: ml.toFixed(1), unit: "mL BD (100mg/5mL)" };
          }
        }
      ]
    },
    {
      id: "cefpodoxime",
      name: "Cefpodoxime Proxetil (Monocef-O / Gudcef / Doxcef)",
      category: "Antibiotics",
      rule: "10 mg/kg/day divided BD",
      frequency: "Twice daily (BD) with food for 5–10 days",
      indications: "Recurrent acute otitis media, community-acquired pneumonia, skin infections, pharyngotonsillitis",
      notes: "Third-generation cephalosporin with excellent bioavailability when taken with fatty food.",
      keywords: "cefpodoxime monocef o gudcef doxcef antibiotic cap aom",
      formulations: [
        {
          type: "Syrup (50mg)",
          strength: "50 mg / 5 mL (10 mg/mL)",
          calc: (w) => {
            const mgDose = (w * 10) / 2;
            const ml = mgDose / 10;
            return { mg: Math.round(mgDose), ml: ml.toFixed(1), unit: "mL BD (50mg/5mL)" };
          }
        },
        {
          type: "Syrup (100mg DS)",
          strength: "100 mg / 5 mL (20 mg/mL)",
          calc: (w) => {
            const mgDose = (w * 10) / 2;
            const ml = mgDose / 20;
            return { mg: Math.round(mgDose), ml: ml.toFixed(1), unit: "mL BD (100mg/5mL)" };
          }
        }
      ]
    },
    {
      id: "ceftriaxone_inj",
      name: "Inj. Ceftriaxone (Monocef / Taxim / Celdit)",
      category: "Antibiotics",
      rule: "50–100 mg/kg/day IV/IM OD/BD (Meningitis: 100 mg/kg/day BD)",
      frequency: "Slow IV infusion over 30 mins (Reconstitute with sterile water for IV or 1% Lignocaine for IM)",
      indications: "Severe sepsis, bacterial meningitis, enteric fever bacteremia, pyelonephritis, severe CAP",
      notes: "Never mix or co-infuse with Calcium-containing IV solutions (e.g. Ringer Lactate) -> fatal lung/kidney precipitate risk.",
      keywords: "ceftriaxone monocef taxim iv injection antibiotic sepsis meningitis typhoid",
      formulations: [
        {
          type: "IV / IM Vial (250mg)",
          strength: "250 mg Dry Vial",
          calc: (w) => {
            const mg = Math.min(w * 50, 2000);
            return { mg: Math.round(mg), ml: (mg/100).toFixed(1) + " mL (in 100mg/mL)", unit: "IV OD/BD" };
          }
        },
        {
          type: "IV / IM Vial (1000mg / 1g)",
          strength: "1 g (1000 mg) Dry Vial",
          calc: (w) => {
            const mg = Math.min(w * 75, 2000);
            return { mg: Math.round(mg), ml: (mg/100).toFixed(1) + " mL (1g in 10mL)", unit: "IV OD/BD" };
          }
        }
      ]
    },
    {
      id: "ciprofloxacin",
      name: "Ciprofloxacin (Cifran / Ciplox)",
      category: "Antibiotics",
      rule: "15–20 mg/kg/day divided BD (Adult: 500mg BD)",
      frequency: "Twice daily (BD) for 3–5 days in bacillary dysentery; 7–14 days in severe UTI",
      indications: "Acute invasive bacterial dysentery (Shigellosis), complicated urinary tract infections",
      notes: "Maintain adequate hydration. Give 2 hours before/after antacids or dairy.",
      keywords: "ciprofloxacin cifran ciplox fluoroquinolone shigella dysentery uti diarrhea",
      formulations: [
        {
          type: "Suspension",
          strength: "250 mg / 5 mL (50 mg/mL)",
          calc: (w) => {
            const mgDose = (w * 15) / 2;
            const ml = mgDose / 50;
            return { mg: Math.round(mgDose), ml: ml.toFixed(1), unit: "mL BD (250mg/5mL)" };
          }
        },
        {
          type: "Tablet (500mg)",
          strength: "500 mg Tablet",
          calc: (w) => {
            if (w < 35) return { mg: "Dose by wt", ml: "Use Syrup", unit: "Adult / Teen Tab" };
            return { mg: "500 mg", ml: "1 Tab", unit: "PO BD for 5 days" };
          }
        }
      ]
    },
    {
      id: "metronidazole",
      name: "Metronidazole (Flagyl / Metrogyl)",
      category: "Antibiotics",
      rule: "30–40 mg/kg/day divided TDS (Adult: 400mg TDS)",
      frequency: "Three times daily (TDS) with food for 5–7 days",
      indications: "Amoebiasis, Giardiasis, Trichomoniasis, anaerobic intra-abdominal infections, dental abscess",
      notes: "Warn patient about metallic taste and dark urine. Strictly avoid alcohol (disulfiram reaction).",
      keywords: "metronidazole flagyl metrogyl amoebiasis giardia diarrhea anaerobic dental",
      formulations: [
        {
          type: "Syrup",
          strength: "200 mg / 5 mL (40 mg/mL)",
          calc: (w) => {
            const mgDose = (w * 30) / 3;
            const ml = mgDose / 40;
            return { mg: Math.round(mgDose), ml: ml.toFixed(1), unit: "mL TDS (200mg/5mL)" };
          }
        },
        {
          type: "IV Infusion",
          strength: "500 mg / 100 mL (5 mg/mL)",
          calc: (w) => {
            const mgDose = (w * 30) / 3;
            const ml = mgDose / 5;
            return { mg: Math.round(mgDose), ml: ml.toFixed(1), unit: "mL IV TDS (500mg/100mL)" };
          }
        }
      ]
    },
    {
      id: "cotrimoxazole",
      name: "Co-trimoxazole / TMP-SMX (Septran / Bactrim)",
      category: "Antibiotics",
      rule: "8 mg/kg/day TMP + 40 mg/kg/day SMX divided BD",
      frequency: "Twice daily (BD) with plenty of water for 5 days",
      indications: "Uncomplicated UTI, Pneumocystis jirovecii prophylaxis in HIV, non-severe CAP (NLEM)",
      notes: "Contraindicated in neonates < 6 weeks (kernicterus risk) and severe G6PD deficiency.",
      keywords: "cotrimoxazole septran bactrim tmp smx trimethoprim sulfa uti pneumonia",
      formulations: [
        {
          type: "Syrup (Pediatric)",
          strength: "240 mg / 5 mL (TMP 40mg + SMX 200mg)",
          calc: (w) => {
            const tmpDose = (w * 8) / 2;
            const ml = tmpDose / 8;
            return { mg: Math.round(tmpDose * 6), ml: ml.toFixed(1), unit: "mL BD (Septran 240mg/5mL)" };
          }
        }
      ]
    },
    {
      id: "doxycycline",
      name: "Doxycycline (Doxicip / Doxy-1 / Microdox)",
      category: "Antibiotics",
      rule: "2.2–4.4 mg/kg/day (Adult: 100mg BD Day 1 -> 100mg OD/BD)",
      frequency: "Twice daily (BD) with a full glass of water, stay upright for 30 mins",
      indications: "Scrub typhus, Leptospirosis prophylaxis & treatment, Cholera, Malaria treatment/prophylaxis",
      notes: "Drug of choice for Scrub Typhus in rural India. Short courses (<14 days) safe in children under 8 years.",
      keywords: "doxycycline scrub typhus rickettsia leptospirosis cholera malaria antibiotic",
      formulations: [
        {
          type: "Capsule / Tablet",
          strength: "100 mg Cap/Tab",
          calc: (w) => {
            if (w < 25) {
              const mg = Math.round(w * 2.2);
              return { mg: mg + " mg", ml: "Approx 1/2 cap in water", unit: "BD with food" };
            } else {
              return { mg: "100 mg", ml: "1 Cap (100mg)", unit: "BD with food x 7 days" };
            }
          }
        }
      ]
    },
    {
      id: "gentamicin_inj",
      name: "Inj. Gentamicin (Genticyn / Garamycin)",
      category: "Antibiotics",
      rule: "5.0–7.5 mg/kg/day OD slow IV / IM",
      frequency: "Single daily dose (OD) infused in 50 mL NS over 30–60 mins",
      indications: "Neonatal sepsis (with Ampicillin), acute pyelonephritis, complicated intra-abdominal sepsis",
      notes: "Monitor renal function and urine output. Avoid concurrent nephrotoxic or ototoxic drugs.",
      keywords: "gentamicin genticyn aminoglycoside neonatal sepsis gram negative antibiotic",
      formulations: [
        {
          type: "Injectable (Vial)",
          strength: "80 mg / 2 mL (40 mg/mL)",
          calc: (w) => {
            const mg = w * 5.0;
            const ml = mg / 40;
            return { mg: Math.round(mg), ml: ml.toFixed(2), unit: "mL OD IV/IM (80mg/2mL)" };
          }
        }
      ]
    },
    {
      id: "ampicillin_inj",
      name: "Inj. Ampicillin (Campicillin)",
      category: "Antibiotics",
      rule: "100–200 mg/kg/day divided QID (Meningitis: up to 300–400 mg/kg/day)",
      frequency: "Every 6 hours slow IV push / infusion",
      indications: "Neonatal sepsis, Listeria/Enterococcal meningitis, severe pediatric pneumonia",
      notes: "Combine with Gentamicin for empirical neonatal sepsis coverage at PHC/FRU.",
      keywords: "ampicillin campicillin penicillin antibiotic neonatal sepsis meningitis listeria",
      formulations: [
        {
          type: "Vial (500mg)",
          strength: "500 mg Dry Vial",
          calc: (w) => {
            const mgDose = (w * 100) / 4;
            return { mg: Math.round(mgDose), ml: (mgDose/100).toFixed(1) + " mL (in 100mg/mL)", unit: "IV QID (every 6h)" };
          }
        }
      ]
    },
    {
      id: "cetirizine",
      name: "Cetirizine (Cetzine / Alerid / Okacet)",
      category: "Respiratory / Antiallergic",
      rule: "0.25 mg/kg/day or Age-based standard",
      frequency: "Once daily (OD) at bedtime",
      indications: "Allergic rhinitis, urticaria, atopic eczema itch, allergic conjunctivitis",
      notes: "Age: 6m–2y: 2.5mg OD; 2y–6y: 2.5mg BD or 5mg OD; >6y: 10mg OD.",
      keywords: "cetirizine cetzine alerid okacet allergy antihistamine cold sneezing itch",
      formulations: [
        {
          type: "Syrup",
          strength: "5 mg / 5 mL (1 mg/mL)",
          calc: (w) => {
            let mg = 2.5;
            if (w >= 15 && w < 25) mg = 5.0;
            if (w >= 25) mg = 10.0;
            return { mg: mg, ml: mg.toFixed(1), unit: "mL OD night (5mg/5mL)" };
          }
        }
      ]
    },
    {
      id: "levocetirizine",
      name: "Levocetirizine (Levocet / Teczine / 1-AL)",
      category: "Respiratory / Antiallergic",
      rule: "0.125 mg/kg/day OD at bedtime",
      frequency: "Once daily (OD) at bedtime",
      indications: "Perennial & seasonal allergic rhinitis, chronic idiopathic urticaria",
      notes: "Potent active enantiomer of cetirizine with minimal sedation.",
      keywords: "levocetirizine levocet teczine 1-al allergy rhinitis antihistamine",
      formulations: [
        {
          type: "Syrup",
          strength: "2.5 mg / 5 mL (0.5 mg/mL)",
          calc: (w) => {
            let mg = 1.25;
            if (w >= 12 && w < 25) mg = 2.5;
            if (w >= 25) mg = 5.0;
            const ml = mg / 0.5;
            return { mg: mg.toFixed(2), ml: ml.toFixed(1), unit: "mL OD night (2.5mg/5mL)" };
          }
        }
      ]
    },
    {
      id: "chlorpheniramine",
      name: "Chlorpheniramine Maleate / CPM (Avil / Piriton)",
      category: "Respiratory / Antiallergic",
      rule: "0.35 mg/kg/day divided TDS (Adult: 4mg TDS, 10-20mg IV/IM)",
      frequency: "Every 8 hours (TDS)",
      indications: "Acute urticaria, pruritus, drug reaction, insect stings, mild allergic reactions",
      notes: "First generation sedating antihistamine. Useful for nighttime itch relief in eczema.",
      keywords: "cpm avil chlorpheniramine piriton allergy rash reaction insect sting",
      formulations: [
        {
          type: "Syrup",
          strength: "2 mg / 5 mL (0.4 mg/mL)",
          calc: (w) => {
            const mgDose = (w * 0.35) / 3;
            const ml = mgDose / 0.4;
            return { mg: mgDose.toFixed(1), ml: ml.toFixed(1), unit: "mL TDS (2mg/5mL)" };
          }
        },
        {
          type: "Injectable (Vial/Amp)",
          strength: "10 mg / 1 mL or 22.75mg/mL",
          calc: (w) => {
            const mg = Math.min((w * 0.35) / 3, 10);
            return { mg: mg.toFixed(1), ml: (mg/10).toFixed(2), unit: "mL slow IM/IV stat" };
          }
        }
      ]
    },
    {
      id: "zinc_ors",
      name: "Zinc Sulfate & ORS (WHO Diarrhea Protocol)",
      category: "Antiemetics / GI",
      rule: "Age-stratified daily supplementation for 14 continuous days",
      frequency: "Daily for 14 days + ORS after each loose stool",
      indications: "Acute watery diarrhea to reduce duration, severity, and prevent recurrence for 3 months",
      notes: "Give dispersible tablet in 5 mL breastmilk or clean water.",
      keywords: "zinc ors diarrhea dehydration electrolyte hydration who protocol",
      formulations: [
        {
          type: "Dispersible Tablet / Syrup",
          strength: "20 mg elemental Zinc DT",
          calc: (w) => {
            if (w < 7) {
              return { mg: "10 mg", ml: "Half Tab (10mg)", unit: "OD x 14 days (<6 months)" };
            } else {
              return { mg: "20 mg", ml: "1 Full Tab (20mg)", unit: "OD x 14 days (>=6 months)" };
            }
          }
        }
      ]
    },
    {
      id: "domperidone",
      name: "Domperidone (Domstal / Motilium)",
      category: "Antiemetics / GI",
      rule: "0.25–0.5 mg/kg/dose TDS (Max 1 mg/kg/day)",
      frequency: "Every 8 hours 15–30 minutes before meals",
      indications: "Post-prandial fullness, gastroesophageal reflux, nausea, delayed gastric emptying",
      notes: "Prokinetic agent. Use with caution in cardiac arrhythmia or QT prolongation.",
      keywords: "domperidone domstal prokinetic vomiting reflux gerd nausea",
      formulations: [
        {
          type: "Drops",
          strength: "10 mg / 1 mL",
          calc: (w) => {
            const mg = Math.min(w * 0.3, 10);
            const ml = mg / 10;
            const drops = Math.round(ml * 20);
            return { mg: mg.toFixed(1), ml: ml.toFixed(2), drops: drops, unit: "drops (10mg/mL)" };
          }
        },
        {
          type: "Syrup",
          strength: "5 mg / 5 mL (1 mg/mL)",
          calc: (w) => {
            const mg = Math.min(w * 0.3, 10);
            return { mg: mg.toFixed(1), ml: mg.toFixed(1), unit: "mL TDS before food (5mg/5mL)" };
          }
        }
      ]
    },
    {
      id: "pantoprazole",
      name: "Pantoprazole (Pan / Pantocid)",
      category: "Antiemetics / GI",
      rule: "1 mg/kg/day OD (Adult: 40mg OD/BD)",
      frequency: "Once daily in morning 30 minutes before breakfast (IV over 15 mins)",
      indications: "Upper GI bleeding, peptic ulcer disease, severe GERD, stress ulcer prophylaxis",
      notes: "Proton pump inhibitor (PPI). Reconstitute 40mg vial in 10 mL NS for IV injection.",
      keywords: "pantoprazole pan pantocid ppi antacid gi bleed acidity ulcer gastritis",
      formulations: [
        {
          type: "Injectable (Vial)",
          strength: "40 mg Vial (in 10 mL NS)",
          calc: (w) => {
            const mg = Math.min(w * 1.0, 40);
            const ml = (mg / 4).toFixed(1);
            return { mg: Math.round(mg), ml: ml + " mL (40mg/10mL)", unit: "IV OD morning" };
          }
        },
        {
          type: "Tablet (Adult/Child >5y)",
          strength: "40 mg / 20 mg Tab",
          calc: (w) => {
            if (w < 20) return { mg: "20 mg", ml: "1/2 Tab (20mg)", unit: "OD morning empty stomach" };
            return { mg: "40 mg", ml: "1 Tab (40mg)", unit: "OD morning empty stomach" };
          }
        }
      ]
    },
    {
      id: "lactulose",
      name: "Lactulose (Duphalac / Looz)",
      category: "Antiemetics / GI",
      rule: "1 mL/kg/day divided BD (Titrate to 2–3 soft stools/day)",
      frequency: "Twice daily with meals or fruit juice",
      indications: "Chronic pediatric functional constipation, hepatic encephalopathy",
      notes: "Osmotic laxative. Safe for long-term maintenance. Ensure generous water intake.",
      keywords: "lactulose duphalac looz constipation laxative stool softener hepatic",
      formulations: [
        {
          type: "Syrup",
          strength: "10 g / 15 mL (3.33 g/5 mL)",
          calc: (w) => {
            const mlDose = (w * 1.0) / 2;
            return { mg: Math.round(mlDose * 0.67) + "g", ml: mlDose.toFixed(1), unit: "mL BD with water" };
          }
        }
      ]
    },
    {
      id: "dicyclomine_mefenamic",
      name: "Dicyclomine + Simethicone (Colimex / Cyclopam)",
      category: "Antiemetics / GI",
      rule: "0.5 mg/kg/dose Dicyclomine TDS SOS",
      frequency: "Every 8 hours SOS for acute spasmodic pain / infantile colic",
      indications: "Infantile colic, spasmodic intestinal cramps, irritable bowel spasm",
      notes: "Contraindicated in infants < 6 months (apnea / anticholinergic risk).",
      keywords: "dicyclomine colimex cyclopam infantile colic spasm stomach pain simethicone",
      formulations: [
        {
          type: "Drops",
          strength: "10 mg Dicyclomine + 40 mg Simethicone / 1 mL",
          calc: (w) => {
            if (w < 7) return { mg: 0, ml: "0 (Avoid <6mo)", unit: "Contraindicated <6mo" };
            const mg = Math.min(w * 0.5, 10);
            const ml = mg / 10;
            const drops = Math.round(ml * 20);
            return { mg: mg.toFixed(1), ml: ml.toFixed(2), drops: drops, unit: "drops SOS" };
          }
        },
        {
          type: "Syrup",
          strength: "10 mg Dicyclomine / 5 mL",
          calc: (w) => {
            if (w < 7) return { mg: 0, ml: "0", unit: "Contraindicated <6mo" };
            const mg = Math.min(w * 0.5, 20);
            const ml = mg / 2;
            return { mg: mg.toFixed(1), ml: ml.toFixed(1), unit: "mL TDS SOS (10mg/5mL)" };
          }
        }
      ]
    },
    {
      id: "salbutamol",
      name: "Salbutamol (Asthalin / Ventorlin)",
      category: "Respiratory / Antiallergic",
      rule: "Oral: 0.15 mg/kg/dose TDS | Neb: 0.03 mL/kg/dose (min 0.3ml, max 1.0ml)",
      frequency: "Nebulization every 20 mins for 3 doses in acute wheeze; Oral TDS",
      indications: "Acute asthma exacerbation, viral wheeze, bronchospasm",
      notes: "In acute severe asthma, nebulize with 100% Oxygen at 6–8 L/min.",
      keywords: "salbutamol asthalin ventorlin bronchodilator asthma wheezing nebulization cough",
      formulations: [
        {
          type: "Respirator Soln for Nebulization",
          strength: "5 mg / 1 mL (5000 mcg/mL)",
          calc: (w) => {
            const ml = Math.max(0.3, Math.min(w * 0.03, 1.0));
            return { mg: (ml * 5).toFixed(1), ml: ml.toFixed(2), unit: "mL + 3mL NS for Nebulization" };
          }
        },
        {
          type: "Syrup",
          strength: "2 mg / 5 mL (0.4 mg/mL)",
          calc: (w) => {
            const mg = Math.min(w * 0.15, 4.0);
            const ml = mg / 0.4;
            return { mg: mg.toFixed(1), ml: ml.toFixed(1), unit: "mL TDS (2mg/5mL)" };
          }
        }
      ]
    },
    {
      id: "budesonide_respules",
      name: "Budesonide Respules (Budecort / Pulmicort)",
      category: "Respiratory / Antiallergic",
      rule: "0.5 mg to 1.0 mg per nebulization session",
      frequency: "Twice daily (BD) nebulization in acute asthma / Croup (1–2 mg STAT in Croup)",
      indications: "Acute croup (laryngotracheobronchitis), persistent bronchial asthma, acute wheeze",
      notes: "Inhaled corticosteroid (ICS). Rinse child's mouth or wipe face with wet cloth after nebulization to prevent oral thrush.",
      keywords: "budesonide budecort pulmicort respules nebulization croup asthma steroids",
      formulations: [
        {
          type: "Respules (0.5mg)",
          strength: "0.5 mg / 2 mL Respule",
          calc: (w) => {
            if (w < 10) return { mg: "0.5 mg", ml: "1 Respule (2mL)", unit: "Nebulize BD" };
            return { mg: "1.0 mg", ml: "2 Respules (4mL)", unit: "Nebulize BD" };
          }
        },
        {
          type: "Respules (1.0mg Forte)",
          strength: "1.0 mg / 2 mL Respule",
          calc: (w) => {
            return { mg: "1.0 mg", ml: "1 Respule (2mL)", unit: "Nebulize BD in acute croup/asthma" };
          }
        }
      ]
    },
    {
      id: "ipratropium_respules",
      name: "Ipratropium Bromide (Ipravent / Duolin Component)",
      category: "Respiratory / Antiallergic",
      rule: "250 mcg (<20kg) to 500 mcg (>=20kg) per nebulization",
      frequency: "Every 20 mins for 3 doses in severe acute asthma, then every 4–6 hours",
      indications: "Severe acute asthma exacerbation unresponsive to Salbutamol alone, COPD bronchospasm",
      notes: "Anticholinergic bronchodilator. Synergistic when mixed with Salbutamol (Duolin regimen).",
      keywords: "ipratropium ipravent duolin nebulization anticholinergic asthma bronchospasm",
      formulations: [
        {
          type: "Respules for Nebulization",
          strength: "250 mcg / 2 mL or 500 mcg / 2 mL",
          calc: (w) => {
            if (w < 20) return { mg: "250 mcg", ml: "1 Respule (2mL)", unit: "Nebulize with Salbutamol" };
            return { mg: "500 mcg", ml: "1 Respule (2mL)", unit: "Nebulize with Salbutamol" };
          }
        }
      ]
    },
    {
      id: "prednisolone",
      name: "Prednisolone (Omnacortil / Wysolone)",
      category: "Respiratory / Antiallergic",
      rule: "1–2 mg/kg/day (Max 40–60 mg/day)",
      frequency: "Once daily (OD) in morning with breakfast for 3–5 days (No taper needed if <= 5 days)",
      indications: "Acute asthma exacerbation, croup (laryngotracheobronchitis), nephrotic syndrome, severe allergic reactions",
      notes: "Give with milk or food to avoid gastric irritation. Do not use in active untreated varicella/measles.",
      keywords: "prednisolone omnacortil wysolone steroid croup asthma allergy nephrotic",
      formulations: [
        {
          type: "Syrup",
          strength: "5 mg / 5 mL (1 mg/mL)",
          calc: (w) => {
            const mg = Math.min(w * 1.5, 40);
            return { mg: mg.toFixed(1), ml: mg.toFixed(1), unit: "mL OD (5mg/5mL)" };
          }
        },
        {
          type: "Dispersible Tablet (10mg / 20mg)",
          strength: "10 mg / 20 mg DT",
          calc: (w) => {
            const mg = Math.min(w * 1.5, 60);
            const tabs = (mg / 10).toFixed(1);
            return { mg: Math.round(mg), ml: tabs + " Tab (10mg DT)", unit: "OD morning with milk" };
          }
        }
      ]
    },
    {
      id: "hydrocortisone_inj",
      name: "Inj. Hydrocortisone (Efcorlin / Primacort)",
      category: "Emergency & Anticonvulsant",
      rule: "4 mg/kg slow IV STAT bolus (then 2–4 mg/kg Q6H)",
      frequency: "STAT in anaphylaxis, severe status asthmaticus, acute adrenal crisis, septic shock",
      indications: "Anaphylaxis, severe asthma, Addisonian crisis, septic shock vasopressor refractory",
      notes: "Rapid onset systemic glucocorticoid. Reconstitute with 2 mL sterile water.",
      keywords: "hydrocortisone efcorlin primacort steroid anaphylaxis emergency shock asthma",
      formulations: [
        {
          type: "Injectable (Vial)",
          strength: "100 mg Vial (in 2 mL sterile water = 50 mg/mL)",
          calc: (w) => {
            const mg = Math.min(w * 4, 200);
            const ml = mg / 50;
            return { mg: Math.round(mg), ml: ml.toFixed(1), unit: "mL slow IV STAT (100mg/2mL)" };
          }
        }
      ]
    },
    {
      id: "dexamethasone_inj",
      name: "Inj. Dexamethasone (Decadron / Dexona)",
      category: "Emergency & Anticonvulsant",
      rule: "0.15–0.6 mg/kg/dose IV/IM/Oral (Max 10 mg/dose)",
      frequency: "Single STAT dose in Croup (0.6 mg/kg); BD for cerebral edema / antiemetic",
      indications: "Viral croup, cerebral edema, severe laryngitis, bacterial meningitis (prior to 1st antibiotic dose)",
      notes: "Longest acting steroid (biological half-life 36–54 hours). Single oral/IM dose effective for croup.",
      keywords: "dexamethasone decadron dexona steroid croup meningitis cerebral edema",
      formulations: [
        {
          type: "Injectable (Vial/Amp)",
          strength: "4 mg / 1 mL or 8 mg / 2 mL",
          calc: (w) => {
            const mg = Math.min(w * 0.3, 10);
            const ml = mg / 4;
            return { mg: mg.toFixed(1), ml: ml.toFixed(2), unit: "mL IV/IM STAT (4mg/mL)" };
          }
        }
      ]
    },
    {
      id: "albendazole",
      name: "Albendazole (Zentel / Bandy / Deworming)",
      category: "Antiemetics / GI",
      rule: "Age-stratified single dose (National Deworming Day / NLEM)",
      frequency: "Single stat dose with evening meal (Repeat after 2 weeks in heavy enterobiasis)",
      indications: "Soil-transmitted helminths (Ascaris, Hookworm, Trichuris, Enterobius)",
      notes: "Contraindicated in children < 1 year. Safe in > 1 year.",
      keywords: "albendazole zentel bandy deworming worms ascaris pinworm parasites",
      formulations: [
        {
          type: "Suspension",
          strength: "400 mg / 10 mL (or 200mg/5mL)",
          calc: (w) => {
            if (w < 10) {
              return { mg: "200 mg", ml: "5.0 mL", unit: "Single Dose (Age 1–2 yrs)" };
            } else {
              return { mg: "400 mg", ml: "10.0 mL", unit: "Single Dose (Age >2 yrs / Adult)" };
            }
          }
        }
      ]
    },
    {
      id: "midazolam_emergency",
      name: "Inj. Midazolam (Mezolam / Emergency Seizure Control)",
      category: "Emergency & Anticonvulsant",
      rule: "0.2 mg/kg Intranasal / Buccal OR 0.1 mg/kg slow IV",
      frequency: "STAT dose for active convulsion lasting > 5 mins",
      indications: "Status epilepticus, febrile convulsion, acute seizure termination",
      notes: "Have Bag-Valve-Mask and O2 ready. If IV access not present, give intranasal via syringe without needle.",
      keywords: "midazolam mezolam seizure convulsion fits epilepsy status epilepticus emergency",
      formulations: [
        {
          type: "Injectable / Intranasal (1mg/mL)",
          strength: "1 mg / 1 mL or 5 mg / 5 mL",
          calc: (w) => {
            const mg = Math.min(w * 0.2, 10.0);
            return { mg: mg.toFixed(1), ml: mg.toFixed(1), unit: "mL Intranasal / Buccal STAT" };
          }
        }
      ]
    },
    {
      id: "diazepam_inj",
      name: "Inj. Diazepam (Calmpose / Valium)",
      category: "Emergency & Anticonvulsant",
      rule: "0.2–0.3 mg/kg slow IV (Max 10 mg) OR 0.5 mg/kg per-rectal",
      frequency: "STAT for prolonged active seizures (> 5 mins) or severe tetanus spasm",
      indications: "Acute epileptic seizure, febrile convulsions, alcohol withdrawal delirium, skeletal muscle spasm",
      notes: "Administer slow IV over 2–3 mins (undiluted). Monitor respiratory rate; have Ambu bag ready for apnea.",
      keywords: "diazepam calmpose valium seizure fits convulsion sedation sedative",
      formulations: [
        {
          type: "Injectable (Ampoule)",
          strength: "10 mg / 2 mL (5 mg/mL)",
          calc: (w) => {
            const mg = Math.min(w * 0.25, 10.0);
            const ml = mg / 5;
            return { mg: mg.toFixed(1), ml: ml.toFixed(2), unit: "mL slow IV over 3 mins (5mg/mL)" };
          }
        }
      ]
    },
    {
      id: "phenytoin_inj",
      name: "Inj. Phenytoin Sodium (Eptoin / Dilantin)",
      category: "Emergency & Anticonvulsant",
      rule: "15–20 mg/kg IV loading dose (Max 1000 mg) at max 1 mg/kg/min (Max 50 mg/min)",
      frequency: "Loading dose diluted strictly in Normal Saline (NS) over 20–30 mins under continuous ECG monitoring",
      indications: "Second-line therapy for status epilepticus unresponsive to benzodiazepines",
      notes: "CRITICAL: Never dilute in Dextrose (causes rapid crystal precipitation). Never give IM (causes tissue necrosis/purple glove syndrome).",
      keywords: "phenytoin eptoin dilantin status epilepticus seizure loading dose anticonvulsant",
      formulations: [
        {
          type: "Injectable (Vial)",
          strength: "100 mg / 2 mL (50 mg/mL)",
          calc: (w) => {
            const mg = Math.min(w * 20, 1000);
            const ml = mg / 50;
            return { mg: Math.round(mg), ml: ml.toFixed(1) + " mL (in 100 mL NS)", unit: "IV infusion over 20 mins" };
          }
        }
      ]
    },
    {
      id: "sodium_valproate",
      name: "Sodium Valproate (Valparin / Encorate)",
      category: "Emergency & Anticonvulsant",
      rule: "20–30 mg/kg/day divided BD (Loading: 20–40 mg/kg IV over 10 mins)",
      frequency: "Twice daily (BD) with meals",
      indications: "Generalized tonic-clonic, absence, myoclonic seizures; alternative second-line in status epilepticus",
      notes: "Contraindicated in suspected mitochondrial disorders and active liver disease.",
      keywords: "valproate valparin encorate seizure epilepsy anticonvulsant fits",
      formulations: [
        {
          type: "Syrup",
          strength: "200 mg / 5 mL (40 mg/mL)",
          calc: (w) => {
            const mgDose = (w * 20) / 2;
            const ml = mgDose / 40;
            return { mg: Math.round(mgDose), ml: ml.toFixed(1), unit: "mL BD (200mg/5mL)" };
          }
        }
      ]
    },
    {
      id: "furosemide_lasix",
      name: "Inj. Furosemide (Lasix / Frusenex)",
      category: "Emergency & Anticonvulsant",
      rule: "1–2 mg/kg/dose slow IV (Max 40–80 mg)",
      frequency: "Every 6 to 12 hours as needed for fluid overload",
      indications: "Acute pulmonary edema, congestive heart failure, acute glomerulonephritis with hypertension / oliguria",
      notes: "Loop diuretic. Check serum potassium and BP; watch for severe volume depletion.",
      keywords: "furosemide lasix diuretic pulmonary edema heart failure fluid overload hypertension",
      formulations: [
        {
          type: "Injectable (Ampoule)",
          strength: "20 mg / 2 mL (10 mg/mL)",
          calc: (w) => {
            const mg = Math.min(w * 1.0, 40);
            const ml = mg / 10;
            return { mg: Math.round(mg), ml: ml.toFixed(1), unit: "mL slow IV over 2 mins (10mg/mL)" };
          }
        }
      ]
    },
    {
      id: "dextrose_25_inj",
      name: "Inj. 25% Dextrose (D25 / Acute Hypoglycemia)",
      category: "Emergency & Anticonvulsant",
      rule: "2–4 mL/kg IV bolus (Rule of 50: % Dextrose x mL/kg = 50 -> 25% x 2mL/kg = 50)",
      frequency: "STAT IV bolus over 3–5 minutes for RBS < 54 mg/dL",
      indications: "Acute symptomatic hypoglycemia, coma of unknown origin, neonatal hypoglycemia (use 10% Dextrose 2-5 mL/kg)",
      notes: "Follow immediately with continuous 10% Dextrose infusion to prevent rebound hypoglycemia.",
      keywords: "dextrose d25 hypoglycemia low blood sugar coma rbs emergency",
      formulations: [
        {
          type: "Injectable (Vial)",
          strength: "25% Dextrose (250 mg/mL)",
          calc: (w) => {
            const ml = Math.min(w * 2.0, 100);
            const mg = ml * 250;
            return { mg: (mg/1000).toFixed(1) + "g", ml: ml.toFixed(1), unit: "mL IV push STAT over 3 mins" };
          }
        }
      ]
    },
    {
      id: "calcium_gluconate_10",
      name: "Inj. 10% Calcium Gluconate (Antidote & Hypocalcemia)",
      category: "Emergency & Anticonvulsant",
      rule: "1 mL/kg (0.5–1.0 mL/kg) slow IV over 10–15 minutes (Max 10 mL / 1g)",
      frequency: "STAT under continuous heart rate monitoring (stop if bradycardia occurs)",
      indications: "Acute hypocalcemic tetany/seizures, severe hyperkalemia cardiac membrane stabilization, Magnesium sulfate toxicity antidote",
      notes: "Never give IM or SC (causes severe tissue necrosis). Never mix with Ceftriaxone or Bicarbonate.",
      keywords: "calcium gluconate hyperkalemia tetany mgso4 toxicity antidote emergency",
      formulations: [
        {
          type: "Injectable (Ampoule)",
          strength: "10% Solution (100 mg/mL = 9.3 mg elemental Ca/mL)",
          calc: (w) => {
            const ml = Math.min(w * 1.0, 10.0);
            return { mg: Math.round(ml * 100) + " mg", ml: ml.toFixed(1), unit: "mL slow IV in equal vol NS over 10m" };
          }
        }
      ]
    },
    {
      id: "iron_folic_acid",
      name: "Iron & Folic Acid (IFA) Syrup (Anemia Mukt Bharat)",
      category: "Govt Programs & Vitamins",
      rule: "1 mL bi-weekly (Contains 20mg Elemental Iron + 100mcg Folic Acid)",
      frequency: "Bi-weekly (e.g. Monday & Thursday) after meals with vitamin C / fruit juice",
      indications: "Prophylaxis and treatment of iron deficiency anemia in children 6–59 months (Govt National Program)",
      notes: "Use auto-dispenser. Do not give with milk or tea. Stools will turn dark green/black (inform mother to prevent panic).",
      keywords: "ifa iron folic acid anemia mukt bharat syrup vitamins national program",
      formulations: [
        {
          type: "Govt Supply Syrup (with auto-dispenser)",
          strength: "20 mg Elemental Iron + 100 mcg Folic Acid / 1 mL",
          calc: (w) => {
            return { mg: "20 mg Fe + 100 mcg FA", ml: "1.0", unit: "mL bi-weekly (AMB Program)" };
          }
        }
      ]
    },
    {
      id: "vitamin_a",
      name: "Vitamin A Solution (National Blindness Control Program)",
      category: "Govt Programs & Vitamins",
      rule: "Age-stratified single mega-dose (NVBDCP / National Immunization Schedule)",
      frequency: "Single oral mega-dose every 6 months from 9 months to 5 years (Total 9 doses)",
      indications: "Prevention of nutritional blindness, Bitot's spots, xerophthalmia, measles adjunct treatment",
      notes: "Dose: 100,000 IU (1 mL) at 9 months with Measles vaccine; 200,000 IU (2 mL) every 6 months thereafter.",
      keywords: "vitamin a xerophthalmia bitots spots blindness measles national program",
      formulations: [
        {
          type: "Oily Solution (Govt Supply Spoon/Dropper)",
          strength: "100,000 IU / 1 mL (200,000 IU / 2 mL)",
          calc: (w) => {
            if (w < 8) {
              return { mg: "100,000 IU", ml: "1.0 mL (Half spoon)", unit: "Oral STAT (<12 months / <8kg)" };
            } else {
              return { mg: "200,000 IU", ml: "2.0 mL (Full spoon)", unit: "Oral STAT (>=12 months / >=8kg)" };
            }
          }
        }
      ]
    },
    {
      id: "vitamin_d3",
      name: "Vitamin D3 / Cholecalciferol (D-3 Must / Ultra-D3)",
      category: "Govt Programs & Vitamins",
      rule: "Infant Prophylaxis: 400 IU/day | Treatment of Rickets: 2000–5000 IU/day or 60,000 IU weekly x 6w",
      frequency: "Daily drops for infants; weekly sachet for deficiency in older children",
      indications: "Prevention and treatment of nutritional rickets, hypocalcemia, osteomalacia",
      notes: "All exclusively breastfed infants require 400 IU/day from birth until 1 year of age.",
      keywords: "vitamin d3 cholecalciferol rickets calcium drops bones sachet",
      formulations: [
        {
          type: "Pediatric Drops (400 IU/mL)",
          strength: "400 IU / 1 mL",
          calc: (w) => {
            return { mg: "400 IU", ml: "1.0 mL", unit: "OD daily prophylaxis" };
          }
        },
        {
          type: "Drops (800 IU/mL Forte)",
          strength: "800 IU / 1 mL",
          calc: (w) => {
            return { mg: "400 IU", ml: "0.5 mL", unit: "OD daily prophylaxis" };
          }
        },
        {
          type: "Sachet (60,000 IU)",
          strength: "60,000 IU Granules Sachet",
          calc: (w) => {
            if (w < 15) return { mg: "Use Drops", ml: "Drops preferred", unit: "Use pediatric drops" };
            return { mg: "60,000 IU", ml: "1 Sachet in milk", unit: "Once weekly x 6 weeks" };
          }
        }
      ]
    },
    {
      id: "calcium_syrup",
      name: "Calcium Carbonate + Vit D3 (Ostocalcium / Shelcal)",
      category: "Govt Programs & Vitamins",
      rule: "250–500 mg Elemental Calcium / day",
      frequency: "Twice daily (BD) after food",
      indications: "Growing children dietary calcium supplementation, hypocalcemia, rickets recovery",
      notes: "Give with meals for optimal absorption. Separate from iron syrup by at least 2 hours.",
      keywords: "calcium shelcal ostocalcium rickets bones teeth supplement",
      formulations: [
        {
          type: "Suspension",
          strength: "250 mg Calcium + 125 IU D3 / 5 mL",
          calc: (w) => {
            const ml = w < 12 ? 2.5 : 5.0;
            return { mg: (ml * 50) + " mg", ml: ml.toFixed(1), unit: "mL BD after food" };
          }
        }
      ]
    },
    {
      id: "permethrin_lotion",
      name: "Permethrin 5% Lotion / Cream (Scabper / Permite)",
      category: "Dermatology & Topicals",
      rule: "Single whole-body application from neck down to toes",
      frequency: "Apply at bedtime, leave for 8–12 hours, then wash with warm water. Repeat after 7 days.",
      indications: "Scabies (Sarcoptes scabiei) infestation, body lice",
      notes: "CRITICAL: Treat all household contacts simultaneously. Wash all clothes/bedding in hot water.",
      keywords: "permethrin scabper permite scabies itch night itching dermatology skin",
      formulations: [
        {
          type: "Lotion / Cream (5%)",
          strength: "5% w/v (30g / 50mL bottle)",
          calc: (w) => {
            return { mg: "5% Lotion", ml: "1 Application", unit: "Apply neck-to-toes overnight" };
          }
        }
      ]
    },
    {
      id: "clotrimazole_cream",
      name: "Clotrimazole 1% Cream (Candid / Canesten)",
      category: "Dermatology & Topicals",
      rule: "Apply thin layer to affected area BD",
      frequency: "Twice daily (BD) for 2 to 4 weeks (continue 1 week after clinical clearing)",
      indications: "Candidal diaper dermatitis (napkin rash), Tinea cruris (jock itch), Tinea corporis (ringworm), Tinea pedis",
      notes: "Keep affected skin folds clean and dry. In diaper rash, expose skin to air as much as possible.",
      keywords: "clotrimazole candid canesten antifungal fungal ringworm diaper rash tinea",
      formulations: [
        {
          type: "Dermal Cream (1%)",
          strength: "1% w/w (20g / 30g tube)",
          calc: (w) => {
            return { mg: "1% Cream", ml: "Thin film", unit: "Apply BD locally x 2–3 weeks" };
          }
        }
      ]
    },
    {
      id: "calamine_lotion",
      name: "Calamine Lotion USP (Caladryl / Lacto Calamine)",
      category: "Dermatology & Topicals",
      rule: "Apply locally with cotton wool TDS SOS",
      frequency: "3–4 times daily as needed for soothing itch relief",
      indications: "Prickly heat (Miliaria rubra), chickenpox vesicles itch, insect bites, contact dermatitis",
      notes: "Shake bottle well before application. Do not apply on open broken weeping skin.",
      keywords: "calamine caladryl prickly heat insect bite chickenpox itch soothing rash",
      formulations: [
        {
          type: "Lotion",
          strength: "Calamine 8% + Zinc Oxide 8% (100mL)",
          calc: (w) => {
            return { mg: "Topical", ml: "As required", unit: "Apply locally TDS with cotton" };
          }
        }
      ]
    },
    {
      id: "silver_sulfadiazine",
      name: "Silver Sulfadiazine 1% Cream (Silverex / Silvadene)",
      category: "Dermatology & Topicals",
      rule: "Apply 1–2 mm sterile layer over burn wound",
      frequency: "1–2 times daily after gentle cleaning of burn surface",
      indications: "Topical antimicrobial prophylaxis in 2nd and 3rd degree burn wounds",
      notes: "Contraindicated in neonates < 2 months and pregnant women at term (kernicterus risk).",
      keywords: "silver sulfadiazine silverex silvadene burn wound dressing burn cream",
      formulations: [
        {
          type: "Burn Cream (1%)",
          strength: "1% w/w (250g / 500g jar)",
          calc: (w) => {
            return { mg: "1% Cream", ml: "1-2 mm layer", unit: "Apply sterile layer under gauze" };
          }
        }
      ]
    },
    {
      id: "mupirocin_ointment",
      name: "Mupirocin 2% Ointment (T-Bact / Bactroban)",
      category: "Dermatology & Topicals",
      rule: "Apply small amount to lesion TDS",
      frequency: "Three times daily (TDS) for 5 to 7 days",
      indications: "Primary bacterial skin infections (Impetigo contagiosa, folliculitis, furunculosis)",
      notes: "Active against MRSA and Streptococcus pyogenes. Clean crusts gently with warm saline before applying.",
      keywords: "mupirocin t-bact bactroban impetigo boil furuncle bacterial skin infection ointment",
      formulations: [
        {
          type: "Topical Ointment (2%)",
          strength: "2% w/w (5g / 15g tube)",
          calc: (w) => {
            return { mg: "2% Ointment", ml: "Pea-sized", unit: "Apply TDS locally x 5-7 days" };
          }
        }
      ]
    },
    {
      id: "povidone_iodine_oint",
      name: "Povidone Iodine 5% / 10% (Betadine / Cipladine)",
      category: "Dermatology & Topicals",
      rule: "Apply directly to wound surface or dressing",
      frequency: "Once daily or during every sterile dressing change",
      indications: "Antiseptic prophylaxis & treatment of infected traumatic wounds, cuts, abrasions, surgical incisions",
      notes: "Do not use in patients with known iodine hypersensitivity. In neonates, prolonged large area use can cause hypothyroidism.",
      keywords: "betadine cipladine povidone iodine antiseptic wound dressing cuts abrasions",
      formulations: [
        {
          type: "Ointment (5%)",
          strength: "5% w/w Ointment (20g tube)",
          calc: (w) => {
            return { mg: "5% Ointment", ml: "Apply on gauze", unit: "Apply locally with sterile dressing" };
          }
        },
        {
          type: "Solution (10% Liquid)",
          strength: "10% w/v Liquid (100mL)",
          calc: (w) => {
            return { mg: "10% Soln", ml: "Clean wound", unit: "Antiseptic wound painting" };
          }
        }
      ]
    }
  ],


  // CASUALTY & EMERGENCY PROTOCOLS (ICMR STWs)
  emergencies: [
    {
      id: "snakebite",
      title: "Snakebite & Envenomation Protocol",
      subtitle: "National Snakebite Protocol (DGHS / ICMR STW)",
      severity: "CRITICAL",
      overview: "Standardized 15-minute emergency stabilization for Neurotoxic (Krait/Cobra) and Vasculotoxic (Russell's/Saw-scaled Viper) bites at PHC/CHC.",
      steps: [
        {
          time: "0 – 5 min",
          title: "Immediate Triage & 20WBCT",
          actions: [
            "Keep patient calm, remove tight rings, bangles, or tight tourniquets (do not release tourniquet abruptly if already on; start IV line first!).",
            "Immobilize bitten limb with a splint at heart level. Do NOT incise, suck, or apply potassium permanganate.",
            "Draw 2 mL venous blood into clean, dry, new glass test tube for 20WBCT (20-Minute Whole Blood Clotting Test). Leave undisturbed for 20 mins."
          ]
        },
        {
          time: "5 – 15 min",
          title: "Anti-Snake Venom (ASV) Administration",
          actions: [
            "INDICATIONS FOR ASV: Non-clotting blood at 20WBCT, spontaneous bleeding, ptosis/diplopia/dysphagia, progressive local swelling crossing half limb, shock/hypotension.",
            "DOSE: 10 Vials of Lyophilized Polyvalent ASV reconstituted in 500 mL Normal Saline (or 10 mL/kg in children). Infuse IV over 1 hour.",
            "PRE-MEDICATION: Have Inj. Adrenaline (1:1000) 0.5 mL ready at bedside for anaphylactoid reaction. (Do not routinely give hydrocortisone/Avil unless reaction develops).",
            "NEUROTOXIC SPECIAL: If ptosis/bulbar weakness present, give 'Neostigmine Test': Inj. Atropine 0.6mg IV followed by Inj. Neostigmine 1.5mg IV (or 0.04mg/kg in children). Repeat neostigmine 0.5mg every 30 mins if positive response."
          ]
        },
        {
          time: "Referral",
          title: "Safe Referral Stabilization",
          actions: [
            "If respiratory failure ensues in neurotoxic bite: perform endotracheal intubation or continuous Ambu Bag-Valve ventilation with 100% O2 during ambulance transport.",
            "Document 1st dose of ASV time, 20WBCT result, and vitals on the standard referral slip."
          ]
        }
      ],
      quickDoses: [
        { drug: "Polyvalent ASV", dose: "10 Vials in 500 mL NS IV over 60 mins" },
        { drug: "Inj. Adrenaline (1:1000)", dose: "0.5 mL IM anterolateral thigh (Anaphylaxis)" },
        { drug: "Inj. Atropine + Neostigmine", dose: "Atropine 0.6mg IV + Neostigmine 1.5mg IV (Neurotoxic)" },
        { drug: "Inj. Tetanus Toxoid (TT)", dose: "0.5 mL IM stat (after stabilization)" }
      ]
    },
    {
      id: "op_poisoning",
      title: "Organophosphate (OP) Poisoning Protocol",
      subtitle: "AIIMS / ICMR Standard Treatment Workflow",
      severity: "CRITICAL",
      overview: "Cholinergic toxidrome management (SLUDGE/DUMBELS: Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis, Bronchospasm, Miosis, Bradycardia).",
      steps: [
        {
          time: "0 – 5 min",
          title: "Decontamination & Airway Protection",
          actions: [
            "Protect health staff: wear gloves and plastic apron (skin absorption risk).",
            "Strip all clothes into plastic bag; wash skin thoroughly with soap and copious water.",
            "Suction copious oral/tracheobronchial secretions. Provide 100% Oxygen via face mask.",
            "Avoid gastric lavage if patient is drowsy/unconscious without prior cuffed endotracheal intubation (high aspiration pneumonitis death rate)."
          ]
        },
        {
          time: "5 – 15 min",
          title: "Target-Driven Atropinization (The Doubling Protocol)",
          actions: [
            "INITIAL DOSE: Inj. Atropine 1.8 mg to 3.0 mg (3–5 ampoules of 0.6mg) IV bolus immediately.",
            "RE-EVALUATE AT 5 MINS: Check 5 Target Endpoints of Full Atropinization:",
            "  1. Clear chest (no crepitations/rhonchi/bronchorrhea)",
            "  2. Heart Rate > 80 bpm",
            "  3. Systolic BP > 90 mmHg",
            "  4. Dry axillae / skin",
            "  5. Pupils dilated (mydriasis)",
            "DOUBLING RULE: If chest is still wet after 5 mins, DOUBLE the previous dose (e.g. 3.6mg -> 7.2mg -> 15mg IV) every 5 minutes until fully atropinized!",
            "MAINTENANCE: Once atropinized, infuse 10–20% of the total loading dose per hour in 5% Dextrose/NS."
          ]
        },
        {
          time: "Specific Antidote",
          title: "Oximes (Pralidoxime / 2-PAM)",
          actions: [
            "Inj. Pralidoxime (2-PAM) 2g IV loading dose in 100 mL NS over 30 mins, followed by 500 mg/hour continuous infusion for 24–48 hours (if facility allows).",
            "Note: Never give 2-PAM without prior Atropine administration."
          ]
        }
      ],
      quickDoses: [
        { drug: "Inj. Atropine", dose: "1.8mg - 3.0mg IV bolus, double every 5 min until clear chest" },
        { drug: "Inj. Pralidoxime (2-PAM)", dose: "2 g in 100 mL NS IV over 30 mins" },
        { drug: "Inj. Diazepam", dose: "5 - 10 mg slow IV (for agitation/fasciculations/seizures)" }
      ]
    },
    {
      id: "anaphylaxis",
      title: "Acute Anaphylaxis & Severe Allergic Shock",
      subtitle: "Emergency Resuscitation Protocol",
      severity: "CRITICAL",
      overview: "Rapidly progressive airway edema, bronchospasm, urticaria, and distributive shock following drug injection, sting, or food allergen.",
      steps: [
        {
          time: "Immediate (0 – 2 min)",
          title: "Adrenaline First (Life Saver)",
          actions: [
            "FIRST DRUG: Inj. Adrenaline (1:1000 / 1 mg/mL) 0.5 mg (0.5 mL) IM into anterolateral mid-thigh immediately! (Children: 0.01 mg/kg IM, max 0.3 mL).",
            "Lay patient flat with legs elevated (do NOT allow patient to stand/sit up suddenly - risk of empty-heart syndrome).",
            "High-flow 100% Oxygen (10–15 L/min via non-rebreather mask).",
            "Repeat IM Adrenaline every 5–10 minutes if no hemodynamic/respiratory improvement."
          ]
        },
        {
          time: "2 – 10 min",
          title: "Circulatory & Secondary Medical Support",
          actions: [
            "Establish 2 large-bore IV lines (16G/18G).",
            "Rapid IV Fluid Challenge: 1 to 2 Litres of Normal Saline or Ringer Lactate wide open in adults (20 mL/kg in children).",
            "SECONDARY DRUGS (Given only AFTER Adrenaline):",
            "  • Inj. Hydrocortisone 200 mg IV (prevents biphasic rebound)",
            "  • Inj. Pheniramine Maleate (Avil) 45.5 mg (2 mL) slow IV or IM",
            "  • Inj. Ranitidine 50 mg IV / Inj. Pantoprazole 40 mg IV"
          ]
        }
      ],
      quickDoses: [
        { drug: "Inj. Adrenaline (1:1000)", dose: "0.5 mL IM into mid-thigh (0.01 mL/kg in kids)" },
        { drug: "IV Normal Saline", dose: "1000 - 2000 mL rapid bolus" },
        { drug: "Inj. Hydrocortisone", dose: "200 mg IV stat" },
        { drug: "Inj. Pheniramine (Avil)", dose: "45.5 mg (2 mL) slow IV" }
      ]
    },
    {
      id: "status_epilepticus",
      title: "Status Epilepticus / Acute Convulsion",
      subtitle: "ICMR Emergency Neurological Protocol",
      severity: "CRITICAL",
      overview: "Continuous seizure activity lasting > 5 minutes or recurrent seizures without regaining consciousness.",
      steps: [
        {
          time: "0 – 5 min",
          title: "Airway, Breathing & Hypoglycemia Check",
          actions: [
            "Position in left lateral recovery position, suction oral secretions, administer high-flow O2.",
            "STAT Random Blood Sugar (RBS): If < 70 mg/dL, give 50 mL of 25% Dextrose IV (in children: 2 mL/kg of 10% Dextrose)."
          ]
        },
        {
          time: "5 – 10 min",
          title: "First-Line Benzodiazepine",
          actions: [
            "Inj. Lorazepam 4 mg IV slow over 2 mins (0.1 mg/kg in kids) OR",
            "Inj. Diazepam 10 mg IV slow over 2 mins (0.2 mg/kg) OR",
            "Inj. Midazolam 10 mg IM / 0.2 mg/kg intranasal if no IV access.",
            "Repeat once at 10 minutes if seizures continue."
          ]
        },
        {
          time: "10 – 25 min",
          title: "Second-Line Antiepileptic Loading",
          actions: [
            "Inj. Levetiracetam 60 mg/kg IV (max 4500 mg) in 100 mL NS over 10 mins OR",
            "Inj. Fosphenytoin 20 mg PE/kg IV in 100 mL NS over 15 mins (requires ECG/BP monitoring) OR",
            "Inj. Sodium Valproate 40 mg/kg IV in 100 mL NS over 10 mins (avoid in suspected metabolic/liver disease)."
          ]
        }
      ],
      quickDoses: [
        { drug: "Inj. Lorazepam", dose: "4 mg IV slow (0.1 mg/kg in children)" },
        { drug: "Inj. Midazolam (Intranasal)", dose: "10 mg IM or 0.2 mg/kg nasal drops" },
        { drug: "Inj. Levetiracetam", dose: "60 mg/kg (max 4.5g) IV infusion over 10m" },
        { drug: "25% Dextrose", dose: "50 mL IV bolus (Hypoglycemia)" }
      ]
    },
    {
      id: "stemi_acs",
      title: "Acute STEMI / Chest Pain Protocol",
      subtitle: "MoHFW / ICMR Acute Coronary Syndrome",
      severity: "CRITICAL",
      overview: "Immediate triage of crushing retrosternal chest pain radiating to left arm/jaw.",
      steps: [
        {
          time: "0 – 10 min",
          title: "10-Minute ECG & STAT Loading Dose",
          actions: [
            "Perform 12-lead ECG within 10 minutes of arrival. Look for ST elevation >= 1mm in 2 contiguous limb leads or >= 2mm in precordial leads (or new LBBB).",
            "STAT ACS LOADING BOX (Administer immediately):",
            "  1. Tab. Aspirin 300 mg (chewable, non-enteric coated - tell patient to CHEW)",
            "  2. Tab. Clopidogrel 300 mg (or 600 mg if primary PCI planned)",
            "  3. Tab. Atorvastatin 80 mg"
          ]
        },
        {
          time: "10 – 20 min",
          title: "Symptom Relief & Reperfusion Decision",
          actions: [
            "Sublingual Nitroglycerin (Sorbitrate) 0.5 mg SL every 5 mins (Max 3 doses) ONLY if Systolic BP > 100 mmHg and no right ventricular infarction (Lead V4R clear).",
            "Inj. Tramadol 50mg IV or Morphine 2-4mg slow IV for refractory severe pain.",
            "Reperfusion Pathway: If transit time to PCI-capable Cath Lab is > 120 minutes, initiate pharmacological thrombolysis (Inj. Streptokinase 1.5 million IU in 100mL NS over 60 min or Tenecteplase) if no contraindications."
          ]
        }
      ],
      quickDoses: [
        { drug: "Aspirin (Chewable)", dose: "300 mg STAT orally (chew)" },
        { drug: "Clopidogrel", dose: "300 - 600 mg STAT orally" },
        { drug: "Atorvastatin", dose: "80 mg STAT orally" },
        { drug: "Sorbitrate (Sublingual)", dose: "0.5 mg SL (check BP > 100 first)" }
      ]
    },
    {
      id: "pph",
      title: "Postpartum Haemorrhage (PPH)",
      subtitle: "MoHFW / WHO Maternal Emergency Protocol",
      severity: "CRITICAL",
      overview: "Blood loss > 500 mL following vaginal delivery or > 1000 mL post-caesarean, or any bleeding causing hemodynamic instability.",
      steps: [
        {
          time: "Immediate (0 – 5 min)",
          title: "Call for Help & First Physical Maneuvers",
          actions: [
            "CALL FOR HELP: Alert staff, midwife, and arrange blood/ambulance.",
            "Continuous Vigorous Fundal Uterine Massage & Bimanual Uterine Compression.",
            "Catheterize bladder with Foley catheter (empty bladder allows uterine contraction).",
            "Establish two 16G/18G IV cannulas; start rapid infusion of Ringer Lactate / Normal Saline."
          ]
        },
        {
          time: "5 – 15 min",
          title: "Uterotonic Medical Management",
          actions: [
            "FIRST-LINE: Inj. Oxytocin 10 IU IM OR 20 IU in 500 mL RL at 60 drops/min (never give undiluted IV bolus - causes sudden cardiovascular collapse).",
            "SECOND-LINE: Tab. Misoprostol 800 mcg per rectum (PR) stat.",
            "HEMOSTATIC: Inj. Tranexamic Acid (TXA) 1 g IV in 100 mL NS over 10 minutes (give within 3 hours of delivery).",
            "METHYLERGOMETRINE: Inj. Methergine 0.2 mg IM (Contraindicated in Preeclampsia / Hypertension / Heart disease!)."
          ]
        },
        {
          time: "Refractory",
          title: "Mechanical Tamponade for Transfer",
          actions: [
            "If bleeding continues: Insert Condom Foley Tamponade (tie clean sterile condom to Foley catheter with silk, insert into uterine cavity, inflate with 300–500 mL warm sterile saline).",
            "Apply External Aortic Compression during ambulance transfer if profound shock."
          ]
        }
      ],
      quickDoses: [
        { drug: "Inj. Oxytocin", dose: "10 IU IM or 20 IU in 500 mL RL @ 60 dpm" },
        { drug: "Tab. Misoprostol", dose: "800 mcg Per Rectum stat" },
        { drug: "Inj. Tranexamic Acid (TXA)", dose: "1 g IV over 10 mins" },
        { drug: "Inj. Methergine", dose: "0.2 mg IM (Avoid if BP high)" }
      ]
    },
    {
      id: "rabies_pep",
      title: "Rabies Post-Exposure Prophylaxis (PEP)",
      subtitle: "National Rabies Control Program (NRCP / MoHFW)",
      severity: "CRITICAL",
      overview: "Animal bite wound categorization, Intradermal/IM anti-rabies vaccination (ARV), and Rabies Immunoglobulin (RIG) local infiltration.",
      steps: [
        {
          time: "0 – 15 min",
          title: "Immediate Wound Washing (Life Saving)",
          actions: [
            "WASH IMMEDIATELY: Flush and wash all bite wounds, scratches, and adjacent skin thoroughly with running water and SOAP for at least 15 continuous minutes.",
            "Apply Virucidal Antiseptic: Povidone Iodine (5%) or surgical spirit.",
            "DO NOT SUTURE: Avoid suturing bite wounds! If unavoidable to stop massive hemorrhage, apply loose approximating sutures only AFTER thorough RIG infiltration.",
            "Tetanus Prophylaxis: Inj. Tetanus Toxoid (TT) 0.5 mL IM stat."
          ]
        },
        {
          time: "Wound Triage",
          title: "WHO / NRCP Category Triage",
          actions: [
            "CATEGORY I: Touching, feeding, licks on intact skin -> Only wash skin; NO vaccine, NO RIG.",
            "CATEGORY II: Minor scratches/abrasions without bleeding, nibbling of uncovered skin -> Immediate wound washing + Full ARV vaccine course (NO RIG).",
            "CATEGORY III: Single/multiple transdermal bites or scratches, bleeding, licks on broken skin, mucous membrane contamination, or wild animal/bat bites -> Wound washing + Full ARV vaccine + LOCAL RIG INFILTRATION."
          ]
        },
        {
          time: "Vaccination & RIG",
          title: "ARV Regimen & RIG Dosing",
          actions: [
            "INTRADERMAL REGIMEN (IDRV - Thai Red Cross): 0.1 mL at 2 separate sites (both deltoids) on Days 0, 3, 7, and 28.",
            "INTRAMUSCULAR REGIMEN (IMRV - Essen): 1 full vial (0.5 mL or 1 mL) IM in deltoid on Days 0, 3, 7, 14, and 28 (Never in gluteal region - poor absorption).",
            "RABIES IMMUNOGLOBULIN (RIG) DOSING for Category III:",
            "  • Equine RIG (ERIG): 40 IU/kg body weight",
            "  • Human RIG (HRIG): 20 IU/kg body weight",
            "  • Infiltrate maximum possible calculated RIG volume locally INTO and AROUND the wounds. Remainder (if any) given IM at a site anatomically distant from vaccine."
          ]
        }
      ],
      quickDoses: [
        { drug: "Wound Washing", dose: "15 mins soap & running water" },
        { drug: "IDRV (Intradermal)", dose: "0.1 mL at 2 deltoid sites on Days 0, 3, 7, 28" },
        { drug: "Equine RIG (ERIG)", dose: "40 IU/kg locally into bite wound" },
        { drug: "Human RIG (HRIG)", dose: "20 IU/kg locally into bite wound" },
        { drug: "Inj. Tetanus Toxoid", dose: "0.5 mL IM stat" }
      ]
    },
    {
      id: "burns_resuscitation",
      title: "Acute Burns & Parkland Resuscitation",
      subtitle: "National Burn Management Protocol",
      severity: "CRITICAL",
      overview: "Initial emergency triage, Rule of 9s calculation, airway assessment in inhalation injury, and Parkland fluid resuscitation.",
      steps: [
        {
          time: "0 – 5 min",
          title: "Immediate First Aid & Airway Check",
          actions: [
            "Cool the burn: Pour clean room-temperature water over burn for 10–20 mins (do NOT apply ice, butter, ink, or toothpaste).",
            "Airway Inhalation Assessment: Look for singed nasal hair, soot in mouth/sputum, hoarse voice, or facial burns -> High risk of acute airway edema -> Secure early airway.",
            "Remove rings, tight clothing, watches before edema develops."
          ]
        },
        {
          time: "Fluid Math",
          title: "Parkland Resuscitation Formula",
          actions: [
            "INDICATION: Any burn >= 15% TBSA in adults or >= 10% TBSA in children.",
            "TOTAL 24-HOUR FLUID (Ringer Lactate): 4 mL x Weight (kg) x % TBSA Burned.",
            "TIMING RULE (Calculated from TIME OF BURN, not arrival!):",
            "  • First 8 Hours: Give 50% (half) of total calculated fluid.",
            "  • Next 16 Hours: Give remaining 50% of calculated fluid.",
            "URINE OUTPUT TARGET: Titrate infusion rate to maintain adult urine output >= 0.5 mL/kg/hour (or 1 mL/kg/h in children) via Foley catheter."
          ]
        }
      ],
      quickDoses: [
        { drug: "Parkland Formula", dose: "4 mL x Weight(kg) x %TBSA (Ringer Lactate)" },
        { drug: "Inj. Tramadol", dose: "50 - 100 mg slow IV in 100mL NS for severe pain" },
        { drug: "Silver Sulfadiazine 1%", dose: "Apply sterile layer after cooling and cleaning" }
      ]
    },
    {
      id: "acute_asthma_copd",
      title: "Acute Severe Asthma & Status Asthmaticus",
      subtitle: "ICMR Emergency Respiratory Protocol",
      severity: "CRITICAL",
      overview: "Impending respiratory failure due to severe bronchospasm refractory to initial bronchodilators.",
      steps: [
        {
          time: "0 – 5 min",
          title: "Immediate Nebulization & Oxygenation",
          actions: [
            "Administer High-Flow Oxygen to maintain SpO2 93–95% (or 88–92% in chronic COPD).",
            "Continuous or back-to-back Nebulization: Respule Salbutamol (2.5mg) + Ipratropium Bromide (0.5mg) (Duolin) driven by Oxygen 6–8 L/min.",
            "Repeat combined nebulization every 20 minutes for 3 cycles."
          ]
        },
        {
          time: "5 – 15 min",
          title: "Systemic Steroids & IV Magnesium",
          actions: [
            "Systemic Corticosteroid: Inj. Hydrocortisone 100–200 mg IV stat (or Inj. Methylprednisolone 40–80 mg IV).",
            "IV Magnesium Sulfate: Inj. MgSO4 2.0 g in 100 mL Normal Saline IV infused over 20 minutes (potent smooth muscle relaxant for refractory bronchospasm).",
            "Subcutaneous/IM Adrenaline: Inj. Adrenaline (1:1000) 0.3–0.5 mL IM if severe anaphylactic component or poor inspiratory effort."
          ]
        },
        {
          time: "Referral",
          title: "Intubation & Ambulance Escort",
          actions: [
            "Indications for intubation: Exhaustion, silent chest, drowsiness, worsening acidosis / hypercapnia.",
            "Transport in 108 Ambulance with continuous Oxygen and doctor/paramedic bag-valve standby."
          ]
        }
      ],
      quickDoses: [
        { drug: "Neb. Salbutamol + Ipratropium", dose: "2.5mg + 0.5mg (1 Respule Duolin) stat" },
        { drug: "Inj. Hydrocortisone", dose: "100 - 200 mg IV stat" },
        { drug: "Inj. Magnesium Sulfate (MgSO4)", dose: "2.0 g in 100 mL NS IV over 20 mins" },
        { drug: "Inj. Adrenaline (1:1000)", dose: "0.3 - 0.5 mL IM (if refractory)" }
      ]
    },
    {
      id: "eclampsia",
      title: "Eclampsia & Severe Pre-Eclampsia",
      subtitle: "Pritchard Regimen / MoHFW Maternal Health Protocol",
      severity: "CRITICAL",
      overview: "Generalized tonic-clonic convulsions in pregnancy (>20 weeks) or postpartum associated with hypertension.",
      steps: [
        {
          time: "0 – 5 min",
          title: "Airway Protection & Magnesium Sulfate Loading",
          actions: [
            "Place in left lateral tilt position (prevents aortocaval compression and aspiration).",
            "Clear airway, suction secretions, provide Oxygen via face mask at 6–8 L/min.",
            "PRITCHARD REGIMEN LOADING DOSE:",
            "  • IV: 4 g Magnesium Sulfate (20% solution, 20 mL) IV slowly over 10–15 minutes.",
            "  • IM: 10 g Magnesium Sulfate (50% solution, 10 mL in each buttock deep IM with 1 mL 2% Lignocaine)."
          ]
        },
        {
          time: "5 – 15 min",
          title: "Antihypertensive & Maintenance Protocol",
          actions: [
            "If Systolic BP >= 160 mmHg or Diastolic BP >= 110 mmHg: Give Inj. Labetalol 20 mg IV slow bolus over 2 mins (repeat 40mg -> 80mg every 10 mins, max 300mg) OR Tab. Nifedipine 10mg orally (swallowed, NOT sublingual).",
            "MAINTENANCE MgSO4: 5 g IM (50% solution, 10 mL) deep IM every 4 hours into alternate buttocks until 24 hours after delivery or last convulsion.",
            "BEFORE EVERY REPEAT DOSE CHECK 3 SAFETY SIGNS:",
            "  1. Knee jerk (patellar reflex) must be PRESENT.",
            "  2. Respiratory rate must be > 16 breaths/min.",
            "  3. Urine output must be > 30 mL/hour (>100 mL over preceding 4 hours).",
            "ANTIDOTE: Keep Inj. Calcium Gluconate 10% (10 mL) at bedside. If respiratory depression / toxicity occurs: give 10 mL 10% Calcium Gluconate IV slow over 10 mins."
          ]
        },
        {
          time: "Referral",
          title: "Emergency Obstetric Referral",
          actions: [
            "Definitive treatment of eclampsia is delivery. Stabilize vitals and immediately transfer to tertiary FRU/Medical College with continuous catheterization and MO escort."
          ]
        }
      ],
      quickDoses: [
        { drug: "Inj. MgSO4 (Loading)", dose: "4g IV (over 10m) + 10g IM (5g in each buttock)" },
        { drug: "Inj. MgSO4 (Maintenance)", dose: "5g IM every 4 hours in alternate buttocks" },
        { drug: "Inj. Labetalol", dose: "20 mg IV bolus over 2 mins (for BP >=160/110)" },
        { drug: "Inj. Calcium Gluconate (Antidote)", dose: "10 mL of 10% IV slow over 10 mins" }
      ]
    }
  ],

  // NATIONAL HEALTH PROGRAMS QUICK-DESK
  nationalPrograms: [
    {
      id: "tb_nikshay",
      name: "Tuberculosis (NTEP / NIKSHAY FDC)",
      category: "National Health Programs",
      subtitle: "Daily Fixed-Dose Combination (FDC) Regimen",
      weightBands: [
        { weight: "25 – 34 kg", ip: "2 Tabs of 4FDC (HRZE)", cp: "2 Tabs of 3FDC (HRE)" },
        { weight: "35 – 49 kg", ip: "3 Tabs of 4FDC (HRZE)", cp: "3 Tabs of 3FDC (HRE)" },
        { weight: "50 – 64 kg", ip: "4 Tabs of 4FDC (HRZE)", cp: "4 Tabs of 3FDC (HRE)" },
        { weight: ">= 65 kg", ip: "5 Tabs of 4FDC (HRZE)", cp: "5 Tabs of 3FDC (HRE)" }
      ],
      notes: "Intensive Phase (IP): 8 weeks 4FDC. Continuation Phase (CP): 16 weeks 3FDC. Add Tab. Pyridoxine (Vit B6) 10-20mg to prevent Isoniazid peripheral neuropathy."
    },
    {
      id: "malaria_nvbdcp",
      name: "Malaria Treatment (NVBDCP)",
      category: "National Health Programs",
      subtitle: "Species-Specific Treatment Workflows",
      protocols: [
        {
          species: "Plasmodium vivax",
          rx: "Tab. Chloroquine 25 mg/kg base over 3 days (10mg/kg Day 1, 10mg/kg Day 2, 5mg/kg Day 3) + Tab. Primaquine 0.25 mg/kg daily for 14 continuous days (Check G6PD!)."
        },
        {
          species: "Plasmodium falciparum",
          rx: "Artemether + Lumefantrine (ACT-AL) weight-based 6-dose regimen over 3 days + Single dose Tab. Primaquine 0.75 mg/kg on Day 2 (as gametocidal)."
        }
      ],
      notes: "Primaquine is strictly contraindicated in G6PD deficiency, infants < 6 months, and pregnancy."
    },
    {
      id: "naco_sti_kits",
      name: "Syndromic STI Management (NACO Kits)",
      category: "National Health Programs",
      subtitle: "Color-Coded National STI Treatment Kits",
      kits: [
        { color: "Kit 1 (Gray)", syndrome: "Urethral Discharge / Cervicitis", contents: "Tab. Azithromycin 1g (1 tab) + Tab. Cefixime 400mg (1 tab) STAT orally" },
        { color: "Kit 2 (Green)", syndrome: "Vaginitis / Trichomoniasis", contents: "Tab. Secnidazole 2g (1 tab) + Cap. Fluconazole 150mg (1 cap) STAT orally" },
        { color: "Kit 3 (White)", syndrome: "Genital Ulcer (Non-Herpetic)", contents: "Inj. Benzathine Penicillin 2.4 MU IM (after test dose) + Tab. Azithromycin 1g STAT" },
        { color: "Kit 5 (Red)", syndrome: "Genital Ulcer (Herpetic)", contents: "Tab. Acyclovir 400mg TDS for 7 days" },
        { color: "Kit 6 (Yellow)", syndrome: "Pelvic Inflammatory Disease (PID)", contents: "Tab. Cefixime 400mg BD x 14d + Tab. Metronidazole 400mg BD x 14d + Cap. Doxycycline 100mg BD x 14d" }
      ]
    }
  ],

  // MEDICO-LEGAL SHIELD & FORENSIC PROTOCOLS
  medicoLegal: {
    grievousHurtClauses: [
      { id: 1, text: "Emasculation (Loss of reproductive capability)." },
      { id: 2, text: "Permanent privation of the sight of either eye." },
      { id: 3, text: "Permanent privation of the hearing of either ear." },
      { id: 4, text: "Privation of any member or joint (loss of limb/finger/toe)." },
      { id: 5, text: "Destruction or permanent impairing of powers of any member or joint." },
      { id: 6, text: "Permanent disfiguration of the head or face." },
      { id: 7, text: "Fracture or dislocation of a bone or tooth." },
      { id: 8, text: "Any hurt which endangers life or causes victim to be in severe bodily pain or unable to follow ordinary pursuits for >= 20 days." }
    ],
    woundTypes: [
      {
        type: "Lacerated Wound (LW)",
        weapon: "Blunt force object (Lathi, stone, rod, fists)",
        margins: "Irregular, ragged, bruised/contused margins, tissue bridging present",
        hair: "Hair bulbs crushed across wound floor",
        bleeding: "Less bleeding due to torn, thrombosed vessels",
        ageClues: "Fresh red -> Brown scab (24-48h) -> Dark crust"
      },
      {
        type: "Incised Wound (IW)",
        weapon: "Sharp-edged weapon (Knife, blade, glass shard, sword)",
        margins: "Clean-cut, well-defined, everted margins, NO tissue bridging",
        hair: "Hair neatly sliced across incision plane",
        bleeding: "Profuse arterial/venous bleeding from cleanly severed vessels",
        ageClues: "Linear clean clot -> Firm scab in 2-3 days"
      },
      {
        type: "Contusion / Bruise",
        weapon: "Blunt impact with intact overlying skin",
        margins: "Ill-defined subcutaneous extravasation of blood",
        colorAging: "Fresh: Red/Purple (0-24h) -> Blue/Dark (2-3d) -> Greenish (4-5d) -> Yellow (7-10d) -> Normal skin (14-21d)"
      },
      {
        type: "Abrasion",
        weapon: "Frictional/glancing impact with rough surface",
        types: "Linear / Scratches / Grazes / Pressure / Imprint (Patterned)",
        ageClues: "Fresh oozing (0-12h) -> Reddish scab (24-48h) -> Brown/Black scab (3-5d) -> Peeling (7-10d)"
      }
    ],
    postMortemRules: [
      { topic: "Time Since Death (TSD)", points: "Warm & Flaccid (< 3h) -> Rigor mortis in face/neck (3-6h) -> Fully established whole body (12-24h) -> Rigor passing off (24-36h) -> Greenish discoloration over right iliac fossa (24-36h)." },
      { topic: "Hanging vs Strangulation", points: "Hanging: Ligature mark oblique, non-continuous, highest at nape of neck, inverted 'V' apex, dry parchmentized base. Strangulation: Ligature mark circular, continuous, horizontal, below thyroid cartilage." },
      { topic: "Drowning (Antemortem)", points: "Fine, white, tenacious, odorless froth at mouth/nostrils (increases on wiping), cadaveric spasm of hands clutching weeds/sand, positive diatom test in sternum/femur." }
    ],
    sobrietyChecklist: [
      "Smell of alcohol from breath (Faint / Moderate / Strong)",
      "Speech: Normal / Thickened / Slurred / Incoherent",
      "Gait: Steady / Swaying / Ataxic / Unable to walk",
      "Pupils: Normal / Sluggish / Dilated / Sluggish light reflex",
      "Memory & Orientation: Oriented to Time, Place & Person",
      "Coordination Tests: Finger-to-Nose test, Romberg's sign"
    ]
  },

  // HIGH-RISK DRUG-DRUG INTERACTIONS (POINT-OF-CARE ALERTS)
  highRiskDDI: [
    {
      pair: "Sildenafil + Nitrates (Sorbitrate / NTG)",
      severity: "FATAL CONTRAINDICATION",
      consequence: "Synergistic cGMP accumulation causes catastrophic refractory hypotension, myocardial infarction, and cardiovascular collapse.",
      rule: "Never give Nitroglycerin within 24 hours of Sildenafil or 48 hours of Tadalafil."
    },
    {
      pair: "Ceftriaxone + Calcium-Containing IV Fluids (Ringer Lactate)",
      severity: "FATAL CONTRAINDICATION",
      consequence: "Forms insoluble crystalline Ceftriaxone-Calcium precipitates causing fatal lung and renal micro-embolism, especially in neonates.",
      rule: "Use Normal Saline only. Never infuse Ceftriaxone in the same IV line as Ringer Lactate."
    },
    {
      pair: "Metronidazole + Alcohol",
      severity: "SEVERE ADVERSE INTERACTION",
      consequence: "Inhibition of aldehyde dehydrogenase causes severe Disulfiram-like reaction (violent vomiting, facial flushing, tachycardia, chest pain).",
      rule: "Strict abstinence from alcohol during treatment and for 48 hours post-completion."
    },
    {
      pair: "Clopidogrel + Omeprazole",
      severity: "MAJOR PHARMACOKINETIC INTERACTION",
      consequence: "Omeprazole inhibits CYP2C19 bioactivation of Clopidogrel, increasing stent thrombosis and recurrent ischemic stroke risk.",
      rule: "Use Pantoprazole or Rabeprazole instead of Omeprazole in acute STEMI / stroke patients on Clopidogrel."
    },
    {
      pair: "ACE Inhibitors (Enalapril / Telmisartan) + Spironolactone",
      severity: "CRITICAL LAB INTERACTION",
      consequence: "Dual blockade of aldosterone and renin-angiotensin axis triggers life-threatening Hyperkalemia (> 6.5 mEq/L) and fatal cardiac arrest.",
      rule: "Mandatory baseline and 1-week Serum Potassium and Creatinine monitoring."
    }
  ],

  // EMERGENCY VASOPRESSOR & INOTROPE INFUSION RULES
  vasopressors: [
    {
      drug: "Noradrenaline (Norepinephrine)",
      standardDilution: "4 mg in 50 mL Normal Saline / 5% Dextrose (80 mcg/mL)",
      doseRange: "0.05 to 0.5 mcg/kg/min",
      calcRate: (w, doseMcg) => {
        // Rate (mL/hr) = (dose * w * 60) / 80
        const rate = (doseMcg * w * 60) / 80;
        return { mlHr: rate.toFixed(1), dropsMin: Math.round(rate) };
      }
    },
    {
      drug: "Dopamine",
      standardDilution: "200 mg in 50 mL Normal Saline / 5% Dextrose (4,000 mcg/mL)",
      doseRange: "5 to 20 mcg/kg/min",
      calcRate: (w, doseMcg) => {
        // Rate (mL/hr) = (dose * w * 60) / 4000
        const rate = (doseMcg * w * 60) / 4000;
        return { mlHr: rate.toFixed(1), dropsMin: Math.round(rate) };
      }
    },
    {
      drug: "Dobutamine",
      standardDilution: "250 mg in 50 mL Normal Saline / 5% Dextrose (5,000 mcg/mL)",
      doseRange: "2.5 to 20 mcg/kg/min",
      calcRate: (w, doseMcg) => {
        // Rate (mL/hr) = (dose * w * 60) / 5000
        const rate = (doseMcg * w * 60) / 5000;
        return { mlHr: rate.toFixed(1), dropsMin: Math.round(rate) };
      }
    }
  ],

  // HIGH-YIELD TOXICOLOGY & POISONING WORKFLOWS
  toxicology: [
    {
      id: "celphos",
      name: "Aluminum Phosphide (Celphos / Rice Tablet)",
      tribute: "Fatal Cardiogenic Shock & Multi-Organ Failure",
      severity: "EXTREME CRITICAL",
      keyWarning: "STRICT NO WATER GASTRIC LAVAGE! Water hydrolyzes Celphos into deadly Phosphine (PH3) gas.",
      lavageProtocol: "Lavage ONLY with 50–100 mL Coconut Oil or Liquid Paraffin (traps phosphine, prevents gastric absorption).",
      antidote: "No specific antidote. Target-driven aggressive supportive resus.",
      managementSteps: [
        "Lavage with COCONUT OIL or LIQUID PARAFFIN immediately. Never use plain water.",
        "Inj. Magnesium Sulfate (MgSO4): 1g IV bolus over 15 mins, followed by 1g/hour infusion for 3 hours, then 1g every 6 hours (membrane stabilizer / antioxidant).",
        "Refractory Cardiogenic Shock: Start Noradrenaline infusion early (0.1–0.5 mcg/kg/min) + Dobutamine if myocardial depression.",
        "Severe Metabolic Acidosis: Inj. Sodium Bicarbonate (8.4%) 50–100 mL IV slow if arterial pH < 7.1 or HCO3 < 10.",
        "Arrange immediate tertiary ICU transfer with inotropic support running."
      ]
    },
    {
      id: "kerosene",
      name: "Kerosene & Hydrocarbon Ingestion",
      tribute: "Chemical Pneumonitis & Lipoid Lung Injury",
      severity: "HIGH ALERT",
      keyWarning: "STRICT NO GASTRIC LAVAGE! STRICT NO INDUCED VOMITING! Aspiration into lungs causes fatal chemical pneumonitis.",
      lavageProtocol: "Gastric lavage strictly contraindicated regardless of time elapsed.",
      antidote: "No antidote. Pure supportive and pulmonary care.",
      managementSteps: [
        "Keep patient completely NPO for 2–4 hours. Do not force milk or activated charcoal (increases vomiting risk).",
        "Wash skin and remove diesel/kerosene-soaked clothes to prevent cutaneous absorption.",
        "Humidified Oxygen if SpO2 < 95% or respiratory distress (tachypnea, grunting, retractions).",
        "Chest X-Ray at 4–6 hours post-ingestion (infiltrates appear early in chemical pneumonitis).",
        "Nebulized Salbutamol if bronchospasm present. Prophylactic steroids/antibiotics are NOT routinely indicated."
      ]
    },
    {
      id: "paracetamol_tox",
      name: "Paracetamol (Acetaminophen) Acute Poisoning",
      tribute: "Acute Hepatic Necrosis & Liver Failure",
      severity: "CRITICAL",
      keyWarning: "Toxic single ingestion threshold: > 150 mg/kg in children or > 7.5 g in adults.",
      lavageProtocol: "Activated Charcoal 1 g/kg orally if presentation within 1–2 hours of ingestion.",
      antidote: "N-Acetylcysteine (NAC) — 100% hepatoprotective if started within 8 hours of ingestion.",
      managementSteps: [
        "Activated Charcoal 1g/kg PO (if within 1-2 hours of ingestion).",
        "IV NAC 21-HOUR PROTOCOL (Total 300 mg/kg):",
        "  • Loading Dose: 150 mg/kg in 200 mL 5% Dextrose over 1 hour",
        "  • Second Dose: 50 mg/kg in 500 mL 5% Dextrose over 4 hours",
        "  • Third Dose: 100 mg/kg in 1000 mL 5% Dextrose over 16 hours",
        "ORAL NAC REGIMEN (If IV unavailable): Loading 140 mg/kg PO, then 70 mg/kg PO every 4 hours for 17 doses.",
        "Baseline and 24h Liver Function Tests (SGOT/SGPT/Bilirubin) and PT/INR monitoring."
      ]
    },
    {
      id: "rodenticide",
      name: "Rodenticides (Zinc Phosphide & Superwarfarins)",
      tribute: "Gastric Ulceration / Severe Coagulopathy",
      severity: "CRITICAL",
      keyWarning: "Identify type: Zinc Phosphide (Rotten fish/garlic odor) vs Superwarfarin (Ratol paste / Bromadiolone).",
      lavageProtocol: "Zinc Phosphide: Lavage with Coconut oil or dilute KMnO4 (1:10,000). Superwarfarin: Activated charcoal.",
      antidote: "Superwarfarin: Inj. Vitamin K1 (Phytomenadione) 10–25 mg IV/PO slow + Fresh Frozen Plasma (FFP).",
      managementSteps: [
        "For Superwarfarin (Bromadiolone / Brodifacoum): Bleeding manifests 24–72 hours later due to long half-life.",
        "Monitor PT/INR at 24h, 48h, and 72h post-exposure.",
        "High-Dose Vitamin K1 (Phytomenadione) 10–25 mg IV slow TDS (may require oral therapy for 4–8 weeks).",
        "If active massive hemorrhage: Transfuse Fresh Frozen Plasma (FFP) 15 mL/kg immediately."
      ]
    },
    {
      id: "corrosive_ingestion",
      name: "Corrosive / Acid & Alkali Ingestion (Toilet Cleaner / Harpic / Acid)",
      tribute: "Esophageal Necrosis & Perforation Hazard",
      severity: "EXTREME CRITICAL",
      keyWarning: "STRICTLY NO GASTRIC LAVAGE! STRICTLY NO INDUCED EMESIS! STRICTLY NO NEUTRALIZING AGENTS (Vinegar/Baking Soda cause exothermic chemical burns and perforation!).",
      lavageProtocol: "CONTRAINDICATED (High risk of esophageal / gastric perforation and aspiration pneumonitis).",
      antidote: "No chemical antidote. Supportive: Keep NPO + IV PPI (Pantoprazole 40mg) + IV Tramadol + IV Fluids.",
      managementSteps: [
        "Keep patient strictly NPO (Nil per oral). Do not give oral water or milk in large quantities (provokes vomiting).",
        "Establish IV access and infuse Normal Saline / Ringer Lactate for dehydration and shock.",
        "Administer IV PPI: Inj. Pantoprazole 40 mg IV BD to suppress acid secretion.",
        "Analgesia: Inj. Tramadol 50–100 mg IV slow in 100 mL NS (avoid NSAIDs due to upper GI bleeding risk).",
        "Examine oral cavity, pharynx, and neck for stridor/airway compromise (if laryngeal edema develops: prepare for emergency intubation/cricothyroidotomy).",
        "Immediate referral to gastroenterology/ENT for Upper GI Endoscopy within 24–48 hours to grade mucosal injury (Zargar classification)."
      ]
    },
    {
      id: "dhatura_poisoning",
      name: "Dhatura / Anticholinergic Poisoning (Atropa Belladonna / Angel's Trumpet)",
      tribute: "Classic Anticholinergic Syndrome",
      severity: "CRITICAL",
      keyWarning: "Anticholinergic toxidrome: Blind as a bat (mydriasis), Dry as a bone (anhidrosis), Red as a beet (flushed), Hot as a hare (hyperthermia), Mad as a hatter (delirium), Full as a flask (urinary retention).",
      lavageProtocol: "Gastric lavage with activated charcoal 1g/kg PO (delayed gastric emptying is common in anticholinergic poisoning).",
      antidote: "Supportive care + Benzodiazepines (Inj. Diazepam 5-10mg IV). Specific antidote Inj. Physostigmine 1-2mg IV slow only in ICU with continuous ECG.",
      managementSteps: [
        "Airway & Supportive: Suction, high-flow O2, quiet dark room (reduces hallucinations/agitation).",
        "Physical Cooling: Tepid sponging and ice packs for extreme hyperthermia (> 39°C / 102°F).",
        "Urinary Catheterization: Essential early step due to severe urinary bladder retention and overdistension.",
        "Control Agitation / Seizures: Inj. Diazepam 5–10 mg slow IV or Inj. Midazolam 5 mg IM (Avoid haloperidol/phenothiazines as they worsen anticholinergic effects and lower seizure threshold!).",
        "IV Hydration: 2–3 Litres Normal Saline to treat hypotension and prevent rhabdomyolysis."
      ]
    }
  ],

  // PEDIATRIC RESUSCITATION & PALS EMERGENCY TAPE
  palsResus: {
    calc: (w) => {
      const weight = Math.max(2.0, Math.min(50.0, parseFloat(w)));
      const nsBolus = Math.round(weight * 20); // 20 mL/kg
      const d10Bolus = (weight * 2).toFixed(1); // 2 mL/kg
      const adrVolume = (weight * 0.1).toFixed(2); // 0.1 mL/kg of 1:10,000
      const adrMcg = Math.round(weight * 10); // 10 mcg/kg
      const defib1 = Math.round(weight * 2); // 2 J/kg
      const defib2 = Math.round(weight * 4); // 4 J/kg
      
      // Estimated age from weight (approximate)
      let estAgeYears = 0;
      if (weight < 4) estAgeYears = 0.1;
      else if (weight < 9) estAgeYears = 0.5;
      else if (weight < 12) estAgeYears = 1;
      else estAgeYears = Math.max(1, (weight - 8) / 2);

      const ettUncuffed = Math.min(8.0, Math.max(2.5, ((estAgeYears / 4) + 4))).toFixed(1);
      const ettCuffed = (parseFloat(ettUncuffed) - 0.5).toFixed(1);
      const ettDepth = Math.round(parseFloat(ettUncuffed) * 3);

      return {
        weight: weight.toFixed(1),
        nsBolus: `${nsBolus} mL`,
        nsBolusNote: "20 mL/kg over 10-20 min IV/IO for hypovolemic shock (repeat x 3 if needed)",
        d10Bolus: `${d10Bolus} mL`,
        d10BolusNote: "2 mL/kg 10% Dextrose slow IV for hypoglycemia (BSL < 54 mg/dL)",
        adrVolume: `${adrVolume} mL`,
        adrNote: `0.1 mL/kg of 1:10,000 dilution (${adrMcg} mcg) IV/IO every 3-5 mins in CPR`,
        defib1: `${defib1} Joules`,
        defib2: `${defib2} Joules`,
        defibNote: `Initial: ${defib1}J (2 J/kg) -> Subsequent: ${defib2}J (4 J/kg) for VF / Pulseless VT`,
        ettSize: `${ettUncuffed} mm (Uncuffed) / ${ettCuffed} mm (Cuffed)`,
        ettDepth: `${ettDepth} cm at lips`
      };
    }
  },

  // CASUALTY 10-SECOND ECG & PRE-THROMBOLYSIS MATRIX
  ecgTriage: {
    leadsMap: [
      {
        territory: "Inferior Wall MI",
        leads: "II, III, aVF",
        culpritArtery: "Right Coronary Artery (RCA) in 85–90%",
        criticalAlert: "Check Right-Sided Lead V4R! If ST elevation in V4R (RV Infarct) -> STRICTLY AVOID Nitroglycerin & Morphine (causes fatal preload drop!). Treat with IV fluids."
      },
      {
        territory: "Anterior / Anteroseptal MI",
        leads: "V1, V2, V3, V4",
        culpritArtery: "Left Anterior Descending (LAD)",
        criticalAlert: "High risk of cardiogenic shock, acute pulmonary edema, and ventricular arrhythmias (VT/VF). Early reperfusion mandatory."
      },
      {
        territory: "Lateral Wall MI",
        leads: "I, aVL, V5, V6",
        culpritArtery: "Left Circumflex (LCx) or Diagonal branch of LAD",
        criticalAlert: "Often accompanies anterior or inferior infarctions."
      },
      {
        territory: "Posterior Wall MI",
        leads: "V1, V2, V3 (Mirror Image: Tall R wave, horizontal ST depression, upright T wave)",
        culpritArtery: "Left Circumflex (LCx) or Posterior Descending Artery (PDA)",
        criticalAlert: "Check Posterior Leads V7, V8, V9 for true ST elevation >= 0.5 mm."
      },
      {
        territory: "Left Main / Triple Vessel Occlusion",
        leads: "ST Elevation in aVR (>= 1 mm) + Diffuse multi-lead ST depression in I, II, aVF, V4-V6",
        culpritArtery: "Left Main Coronary Artery (LMCA) / Severe 3-Vessel Disease",
        criticalAlert: "Extreme mortality risk. Patient in impending catastrophic cardiogenic collapse. Urgent transfer for emergency Cath Lab / CABG."
      },
      {
        territory: "Wellens' Syndrome (Critical LAD Stenosis)",
        leads: "V2, V3 (Deeply inverted or biphasic T-waves during chest pain-free interval)",
        culpritArtery: "Critical Proximal LAD Stenosis (>85% Occlusion)",
        criticalAlert: "Impending massive anterior myocardial infarction within days! STRICTLY AVOID cardiac exercise stress test (provokes fatal MI). Urgent coronary angiography / Cath Lab transfer required."
      },
      {
        territory: "De Winter's T-Waves (STEMI Equivalent)",
        leads: "V1, V2, V3, V4 (Upsloping ST depression >1mm at J-point with tall, prominent, symmetric T-waves)",
        culpritArtery: "Acute Proximal LAD Occlusion (STEMI Equivalent in ~2% patients)",
        criticalAlert: "True STEMI equivalent despite absence of classic ST elevation! Treat as STEMI with immediate thrombolysis or primary PCI."
      }
    ],
    thrombolysisChecklist: {
      indications: [
        "Chest pain onset < 12 hours (ideal < 3 hours)",
        "ST elevation >= 1 mm in >= 2 contiguous limb leads, or >= 2 mm in precordial leads",
        "New or presumed new Left Bundle Branch Block (LBBB)",
        "Transit time to primary PCI center > 120 minutes"
      ],
      absoluteContraindications: [
        "Prior intracranial hemorrhage or stroke of unknown origin at any time",
        "Ischemic stroke within the preceding 6 months",
        "Known central nervous system neoplasm or arteriovenous malformation (AVM)",
        "Major surgery, severe trauma, or head injury within preceding 3 weeks",
        "Active gastrointestinal bleeding within the preceding 1 month",
        "Known or suspected Aortic Dissection",
        "Non-compressible vascular puncture within 24 hours (e.g. liver biopsy, lumbar puncture)"
      ],
      relativeContraindications: [
        "Transient Ischemic Attack (TIA) within preceding 6 months",
        "Oral anticoagulant therapy (Warfarin / DOAC with elevated INR)",
        "Pregnancy or within 1st postpartum week",
        "Refractory hypertension (Systolic BP > 180 mmHg or Diastolic BP > 110 mmHg)",
        "Active peptic ulcer disease",
        "Prolonged or traumatic cardiopulmonary resuscitation (> 10 mins)"
      ],
      regimens: [
        { drug: "Inj. Streptokinase (STK)", dose: "1.5 Million IU in 100 mL Normal Saline or 5% Dextrose IV infused over 60 minutes." },
        { drug: "Inj. Tenecteplase (TNK-tPA)", dose: "Weight-adjusted single IV bolus over 5-10 secs: <60kg: 30mg (6mL); 60-70kg: 35mg (7mL); 70-80kg: 40mg (8mL); 80-90kg: 45mg (9mL); >=90kg: 50mg (10mL)." }
      ]
    }
  },

  // OPD & DISEASE SURVEILLANCE REGISTER (IDSP / IHIP FORM P)
  opdDailyTally: {
    categories: [
      { id: "ari", name: "Acute Respiratory Infection (ARI / URTI / LRTI)", code: "P-01", color: "blue" },
      { id: "add", name: "Acute Diarrheal Disease (ADD / Gastroenteritis)", code: "P-02", color: "cyan" },
      { id: "fuo", name: "Fever / Pyrexia of Unknown Origin (PUO / Dengue / Malaria)", code: "P-03", color: "amber" },
      { id: "htn", name: "Hypertension (NCD Clinic)", code: "P-04", color: "rose" },
      { id: "dm", name: "Type 2 Diabetes Mellitus (NCD Clinic)", code: "P-05", color: "purple" },
      { id: "dogbite", name: "Dog Bite / Animal Scratch (Rabies PEP)", code: "P-06", color: "orange" },
      { id: "snakebite", name: "Snakebite / Suspected Envenomation", code: "P-07", color: "red" },
      { id: "trauma", name: "Road Traffic Accident / Physical Trauma (RTA)", code: "P-08", color: "emerald" },
      { id: "anc", name: "Antenatal Care Visit (ANC Checkup)", code: "P-09", color: "pink" },
      { id: "skin", name: "Skin Infection / Scabies / Dermatophytosis", code: "P-10", color: "teal" },
      { id: "mlc", name: "Medico-Legal Injury Cases (MLC)", code: "P-11", color: "yellow" },
      { id: "minor_ot", name: "Minor OT / Suturing / Dressing / Abscess I&D", code: "P-12", color: "indigo" },
      { id: "general", name: "General / Other Minor Illnesses", code: "P-13", color: "zinc" }
    ]
  },

  // REGIONAL BILINGUAL TRANSLATIONS FOR PATIENT INSTRUCTIONS
  regionalLanguages: [
    { code: "en", name: "English", label: "English" },
    { code: "hi", name: "Hindi", label: "हिन्दी" },
    { code: "ta", name: "Tamil", label: "தமிழ்" },
    { code: "te", name: "Telugu", label: "తెలుగు" },
    { code: "mr", name: "Marathi", label: "मराठी" },
    { code: "bn", name: "Bengali", label: "বাংলা" }
  ],

  // BURNS PARKLAND RESUSCITATION CALCULATOR
  burnsCalculator: {
    calc: (weight, tbsaPercent) => {
      const w = Math.max(2, Math.min(150, parseFloat(weight) || 60));
      const tbsa = Math.max(1, Math.min(100, parseFloat(tbsaPercent) || 20));
      const total24h = Math.round(4 * w * tbsa); // 4 mL x kg x %TBSA (Ringer Lactate)
      const first8h = Math.round(total24h / 2);
      const next16h = total24h - first8h;
      const rate8h = Math.round(first8h / 8);
      const rate16h = Math.round(next16h / 16);
      return {
        weight: w,
        tbsa: tbsa,
        total24hMl: total24h,
        first8hMl: first8h,
        first8hRateMlHr: rate8h,
        next16hMl: next16h,
        next16hRateMlHr: rate16h,
        fluidType: "Ringer Lactate (RL)",
        targetUrineOutput: w >= 30 ? ">= 0.5 mL/kg/hr (30-50 mL/hr)" : ">= 1.0 mL/kg/hr",
        clinicalNote: "Calculate from TIME OF BURN injury, not time of hospital arrival."
      };
    }
  },

  // SHOCK INDEX & HEMODYNAMIC TRIAGE
  shockIndexCalculator: {
    calc: (hr, sbp) => {
      const heartRate = parseFloat(hr) || 80;
      const systolicBp = parseFloat(sbp) || 120;
      if (systolicBp <= 0) return { index: 0, triage: "Invalid BP", color: "zinc" };
      const si = parseFloat((heartRate / systolicBp).toFixed(2));
      let triage = "Normal (Hemodynamically Stable)";
      let color = "emerald";
      let alert = "Patient stable. Monitor vitals regularly.";

      if (si >= 0.7 && si < 0.9) {
        triage = "Mild Shock / Occult Hypoperfusion";
        color = "amber";
        alert = "Elevated Shock Index. Start IV fluid challenge, check lactate and hemoglobin.";
      } else if (si >= 0.9 && si < 1.1) {
        triage = "Moderate Shock (Impending Collapse)";
        color = "orange";
        alert = "High risk of clinical deterioration. Secure 2 large-bore IVs, infuse warm crystalloids, cross-match blood.";
      } else if (si >= 1.1) {
        triage = "Severe Decompensated Shock (Critical)";
        color = "red";
        alert = "High mortality risk. Initiate immediate massive transfusion protocol / vasopressor support & ICU transfer.";
      }

      return {
        heartRate,
        systolicBp,
        index: si,
        triage,
        color,
        alert
      };
    }
  },

  // RABIES RIG (IMMUNOGLOBULIN) CALCULATOR
  rabiesRigCalculator: {
    calc: (weight, type = "ERIG") => {
      const w = Math.max(2, Math.min(150, parseFloat(weight) || 60));
      const isEquine = type === "ERIG";
      const dosePerKg = isEquine ? 40 : 20; // 40 IU/kg for ERIG, 20 IU/kg for HRIG
      const totalIU = Math.round(w * dosePerKg);
      // Typical ERIG vial: 1000 IU / 5 mL (200 IU/mL); HRIG vial: 300 IU / 2 mL (150 IU/mL)
      const concentration = isEquine ? 200 : 150;
      const volumeMl = (totalIU / concentration).toFixed(1);

      return {
        weight: w,
        type: isEquine ? "Equine RIG (ERIG)" : "Human RIG (HRIG)",
        dosePerKg: `${dosePerKg} IU/kg`,
        totalIU: totalIU,
        estimatedVolumeMl: `${volumeMl} mL`,
        technique: "Infiltrate full volume locally around & into ALL bite wounds. Any remainder given deep IM in anterolateral thigh distant from vaccine."
      };
    }
  }
};


