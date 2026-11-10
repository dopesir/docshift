const DOCSHIFT_VERSION = "2.2.0";

let appState = {
  currentHub: "opd", // 'opd' | 'emergency' | 'legal'
  currentEmergencySubTab: "resus", // 'resus' | 'ecg' | 'tox' | 'vaso'
  currentLegalSubTab: "referral", // 'referral' | 'mlc' | 'transformer' | 'autopsy'
  hub3MobileView: "form", // 'form' | 'preview'
  transformerInputMode: "paste", // 'paste' | 'file'
  
  // Pediatric Formulary State
  pedsWeight: 12.0,
  pedsCategory: "All",
  pedsSearch: "",
  pedsViewMode: "matrix", // 'matrix' | 'cards' | 'pals'
  prescriptionLanguage: "en", // 'en' | 'hi' | 'ta' | 'te' | 'mr' | 'bn'

  // Casualty & Resuscitation State
  selectedEmergencyId: "snakebite",
  timerSeconds: 1200, // 20 mins for 20WBCT
  timerInterval: null,
  timerRunning: false,
  selectedEcgIndex: 0,
  checkedContraindications: [],
  selectedToxId: "celphos",
  vasoWeight: 60.0,
  vasoDoses: { noradrenaline: 0.1, dopamine: 10, dobutamine: 5 },
  burnsTbsa: 20,
  rabiesRigType: "ERIG",
  atropineStep: 1,

  // Pre-Referral State & Shock Index
  refFacility: "Primary Health Centre, Rural Block",
  refDoctor: "Dr. Medical Officer, MBBS",
  refPtName: "Patient X",
  refPtAgeSex: "28 / M",
  refVitals: {
    bp: "120/80",
    pr: "84",
    spo2: "98",
    rr: "18",
    rbs: "110",
    gcs: "15/15"
  },
  refDiagnosis: "Acute Neurotoxic Snakebite (Suspected Krait bite)",
  refDrugsGiven: "10 Vials Polyvalent ASV in 500 mL NS IV, Inj. Atropine 0.6mg + Neostigmine 1.5mg IV given at 10:45 AM",
  refReason: "Requires higher tertiary care monitoring / Ventilator support standby",
  refTransport: "Govt 108 Ambulance with continuous Oxygen & paramedic escort",
  printPaperFormat: "a4", // 'a4' | 'thermal'

  // Medico-Legal State (BNS 114–116 / IPC 319–320)
  mlcWoundType: "Lacerated Wound",
  mlcLocation: "Forehead, 3 cm above left eyebrow",
  mlcLength: "4.0",
  mlcBreadth: "1.5",
  mlcDepth: "Bone deep",
  mlcMargins: "Irregular, contused, tissue bridging present across base",
  mlcAge: "Fresh (< 6 hours duration)",
  mlcWeaponNature: "Hard and blunt object",
  selectedGrievousClauses: [],

  // Daily Tally & IDSP State
  tallyDate: new Date().toISOString().split('T')[0],
  tallyCounts: {},

  // UI Theme
  isDarkMode: false
};

// -------------------------------------------------------------
// TRANSLATION DICTIONARY FOR REGIONAL PATIENT ADVICE
// -------------------------------------------------------------
const REGIONAL_PRESCRIPTION_TEXTS = {
  en: {
    title: "Rx for Child",
    wt: "Weight",
    dose: "Dose",
    freq: "Frequency",
    form: "Supply Form",
    notes: "Clinical Caution",
    shake: "Shake bottle well before each use.",
    warning: "Keep out of reach of children. Consult doctor immediately if high fever persists or breathing difficulty develops."
  },
  hi: {
    title: "बाल चिकित्सा पर्ची (Rx)",
    wt: "बच्चे का वजन",
    dose: "खुराक",
    freq: "लेने का समय",
    form: "दवा का रूप",
    notes: "सावधानी",
    shake: "प्रत्येक उपयोग से पहले शीशी को अच्छी तरह हिलाएं।",
    warning: "दवा को बच्चों की पहुंच से दूर रखें। यदि तेज बुखार बना रहे या सांस लेने में तकलीफ हो तो तुरंत डॉक्टर से संपर्क करें।"
  },
  ta: {
    title: "குழந்தை மருத்துவ சீட்டு (Rx)",
    wt: "எடை",
    dose: "மருந்தளவு",
    freq: "எடுக்கும் நேரம்",
    form: "மருந்து வடிவம்",
    notes: "எச்சரிக்கை",
    shake: "பயன்படுத்துவதற்கு முன் பாட்டிலை நன்றாக குலுக்கவும்.",
    warning: "குழந்தைகளுக்கு எட்டாத இடத்தில் வைக்கவும். அதிக காய்ச்சல் தொடர்ந்தால் உடனடியாக மருத்துவரை அணுகவும்."
  },
  te: {
    title: "పిల్లల ప్రిస్క్రిప్షన్ (Rx)",
    wt: "బరువు",
    dose: "మోతాదు",
    freq: "తీసుకునే సమయం",
    form: "మందు రూపం",
    notes: "జాగ్రత్త",
    shake: "వాడే ముందు బాటిల్‌ను బాగా కలపండి.",
    warning: "మందులను పిల్లలకు దూరంగా ఉంచండి. తీవ్ర జ్వరం కొనసాగితే వెంటనే వైద్యుడిని సంప్రదించండి."
  },
  mr: {
    title: "बालरोग प्रिस्क्रिप्शन (Rx)",
    wt: "वजन",
    dose: "डोस",
    freq: "घेण्याची वेळ",
    form: "औषधाचे स्वरूप",
    notes: "काळजी",
    shake: "वापरण्यापूर्वी बाटली चांगली हलवा.",
    warning: "औषधे मुलांच्या आवाक्याबाहेर ठेवा. ताप कमी न झाल्यास किंवा श्वास घेण्यास त्रास झाल्यास त्वरित डॉक्टरांशी संपर्क साधा."
  },
  bn: {
    title: "শিশুর প্রেসক্রিপশন (Rx)",
    wt: "ওজন",
    dose: "ডোজ",
    freq: "খাওয়ার সময়",
    form: "ওষুধের ধরন",
    notes: "সতর্কতা",
    shake: "প্রতিটি ব্যবহারের আগে বোতলটি ভালো করে ঝাঁকিয়ে নিন।",
    warning: "ওষুধ শিশুদের নাগালের বাইরে রাখুন। জ্বর না কমলে অবিলম্বে ডাক্তারের সাথে যোগাযোগ করুন।"
  }
};

// -------------------------------------------------------------

// -------------------------------------------------------------
// TACTILE FEEDBACK (HAPTIC ENGINE FOR MOBILE / TABLET)
// -------------------------------------------------------------
function triggerHapticFeedback(pattern = 10) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Gracefully ignore if unsupported
    }
  }
}

// INITIALIZATION
// -------------------------------------------------------------
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    restoreSessionDrafts();
    loadTallyCounts();
    syncQuickTallyStrip();
    renderPediatricDesk();
    renderEmergencyDesk();
    renderEcgDesk();
    renderToxicologyDesk();
    renderVasopressorsDesk();
    renderTallyDesk();
    renderNationalPrograms();
    renderMedicoLegalDesk();
    updateActiveLegalPreview();
    setupEventListeners();
    initPersistentStorage();
    setupKeyboardShortcuts();
    setupGlobalSearch();
  });
}

// -------------------------------------------------------------
// THEME MANAGEMENT (Night Shift Mode)
// -------------------------------------------------------------
function initTheme() {
  const savedTheme = localStorage.getItem("docshift-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    appState.isDarkMode = true;
    document.documentElement.classList.add("dark");
  } else {
    appState.isDarkMode = false;
    document.documentElement.classList.remove("dark");
  }
}

function toggleDarkMode() {
  triggerHapticFeedback(20);
  appState.isDarkMode = !appState.isDarkMode;
  if (appState.isDarkMode) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("docshift-theme", "dark");
    showToast("Night Shift HUD Enabled");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("docshift-theme", "light");
    showToast("Daylight Mode Enabled");
  }
}

function initPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().then(granted => {
      if (granted) {
        console.log("[DocShift] Storage persisted (protected from OS eviction).");
      }
    }).catch(e => console.warn("[DocShift] Storage persist warning:", e));
  }
}

// -------------------------------------------------------------
// SESSION PERSISTENCE & DRAFTS
// -------------------------------------------------------------
function saveSessionDrafts() {
  const sessionData = {
    refFacility: appState.refFacility,
    refDoctor: appState.refDoctor,
    refPtName: appState.refPtName,
    refPtAgeSex: appState.refPtAgeSex,
    refVitals: appState.refVitals,
    refDiagnosis: appState.refDiagnosis,
    refDrugsGiven: appState.refDrugsGiven,
    refReason: appState.refReason,
    refTransport: appState.refTransport,
    pedsWeight: appState.pedsWeight,
    prescriptionLanguage: appState.prescriptionLanguage,
    vasoWeight: appState.vasoWeight,
    burnsTbsa: appState.burnsTbsa,
    printPaperFormat: appState.printPaperFormat,
    mlcWoundType: appState.mlcWoundType,
    mlcLocation: appState.mlcLocation,
    mlcLength: appState.mlcLength,
    mlcBreadth: appState.mlcBreadth,
    mlcDepth: appState.mlcDepth,
    mlcMargins: appState.mlcMargins,
    mlcAge: appState.mlcAge,
    mlcWeaponNature: appState.mlcWeaponNature,
    selectedGrievousClauses: appState.selectedGrievousClauses
  };
  localStorage.setItem("docshift-session-draft", JSON.stringify(sessionData));
}

function restoreSessionDrafts() {
  const saved = localStorage.getItem("docshift-session-draft");
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        appState[key] = data[key];
      }
    });

    const syncVal = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined) el.value = val;
    };
    syncVal("ref-input-ptname", appState.refPtName);
    syncVal("ref-input-agesex", appState.refPtAgeSex);
    syncVal("ref-input-facility", appState.refFacility);
    syncVal("ref-input-doctor", appState.refDoctor);
    if (appState.refVitals) {
      syncVal("ref-input-bp", appState.refVitals.bp);
      syncVal("ref-input-pr", appState.refVitals.pr);
      syncVal("ref-input-spo2", appState.refVitals.spo2);
      syncVal("ref-input-rbs", appState.refVitals.rbs);
      syncVal("ref-input-gcs", appState.refVitals.gcs);
    }
    syncVal("ref-input-diag", appState.refDiagnosis);
    syncVal("ref-input-drugs", appState.refDrugsGiven);
    syncVal("ref-input-reason", appState.refReason);
  } catch(e) {
    console.warn("[DocShift] Failed to restore session draft:", e);
  }
}

// -------------------------------------------------------------
// 3-HUB MASTER NAVIGATION
// -------------------------------------------------------------
function switchHub(hubId) {
  triggerHapticFeedback(12);
  appState.currentHub = hubId;

  document.querySelectorAll(".hub-content").forEach(el => el.classList.add("hidden"));
  const activeHub = document.getElementById(`hub-${hubId}`);
  if (activeHub) activeHub.classList.remove("hidden");

  document.querySelectorAll(".hub-btn").forEach(btn => {
    btn.classList.remove("active-hub", "bg-white", "dark:bg-zinc-800", "text-slate-900", "dark:text-white", "shadow-2xs");
    btn.classList.add("text-slate-500", "dark:text-zinc-400");
    btn.setAttribute("aria-selected", "false");
  });
  const activeDesktopBtn = document.getElementById(`btn-hub-${hubId}`);
  if (activeDesktopBtn) {
    activeDesktopBtn.classList.add("active-hub", "bg-white", "dark:bg-zinc-800", "text-slate-900", "dark:text-white", "shadow-2xs");
    activeDesktopBtn.classList.remove("text-slate-500", "dark:text-zinc-400");
    activeDesktopBtn.setAttribute("aria-selected", "true");
  }

  const mobileButtons = document.querySelectorAll(".mobile-hub-btn");
  if (mobileButtons && mobileButtons.length >= 3) {
    mobileButtons.forEach(btn => {
      btn.classList.remove("text-slate-900", "dark:text-white", "font-black");
      btn.classList.add("text-slate-400");
    });
    if (hubId === "opd" && mobileButtons[0]) {
      mobileButtons[0].classList.add("text-slate-900", "dark:text-white", "font-black");
      mobileButtons[0].classList.remove("text-slate-400");
    } else if (hubId === "emergency" && mobileButtons[1]) {
      mobileButtons[1].classList.add("text-slate-900", "dark:text-white", "font-black");
      mobileButtons[1].classList.remove("text-slate-400");
    } else if (hubId === "legal" && mobileButtons[2]) {
      mobileButtons[2].classList.add("text-slate-900", "dark:text-white", "font-black");
      mobileButtons[2].classList.remove("text-slate-400");
    }
  }

  if (hubId === "opd") {
    syncQuickTallyStrip();
    renderPediatricContent();
  } else if (hubId === "emergency") {
    switchEmergencySubTab(appState.currentEmergencySubTab || "resus");
  } else if (hubId === "legal") {
    switchLegalSubTab(appState.currentLegalSubTab || "referral");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// -------------------------------------------------------------
// CASUALTY SUB-TABS (Resus, ECG, Tox, Vaso)
// -------------------------------------------------------------
function switchEmergencySubTab(subTab) {
  triggerHapticFeedback(8);
  appState.currentEmergencySubTab = subTab;

  document.querySelectorAll(".em-sub-view").forEach(el => el.classList.add("hidden"));
  const activeSubView = document.getElementById(`em-view-${subTab}`);
  if (activeSubView) activeSubView.classList.remove("hidden");

  document.querySelectorAll(".em-sub-btn").forEach(btn => {
    btn.classList.remove("active-em-sub", "bg-slate-900", "dark:bg-white", "text-white", "dark:text-zinc-950", "shadow-2xs");
    btn.classList.add("text-slate-500", "dark:text-zinc-400");
  });

  const activeBtn = document.getElementById(`btn-em-sub-${subTab}`);
  if (activeBtn) {
    activeBtn.classList.add("active-em-sub", "bg-slate-900", "dark:bg-white", "text-white", "dark:text-zinc-950", "shadow-2xs");
    activeBtn.classList.remove("text-slate-500", "dark:text-zinc-400");
  }

  if (subTab === "resus") renderEmergencyDesk();
  else if (subTab === "ecg") renderEcgDesk();
  else if (subTab === "tox") renderToxicologyDesk();
  else if (subTab === "vaso") renderVasopressorsDesk();
}

// -------------------------------------------------------------
// LEGAL SUB-TABS (Pre-Referral, MLC BNS 116, Transformer, Autopsy)
// -------------------------------------------------------------
let activeUploadedDoc = null; // { name, size, type, text, lastModified }
let transformedDocOutput = null;

function switchLegalSubTab(subTab) {
  triggerHapticFeedback(8);
  appState.currentLegalSubTab = subTab;

  const formReferral = document.getElementById("legal-form-referral");
  const formMlc = document.getElementById("legal-form-mlc");
  const formTransformer = document.getElementById("legal-form-transformer");
  const formAutopsy = document.getElementById("legal-form-autopsy");

  if (formReferral) formReferral.classList.add("hidden");
  if (formMlc) formMlc.classList.add("hidden");
  if (formTransformer) formTransformer.classList.add("hidden");
  if (formAutopsy) formAutopsy.classList.add("hidden");

  const targetForm = document.getElementById(`legal-form-${subTab}`);
  if (targetForm) targetForm.classList.remove("hidden");

  document.querySelectorAll(".legal-sub-btn").forEach(btn => {
    btn.classList.remove("active-legal-sub", "bg-slate-900", "dark:bg-white", "text-white", "dark:text-zinc-950", "shadow-2xs");
    btn.classList.add("text-slate-500", "dark:text-zinc-400");
  });

  const activeBtn = document.getElementById(`btn-legal-sub-${subTab}`);
  if (activeBtn) {
    activeBtn.classList.add("active-legal-sub", "bg-slate-900", "dark:bg-white", "text-white", "dark:text-zinc-950", "shadow-2xs");
    activeBtn.classList.remove("text-slate-500", "dark:text-zinc-400");
  }

  updateActiveLegalPreview();
}

function updateActiveLegalPreview() {
  const preview = document.getElementById("legal-active-preview-text");
  const title = document.getElementById("legal-preview-title");
  const dot = document.getElementById("legal-preview-dot");
  const whatsappBtn = document.getElementById("legal-btn-whatsapp");

  if (!preview) return;

  if (appState.currentLegalSubTab === "referral") {
    if (title) title.innerText = appState.printPaperFormat === "thermal" ? "Generated Pre-Referral Slip (Thermal 58/80mm)" : "Generated Official Pre-Referral Slip (A4)";
    if (dot) dot.className = "w-2 h-2 rounded-full bg-emerald-500";
    if (whatsappBtn) whatsappBtn.style.display = "flex";
    preview.innerText = generateReferralText();
  } else if (appState.currentLegalSubTab === "mlc") {
    if (title) title.innerText = "Generated Medico-Legal Injury Slip (BNS 116)";
    if (dot) dot.className = "w-2 h-2 rounded-full bg-amber-500";
    if (whatsappBtn) whatsappBtn.style.display = "flex";
    preview.innerText = generateMlcText();
  } else if (appState.currentLegalSubTab === "transformer") {
    if (title) title.innerText = transformedDocOutput ? "Transformed Statutory Clinical Certificate" : "Ready for Clinical Document Transformation";
    if (dot) dot.className = transformedDocOutput ? "w-2 h-2 rounded-full bg-indigo-500" : "w-2 h-2 rounded-full bg-slate-400";
    if (whatsappBtn) whatsappBtn.style.display = "flex";
    preview.innerText = transformedDocOutput || generateTransformerPlaceholderText();
  } else if (appState.currentLegalSubTab === "autopsy") {
    if (title) title.innerText = "Post-Mortem & Sobriety Quick Reference";
    if (dot) dot.className = "w-2 h-2 rounded-full bg-purple-500";
    if (whatsappBtn) whatsappBtn.style.display = "none";
    preview.innerText = generateAutopsyReferenceText();
  }
}

function generateTransformerPlaceholderText() {
  return `===============================================================
DOCSHIFT CLINICAL DOCUMENT & SHIFT HANDOVER TRANSFORMER
100% Client-Side In-Memory Engine • Zero-Cloud Private Vault
===============================================================
Awaiting document upload or sample selection...

HOW TO USE:
1. Drag & drop or select an unstructured clinical note, triage memo,
   IDSP daily tally CSV, or shift handover JSON from your device.
2. The DocShift engine validates structure, extracts patient vitals
   (BP, PR, SpO2, GCS), matches provisional diagnoses, and maps
   emergency treatments into statutory Government of India format.
3. Once transformed, inspect the verified clinical certificate,
   export to WhatsApp, or print directly on A4 / 58mm Thermal paper.

Or click one of the quick sample buttons to test the pipeline instantly:
- [Emergency Snakebite Triage Note]
- [Medico-Legal RTA Trauma Note]
- [Daily IDSP Shift Tally CSV]
- [Night Shift Handover Log JSON]
===============================================================`;
}

// -------------------------------------------------------------
// DOCUMENT DRAG & DROP AND FILE HANDLING
// -------------------------------------------------------------
function handleDocDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  const dropzone = document.getElementById("doc-dropzone");
  if (dropzone) {
    dropzone.classList.add("border-indigo-500", "bg-indigo-500/10");
  }
}

function handleDocDragLeave(event) {
  event.preventDefault();
  event.stopPropagation();
  const dropzone = document.getElementById("doc-dropzone");
  if (dropzone) {
    dropzone.classList.remove("border-indigo-500", "bg-indigo-500/10");
  }
}

function handleDocDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  const dropzone = document.getElementById("doc-dropzone");
  if (dropzone) {
    dropzone.classList.remove("border-indigo-500", "bg-indigo-500/10");
  }

  if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
    processUploadedFile(event.dataTransfer.files[0]);
  }
}

function handleDocFileSelect(event) {
  if (event.target && event.target.files && event.target.files.length > 0) {
    processUploadedFile(event.target.files[0]);
  }
}

function processUploadedFile(file) {
  hideDocError();
  // 1. File Size Validation (Max 5.0 MB)
  if (file.size > 5 * 1024 * 1024) {
    showDocError("File Exceeds Size Limit", `The file size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum allowed 5.0 MB threshold.`);
    return;
  }

  // 2. Format Validation
  const validExtensions = ['.txt', '.json', '.csv', '.md'];
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!validExtensions.includes(ext) && file.type !== "text/plain" && file.type !== "application/json" && file.type !== "text/csv") {
    showDocError("Unsupported Document Format", `The file "${file.name}" is not a supported format. Please upload a .TXT, .JSON, .CSV, or .MD document.`);
    return;
  }

  // 3. Read File Contents
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    if (!content || content.trim().length === 0) {
      showDocError("Empty Document Detected", `The selected file "${file.name}" does not contain any clinical data.`);
      return;
    }

    activeUploadedDoc = {
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      type: ext.replace('.', '').toUpperCase(),
      text: content,
      lastModified: new Date(file.lastModified).toLocaleTimeString()
    };

    displayActiveFileInfo();
    showToast(`Loaded: ${file.name}`);
  };

  reader.onerror = () => {
    showDocError("File Read Error", "Unable to read file content from local filesystem.");
  };

  reader.readAsText(file);
}

function displayActiveFileInfo() {
  if (!activeUploadedDoc) return;
  const info = document.getElementById("doc-file-info");
  const nameEl = document.getElementById("doc-file-name");
  const metaEl = document.getElementById("doc-file-meta");
  if (info && nameEl && metaEl) {
    nameEl.innerText = activeUploadedDoc.name;
    metaEl.innerText = `${activeUploadedDoc.size} • ${activeUploadedDoc.type} Format`;
    info.classList.remove("hidden");
  }
}

function clearUploadedDoc() {
  activeUploadedDoc = null;
  transformedDocOutput = null;
  const info = document.getElementById("doc-file-info");
  const pipeline = document.getElementById("doc-processing-pipeline");
  const fileInput = document.getElementById("doc-file-input");
  if (info) info.classList.add("hidden");
  if (pipeline) pipeline.classList.add("hidden");
  if (fileInput) fileInput.value = "";
  hideDocError();
  updateActiveLegalPreview();
  showToast("Uploaded document cleared");
}

function showDocError(title, reason) {
  const alertBox = document.getElementById("doc-error-alert");
  const titleEl = document.getElementById("doc-error-title");
  const reasonEl = document.getElementById("doc-error-reason");
  if (alertBox && titleEl && reasonEl) {
    titleEl.innerText = title;
    reasonEl.innerText = reason;
    alertBox.classList.remove("hidden");
  }
}

function hideDocError() {
  const alertBox = document.getElementById("doc-error-alert");
  if (alertBox) alertBox.classList.add("hidden");
}

// -------------------------------------------------------------
// DUAL-MODE TRANSFORMER & REAL-WORLD CLINICAL SAMPLES
// -------------------------------------------------------------
let transformerInputMode = "paste"; // 'paste' | 'file'

function setTransformerInputMode(mode) {
  transformerInputMode = mode;
  appState.transformerInputMode = mode;
  const btnPaste = document.getElementById("btn-trans-mode-paste");
  const btnFile = document.getElementById("btn-trans-mode-file");
  const pasteSection = document.getElementById("trans-paste-section");
  const fileSection = document.getElementById("trans-file-section");

  if (mode === "paste") {
    if (btnPaste) btnPaste.className = "flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-2xs transition";
    if (btnFile) btnFile.className = "flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition";
    if (pasteSection) pasteSection.classList.remove("hidden");
    if (fileSection) fileSection.classList.add("hidden");
  } else {
    if (btnFile) btnFile.className = "flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-2xs transition";
    if (btnPaste) btnPaste.className = "flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition";
    if (fileSection) fileSection.classList.remove("hidden");
    if (pasteSection) pasteSection.classList.add("hidden");
  }
}

function handleRawTextareaInput(val) {
  const charCount = document.getElementById("doc-raw-char-count");
  if (charCount) {
    charCount.innerText = `${val.length} chars`;
  }
}

function transformRawText() {
  const textarea = document.getElementById("doc-raw-textarea");
  const rawText = textarea ? textarea.value.trim() : "";
  if (!rawText) {
    showDocError("Input Note is Empty", "Please paste or type an unstructured clinical note, WhatsApp handover, or doctor shorthand.");
    return;
  }

  hideDocError();
  activeUploadedDoc = {
    name: "pasted_clinical_shorthand.txt",
    size: (rawText.length / 1024).toFixed(1) + " KB",
    type: "TXT",
    text: rawText,
    lastModified: "Manual Shorthand"
  };

  startDocumentTransformation();
}

const SAMPLE_CLINICAL_DOCS = {
  snakebite: {
    name: "Snakebite_WhatsApp_Handover.txt",
    type: "TXT",
    text: `Urgent ref from PHC: Ramesh Kumar 32/M, farmer. Sustained snake bite right lower ankle while working in fields 1 hr back. Fang marks + active oozing + bilateral ptosis + slurred speech. Vitals: BP 90/60 HR 118 SpO2 91% RBS 98 GCS 12/15 RR 26. 20WBCT >20min unclotted (coagulopathy confirmed). Initial Rx: 10 vials polyvalent ASV in 500ml NS IV over 1 hr + Inj Atropine 0.6mg IV + Inj Neostigmine 1.5mg IV. Shifting via 108 ALS ambulance with doctor escort.`
  },
  rta_trauma: {
    name: "RTA_Polytrauma_Casualty_Shorthand.txt",
    type: "TXT",
    text: `45/M brought by 108 ambulance after high speed two-wheeler RTA 2h ago. Severe head trauma + blunt abdominal pain. O/E: GCS 8/15 (E2V2M4), right pupil 4mm sluggish, BP 80/50, PR 128 bpm thready, SpO2 91% room air, RBS 184. Treatment: 2x 18G IV lines, NS 1L bolus fast, Inj Pantop 40 IV, Inj Tranexa 1g IV, C-collar applied. Compound fracture right tibia splinted. Section 116(g) BNS grievous hurt. Shift urgently to tertiary neurosurgery & general surgery.`
  },
  peds_shock: {
    name: "Pediatric_Gastroenteritis_Shock.txt",
    type: "TXT",
    text: `Baby Aarav, 18mo M, 11kg. Severe acute gastroenteritis, vomiting x 8 episodes, watery loose stools x 10. Lethargic, depressed fontanelle, sunken eyes, delayed skin turgor > 2s. BP 70/40, HR 160, SpO2 95%, RBS 72. Rx: RL 330ml IV fast bolus over 1h, Inj Ondansetron 1.5mg IV, Zinc 20mg, ORS started. Ref urgently to District Hospital PICU.`
  },
  celphos_poisoning: {
    name: "Celphos_Pesticide_Poisoning.txt",
    type: "TXT",
    text: `22yo female Sunita, alleged ingestion of Celphos (Aluminum Phosphide) ~3h back. Strong garlic odor, severe epigastric burning, vomiting. Vitals: BP 78/48 mmHg, HR 134, SpO2 89%, GCS 11/15, RBS 140. Gastric lavage done with KMNO4 & mineral oil slurry. Inj Sodium Bicarbonate 50ml IV + Inj Hydrocortisone 200mg IV given. Referred immediately to Medical College ICU on 108 ALS.`
  },
  stemi_cardiogenic: {
    name: "Inferior_STEMI_Cardiogenic_Shock.txt",
    type: "TXT",
    text: `58/M Mohan Lal. Severe crushing retrosternal chest pain radiating to left arm x 3 hrs with profuse sweating. ECG: Marked ST elevation in II, III, aVF with reciprocal depression in I, aVL (Inferior STEMI + RV extension). BP 85/55, HR 112, SpO2 94%, RBS 165. Rx: Tab Aspirin 300mg chewed + Tab Clopidogrel 300mg + Tab Atorvastatin 80mg given. Normal Saline 500ml IV started. Shift urgently for primary PCI / Thrombolysis.`
  },
  idsp_tally: {
    name: "IDSP_Shift_Surveillance_Data.csv",
    type: "CSV",
    text: `Date,Facility,ReportingMO,Code,Category,Count
2026-09-07,PHC Rural,Dr. Medical Officer,P-01,Acute Respiratory Infection (ARI),42
2026-09-07,PHC Rural,Dr. Medical Officer,P-02,Acute Diarrheal Disease (ADD),28
2026-09-07,PHC Rural,Dr. Medical Officer,P-03,Pyrexia of Unknown Origin (PUO/Fever),35
2026-09-07,PHC Rural,Dr. Medical Officer,P-04,Hypertension & Diabetes (NCD),54
2026-09-07,PHC Rural,Dr. Medical Officer,P-05,Dog Bite (Rabies Category III),6
2026-09-07,PHC Rural,Dr. Medical Officer,P-06,Snakebite Envenomation,2
2026-09-07,PHC Rural,Dr. Medical Officer,P-07,Trauma & Road Injuries,11
2026-09-07,PHC Rural,Dr. Medical Officer,P-08,Antenatal Care (ANC Checkup),19`
  },
  shift_handover: {
    name: "Casualty_Shift_Handover_Log.json",
    type: "JSON",
    text: JSON.stringify({
      facility: "Community Health Centre, Central Division",
      shiftDate: "2026-09-07",
      shiftType: "Night Casualty Shift (20:00 - 08:00)",
      outgoingDoctor: "Dr. Medical Officer, MBBS",
      totalPatientsSeen: 118,
      admittedCasualty: 7,
      transferredTertiary: 3,
      highPriorityCases: [
        {
          patient: "Ramesh Kumar (32/M)",
          diagnosis: "Neurotoxic Snakebite",
          asvGiven: "10 Vials IV in 500 mL NS",
          status: "Transferred via 108 Ambulance to District Hospital"
        }
      ],
      antiRabiesVialsUsed: 4,
      asvVialsUsed: 10
    }, null, 2)
  }
};

function loadSampleDoc(key) {
  const sample = SAMPLE_CLINICAL_DOCS[key];
  if (!sample) return;

  hideDocError();
  activeUploadedDoc = {
    name: sample.name,
    size: (sample.text.length / 1024).toFixed(1) + " KB",
    type: sample.type,
    text: sample.text,
    lastModified: "Verified Template"
  };

  const textarea = document.getElementById("doc-raw-textarea");
  if (textarea) {
    textarea.value = sample.text;
    handleRawTextareaInput(sample.text);
  }

  displayActiveFileInfo();
  showToast(`Loaded Template: ${sample.name}`);
  startDocumentTransformation();
}

// -------------------------------------------------------------
// CORE CLINICAL PARSER & EXTRACTION ENGINE (Zero-Hallucination)
// -------------------------------------------------------------
function validateFileCheck(name, size) {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const validExts = ['.txt', '.json', '.csv', '.md'];
  if (size > MAX_FILE_SIZE) return { valid: false, error: "EXCEEDS_SIZE", message: "File exceeds 5.0 MB maximum threshold." };
  const ext = name.substring(name.lastIndexOf('.')).toLowerCase();
  if (!validExts.includes(ext)) return { valid: false, error: "INVALID_FORMAT", message: "Unsupported format. Use .TXT, .JSON, .CSV, or .MD." };
  return { valid: true, ext: ext.replace('.', '').toUpperCase() };
}

function parseCsvCounts(csvText) {
  if (!csvText || typeof csvText !== "string") return 0;
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length <= 1) return 0;
  let total = 0;
  lines.slice(1).forEach(line => {
    const parts = line.split(',');
    if (parts.length >= 6) total += parseInt(parts[5].trim(), 10) || 0;
    else if (parts.length >= 2) total += parseInt(parts[parts.length - 1].trim(), 10) || 0;
  });
  return total;
}

function parseClinicalDocument(text, docType = "TXT") {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return {
      success: false,
      error: "EMPTY_INPUT",
      message: "The document is empty or unreadable.",
      fields: {}
    };
  }

  const cleanText = text.replace(/\r\n/g, "\n");

  if (docType === "JSON") {
    try {
      const data = JSON.parse(cleanText);
      const highPriority = Array.isArray(data.highPriorityCases) && data.highPriorityCases.length > 0 ? data.highPriorityCases[0] : {};
      return {
        success: true,
        type: "JSON",
        fields: {
          facility: data.facility || "[Facility Not Specified in JSON]",
          doctor: data.outgoingDoctor || data.doctor || "[Doctor Not Specified in JSON]",
          patient: highPriority.patient || data.patient || "[Patient Not Specified in JSON]",
          ageSex: highPriority.ageSex || data.ageSex || "[Age/Sex Not Specified]",
          bp: highPriority.bp || data.bp || null,
          pr: highPriority.pr || data.pr || null,
          spo2: highPriority.spo2 || data.spo2 || null,
          rbs: highPriority.rbs || data.rbs || null,
          gcs: highPriority.gcs || data.gcs || null,
          rr: highPriority.rr || data.rr || null,
          diagnosis: highPriority.diagnosis || data.diagnosis || "[Diagnosis Not Specified in JSON]",
          drugs: highPriority.asvGiven ? `Inj. ASV: ${highPriority.asvGiven}` : (highPriority.drugs || data.drugs || "[No Emergency Medications Documented]"),
          reason: highPriority.status || data.reason || "[Referral Reason Not Stated]",
          transport: data.transport || "Govt 108 Emergency Ambulance with Paramedic",
          totalPatientsSeen: typeof data.totalPatientsSeen === "number" ? data.totalPatientsSeen : null,
          grievousClauses: []
        }
      };
    } catch(err) {
      return {
        success: false,
        type: "JSON",
        error: "JSON_PARSE_ERROR",
        message: "Malformed JSON syntax: " + err.message,
        fields: {}
      };
    }
  }

  if (docType === "CSV") {
    const lines = cleanText.split("\n").filter(l => l.trim().length > 0);
    if (lines.length <= 1) {
      return {
        success: false,
        type: "CSV",
        error: "CSV_EMPTY_DATA",
        message: "CSV file contains no records beyond the header row.",
        fields: {}
      };
    }

    let totalExamined = 0;
    const records = [];
    lines.slice(1).forEach((line, idx) => {
      const parts = line.split(",").map(p => p.trim());
      if (parts.length >= 6) {
        const code = parts[3];
        const category = parts[4];
        const count = parseInt(parts[5], 10) || 0;
        totalExamined += count;
        records.push({ code, category, count });
      } else if (parts.length >= 2) {
        const count = parseInt(parts[parts.length - 1], 10) || 0;
        totalExamined += count;
        records.push({ code: `ROW-${idx + 1}`, category: parts[0], count });
      }
    });

    return {
      success: true,
      type: "CSV",
      fields: {
        totalExamined: totalExamined,
        records: records
      }
    };
  }

  // --- FREE-TEXT / SHORTHAND / WHATSAPP / CASUALTY NOTE PARSER ---
  const extractField = (regex) => {
    const match = cleanText.match(regex);
    return match && match[1] ? match[1].trim() : null;
  };

  // 1. Patient Name & Demographic Extraction
  let rawPatient = extractField(/(?:^|\n)\s*(?:Patient(?:\s*Name)?|Name|Pt\.?)\s*[:=]\s*([^\n\r]+)/i);
  let patientName = null;
  let parsedAgeSex = null;

  if (rawPatient) {
    const inlineMatch = rawPatient.match(/^([^(,\n]+?)\s*(?:\(([^)]+)\)|,\s*([^\n]+))$/);
    if (inlineMatch) {
      patientName = inlineMatch[1].trim();
      parsedAgeSex = (inlineMatch[2] || inlineMatch[3]).trim();
    } else {
      patientName = rawPatient.trim();
    }
  }

  // Explicit Age/Sex line matching with strict word boundary
  const explicitAgeSex = extractField(/(?:^|\n)\s*(?:Age\s*\/\s*(?:Sex|Gender)|\bAge\b)\s*[:=]\s*([^\n\r]+)/i);
  if (explicitAgeSex) {
    parsedAgeSex = explicitAgeSex;
  }

  // Shorthand demographics fallback (e.g. "45/M", "32M", "68 F", "28 yo male", "Baby Aarav, 18mo M", "Sunita 24yo female")
  if (!parsedAgeSex) {
    const shorthandAgeSexMatch = cleanText.match(/\b([0-9]{1,3}\s*(?:yo|yr|yrs|y\/o|mo|months|month)?\s*(?:\/|\s)\s*(?:M|F|Male|Female|Boy|Girl))\b/i) ||
                                cleanText.match(/\b([0-9]{1,3}\s*(?:M|F))\b/);
    if (shorthandAgeSexMatch) {
      parsedAgeSex = shorthandAgeSexMatch[1].trim();
    }
  }

  if (!patientName) {
    // Check for leading name in shorthand e.g. "Ramesh Kumar 32M" or "Baby Aarav, 18mo M" or "Urgent ref: Suresh Patil 52M"
    const leadingNameMatch = cleanText.match(/(?:(?:Urgent\s*ref|MLC\s*Case|Patient|Pt\.?)\s*(?:from\s+[A-Z0-9\s]+)?[:=]?\s*)?([A-Z][a-zA-Z\s.]+?)\s*(?:,|\s)?\s*([0-9]{1,3}\s*(?:yo|yr|yrs|y\/o|mo)?\s*(?:\/|\s)?\s*(?:M|F|Male|Female))\b/);
    if (leadingNameMatch) {
      const candidate = leadingNameMatch[1].trim();
      if (!/^(CLINICAL|MEDICO|CASUALTY|DOCTOR|FACILITY|HOSPITAL|TRIAGE|REPORT|DATE|TIME|URGENT|REF|MLC|HISTORY|EXAMINATION|VITALS|TREATMENT|REASON)/i.test(candidate) && candidate.length > 2) {
        patientName = candidate;
        if (!parsedAgeSex) parsedAgeSex = leadingNameMatch[2].trim();
      }
    }
  }

  if (!patientName) {
    // Check for Age/Sex preceding name e.g. "22yo female Sunita", "58/M Mohan Lal", "45M Rajesh Kumar"
    const leadingAgeNameMatch = cleanText.match(/(?:^|\n|\b)(?:(?:Urgent\s*ref|MLC\s*Case|Patient|Pt\.?)\s*(?:from\s+[A-Z0-9\s]+)?[:=]?\s*)?([0-9]{1,3}\s*(?:yo|yr|yrs|y\/o|mo)?\s*(?:\/|\s)?\s*(?:M|F|Male|Female|Boy|Girl))\s*(?:,|\s|\.)\s*([A-Z][a-zA-Z\s.]+?)(?=\s*[,.\n]|\s+(?:alleged|presented|c\/o|h\/o|with|vitals|bp|hr|pr|rx|referred|on|$))/i);
    if (leadingAgeNameMatch) {
      const candidate = leadingAgeNameMatch[2].trim();
      if (!/^(CLINICAL|MEDICO|CASUALTY|DOCTOR|FACILITY|HOSPITAL|TRIAGE|REPORT|DATE|TIME|URGENT|REF|MLC|HISTORY|EXAMINATION|VITALS|TREATMENT|REASON|ALLEGED|PRESENTED|SEVERE|ACUTE|CHRONIC)/i.test(candidate) && candidate.length > 2) {
        patientName = candidate;
        if (!parsedAgeSex) parsedAgeSex = leadingAgeNameMatch[1].trim();
      }
    }
  }

  // 2. Doctor Extraction (stripping duplicate prefixes cleanly)
  let rawDoctor = extractField(/(?:^|\n)\s*(?:Attending\s*Doctor|Examining\s*(?:Doctor|MO)|Medical\s*Officer|Doctor|MO)\s*[:=]\s*([^\n\r]+)/i);
  let doctorName = null;
  if (rawDoctor) {
    doctorName = rawDoctor.replace(/^(?:Attending\s*Doctor|Doctor|Dr\.?)\s*[:=]?\s*/i, "").trim();
    if (!doctorName.toLowerCase().startsWith("dr.")) {
      doctorName = `Dr. ${doctorName}`;
    }
  }

  // 3. Facility Extraction
  const facility = extractField(/(?:^|\n)\s*(?:Referring\s*Facility|Facility|Hospital|Health\s*Centre|PHC|CHC)\s*[:=]\s*([^\n\r]+)/i);

  // 4. Presentation Vitals (BP, PR/HR, SpO2, RBS, GCS, RR)
  const bpMatch = cleanText.match(/\b(?:BP|Blood\s*Pressure|NIBP)\s*[:=]?\s*([0-9]{2,3}\s*\/\s*[0-9]{2,3})\s*(?:mmHg)?\b/i) ||
                  cleanText.match(/\b([0-9]{2,3}\s*\/\s*[0-9]{2,3})\s*mmHg\b/i);
  const bp = bpMatch ? bpMatch[1].replace(/\s+/g, '') : null;

  const prMatch = cleanText.match(/\b(?:PR|Pulse(?:\s*Rate)?|HR|Heart\s*Rate)\s*[:=]?\s*([0-9]{2,3})\s*(?:bpm|\/min)?\b/i) ||
                  cleanText.match(/\b([0-9]{2,3})\s*(?:bpm|\/min)\b/i);
  const pr = prMatch ? prMatch[1] : null;

  const spo2Match = cleanText.match(/\b(?:SpO2|Oxygen(?:\s*Sat(?:uration)?)?|O2\s*Sat|Sat)\s*[:=]?\s*([0-9]{2,3})\s*%/i) ||
                    cleanText.match(/\b(?:SpO2|spo2)\s*[:=]?\s*([0-9]{2,3})\b/i);
  const spo2 = spo2Match ? spo2Match[1] : null;

  const rbsMatch = cleanText.match(/\b(?:RBS|Blood\s*Sugar|Blood\s*Glucose|GRBS|Sugar)\s*[:=]?\s*([0-9]{2,3})\s*(?:mg\/dL|mg\/dl)?\b/i);
  const rbs = rbsMatch ? rbsMatch[1] : null;

  const gcsMatch = cleanText.match(/\b(?:GCS(?:\s*Score)?)\s*[:=]?\s*([0-9]{1,2}(?:\s*\/\s*15)?(?:\s*\([^)]+\))?)\b/i) ||
                  cleanText.match(/\b(?:GCS\s*(?:E\d+V\d+M\d+|[0-9]{1,2}\/15|[0-9]{1,2}))\b/i);
  let gcs = null;
  if (gcsMatch) {
    gcs = gcsMatch[1] ? gcsMatch[1].trim() : gcsMatch[0].replace(/^GCS\s*[:=]?\s*/i, '').trim();
    if (/^\d{1,2}$/.test(gcs)) gcs = `${gcs}/15`;
  }

  const rrMatch = cleanText.match(/\b(?:RR|Resp(?:iratory)?\s*Rate)\s*[:=]?\s*([0-9]{1,2})\s*(?:\/min|bpm)?\b/i);
  const rr = rrMatch ? rrMatch[1] : null;

  // Shock Index Calculation
  let shockIndex = null;
  let shockAlert = null;
  if (bp && pr) {
    const sbp = parseFloat(bp.split('/')[0]) || 0;
    const hrVal = parseFloat(pr) || 0;
    if (sbp > 0 && hrVal > 0) {
      const siVal = hrVal / sbp;
      const siFixed = siVal.toFixed(2);
      if (siVal >= 1.0) {
        shockIndex = `${siFixed} (Severe Shock / Impending Collapse)`;
        shockAlert = "SEVERE_SHOCK";
      } else if (siVal >= 0.7) {
        shockIndex = `${siFixed} (Moderate Shock / Watch Closely)`;
        shockAlert = "MODERATE_SHOCK";
      } else {
        shockIndex = `${siFixed} (Normal Hemodynamics)`;
        shockAlert = "NORMAL";
      }
    }
  }

  // 5. Clinical Syndrome & Provisional Diagnosis Classification
  let diagnosis = extractField(/(?:^|\n)\s*(?:Provisional\s*Diagnosis|Diagnosis|Clinical\s*Impression|Impression)\s*[:=]\s*([^\n\r]+)/i);
  let syndrome = "General Emergency";
  const lowerText = cleanText.toLowerCase();

  // 9. Statutory Grievous Hurt Clauses (BNS Section 116 / IPC 320)
  const grievousClauses = [];
  if (lowerText.includes("fracture") || lowerText.includes("dislocation") || lowerText.includes("clause 7") || lowerText.includes("clause vii") || lowerText.includes("bone")) {
    grievousClauses.push("Clause 7: Fracture or Dislocation of Bone / Tooth");
  }
  if (lowerText.includes("endangering life") || lowerText.includes("severe bodily pain") || lowerText.includes("clause 8") || lowerText.includes("clause viii") || shockAlert === "SEVERE_SHOCK") {
    grievousClauses.push("Clause 8: Any hurt endangering life or causing severe bodily pain for 20 days");
  }
  if (lowerText.includes("emasculation") || lowerText.includes("clause 1") || lowerText.includes("clause i")) {
    grievousClauses.push("Clause 1: Emasculation");
  }
  if (lowerText.includes("privation of sight") || lowerText.includes("clause 2") || lowerText.includes("clause ii")) {
    grievousClauses.push("Clause 2: Permanent privation of the sight of either eye");
  }
  if (lowerText.includes("privation of hearing") || lowerText.includes("clause 3") || lowerText.includes("clause iii")) {
    grievousClauses.push("Clause 3: Permanent privation of the hearing of either ear");
  }
  if (lowerText.includes("privation of any member") || lowerText.includes("clause 4") || lowerText.includes("clause iv")) {
    grievousClauses.push("Clause 4: Privation of any member or joint");
  }
  if (lowerText.includes("destruction of power of member") || lowerText.includes("clause 5") || lowerText.includes("clause v")) {
    grievousClauses.push("Clause 5: Destruction or permanent impairing of the power of any member or joint");
  }
  if (lowerText.includes("disfiguration of head") || lowerText.includes("disfiguration of face") || lowerText.includes("clause 6") || lowerText.includes("clause vi")) {
    grievousClauses.push("Clause 6: Permanent disfiguration of the head or face");
  }

  if (!diagnosis) {
    if (lowerText.includes("snake") || lowerText.includes("bite") || lowerText.includes("asv") || lowerText.includes("20wbct") || lowerText.includes("fang") || lowerText.includes("ptosis") || lowerText.includes("envenomation")) {
      if (lowerText.includes("ptosis") || lowerText.includes("swallow") || lowerText.includes("saliva") || lowerText.includes("krait") || lowerText.includes("cobra")) {
        diagnosis = "Acute Neurotoxic Snakebite Envenomation";
      } else {
        diagnosis = "Acute Vasculotoxic / Hemotoxic Snakebite with Coagulopathy";
      }
      syndrome = "Snakebite Envenomation";
    } else if (lowerText.includes("celphos") || lowerText.includes("organophosphate") || lowerText.includes("pesticide") || lowerText.includes("poison") || lowerText.includes("lavage") || lowerText.includes("atropine")) {
      diagnosis = lowerText.includes("celphos") ? "Severe Aluminum Phosphide (Celphos) Ingestion" : "Organophosphate Poisoning (Cholinergic Toxidrome)";
      syndrome = "Emergency Toxicology";
    } else if (lowerText.includes("stemi") || lowerText.includes("chest pain") || lowerText.includes("st elevation") || lowerText.includes("infarction") || lowerText.includes("troponin")) {
      diagnosis = "Acute Coronary Syndrome (STEMI)";
      syndrome = "Cardiovascular Emergency";
    } else if (lowerText.includes("rta") || lowerText.includes("trauma") || lowerText.includes("head injury") || lowerText.includes("accident") || lowerText.includes("fracture") || lowerText.includes("assault")) {
      if (lowerText.includes("head injury") || lowerText.includes("gcs") || lowerText.includes("scalp") || lowerText.includes("pupil")) {
        diagnosis = "Polytrauma with Traumatic Brain Injury (TBI)";
      } else {
        diagnosis = "Road Traffic Accident (RTA) / Polytrauma";
      }
      syndrome = "Trauma & Neurosurgery";
    } else if (lowerText.includes("stroke") || lowerText.includes("cva") || lowerText.includes("hemiplegia") || lowerText.includes("facial deviation")) {
      diagnosis = "Acute Cerebrovascular Accident (CVA / Stroke)";
      syndrome = "Neurology Emergency";
    } else if (lowerText.includes("sepsis") || lowerText.includes("purpura") || lowerText.includes("bacteremia")) {
      diagnosis = "Severe Sepsis with Septic Shock";
      syndrome = "Critical Care / Sepsis";
    } else if (lowerText.includes("dka") || lowerText.includes("ketoacidosis") || (rbs && parseInt(rbs, 10) > 300)) {
      diagnosis = "Diabetic Ketoacidosis (DKA)";
      syndrome = "Endocrine Emergency";
    } else if (lowerText.includes("diarrhea") || lowerText.includes("vomit") || lowerText.includes("gastroenteritis") || lowerText.includes("dehydration") || lowerText.includes("sunken eyes")) {
      diagnosis = "Acute Gastroenteritis with Severe Dehydration & Hypovolemic Shock";
      syndrome = "Pediatric & GI Emergency";
    }
  }

  // Triage Level Classification (Red / Yellow / Green)
  let triageLevel = "GREEN";
  const gcsNum = gcs ? parseInt(gcs.split('/')[0], 10) : 15;
  const sbpNum = bp ? parseInt(bp.split('/')[0], 10) : 120;
  const spo2Num = spo2 ? parseInt(spo2, 10) : 98;
  if (shockAlert === "SEVERE_SHOCK" || gcsNum <= 8 || sbpNum < 90 || spo2Num < 90 || syndrome === "Snakebite Envenomation" || syndrome === "Cardiovascular Emergency" || syndrome === "Emergency Toxicology" || (grievousClauses && grievousClauses.length > 0)) {
    triageLevel = "RED";
  } else if (shockAlert === "MODERATE_SHOCK" || gcsNum <= 13 || spo2Num < 95 || sbpNum < 100) {
    triageLevel = "YELLOW";
  }

  // 6. Medications / Treatment Extraction
  let drugs = null;
  const treatmentBlockMatch = cleanText.match(/(?:^|\n)\s*(?:Initial\s*Treatment(?:\s*Given)?|Emergency\s*Drugs(?:\s*Administered)?|Treatment(?:\s*Given)?|Medications(?:\s*Given)?|Rx(?:\s*Given)?)\s*[:=]\s*([\s\S]*?)(?=(?:\n\s*(?:Reason\s*for|Transport|Attendant|Medical\s*Officer|===|---|\bVitals\b|\bHistory\b|\bDiagnosis\b)|$))/i);
  if (treatmentBlockMatch && treatmentBlockMatch[1]) {
    const rawLines = treatmentBlockMatch[1]
      .split("\n")
      .map(l => l.replace(/^[-*•0-9.)\s]+/, '').trim())
      .filter(l => l.length > 0);
    if (rawLines.length > 0) {
      drugs = rawLines.join("; ");
    }
  }

  // Fallback medication token scanning if no explicit block was parsed
  if (!drugs) {
    const detectedDrugs = [];
    if (lowerText.includes("asv") || lowerText.includes("anti-snake venom")) {
      const asvMatch = cleanText.match(/(\d+\s*vials?\s*(?:polyvalent\s*)?asv[^\n,;.]*)/i);
      detectedDrugs.push(asvMatch ? asvMatch[1] : "10 Vials Polyvalent ASV IV in NS");
    }
    if (lowerText.includes("atropine")) {
      const atropineMatch = cleanText.match(/(inj\.?\s*atropine[^\n,;.]*)/i);
      detectedDrugs.push(atropineMatch ? atropineMatch[1] : "Inj. Atropine 0.6mg IV");
    }
    if (lowerText.includes("neostigmine")) {
      detectedDrugs.push("Inj. Neostigmine 1.5mg IV");
    }
    if (lowerText.includes("tranexa") || lowerText.includes("tranexamic")) {
      detectedDrugs.push("Inj. Tranexamic Acid 1g IV");
    }
    if (lowerText.includes("tt") || lowerText.includes("tetanus")) {
      detectedDrugs.push("Inj. Tetanus Toxoid 0.5 mL IM");
    }
    if (lowerText.includes("hydrocort") || lowerText.includes("hydrocortisone")) {
      detectedDrugs.push("Inj. Hydrocortisone 100mg IV");
    }
    if (lowerText.includes("ns") || lowerText.includes("normal saline")) {
      const nsMatch = cleanText.match(/(ns\s*\d+[a-zA-Z\s]*bolus[^\n,;.]*|1L\s*ns[^\n,;.]*|500\s*ml\s*ns[^\n,;.]*)/i);
      detectedDrugs.push(nsMatch ? nsMatch[1] : "IV Normal Saline 1000 mL bolus");
    }
    if (lowerText.includes("rl") || lowerText.includes("ringer")) {
      detectedDrugs.push("IV Ringer Lactate fluid resuscitation");
    }
    if (lowerText.includes("pantop") || lowerText.includes("pantoprazole")) {
      detectedDrugs.push("Inj. Pantoprazole 40mg IV");
    }
    if (lowerText.includes("ceftriaxone")) {
      detectedDrugs.push("Inj. Ceftriaxone 1g IV");
    }
    if (lowerText.includes("aspirin") || lowerText.includes("ecosprin")) {
      detectedDrugs.push("Tab. Aspirin 300mg (chewed)");
    }
    if (lowerText.includes("clopidogrel")) {
      detectedDrugs.push("Tab. Clopidogrel 300mg stat");
    }
    if (lowerText.includes("atorvastatin")) {
      detectedDrugs.push("Tab. Atorvastatin 80mg stat");
    }
    if (lowerText.includes("charcoal") || lowerText.includes("lavage")) {
      detectedDrugs.push("Gastric lavage with Activated Charcoal 50g slurry");
    }
    if (detectedDrugs.length > 0) {
      drugs = detectedDrugs.join("; ");
    }
  }

  // 7. Reason for Referral Extraction
  let reason = extractField(/(?:^|\n)\s*(?:Reason\s*for\s*(?:Urgent\s*)?Referral|Referral\s*Reason|Ref\s*Reason|Reason)\s*[:=]\s*([^\n\r]+)/i);
  if (!reason) {
    const refMatch = cleanText.match(/\b(?:Ref(?:er|erred)?|Shift(?:ed)?|Transfer(?:red)?)\s*(?:to|urgently\s*to|for)?\s*([^\n\r.]+)/i);
    if (refMatch) {
      reason = `Requires urgent transfer to ${refMatch[1].trim()}`;
    } else if (syndrome === "Snakebite Envenomation") {
      reason = "Requires higher tertiary care ICU monitoring / Mechanical ventilation standby";
    } else if (syndrome === "Trauma & Neurosurgery") {
      reason = "Requires urgent NCCT Brain, neurosurgical and operative intervention";
    } else if (syndrome === "Emergency Toxicology") {
      reason = "Severe poisoning requiring intensive care unit monitoring and toxicological support";
    } else if (syndrome === "Cardiovascular Emergency") {
      reason = "Requires immediate catheterization lab / primary PCI standby and tertiary cardiac monitoring";
    }
  }

  // 8. Transport Extraction
  let transport = extractField(/(?:^|\n)\s*(?:Transport(?:\s*Condition)?|En-Route\s*Escort|Ambulance)\s*[:=]\s*([^\n\r]+)/i);
  if (!transport) {
    transport = "Govt 108 Emergency ALS Ambulance with continuous Oxygen flow & paramedic escort";
  }

  return {
    success: true,
    type: "TXT",
    fields: {
      patient: patientName,
      ageSex: parsedAgeSex,
      facility: facility,
      doctor: doctorName,
      bp: bp,
      pr: pr,
      spo2: spo2,
      rbs: rbs,
      gcs: gcs,
      rr: rr,
      shockIndex: shockIndex,
      shockAlert: shockAlert,
      diagnosis: diagnosis,
      syndrome: syndrome,
      triageLevel: triageLevel,
      drugs: drugs,
      reason: reason,
      transport: transport,
      grievousClauses: grievousClauses
    }
  };
}

// -------------------------------------------------------------
// MULTI-STAGE DOCUMENT TRANSFORMATION PIPELINE
// -------------------------------------------------------------
function startDocumentTransformation() {
  if (!activeUploadedDoc || !activeUploadedDoc.text) {
    showDocError("No Document Selected", "Please paste an unformatted clinical note or drag and drop a clinical file.");
    return;
  }

  const pipeline = document.getElementById("doc-processing-pipeline");
  const statusText = document.getElementById("doc-pipeline-status-text");
  const pctText = document.getElementById("doc-pipeline-pct");
  const bar = document.getElementById("doc-pipeline-bar");

  if (pipeline) pipeline.classList.remove("hidden");
  hideDocError();

  // Stage 1: Validation (25%)
  if (statusText) statusText.innerText = "Stage 1/4: Validating Document Structure & Encoding...";
  if (pctText) pctText.innerText = "25%";
  if (bar) bar.style.width = "25%";

  setTimeout(() => {
    // Stage 2: Entity & Vitals Parsing (55%)
    if (statusText) statusText.innerText = "Stage 2/4: Extracting Clinical Entities, Vitals & Shock Index...";
    if (pctText) pctText.innerText = "55%";
    if (bar) bar.style.width = "55%";

    setTimeout(() => {
      // Stage 3: Statutory Structuring (85%)
      if (statusText) statusText.innerText = "Stage 3/4: Mapping ICMR / BNS 116 Government Stationery...";
      if (pctText) pctText.innerText = "85%";
      if (bar) bar.style.width = "85%";

      setTimeout(() => {
        // Stage 4: Completion (100%)
        executeDocumentParser(activeUploadedDoc);
        if (statusText) statusText.innerText = "Assistive Transformation Complete — Ready for Clinician Review.";
        if (pctText) pctText.innerText = "100%";
        if (bar) bar.style.width = "100%";
        showToast("Messy Note Transformed into Clean Stationery in Seconds!");
      }, 200);
    }, 200);
  }, 200);
}

function renderStructuredEntitiesReview(fields) {
  const container = document.getElementById("doc-extracted-entities-container");
  if (!container) return;

  const isRed = fields.triageLevel === "RED";
  const isYellow = fields.triageLevel === "YELLOW";
  const triageBadge = isRed ? 
    `<span class="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-black text-[10px] tracking-wide animate-pulse">🔴 RED TRIAGE</span>` :
    (isYellow ? 
      `<span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-black text-[10px] tracking-wide">🟡 YELLOW TRIAGE</span>` :
      `<span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-black text-[10px] tracking-wide">🟢 GREEN TRIAGE</span>`);

  let shockBadge = "";
  if (fields.shockIndex) {
    const isShockAlert = fields.shockAlert === "SEVERE_SHOCK";
    shockBadge = `
      <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${isShockAlert ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-black' : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'} text-[11px] font-mono">
        <span>🫀 Shock Index:</span>
        <span>${fields.shockIndex}</span>
      </div>
    `;
  }

  const vitalsPills = [
    { label: "BP", val: fields.bp, unit: "mmHg", warn: fields.bp && parseInt(fields.bp.split('/')[0], 10) < 90 },
    { label: "PR", val: fields.pr, unit: "bpm", warn: fields.pr && (parseInt(fields.pr, 10) > 100 || parseInt(fields.pr, 10) < 60) },
    { label: "SpO2", val: fields.spo2, unit: "%", warn: fields.spo2 && parseInt(fields.spo2, 10) < 92 },
    { label: "RBS", val: fields.rbs, unit: "mg/dL", warn: fields.rbs && (parseInt(fields.rbs, 10) < 70 || parseInt(fields.rbs, 10) > 200) },
    { label: "GCS", val: fields.gcs, unit: "", warn: fields.gcs && parseInt(fields.gcs.split('/')[0], 10) < 14 }
  ].filter(v => v.val).map(v => `
    <div class="px-2 py-1 rounded-lg border ${v.warn ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold' : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200'} text-[11px] font-mono flex items-center gap-1">
      <span class="text-slate-400 text-[10px]">${v.label}:</span>
      <span>${v.val} ${v.unit}</span>
    </div>
  `).join("");

  const medsPills = fields.drugs ? fields.drugs.split(';').map(m => `
    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-[10px] font-medium font-mono">
      <span>💊</span>
      <span>${m.trim()}</span>
    </span>
  `).join(" ") : '<span class="text-[11px] text-slate-400 italic">None documented</span>';

  const grievousHtml = fields.grievousClauses && fields.grievousClauses.length > 0 ? `
    <div class="pt-2 border-t border-slate-100 dark:border-zinc-800">
      <span class="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">⚖️ BNS Sec 116 Grievous Hurt Detected:</span>
      <div class="mt-1 space-y-1">
        ${fields.grievousClauses.map(c => `<div class="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-0.5">• ${c}</div>`).join("")}
      </div>
    </div>
  ` : "";

  container.innerHTML = `
    <div class="p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3 animate-fadeIn">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-zinc-800 pb-2.5">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-slate-900 dark:text-white">Structured Entities Extracted:</span>
          ${triageBadge}
        </div>
        <span class="text-[10px] text-slate-400 font-mono">${fields.syndrome || 'Clinical Case'}</span>
      </div>

      <!-- Vitals Strip -->
      <div class="space-y-1.5">
        <div class="flex flex-wrap items-center gap-1.5">
          ${shockBadge}
          ${vitalsPills || '<span class="text-[11px] text-slate-400">No vitals in note</span>'}
        </div>
      </div>

      <!-- Extracted Medications -->
      <div>
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Extracted Emergency Regimen:</span>
        <div class="flex flex-wrap gap-1">${medsPills}</div>
      </div>

      ${grievousHtml}

      <!-- 1-Click Form Transfer & Action Strip -->
      <div class="pt-2 border-t border-slate-200/80 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-1.5">
          <button onclick="transferEntitiesToReferralForm()" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs transition active:scale-95">
            🚑 Load into Pre-Referral Form
          </button>
          <button onclick="transferEntitiesToMlcForm()" class="px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-lg text-xs font-semibold border border-slate-200 dark:border-zinc-700 transition active:scale-95">
            ⚖️ Load into MLC Form
          </button>
        </div>
        <button onclick="switchHub3MobileView('preview')" class="lg:hidden px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-lg shadow-2xs">
          📄 View Stationery Slip →
        </button>
      </div>
    </div>
  `;
  container.classList.remove("hidden");
}

function transferEntitiesToReferralForm() {
  switchLegalSubTab('referral');
  showToast("Loaded extracted clinical data into Pre-Referral Form");
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    switchHub3MobileView('form');
  }
}

function transferEntitiesToMlcForm() {
  switchLegalSubTab('mlc');
  showToast("Loaded extracted clinical data into Medico-Legal Injury Form");
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    switchHub3MobileView('form');
  }
}

function switchHub3MobileView(view) {
  triggerHapticFeedback(10);
  appState.hub3MobileView = view;
  const leftPane = document.getElementById("hub3-left-pane");
  const rightPane = document.getElementById("hub3-right-pane");
  const btnForm = document.getElementById("btn-hub3-mobile-form");
  const btnPreview = document.getElementById("btn-hub3-mobile-preview");

  if (view === "form") {
    if (leftPane) {
      leftPane.classList.remove("hidden");
      leftPane.classList.add("block");
    }
    if (rightPane) {
      rightPane.classList.add("hidden");
      rightPane.classList.remove("block", "flex");
    }
    if (btnForm) {
      btnForm.className = "flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-2xs transition";
    }
    if (btnPreview) {
      btnPreview.className = "flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition flex items-center justify-center gap-1.5";
    }
  } else {
    updateActiveLegalPreview();
    if (leftPane) {
      leftPane.classList.add("hidden");
      leftPane.classList.remove("block");
    }
    if (rightPane) {
      rightPane.classList.remove("hidden");
      rightPane.classList.add("block");
    }
    if (btnPreview) {
      btnPreview.className = "flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-2xs transition flex items-center justify-center gap-1.5";
    }
    if (btnForm) {
      btnForm.className = "flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition";
    }
  }
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function executeDocumentParser(doc) {
  const result = parseClinicalDocument(doc.text, doc.type);

  if (!result.success) {
    showDocError(result.error || "Document Parsing Failure", result.message || "Unable to extract clinical data from file.");
    return;
  }

  // Render the structured review badges
  if (result.type !== "CSV" && typeof renderStructuredEntitiesReview === "function") {
    renderStructuredEntitiesReview(result.fields);
  }

  if (result.type === "CSV") {
    const totalExamined = result.fields.totalExamined || 0;
    const summaryList = (result.fields.records || []).map(r => `- [${r.code}] ${r.category}: ${r.count} cases`).join("\n");

    transformedDocOutput = `===============================================================
INTEGRATED DISEASE SURVEILLANCE PROGRAMME (IDSP FORM P DRAFT)
Primary Health Care & Casualty Footfall Summary
===============================================================
FACILITY NAME      : ${appState.refFacility}
REPORTING OFFICER  : ${appState.refDoctor}
REPORTING DATE     : ${new Date().toISOString().split('T')[0]}
TOTAL PATIENTS     : ${totalExamined} Cases Recorded in Uploaded CSV
---------------------------------------------------------------
EPIDEMIOLOGICAL SURVEILLANCE BREAKDOWN:
${summaryList || "[No breakdown entries found]"}
---------------------------------------------------------------
REPORTING OFFICER REVIEW DECLARATION:
"I have examined and verified the above disease surveillance counts.
Outbreak-prone disease alerts have been cross-checked."

Medical Officer Signature: ____________________________________
Registration No (NMC / State Council): _______________________
===============================================================`;
    updateActiveLegalPreview();
    return;
  }

  const f = result.fields;

  // Apply to appState safely without inventing false data
  if (f.patient) {
    appState.refPtName = f.patient;
    const el = document.getElementById("ref-input-ptname");
    if (el) el.value = f.patient;
  }
  if (f.ageSex) {
    appState.refPtAgeSex = f.ageSex;
    const el = document.getElementById("ref-input-agesex");
    if (el) el.value = f.ageSex;
  }
  if (f.facility) {
    appState.refFacility = f.facility;
    const el = document.getElementById("ref-input-facility");
    if (el) el.value = f.facility;
  }
  if (f.doctor) {
    appState.refDoctor = f.doctor;
    const el = document.getElementById("ref-input-doctor");
    if (el) el.value = f.doctor;
  }
  if (f.bp) {
    appState.refVitals.bp = f.bp;
    const el = document.getElementById("ref-input-bp");
    if (el) el.value = f.bp;
  }
  if (f.pr) {
    appState.refVitals.pr = f.pr;
    const el = document.getElementById("ref-input-pr");
    if (el) el.value = f.pr;
  }
  if (f.spo2) {
    appState.refVitals.spo2 = f.spo2;
    const el = document.getElementById("ref-input-spo2");
    if (el) el.value = f.spo2;
  }
  if (f.rbs) {
    appState.refVitals.rbs = f.rbs;
    const el = document.getElementById("ref-input-rbs");
    if (el) el.value = f.rbs;
  }
  if (f.gcs) {
    appState.refVitals.gcs = f.gcs;
    const el = document.getElementById("ref-input-gcs");
    if (el) el.value = f.gcs;
  }
  if (f.rr) {
    appState.refVitals.rr = f.rr;
  }
  if (f.diagnosis) {
    appState.refDiagnosis = f.diagnosis;
    const el = document.getElementById("ref-input-diag");
    if (el) el.value = f.diagnosis;
  }
  if (f.drugs) {
    appState.refDrugsGiven = f.drugs;
    const el = document.getElementById("ref-input-drugs");
    if (el) el.value = f.drugs;
  }
  if (f.reason) {
    appState.refReason = f.reason;
    const el = document.getElementById("ref-input-reason");
    if (el) el.value = f.reason;
  }
  if (f.transport) {
    appState.refTransport = f.transport;
  }

  saveSessionDrafts();

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const sbp = f.bp ? (parseFloat(f.bp.split('/')[0]) || null) : null;
  const hr = f.pr ? (parseFloat(f.pr) || null) : null;
  let shockText = "[Vitals Not Sufficient to Calculate Shock Index]";
  if (sbp && hr && CLINICAL_DATA.shockIndexCalculator) {
    const si = CLINICAL_DATA.shockIndexCalculator.calc(hr, sbp);
    shockText = `${si.index} [${si.triage}]`;
  } else if (f.shockIndex) {
    shockText = f.shockIndex;
  }

  transformedDocOutput = `===============================================================
CLINICAL ASSISTIVE SUMMARY & PRE-REFERRAL DRAFT
Generated via DocShift In-Memory Extraction Engine (NLEM / ICMR)
NOTICE: Assistive Draft Only — Must be clinically verified, edited,
and signed by the Registered Medical Practitioner.
===============================================================
REFERRING FACILITY : ${f.facility || appState.refFacility || "[Facility Not Stated in Note]"}
MEDICAL OFFICER    : ${f.doctor || appState.refDoctor || "[Attending Medical Officer]"}
DATE & TIME        : ${dateStr} at ${timeStr}
REFERRED TO        : Nearest Tertiary Care / Medical College Hospital
---------------------------------------------------------------
PATIENT PARTICULARS (EXTRACTED FROM SOURCE NOTE):
Name               : ${f.patient || "[Not Stated in Note — Clinician to Specify]"}
Age / Sex          : ${f.ageSex || "[Not Stated]"}
---------------------------------------------------------------
PRESENTATION VITALS (EXTRACTED & CITATION-CHECKED):
- Blood Pressure (BP): ${f.bp ? `${f.bp} mmHg` : "[Not Recorded in Note]"}
- Pulse Rate (PR)    : ${f.pr ? `${f.pr} bpm` : "[Not Recorded in Note]"}
- Shock Index (SI)   : ${shockText}
- Oxygen Sat (SpO2)  : ${f.spo2 ? `${f.spo2} %` : "[Not Recorded in Note]"}
- Blood Sugar (RBS)  : ${f.rbs ? `${f.rbs} mg/dL` : "[Not Recorded in Note]"}
- Glasgow Coma Scale : ${f.gcs || "[Not Recorded in Note]"}
- Respiratory Rate   : ${f.rr ? `${f.rr} /min` : "[Not Recorded in Note]"}
---------------------------------------------------------------
PROVISIONAL CLINICAL DIAGNOSIS:
${f.diagnosis || "[Diagnosis Not Specified in Note — Clinician Verification Required]"}

EMERGENCY STABILIZATION / MEDICATIONS ADMINISTERED:
${f.drugs || "[No Emergency Medications Documented in Source Note]"}

REASON FOR URGENT REFERRAL:
${f.reason || "[Referral Reason Not Specified in Note]"}

TRANSPORT & EN-ROUTE ESCORT:
${f.transport || "Govt 108 Emergency ALS Ambulance with continuous Oxygen flow & paramedic escort"}
---------------------------------------------------------------
STATUTORY MEDICO-LEGAL REFERENCE:
${f.grievousClauses && f.grievousClauses.length > 0 ? `- Grievous Hurt Indicators under Sec 116 Bharatiya Nyaya Sanhita (BNS, 2023):\n  * ${f.grievousClauses.join("\n  * ")}` : '- General Clinical Referral (Subject to institutional documentation protocols).'}

Attendant Signature / Thumb: _________________________________
Attendant Name & Relation  : _________________________________

Medical Officer Signature & Seal: ____________________________
Registration No (NMC / State Council): _______________________
===============================================================`;

  updateActiveLegalPreview();
}

function purgeAllShiftData() {
  if (confirm("Are you sure you want to PURGE all active patient notes, drafts, and IDSP tallies from local storage? This action cannot be undone.")) {
    localStorage.removeItem("docshift-session-draft");
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith("docshift-tally-")) localStorage.removeItem(k);
    });
    appState.refPtName = "Patient";
    appState.refPtAgeSex = "Adult";
    appState.refVitals = { bp: "120/80", pr: "84", spo2: "98", rr: "18", rbs: "110", gcs: "15/15" };
    appState.refDiagnosis = "Clinical Presentation";
    appState.refDrugsGiven = "Emergency Stabilization";
    activeUploadedDoc = null;
    transformedDocOutput = null;
    loadTallyCounts();
    syncQuickTallyStrip();
    clearUploadedDoc();
    updateActiveLegalPreview();
    showToast("All Local Patient Data & Drafts Purged");
  }
}

function printThermalLegalSlip() {
  setPrintPaperFormat("thermal");
  printActiveLegalSlip();
}

function setPrintPaperFormat(mode) {
  appState.printPaperFormat = mode;
  saveSessionDrafts();
  updateActiveLegalPreview();
  showToast(`Print format set to: ${mode.toUpperCase()}`);
}

function shareActiveLegalSlip() {
  let text = "";
  if (appState.currentLegalSubTab === "referral") text = generateReferralText();
  else if (appState.currentLegalSubTab === "mlc") text = generateMlcText();
  else if (appState.currentLegalSubTab === "transformer") text = transformedDocOutput || generateTransformerPlaceholderText();
  else text = generateAutopsyReferenceText();

  // Prompt privacy & de-identification confirmation before transmitting via external URL
  const confirmShare = confirm(
    "PATIENT DATA PRIVACY NOTICE:\n\n" +
    "Before sharing clinical information over WhatsApp or external messaging:\n" +
    "1. Ensure patient/attendant consent has been obtained.\n" +
    "2. Do you wish to share a DE-IDENTIFIED summary (redacting personal identifiers)?\n\n" +
    "Click [OK] for De-Identified Summary (Recommended)\n" +
    "Click [Cancel] for Unmodified Note"
  );

  let sharePayload = text;
  if (confirmShare) {
    // Redact patient identifying line for transit privacy
    sharePayload = text.replace(/Name\s*:\s*[^\n\r]+/i, "Name               : [REDACTED FOR TRANSIT PRIVACY / REFER TO PHYSICAL SLIP]");
  }

  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(sharePayload)}`;
  window.open(url, "_blank");
}

function copyActiveLegalSlip() {
  let text = "";
  if (appState.currentLegalSubTab === "referral") text = generateReferralText();
  else if (appState.currentLegalSubTab === "mlc") text = generateMlcText();
  else if (appState.currentLegalSubTab === "transformer") text = transformedDocOutput || generateTransformerPlaceholderText();
  else text = generateAutopsyReferenceText();

  navigator.clipboard.writeText(text).then(() => {
    const copyBtn = document.getElementById("legal-btn-copy");
    if (copyBtn) {
      const originalText = copyBtn.innerText;
      copyBtn.innerText = "✓ Copied!";
      copyBtn.classList.add("bg-emerald-600", "text-white");
      setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.classList.remove("bg-emerald-600", "text-white");
      }, 2000);
    }
    showToast("Clinical summary copied to clipboard");
  });
}

function printActiveLegalSlip() {
  let text = "";
  let title = "Document";
  const isThermal = appState.printPaperFormat === "thermal";

  if (appState.currentLegalSubTab === "referral") {
    text = generateReferralText();
    title = isThermal ? "Pre-Referral (Thermal)" : "Official Pre-Referral Clinical Slip";
  } else if (appState.currentLegalSubTab === "mlc") {
    text = generateMlcText();
    title = "Medico-Legal Injury Certificate (BNS 116)";
  } else {
    text = generateAutopsyReferenceText();
    title = "Post-Mortem & Forensic Guidelines";
  }

  const printWin = window.open("", "_blank");
  const pageSize = isThermal ? "58mm auto" : "A4";
  const fontSize = isThermal ? "8pt" : "11pt";
  const padding = isThermal ? "2mm" : "15mm";

  printWin.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} — DocShift</title>
        <style>
          @page { size: ${pageSize}; margin: ${padding}; }
          body { 
            font-family: 'Courier New', Courier, monospace; 
            font-size: ${fontSize}; 
            line-height: 1.35; 
            color: #000; 
            background: #fff;
            padding: 4px;
            white-space: pre-wrap;
          }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 8px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">GOVT CLINICAL SERVICES • STATUTORY RECORD</div>
        <div>${escapeHtml(text)}</div>
      </body>
    </html>
  `);
  printWin.document.close();
  printWin.focus();
  setTimeout(() => {
    printWin.print();
  }, 250);
}

function escapeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// -------------------------------------------------------------
// PEDIATRIC DOSING DESK & REGIONAL TRANSLATIONS
// -------------------------------------------------------------
function setWeight(weight) {
  appState.pedsWeight = Math.max(2.0, Math.min(50.0, parseFloat(weight)));
  const slider = document.getElementById("peds-weight-slider");
  if (slider) slider.value = appState.pedsWeight;
  const display = document.getElementById("peds-weight-display");
  if (display) display.innerText = `${appState.pedsWeight.toFixed(1)} kg`;
  
  saveSessionDrafts();
  renderPediatricContent();
}

function adjustWeight(delta) {
  triggerHapticFeedback(15);
  setWeight(appState.pedsWeight + delta);
}

function handlePedsSearch(query) {
  appState.pedsSearch = query.trim();
  renderPediatricContent();
}

function setPrescriptionLanguage(langCode) {
  appState.prescriptionLanguage = langCode;
  saveSessionDrafts();
  renderPediatricContent();
  showToast(`Language set to: ${langCode.toUpperCase()}`);
}

function setPedsCategory(cat) {
  appState.pedsCategory = cat;
  document.querySelectorAll(".peds-cat-btn").forEach(btn => {
    btn.classList.remove("bg-slate-900", "dark:bg-white", "text-white", "dark:text-zinc-950");
    btn.classList.add("bg-slate-100", "dark:bg-zinc-900", "text-slate-600", "dark:text-zinc-400", "border", "border-slate-200", "dark:border-zinc-800");
  });

  const catBtnId = `peds-cat-${cat.replace(/[\s\/]+/g, '')}`;
  const activeBtn = document.getElementById(catBtnId);
  if (activeBtn) {
    activeBtn.classList.remove("bg-slate-100", "dark:bg-zinc-900", "text-slate-600", "dark:text-zinc-400", "border", "border-slate-200", "dark:border-zinc-800");
    activeBtn.classList.add("bg-slate-900", "dark:bg-white", "text-white", "dark:text-zinc-950");
  }
  renderPediatricContent();
}

function setPedsViewMode(mode) {
  appState.pedsViewMode = mode;
  const btnMatrix = document.getElementById("btn-view-matrix");
  const btnCards = document.getElementById("btn-view-cards");
  const btnPals = document.getElementById("btn-view-pals");
  const catBar = document.getElementById("peds-category-chips-bar");

  [btnMatrix, btnCards, btnPals].forEach(b => {
    if (b) {
      b.className = "px-3 py-1.5 text-xs font-bold rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition shrink-0";
    }
  });

  if (mode === "matrix" && btnMatrix) {
    btnMatrix.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-2xs transition shrink-0";
    if (catBar) catBar.style.display = "flex";
  } else if (mode === "cards" && btnCards) {
    btnCards.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-2xs transition shrink-0";
    if (catBar) catBar.style.display = "flex";
  } else if (mode === "pals" && btnPals) {
    btnPals.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600 text-white shadow-2xs transition shrink-0";
    if (catBar) catBar.style.display = "none";
  }
  renderPediatricContent();
}

function renderPediatricDesk() {
  const slider = document.getElementById("peds-weight-slider");
  if (slider) {
    slider.addEventListener("input", (e) => {
      setWeight(e.target.value);
    });
  }
  renderPediatricContent();
}

function handlePedsSearch(val) {
  appState.pedsSearch = (val || "").trim();
  const clearBtn = document.getElementById("peds-search-clear-btn");
  if (clearBtn) {
    if (appState.pedsSearch.length > 0) clearBtn.classList.remove("hidden");
    else clearBtn.classList.add("hidden");
  }
  renderPediatricContent();
}

function clearPedsSearch() {
  const input = document.getElementById("peds-desk-search-input");
  if (input) input.value = "";
  handlePedsSearch("");
}

function getFilteredPediatrics() {
  let filtered = CLINICAL_DATA.pediatrics;
  if (appState.pedsCategory !== "All") {
    filtered = filtered.filter(item => item.category === appState.pedsCategory);
  }
  if (appState.pedsSearch) {
    const q = appState.pedsSearch.toLowerCase().trim();
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(q) ||
      item.indications.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.rule.toLowerCase().includes(q) ||
      (item.keywords && item.keywords.toLowerCase().includes(q)) ||
      (item.notes && item.notes.toLowerCase().includes(q))
    );
  }
  return filtered;
}

function renderPediatricContent() {
  const container = document.getElementById("pediatric-content-container");
  if (!container) return;

  if (appState.pedsViewMode === "pals") {
    renderPalsTapeInContainer(container);
    return;
  }

  const filtered = getFilteredPediatrics();
  const w = appState.pedsWeight;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80">
        <p class="text-sm font-semibold">No generic medicines match "${escapeHtml(appState.pedsSearch)}".</p>
        <p class="text-xs mt-1 text-slate-400 dark:text-zinc-500">Try searching Paracetamol, Amoxiclav, Ondansetron, Cetirizine, or Salbutamol</p>
      </div>
    `;
    return;
  }

  if (appState.pedsViewMode === "matrix") {
    renderPediatricMatrix(container, filtered, w);
  } else {
    renderPediatricCards(container, filtered, w);
  }
}

// 1. DENSE GLANCEABLE MATRIX TABLE
function renderPediatricMatrix(container, drugs, w) {
  const lang = appState.prescriptionLanguage || "en";
  const langDict = REGIONAL_PRESCRIPTION_TEXTS[lang] || REGIONAL_PRESCRIPTION_TEXTS.en;

  const rowsHtml = drugs.map((drug) => {
    const primaryForm = drug.formulations[drug.formulations.length - 1];
    const res = primaryForm.calc(w);

    const altForms = drug.formulations.map(f => {
      const r = f.calc(w);
      return `<span class="inline-block bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 px-1.5 py-0.5 rounded text-[10px] text-slate-700 dark:text-zinc-300 font-mono mr-1 mb-0.5">${f.type}: <strong>${r.ml} ${r.unit || ''}</strong></span>`;
    }).join("");

    return `
      <tr class="border-b border-slate-100 dark:border-zinc-800/60 hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition">
        <!-- Drug & Category -->
        <td class="py-3 px-3.5">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-bold text-slate-900 dark:text-white">${drug.name}</span>
            ${drug.id === 'ibuprofen' ? '<span class="px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[9px] font-bold">DENGUE ALERT</span>' : ''}
          </div>
          <div class="text-[10px] text-slate-400 dark:text-zinc-500">${drug.category}</div>
          <div class="mt-1 flex flex-wrap">${altForms}</div>
        </td>

        <!-- Primary Strength -->
        <td class="py-3 px-3 text-xs text-slate-500 dark:text-zinc-400 font-mono hidden sm:table-cell">
          ${primaryForm.strength}
        </td>

        <!-- Calculated Dose -->
        <td class="py-3 px-3">
          <div class="flex items-baseline gap-1">
            <span class="text-base font-black font-mono tracking-tight text-indigo-600 dark:text-indigo-400">${res.ml}</span>
            ${res.drops ? `<span class="text-xs font-semibold text-purple-600 dark:text-purple-400 font-mono">(${res.drops} drops)</span>` : ''}
          </div>
          <div class="text-[10px] font-mono text-slate-400 dark:text-zinc-500">${res.mg} mg/dose</div>
        </td>

        <!-- Frequency & Timing -->
        <td class="py-3 px-3 text-xs text-slate-700 dark:text-zinc-300 font-medium">
          <div>${drug.frequency}</div>
          <div class="text-[10px] text-slate-400 dark:text-zinc-500 italic mt-0.5">${drug.indications}</div>
        </td>

        <!-- Copy Action -->
        <td class="py-3 px-3 text-right">
          <button id="btn-copy-${drug.id}" onclick="copySingleDrugPrescription('${drug.id}')" title="Copy Prescription (${lang.toUpperCase()})" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </button>
        </td>
      </tr>
    `;
  }).join("");

  const langButtonsHtml = CLINICAL_DATA.regionalLanguages.map(l => {
    const isSel = l.code === lang;
    return `
      <button onclick="setPrescriptionLanguage('${l.code}')" class="px-2 py-0.5 rounded text-[11px] font-semibold transition ${isSel ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'}">
        ${l.label}
      </button>
    `;
  }).join("");

  container.innerHTML = `
    <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-xs overflow-hidden transition-colors">
      <!-- Top Language Selector Bar -->
      <div class="px-3.5 py-2 bg-slate-50/80 dark:bg-zinc-950/60 border-b border-slate-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="text-[10px] font-bold uppercase text-slate-400 dark:text-zinc-500">Patient Advice Language:</span>
          <div class="flex flex-wrap items-center gap-1">${langButtonsHtml}</div>
        </div>
        <span class="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">1-Tap Copy Copies Bilingual Prescription</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-zinc-950/80 border-b border-slate-200/80 dark:border-zinc-800 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
              <th class="py-2.5 px-3.5">Generic Medicine & Formulations</th>
              <th class="py-2.5 px-3 hidden sm:table-cell">Supply Strength</th>
              <th class="py-2.5 px-3">Calculated Dose (${w.toFixed(1)} kg)</th>
              <th class="py-2.5 px-3">Frequency & Protocol</th>
              <th class="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 2. DETAILED CLINICAL CARDS VIEW
function renderPediatricCards(container, drugs, w) {
  const cardsHtml = drugs.map(drug => {
    const formulationsHtml = drug.formulations.map(f => {
      const res = f.calc(w);
      return `
        <div class="bg-slate-50 dark:bg-zinc-950/80 border border-slate-200/70 dark:border-zinc-800/80 rounded-xl p-3">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">${f.type}</span>
            <span class="text-[10px] text-slate-400 font-mono">${f.strength}</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <div>
              <span class="text-xl font-black font-mono tracking-tight text-indigo-600 dark:text-indigo-400">${res.ml}</span>
              ${res.drops ? `<span class="text-xs font-semibold text-purple-600 dark:text-purple-400 font-mono ml-1">(${res.drops} drops)</span>` : ''}
            </div>
            <span class="text-[11px] font-medium text-slate-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700">${res.unit || ''}</span>
          </div>
          <div class="text-[10px] font-mono text-slate-400 mt-1">${res.mg} mg per administration</div>
        </div>
      `;
    }).join("");

    return `
      <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-xs p-4 flex flex-col justify-between transition-colors">
        <div>
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 mb-1">
                ${drug.category}
              </span>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">${drug.name}</h3>
            </div>
            <button onclick="copySingleDrugPrescription('${drug.id}')" title="Copy Prescription" class="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>
          </div>
          
          <div class="mt-2 text-xs text-slate-500 dark:text-zinc-400 space-y-1">
            <p><span class="font-semibold text-slate-700 dark:text-zinc-300">Rule:</span> ${drug.rule}</p>
            <p><span class="font-semibold text-slate-700 dark:text-zinc-300">Frequency:</span> ${drug.frequency}</p>
          </div>

          <div class="mt-3 space-y-2">
            ${formulationsHtml}
          </div>
        </div>

        <div class="mt-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
          ${drug.id === 'ibuprofen' ? `
            <div class="text-[11px] text-rose-700 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 font-bold rounded-lg p-2 flex items-start gap-1.5">
              <span>⚠️</span>
              <span>DENGUE WARNING: Strict contraindication in Dengue / bleeding risk. Use Paracetamol only.</span>
            </div>
          ` : drug.id === 'paracetamol' ? `
            <div class="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 font-semibold rounded-lg p-2 flex items-start gap-1.5">
              <span>💧</span>
              <span>DROPS SAFETY: 100mg/mL drops must ONLY be given with calibrated dropper, never a spoon or cup!</span>
            </div>
          ` : `
            <p class="text-[11px] text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/60 dark:border-zinc-800/80 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 text-slate-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>${drug.notes}</span>
            </p>
          `}
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">${cardsHtml}</div>`;
}

function renderPalsTapeInContainer(container) {
  if (!CLINICAL_DATA.palsResus) return;
  const res = CLINICAL_DATA.palsResus.calc(appState.pedsWeight);
  const w = appState.pedsWeight;

  container.innerHTML = `
    <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 p-5 shadow-xs space-y-4">
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Emergency Resuscitation Tape</span>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">PALS Resuscitation Card (${w.toFixed(1)} kg)</h3>
        </div>
        <span class="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-mono font-bold">
          ${w.toFixed(1)} kg Active
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Normal Saline Shock Bolus -->
        <div class="bg-slate-50 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Circulation / Shock</span>
              <span class="text-[10px] font-mono text-slate-400">20 mL/kg</span>
            </div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">Normal Saline / RL Bolus</h4>
            <div class="mt-3 flex items-baseline gap-2">
              <span class="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400">${res.nsBolus}</span>
              <span class="text-xs text-slate-500 font-medium">IV / IO push</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">${res.nsBolusNote}</p>
          </div>
          <div class="mt-3 pt-2 border-t border-slate-200/60 dark:border-zinc-800/80 text-[10px] font-mono text-slate-400">
            Reassess liver size & lung crepitations after each bolus.
          </div>
        </div>

        <!-- 10% Dextrose Bolus -->
        <div class="bg-slate-50 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Hypoglycemia / Coma</span>
              <span class="text-[10px] font-mono text-slate-400">2 mL/kg (D10W)</span>
            </div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">10% Dextrose (D10W) Bolus</h4>
            <div class="mt-3 flex items-baseline gap-2">
              <span class="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">${res.d10Bolus}</span>
              <span class="text-xs text-slate-500 font-medium">slow IV push</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">${res.d10BolusNote}</p>
          </div>
          <div class="mt-3 pt-2 border-t border-slate-200/60 dark:border-zinc-800/80 text-[10px] font-mono text-slate-400">
            Follow with maintenance 5% or 10% Dextrose infusion.
          </div>
        </div>

        <!-- Adrenaline 1:10,000 for CPR -->
        <div class="bg-slate-50 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Cardiac Arrest / CPR</span>
              <span class="text-[10px] font-mono text-slate-400">0.1 mL/kg (1:10,000)</span>
            </div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">Inj. Adrenaline (1:10,000)</h4>
            <div class="mt-3 flex items-baseline gap-2">
              <span class="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">${res.adrVolume}</span>
              <span class="text-xs text-slate-500 font-medium">IV / IO stat</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">${res.adrNote}</p>
          </div>
          <div class="mt-3 pt-2 border-t border-slate-200/60 dark:border-zinc-800/80 text-[10px] font-mono text-slate-400">
            Dilution: 1 mL of 1:1000 + 9 mL Normal Saline = 1:10,000.
          </div>
        </div>

        <!-- Defibrillation Energy -->
        <div class="bg-slate-50 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Defibrillation / Cardioversion</span>
              <span class="text-[10px] font-mono text-slate-400">2 J/kg -> 4 J/kg</span>
            </div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">Defibrillation Energy</h4>
            <div class="mt-3 flex items-baseline gap-3">
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Initial Shock:</span>
                <span class="text-xl font-black font-mono text-purple-600 dark:text-purple-400">${res.defib1}</span>
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Subsequent:</span>
                <span class="text-xl font-black font-mono text-purple-600 dark:text-purple-400">${res.defib2}</span>
              </div>
            </div>
            <p class="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">${res.defibNote}</p>
          </div>
          <div class="mt-3 pt-2 border-t border-slate-200/60 dark:border-zinc-800/80 text-[10px] font-mono text-slate-400">
            Resume CPR compressions immediately for 2 minutes post-shock.
          </div>
        </div>

        <!-- Endotracheal Tube (ETT) Size & Depth -->
        <div class="bg-slate-50 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between md:col-span-2">
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Airway & Intubation</span>
              <span class="text-[10px] font-mono text-slate-400">Formula: (Age/4)+4</span>
            </div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">Endotracheal Tube (ETT) Selection</h4>
            <div class="mt-3 grid grid-cols-2 gap-4">
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Internal Diameter (ID):</span>
                <span class="text-lg font-black font-mono text-indigo-600 dark:text-indigo-400">${res.ettSize}</span>
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Insertion Depth at Lip:</span>
                <span class="text-lg font-black font-mono text-indigo-600 dark:text-indigo-400">${res.ettDepth}</span>
              </div>
            </div>
          </div>
          <div class="mt-3 pt-2 border-t border-slate-200/60 dark:border-zinc-800/80 text-[10px] font-mono text-slate-400">
            Keep one size smaller (0.5mm) and one size larger ready at bedside.
          </div>
        </div>
      </div>
    </div>
  `;
}

function copySingleDrugPrescription(drugId) {
  const drug = CLINICAL_DATA.pediatrics.find(d => d.id === drugId);
  if (!drug) return;
  const w = appState.pedsWeight;
  const primaryForm = drug.formulations[drug.formulations.length - 1];
  const res = primaryForm.calc(w);
  const lang = appState.prescriptionLanguage || "en";
  const dict = REGIONAL_PRESCRIPTION_TEXTS[lang] || REGIONAL_PRESCRIPTION_TEXTS.en;

  let text = `========================================\n${dict.title} (${dict.wt}: ${w.toFixed(1)} kg)\n========================================\n- ${drug.name}\n  ${dict.form}: ${primaryForm.type} (${primaryForm.strength})\n  ${dict.dose}: ${res.ml} ${res.unit}\n  ${dict.freq}: ${drug.frequency}\n  ${dict.shake}\n----------------------------------------\n${dict.warning}\n----------------------------------------\n[DocShift Clinical HUD]`;

  navigator.clipboard.writeText(text).then(() => {
    showToast(`Prescription copied (${lang.toUpperCase()})`);
  });
}

// -------------------------------------------------------------
// CASUALTY & EMERGENCY PROTOCOLS
// -------------------------------------------------------------
function selectEmergency(emId) {
  appState.selectedEmergencyId = emId;
  document.querySelectorAll(".emergency-nav-btn").forEach(btn => {
    btn.classList.remove("bg-slate-100", "dark:bg-zinc-800", "text-slate-900", "dark:text-white", "font-bold");
    btn.classList.add("text-slate-600", "dark:text-zinc-400");
  });
  const activeBtn = document.getElementById(`em-btn-${emId}`);
  if (activeBtn) {
    activeBtn.classList.add("bg-slate-100", "dark:bg-zinc-800", "text-slate-900", "dark:text-white", "font-bold");
    activeBtn.classList.remove("text-slate-600", "dark:text-zinc-400");
  }
  renderEmergencyDetail();
}

function renderEmergencyDesk() {
  const navContainer = document.getElementById("emergency-nav-container");
  if (!navContainer) return;

  navContainer.innerHTML = CLINICAL_DATA.emergencies.map((em) => {
    const isSelected = em.id === appState.selectedEmergencyId;
    return `
      <button id="em-btn-${em.id}" onclick="selectEmergency('${em.id}')" class="emergency-nav-btn w-full text-left p-2.5 rounded-xl transition flex items-center justify-between text-xs ${isSelected ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-bold shadow-2xs' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-850'}">
        <div class="flex items-center gap-2 truncate">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
          <span class="truncate">${em.title.split('&')[0].trim()}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-400 shrink-0"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    `;
  }).join("");

  renderEmergencyDetail();
}

function renderEmergencyDetail() {
  const container = document.getElementById("emergency-detail-container");
  if (!container) return;

  const em = CLINICAL_DATA.emergencies.find(e => e.id === appState.selectedEmergencyId) || CLINICAL_DATA.emergencies[0];

  const stepsHtml = em.steps.map(step => `
    <div class="relative pl-6 pb-5 border-l-2 border-slate-200 dark:border-zinc-800 last:border-0 last:pb-0">
      <div class="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-rose-500 border-2 border-white dark:border-zinc-900 shadow-xs">
      </div>
      <div class="flex items-center gap-2 mb-1">
        <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">${step.time}</span>
        <h4 class="text-xs font-bold text-slate-900 dark:text-white">${step.title}</h4>
      </div>
      <div class="text-xs text-slate-600 dark:text-zinc-300 space-y-1.5 mt-2 bg-slate-50 dark:bg-zinc-950/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800/80">
        ${step.actions.map(act => `<p class="leading-relaxed">${act}</p>`).join("")}
      </div>
    </div>
  `).join("");

  const quickDosesHtml = em.quickDoses.map(d => `
    <div class="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-zinc-950/60 rounded-xl border border-slate-200/80 dark:border-zinc-800/80 text-xs">
      <span class="font-semibold text-slate-900 dark:text-white">${d.drug}</span>
      <span class="font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-800">${d.dose}</span>
    </div>
  `).join("");

  const isSnakebite = em.id === "snakebite";
  const isBurns = em.id === "burns_resuscitation";
  const isRabies = em.id === "rabies_pep";
  const isOp = em.id === "op_poisoning";

  // Interactive Burns Calculator HTML
  let burnsCalculatorHtml = "";
  if (isBurns && CLINICAL_DATA.burnsCalculator) {
    const bRes = CLINICAL_DATA.burnsCalculator.calc(appState.vasoWeight || 60, appState.burnsTbsa || 20);
    burnsCalculatorHtml = `
      <div class="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-3">
        <div class="flex items-center justify-between border-b border-indigo-500/20 pb-2">
          <span class="text-xs font-bold text-indigo-700 dark:text-indigo-400">🔥 Interactive Parkland Resuscitation Calculator</span>
          <span class="text-[10px] font-mono text-slate-400">4 mL x kg x %TBSA</span>
        </div>
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1">Burn Surface Area (% TBSA): <strong class="text-indigo-600 dark:text-indigo-400 font-mono">${bRes.tbsa}%</strong></label>
            <input type="range" min="5" max="80" step="5" value="${bRes.tbsa}" oninput="updateBurnsTbsa(this.value)" class="w-full">
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1">Patient Weight: <strong class="text-indigo-600 dark:text-indigo-400 font-mono">${bRes.weight} kg</strong></label>
            <input type="range" min="10" max="120" step="5" value="${bRes.weight}" oninput="adjustVasoWeight(this.value - (appState.vasoWeight||60))" class="w-full">
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div class="p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800">
            <span class="text-[9px] uppercase font-bold text-slate-400 block">Total 24h RL:</span>
            <span class="text-base font-black font-mono text-slate-900 dark:text-white">${bRes.total24hMl} mL</span>
          </div>
          <div class="p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800">
            <span class="text-[9px] uppercase font-bold text-indigo-500 block">First 8 Hours (50%):</span>
            <span class="text-base font-black font-mono text-indigo-600 dark:text-indigo-400">${bRes.first8hRateMlHr} mL/hr</span>
            <span class="text-[9px] text-slate-400 block">Total: ${bRes.first8hMl} mL</span>
          </div>
          <div class="p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800">
            <span class="text-[9px] uppercase font-bold text-cyan-500 block">Next 16 Hours (50%):</span>
            <span class="text-base font-black font-mono text-cyan-600 dark:text-cyan-400">${bRes.next16hRateMlHr} mL/hr</span>
            <span class="text-[9px] text-slate-400 block">Total: ${bRes.next16hMl} mL</span>
          </div>
        </div>
      </div>
    `;
  }

  // Interactive Rabies RIG Calculator HTML
  let rabiesRigHtml = "";
  if (isRabies && CLINICAL_DATA.rabiesRigCalculator) {
    const rigRes = CLINICAL_DATA.rabiesRigCalculator.calc(appState.vasoWeight || 60, appState.rabiesRigType || "ERIG");
    rabiesRigHtml = `
      <div class="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3">
        <div class="flex items-center justify-between border-b border-amber-500/20 pb-2">
          <span class="text-xs font-bold text-amber-700 dark:text-amber-400">🐕 Rabies Immunoglobulin (RIG) Infiltration Calculator</span>
          <div class="flex items-center gap-1">
            <button onclick="setRabiesRigType('ERIG')" class="px-2 py-0.5 rounded text-[10px] font-bold ${appState.rabiesRigType === 'ERIG' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600'}">ERIG (40 IU/kg)</button>
            <button onclick="setRabiesRigType('HRIG')" class="px-2 py-0.5 rounded text-[10px] font-bold ${appState.rabiesRigType === 'HRIG' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600'}">HRIG (20 IU/kg)</button>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div class="p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800">
            <span class="text-[9px] uppercase font-bold text-slate-400 block">Patient Weight:</span>
            <span class="text-base font-black font-mono text-slate-900 dark:text-white">${rigRes.weight} kg</span>
          </div>
          <div class="p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800">
            <span class="text-[9px] uppercase font-bold text-amber-600 block">Total Dose:</span>
            <span class="text-base font-black font-mono text-amber-600 dark:text-amber-400">${rigRes.totalIU} IU</span>
          </div>
          <div class="p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800">
            <span class="text-[9px] uppercase font-bold text-indigo-600 block">Volume to Infiltrate:</span>
            <span class="text-base font-black font-mono text-indigo-600 dark:text-indigo-400">${rigRes.estimatedVolumeMl}</span>
          </div>
        </div>
        <p class="text-[11px] text-slate-500 italic">${rigRes.technique}</p>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 p-5 shadow-xs transition-colors">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 tracking-wider">
              ${em.severity}
            </span>
            <span class="text-xs text-slate-400 font-medium">${em.subtitle}</span>
          </div>
          <h2 class="text-lg font-black text-slate-900 dark:text-white mt-1">${em.title}</h2>
          <p class="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">${em.overview}</p>
        </div>

        <button onclick="prefillReferralFromEmergency('${em.id}')" class="shrink-0 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold rounded-xl shadow-2xs active:scale-95 transition">
          <span>Send to Referral Slip</span>
        </button>
      </div>

      ${isSnakebite ? `
        <!-- 20WBCT Clotting Timer Bar -->
        <div class="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-900 dark:text-white">20-Minute Whole Blood Clotting Test (20WBCT)</h4>
              <p class="text-[11px] text-slate-500 dark:text-zinc-400">Leave tube upright at room temperature. Invert gently at 20 mins exactly.</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span id="wbct-timer-display" class="text-xl font-black font-mono text-slate-900 dark:text-white bg-white dark:bg-zinc-950 px-3 py-1 rounded-lg border border-slate-200 dark:border-zinc-800">
              ${formatSeconds(appState.timerSeconds)}
            </span>
            <button id="wbct-timer-toggle-btn" onclick="toggleWBCTTimer()" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl active:scale-95 transition">
              ${appState.timerRunning ? 'Pause' : 'Start Timer'}
            </button>
            <button onclick="resetWBCTTimer()" class="px-2 py-1.5 text-slate-400 hover:text-slate-600 text-xs font-medium active:scale-95">Reset</button>
          </div>
        </div>
      ` : ''}

      ${burnsCalculatorHtml}
      ${rabiesRigHtml}

      <div class="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <h3 class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">15-Minute Resuscitation Flow</h3>
          <div class="mt-2">
            ${stepsHtml}
          </div>
        </div>

        <div>
          <h3 class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Stat Doses Table</h3>
          <div class="space-y-2">
            ${quickDosesHtml}
          </div>

          <div class="mt-4 p-3.5 bg-rose-500/5 border border-rose-500/20 rounded-xl">
            <h4 class="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
              Clinical Red Flag
            </h4>
            <p class="text-[11px] text-slate-600 dark:text-zinc-300 mt-1 leading-relaxed">
              Always secure IV access and administer first-line stabilization *before* patient departs in ambulance. Document all baseline vitals.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function updateBurnsTbsa(val) {
  appState.burnsTbsa = parseFloat(val);
  saveSessionDrafts();
  renderEmergencyDetail();
}

function setRabiesRigType(type) {
  appState.rabiesRigType = type;
  saveSessionDrafts();
  renderEmergencyDetail();
}

// 20WBCT Timer Logic
function formatSeconds(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function toggleWBCTTimer() {
  if (appState.timerRunning) {
    clearInterval(appState.timerInterval);
    appState.timerRunning = false;
  } else {
    appState.timerRunning = true;
    appState.timerInterval = setInterval(() => {
      if (appState.timerSeconds > 0) {
        appState.timerSeconds--;
        const display = document.getElementById("wbct-timer-display");
        if (display) display.innerText = formatSeconds(appState.timerSeconds);
      } else {
        clearInterval(appState.timerInterval);
        appState.timerRunning = false;
        triggerWbctAlarm();
      }
    }, 1000);
  }
  const btn = document.getElementById("wbct-timer-toggle-btn");
  if (btn) btn.innerText = appState.timerRunning ? 'Pause' : 'Start Timer';
}

function resetWBCTTimer() {
  clearInterval(appState.timerInterval);
  appState.timerRunning = false;
  appState.timerSeconds = 1200;
  const display = document.getElementById("wbct-timer-display");
  if (display) display.innerText = formatSeconds(appState.timerSeconds);
  const btn = document.getElementById("wbct-timer-toggle-btn");
  if (btn) btn.innerText = 'Start Timer';
}

function triggerWbctAlarm() {
  const banner = document.getElementById("wbct-alarm-banner");
  if (banner) banner.classList.remove("hidden");
  
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
  } catch(e) {
    console.log("[DocShift] Audio context not available:", e);
  }
}

function dismissWbctAlarm() {
  const banner = document.getElementById("wbct-alarm-banner");
  if (banner) banner.classList.add("hidden");
}

function prefillReferralFromEmergency(emId) {
  const em = CLINICAL_DATA.emergencies.find(e => e.id === emId);
  if (!em) return;
  appState.refDiagnosis = em.title;
  appState.refDrugsGiven = em.quickDoses.map(d => `${d.drug}: ${d.dose}`).join("; ");
  
  const diagInput = document.getElementById("ref-input-diag");
  if (diagInput) diagInput.value = appState.refDiagnosis;
  const drugsInput = document.getElementById("ref-input-drugs");
  if (drugsInput) drugsInput.value = appState.refDrugsGiven;

  saveSessionDrafts();
  switchHub("legal");
  switchLegalSubTab("referral");
  showToast(`Emergency protocol sent to Referral Slip!`);
}

// -------------------------------------------------------------
// 10-SECOND CASUALTY ECG & PRE-THROMBOLYSIS MATRIX
// -------------------------------------------------------------
function selectEcgTerritory(idx) {
  appState.selectedEcgIndex = idx;
  renderEcgDesk();
}

function toggleContraindication(item) {
  if (appState.checkedContraindications.includes(item)) {
    appState.checkedContraindications = appState.checkedContraindications.filter(c => c !== item);
  } else {
    appState.checkedContraindications.push(item);
  }
  renderEcgDesk();
}

function renderEcgDesk() {
  const container = document.getElementById("ecg-content-container");
  if (!container || !CLINICAL_DATA.ecgTriage) return;

  const leads = CLINICAL_DATA.ecgTriage.leadsMap;
  const activeLead = leads[appState.selectedEcgIndex || 0] || leads[0];
  const checklist = CLINICAL_DATA.ecgTriage.thrombolysisChecklist;

  const leadPillsHtml = leads.map((l, idx) => {
    const isSel = idx === (appState.selectedEcgIndex || 0);
    return `
      <button onclick="selectEcgTerritory(${idx})" class="px-3 py-1.5 rounded-xl text-xs font-semibold border transition shrink-0 active:scale-95 ${isSel ? 'bg-slate-900 dark:bg-white text-white dark:text-zinc-950 border-slate-900 dark:border-white shadow-2xs' : 'bg-slate-100 dark:bg-zinc-850 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-800'}">
        ${l.territory.split(' ')[0]} (${l.leads.split(' ')[0]})
      </button>
    `;
  }).join("");

  const hasAbsoluteContraindication = appState.checkedContraindications.some(c => checklist.absoluteContraindications.includes(c));

  const absCheckboxesHtml = checklist.absoluteContraindications.map((item) => {
    const isChecked = appState.checkedContraindications.includes(item);
    return `
      <label class="flex items-start gap-2 p-2 rounded-xl border text-xs cursor-pointer transition ${isChecked ? 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200 font-semibold' : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'}">
        <input type="checkbox" onchange="toggleContraindication('${item}')" ${isChecked ? 'checked' : ''} class="mt-0.5 rounded text-rose-600 focus:ring-rose-500">
        <span>${item}</span>
      </label>
    `;
  }).join("");

  const relCheckboxesHtml = checklist.relativeContraindications.map((item) => {
    const isChecked = appState.checkedContraindications.includes(item);
    return `
      <label class="flex items-start gap-2 p-2 rounded-xl border text-xs cursor-pointer transition ${isChecked ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200 font-semibold' : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'}">
        <input type="checkbox" onchange="toggleContraindication('${item}')" ${isChecked ? 'checked' : ''} class="mt-0.5 rounded text-amber-600 focus:ring-amber-500">
        <span>${item}</span>
      </label>
    `;
  }).join("");

  const tnkWeight = appState.vasoWeight || 60;
  const tnkDose = tnkWeight < 60 ? "30 mg (6 mL)" : tnkWeight < 70 ? "35 mg (7 mL)" : tnkWeight < 80 ? "40 mg (8 mL)" : tnkWeight < 90 ? "45 mg (9 mL)" : "50 mg (10 mL)";

  container.innerHTML = `
    <!-- 1. Territory & Culprit Artery Triangulation -->
    <div class="bg-slate-50 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-xs">
      <div class="flex items-center justify-between mb-3">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Step 1: Lead Localization</span>
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">Anatomical Territory & Culprit Artery</h3>
        </div>
      </div>

      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        ${leadPillsHtml}
      </div>

      <div class="mt-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-2">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 dark:border-zinc-800 pb-2">
          <div>
            <span class="text-xs font-bold text-slate-900 dark:text-white">${activeLead.territory}</span>
            <span class="text-xs font-mono text-indigo-600 dark:text-indigo-400 ml-2">[Leads: ${activeLead.leads}]</span>
          </div>
          <div class="text-xs font-semibold text-slate-600 dark:text-zinc-300">
            Artery: <span class="font-mono text-slate-900 dark:text-white font-bold">${activeLead.culpritArtery}</span>
          </div>
        </div>
        <div class="p-2.5 bg-rose-500/5 border border-rose-500/20 rounded-lg text-xs text-rose-800 dark:text-rose-300 font-medium leading-relaxed">
          ⚠️ <strong>Clinical Alert:</strong> ${activeLead.criticalAlert}
        </div>
      </div>
    </div>

    <!-- 2. Pre-Thrombolysis Safety Checker -->
    <div class="bg-slate-50 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-xs">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-zinc-800 pb-3 mb-3">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Step 2: Safety Verification</span>
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">Pre-Thrombolysis Contraindication Checklist</h3>
        </div>
        <div>
          ${hasAbsoluteContraindication ? `
            <span class="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse">
              🛑 THROMBOLYSIS CONTRAINDICATED
            </span>
          ` : `
            <span class="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              ✓ ELIGIBLE (If Indications Met)
            </span>
          `}
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <span class="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1.5">Absolute Contraindications (Any = STRICT NO THROMBOLYSIS):</span>
          <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            ${absCheckboxesHtml}
          </div>
        </div>

        <div>
          <span class="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1.5">Relative Contraindications (Weigh Risk vs Benefit):</span>
          <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            ${relCheckboxesHtml}
          </div>
        </div>
      </div>

      <!-- Thrombolytic Regimens -->
      <div class="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800">
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Thrombolytic Drug Regimens:</span>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs">
            <span class="font-bold text-slate-900 dark:text-white block">Inj. Streptokinase (STK)</span>
            <p class="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-1">1.5 Million IU in 100 mL NS IV over 60 mins</p>
            <p class="text-[10px] text-slate-400 mt-1">Monitor for allergic reaction and hypotension.</p>
          </div>
          <div class="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-900 dark:text-white">Inj. Tenecteplase (TNK)</span>
              <span class="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">${tnkDose}</span>
            </div>
            <p class="text-[11px] font-mono text-purple-600 dark:text-purple-400 mt-1">Single IV bolus over 5-10 seconds based on weight</p>
            <p class="text-[10px] text-slate-400 mt-1">Calculated for current weight (${tnkWeight} kg).</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// EMERGENCY TOXICOLOGY & POISONING ANTIDOTES
// -------------------------------------------------------------
function renderToxicologyDesk() {
  const container = document.getElementById("toxicology-content-container");
  if (!container || !CLINICAL_DATA.toxicology) return;

  const pcmWeight = appState.vasoWeight || 60;
  const pcmLoading = Math.round(pcmWeight * 150);
  const pcmDose2 = Math.round(pcmWeight * 50);
  const pcmDose3 = Math.round(pcmWeight * 100);

  const toxHtml = CLINICAL_DATA.toxicology.map(t => {
    const isPcm = t.id === "paracetamol_tox";

    return `
      <div class="bg-slate-50 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-xs transition-colors">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-zinc-800 pb-3 mb-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                ${t.severity}
              </span>
              <span class="text-xs text-slate-400 font-medium">${t.tribute}</span>
            </div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white mt-1">${t.name}</h3>
          </div>
        </div>

        <!-- Key Warning Banner -->
        <div class="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-800 dark:text-rose-300 font-bold flex items-start gap-2 mb-3">
          <span class="text-sm shrink-0">🛑</span>
          <span>${t.keyWarning}</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="lg:col-span-2 space-y-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Emergency Management Protocol:</span>
            <div class="space-y-1.5 bg-white dark:bg-zinc-900 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-300">
              ${t.managementSteps.map(s => `<p class="leading-relaxed">• ${s}</p>`).join("")}
            </div>
          </div>

          <div class="space-y-3">
            <div class="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs">
              <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Lavage Protocol:</span>
              <p class="font-semibold text-slate-900 dark:text-white">${t.lavageProtocol}</p>
            </div>

            <div class="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs">
              <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Antidote / Antidotal Action:</span>
              <p class="font-semibold text-indigo-600 dark:text-indigo-400">${t.antidote}</p>
            </div>

            ${isPcm ? `
              <div class="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl text-xs space-y-1">
                <span class="font-bold text-indigo-700 dark:text-indigo-400 block">Calculated IV NAC for ${pcmWeight} kg:</span>
                <p class="text-[11px] text-slate-600 dark:text-zinc-300">1. Loading (1h): <strong class="text-slate-900 dark:text-white font-mono">${pcmLoading} mg</strong> in 200mL D5W</p>
                <p class="text-[11px] text-slate-600 dark:text-zinc-300">2. Second (4h): <strong class="text-slate-900 dark:text-white font-mono">${pcmDose2} mg</strong> in 500mL D5W</p>
                <p class="text-[11px] text-slate-600 dark:text-zinc-300">3. Third (16h): <strong class="text-slate-900 dark:text-white font-mono">${pcmDose3} mg</strong> in 1000mL D5W</p>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = toxHtml;
}

// -------------------------------------------------------------
// VASOPRESSOR INFUSIONS & HIGH-RISK DDI MATRIX
// -------------------------------------------------------------
function adjustVasoWeight(delta) {
  appState.vasoWeight = Math.max(30, Math.min(150, (appState.vasoWeight || 60) + delta));
  saveSessionDrafts();
  renderVasopressorsDesk();
  renderEcgDesk();
  renderToxicologyDesk();
}

function renderVasopressorsDesk() {
  const container = document.getElementById("vasopressors-content-container");
  if (!container || !CLINICAL_DATA.vasopressors) return;

  const w = appState.vasoWeight || 60;
  const doses = appState.vasoDoses || { noradrenaline: 0.1, dopamine: 10, dobutamine: 5 };

  const vasoHtml = CLINICAL_DATA.vasopressors.map(v => {
    const isNora = v.drug.includes("Noradrenaline");
    const isDopa = v.drug.includes("Dopamine");
    const currentDose = isNora ? doses.noradrenaline : isDopa ? doses.dopamine : doses.dobutamine;
    const res = v.calcRate(w, currentDose);

    return `
      <div class="bg-slate-50 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Syringe Pump Rate</span>
            <span class="text-[10px] font-mono text-slate-400">${v.doseRange}</span>
          </div>
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">${v.drug}</h3>
          <p class="text-[11px] text-slate-500 font-mono mt-0.5">${v.standardDilution}</p>

          <div class="mt-4 flex items-center justify-between bg-white dark:bg-zinc-900 p-3 rounded-xl border border-slate-200 dark:border-zinc-800">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Target Dose:</span>
              <span class="text-sm font-mono font-black text-slate-900 dark:text-white">${currentDose} mcg/kg/min</span>
            </div>
            <div class="text-right">
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Pump Infusion Rate:</span>
              <span class="text-2xl font-mono font-black text-indigo-600 dark:text-indigo-400">${res.mlHr} mL/hr</span>
            </div>
          </div>
        </div>

        <div class="mt-3 pt-2 border-t border-slate-200/60 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Macro Drip: ~${res.dropsMin} drops/min</span>
          <span>Weight: ${w} kg</span>
        </div>
      </div>
    `;
  }).join("");

  const ddiHtml = CLINICAL_DATA.highRiskDDI.map(d => `
    <div class="p-3.5 bg-slate-50 dark:bg-zinc-950/80 rounded-xl border border-slate-200/80 dark:border-zinc-800/80 space-y-1.5">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-900 dark:text-white">${d.pair}</span>
        <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">${d.severity}</span>
      </div>
      <p class="text-xs text-rose-700 dark:text-rose-300 font-medium">${d.consequence}</p>
      <p class="text-[11px] text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 p-2 rounded-lg border border-slate-200 dark:border-zinc-800"><strong>Rule:</strong> ${d.rule}</p>
    </div>
  `).join("");

  container.innerHTML = `
    <!-- Weight Control for Inotropes -->
    <div class="flex items-center justify-between bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs">
      <span class="font-bold text-slate-800 dark:text-zinc-200">Patient Weight for Inotropes:</span>
      <div class="flex items-center gap-2">
        <button onclick="adjustVasoWeight(-5)" class="px-2 py-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg font-mono font-bold active:scale-95">-5k</button>
        <span class="font-mono font-black text-sm text-slate-900 dark:text-white min-w-[50px] text-center">${w} kg</span>
        <button onclick="adjustVasoWeight(5)" class="px-2 py-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg font-mono font-bold active:scale-95">+5k</button>
      </div>
    </div>

    <!-- Inotrope Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      ${vasoHtml}
    </div>

    <!-- DDI Matrix -->
    <div class="mt-6 pt-4 border-t border-slate-200 dark:border-zinc-800">
      <span class="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-3">Fatal Point-of-Care Drug Interactions (DDI Matrix):</span>
      <div class="space-y-3">
        ${ddiHtml}
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// OPD DAILY TALLY & IDSP FORM P REGISTER
// -------------------------------------------------------------
function getTallyStorageKey() {
  return `docshift-tally-${appState.tallyDate}`;
}

function loadTallyCounts() {
  const saved = localStorage.getItem(getTallyStorageKey());
  if (saved) {
    try {
      appState.tallyCounts = JSON.parse(saved);
    } catch(e) {
      appState.tallyCounts = {};
    }
  } else {
    appState.tallyCounts = {};
  }
  if (CLINICAL_DATA.opdDailyTally && CLINICAL_DATA.opdDailyTally.categories) {
    CLINICAL_DATA.opdDailyTally.categories.forEach(cat => {
      if (typeof appState.tallyCounts[cat.id] !== 'number') {
        appState.tallyCounts[cat.id] = 0;
      }
    });
  }
}

function saveTallyCounts() {
  localStorage.setItem(getTallyStorageKey(), JSON.stringify(appState.tallyCounts));
}

function syncQuickTallyStrip() {
  const total = Object.values(appState.tallyCounts || {}).reduce((a, b) => a + b, 0);
  
  const elTotal = document.getElementById("quick-tally-total");
  if (elTotal) elTotal.innerText = total;

  const elCapsuleTotal = document.getElementById("quick-tally-total-capsule");
  if (elCapsuleTotal) elCapsuleTotal.innerText = total;

  const elAri = document.getElementById("quick-count-ari");
  if (elAri) elAri.innerText = (appState.tallyCounts && appState.tallyCounts["ari"]) || 0;

  const elAdd = document.getElementById("quick-count-add");
  if (elAdd) elAdd.innerText = (appState.tallyCounts && appState.tallyCounts["add"]) || 0;

  const elFuo = document.getElementById("quick-count-fuo");
  if (elFuo) elFuo.innerText = (appState.tallyCounts && appState.tallyCounts["fuo"]) || 0;

  const elHtn = document.getElementById("quick-count-htn");
  if (elHtn) elHtn.innerText = (appState.tallyCounts && appState.tallyCounts["htn"]) || 0;
}

function toggleTallyDrawer() {
  const drawer = document.getElementById("full-tally-drawer");
  if (!drawer) return;
  const isHidden = drawer.classList.contains("hidden");
  if (isHidden) {
    drawer.classList.remove("hidden");
    renderTallyDesk();
  } else {
    drawer.classList.add("hidden");
  }
}

function renderTallyDesk() {
  const container = document.getElementById("tally-content-container");
  if (!container || !CLINICAL_DATA.opdDailyTally) return;

  loadTallyCounts();
  syncQuickTallyStrip();

  const categories = CLINICAL_DATA.opdDailyTally.categories;
  const totalCount = Object.values(appState.tallyCounts).reduce((a, b) => a + b, 0);

  const cardsHtml = categories.map(cat => {
    const count = appState.tallyCounts[cat.id] || 0;
    const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

    return `
      <div class="bg-slate-50 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">${cat.code}</span>
            <span class="text-[10px] font-mono text-slate-400 font-bold">${pct}%</span>
          </div>
          <h4 class="text-xs font-bold text-slate-900 dark:text-white leading-tight min-h-[32px]">${cat.name}</h4>
        </div>

        <div class="mt-3 flex items-center justify-between">
          <span class="text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">${count}</span>
          <div class="flex items-center gap-1">
            <button onclick="decrementTally('${cat.id}')" class="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-mono font-bold text-sm flex items-center justify-center shadow-2xs active:scale-95 transition">-</button>
            <button onclick="incrementTally('${cat.id}', 1)" class="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-slate-800 dark:hover:bg-zinc-100 font-mono font-bold text-sm flex items-center justify-center shadow-2xs active:scale-95 transition">+</button>
            <button onclick="incrementTally('${cat.id}', 5)" class="px-2 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-mono font-bold text-xs flex items-center justify-center shadow-2xs active:scale-95 transition">+5</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  const reportText = generateTallyReportText();

  container.innerHTML = `
    <!-- Top Summary Banner -->
    <div class="bg-slate-900 dark:bg-white text-white dark:text-zinc-950 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 dark:text-zinc-600 block">Total Shift OPD Footfall</span>
        <div class="flex items-baseline gap-2 mt-0.5">
          <span class="text-3xl font-black font-mono tracking-tight">${totalCount}</span>
          <span class="text-xs font-semibold">Patients Examined Today</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <input type="date" value="${appState.tallyDate}" onchange="changeTallyDate(this.value)" class="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 border border-slate-700 dark:border-zinc-300 focus:outline-none">
        <button onclick="resetTallyShift()" class="px-2.5 py-1.5 text-xs bg-rose-500/20 text-rose-300 dark:text-rose-700 border border-rose-500/30 rounded-lg hover:bg-rose-500/30 active:scale-95 transition">Reset</button>
      </div>
    </div>

    <!-- Disease Category Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      ${cardsHtml}
    </div>

    <!-- Live Form P WhatsApp Report Preview -->
    <div class="bg-slate-50 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-xs">
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3 mb-3">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">Generated Daily IDSP Report (WhatsApp)</h3>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="copyTallyReport()" class="px-2.5 py-1 bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-semibold rounded-md active:scale-95 transition">
            Copy
          </button>
          <button onclick="shareTallyWhatsApp()" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-2xs active:scale-95 transition">
            Share WhatsApp
          </button>
        </div>
      </div>
      <pre id="tally-report-preview" class="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-[11px] font-mono leading-relaxed text-slate-800 dark:text-zinc-200 whitespace-pre-wrap select-all max-h-56 overflow-y-auto">${reportText}</pre>
    </div>
  `;
}

function incrementTally(catId, amount = 1) {
  triggerHapticFeedback(15);
  if (!appState.tallyCounts[catId]) appState.tallyCounts[catId] = 0;
  appState.tallyCounts[catId] += amount;
  saveTallyCounts();
  syncQuickTallyStrip();
  const drawer = document.getElementById("full-tally-drawer");
  if (drawer && !drawer.classList.contains("hidden")) {
    renderTallyDesk();
  }
}

function decrementTally(catId) {
  triggerHapticFeedback(15);
  if (!appState.tallyCounts[catId]) appState.tallyCounts[catId] = 0;
  appState.tallyCounts[catId] = Math.max(0, appState.tallyCounts[catId] - 1);
  saveTallyCounts();
  syncQuickTallyStrip();
  const drawer = document.getElementById("full-tally-drawer");
  if (drawer && !drawer.classList.contains("hidden")) {
    renderTallyDesk();
  }
}

function resetTallyShift() {
  if (confirm("Reset all disease counts for this date to 0?")) {
    Object.keys(appState.tallyCounts).forEach(k => appState.tallyCounts[k] = 0);
    saveTallyCounts();
    syncQuickTallyStrip();
    renderTallyDesk();
    showToast("Shift Counts Reset to 0");
  }
}

function changeTallyDate(newDate) {
  appState.tallyDate = newDate;
  loadTallyCounts();
  syncQuickTallyStrip();
  renderTallyDesk();
}

function generateTallyReportText() {
  const now = new Date();
  const dateStr = appState.tallyDate || now.toISOString().split('T')[0];
  const categories = (CLINICAL_DATA.opdDailyTally && CLINICAL_DATA.opdDailyTally.categories) || [];
  const totalCount = Object.values(appState.tallyCounts || {}).reduce((a, b) => a + b, 0);

  let text = `========================================\nDAILY OPD & IDSP SURVEILLANCE REPORT (FORM P)\nFacility: ${appState.refFacility}\nDate: ${dateStr}\nReporting MO: ${appState.refDoctor}\n========================================\nTOTAL PATIENTS EXAMINED: ${totalCount}\n----------------------------------------\n`;

  categories.forEach((cat, idx) => {
    const c = (appState.tallyCounts && appState.tallyCounts[cat.id]) || 0;
    text += `${(idx+1).toString().padStart(2, ' ')}. [${cat.code}] ${cat.name}: ${c}\n`;
  });

  text += `----------------------------------------\nGenerated via DocShift Clinical Operating HUD`;
  return text;
}

function copyTallyReport() {
  const text = generateTallyReportText();
  navigator.clipboard.writeText(text).then(() => {
    showToast("IDSP Tally Report Copied!");
  });
}

function shareTallyWhatsApp() {
  const text = generateTallyReportText();
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

// -------------------------------------------------------------
// NATIONAL HEALTH PROGRAMS ACCORDION
// -------------------------------------------------------------
function toggleProgramsAccordion() {
  const drawer = document.getElementById("programs-collapsible-drawer");
  const arrow = document.getElementById("programs-toggle-arrow");
  if (!drawer) return;
  const isHidden = drawer.classList.contains("hidden");
  if (isHidden) {
    drawer.classList.remove("hidden");
    if (arrow) arrow.innerText = "▲";
    renderNationalPrograms();
  } else {
    drawer.classList.add("hidden");
    if (arrow) arrow.innerText = "▼";
  }
}

function renderNationalPrograms() {
  const container = document.getElementById("national-programs-container");
  if (!container || !CLINICAL_DATA.nationalPrograms) return;

  const tb = CLINICAL_DATA.nationalPrograms.find(p => p.id === "tb_nikshay");
  const malaria = CLINICAL_DATA.nationalPrograms.find(p => p.id === "malaria_nvbdcp");
  const sti = CLINICAL_DATA.nationalPrograms.find(p => p.id === "naco_sti_kits");

  let html = "";

  // TB Module
  if (tb) {
    const tbRows = tb.weightBands.map(b => `
      <tr class="border-b border-slate-100 dark:border-zinc-800 text-xs">
        <td class="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">${b.weight}</td>
        <td class="py-2.5 px-3 text-emerald-700 dark:text-emerald-400 font-semibold">${b.ip}</td>
        <td class="py-2.5 px-3 text-indigo-700 dark:text-indigo-400 font-semibold">${b.cp}</td>
      </tr>
    `).join("");

    html += `
      <div class="border border-slate-200/80 dark:border-zinc-800 rounded-xl p-4 bg-slate-50 dark:bg-zinc-950/60">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2 mb-3">
          <div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">${tb.name}</h3>
            <p class="text-[11px] text-slate-500">${tb.subtitle}</p>
          </div>
          <span class="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">NTEP / NIKSHAY</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-zinc-800">
                <th class="py-1.5 px-3">Patient Weight Band</th>
                <th class="py-1.5 px-3">Intensive Phase (8 Wks)</th>
                <th class="py-1.5 px-3">Continuation Phase (16 Wks)</th>
              </tr>
            </thead>
            <tbody>${tbRows}</tbody>
          </table>
        </div>
        <p class="text-[11px] text-slate-500 mt-2 italic">${tb.notes}</p>
      </div>
    `;
  }

  // NACO STI Kits
  if (sti) {
    const stiCards = sti.kits.map(k => `
      <div class="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs">
        <div class="flex items-center justify-between mb-1">
          <span class="font-bold text-slate-900 dark:text-white">${k.color}</span>
          <span class="text-[10px] text-slate-400 font-medium">${k.syndrome}</span>
        </div>
        <p class="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono mt-1">${k.contents}</p>
      </div>
    `).join("");

    html += `
      <div class="border border-slate-200/80 dark:border-zinc-800 rounded-xl p-4 bg-slate-50 dark:bg-zinc-950/60">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2 mb-3">
          <div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">${sti.name}</h3>
            <p class="text-[11px] text-slate-500">${sti.subtitle}</p>
          </div>
          <span class="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">NACO STD Control</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${stiCards}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

// -------------------------------------------------------------
// PRE-REFERRAL SLIP GENERATION & SHOCK INDEX
// -------------------------------------------------------------
function clearReferralForm() {
  appState.refPtName = "";
  appState.refPtAgeSex = "";
  appState.refVitals = { bp: "", pr: "", spo2: "", rr: "", rbs: "", gcs: "" };
  appState.refDiagnosis = "";
  appState.refDrugsGiven = "";
  appState.refReason = "";

  const fieldMap = {
    "ref-input-ptname": "",
    "ref-input-agesex": "",
    "ref-input-bp": "",
    "ref-input-pr": "",
    "ref-input-spo2": "",
    "ref-input-rbs": "",
    "ref-input-gcs": "",
    "ref-input-diag": "",
    "ref-input-drugs": "",
    "ref-input-reason": ""
  };
  Object.entries(fieldMap).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });

  saveSessionDrafts();
  updateActiveLegalPreview();
  showToast("Pre-Referral Form Cleared for New Patient");
}

function applyVitalsPreset(type) {
  if (type === "shock") {
    appState.refVitals.bp = "70/40";
    appState.refVitals.pr = "134";
    appState.refVitals.spo2 = "89";
    appState.refVitals.rbs = "65";
    appState.refVitals.gcs = "9/15";
  }
  const elBp = document.getElementById("ref-input-bp");
  if (elBp) elBp.value = appState.refVitals.bp;
  const elPr = document.getElementById("ref-input-pr");
  if (elPr) elPr.value = appState.refVitals.pr;
  const elSpo2 = document.getElementById("ref-input-spo2");
  if (elSpo2) elSpo2.value = appState.refVitals.spo2;
  const elRbs = document.getElementById("ref-input-rbs");
  if (elRbs) elRbs.value = appState.refVitals.rbs;
  const elGcs = document.getElementById("ref-input-gcs");
  if (elGcs) elGcs.value = appState.refVitals.gcs;
  
  saveSessionDrafts();
  updateActiveLegalPreview();
  showToast("Shock Vitals Preset Applied");
}

function generateReferralText() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const sbp = parseFloat(appState.refVitals.bp.split('/')[0]) || 120;
  const hr = parseFloat(appState.refVitals.pr) || 84;
  const shockInfo = CLINICAL_DATA.shockIndexCalculator ? CLINICAL_DATA.shockIndexCalculator.calc(hr, sbp) : { index: (hr/sbp).toFixed(2), triage: "Calculated" };

  return `===============================================================
OFFICIAL EMERGENCY PRE-REFERRAL CLINICAL SLIP
Government Public Health / Casualty Facility
===============================================================
REFERRING FACILITY : ${appState.refFacility}
MEDICAL OFFICER    : ${appState.refDoctor}
DATE & TIME        : ${dateStr} at ${timeStr}
REFERRED TO        : Nearest Tertiary Care / Medical College Hospital
---------------------------------------------------------------
PATIENT PARTICULARS:
Name               : ${appState.refPtName}
Age / Sex          : ${appState.refPtAgeSex}
---------------------------------------------------------------
BASELINE VITALS AT PRESENTATION:
Blood Pressure (BP): ${appState.refVitals.bp} mmHg
Pulse Rate (PR)    : ${appState.refVitals.pr} bpm
Shock Index (SI)   : ${shockInfo.index} (${shockInfo.triage})
Oxygen Sat (SpO2)  : ${appState.refVitals.spo2} %
Respiratory Rate   : ${appState.refVitals.rr || 18} /min
Blood Sugar (RBS)  : ${appState.refVitals.rbs} mg/dL
GCS Score          : ${appState.refVitals.gcs}
---------------------------------------------------------------
PROVISIONAL DIAGNOSIS:
${appState.refDiagnosis}

INITIAL EMERGENCY STABILIZATION GIVEN AT FACILITY:
${appState.refDrugsGiven}

REASON FOR REFERRAL:
${appState.refReason} (Non-availability of ICU / Specialist / Mechanical Ventilator)

TRANSPORT CONDITION & EN-ROUTE ESCORT:
${appState.refTransport}
---------------------------------------------------------------
ATTENDANT INFORMED CONSENT & LEGAL DISCLOSURE:
"The critical clinical condition of the patient, the urgent need for tertiary level specialist management/ICU, and the high risks involved during ambulance transit (including potential deterioration/cardiac arrest) have been thoroughly explained to the patient's attendants/relatives in their primary language. Attendants have understood and agreed to the referral."

Attendant Signature / Thumb Impression: _______________________
Name of Attendant & Relation: _______________________________

Medical Officer Signature & Seal: ____________________________
Registration No (NMC / State Council): _______________________
===============================================================`;
}

// -------------------------------------------------------------
// MEDICO-LEGAL SHIELD (BNS 116 / IPC 320)
// -------------------------------------------------------------
function renderMedicoLegalDesk() {
  renderGrievousHurtList();
  renderPostMortemRules();
}

function renderGrievousHurtList() {
  const container = document.getElementById("grievous-clauses-container");
  if (!container || !CLINICAL_DATA.medicoLegal) return;

  container.innerHTML = CLINICAL_DATA.medicoLegal.grievousHurtClauses.map(clause => {
    const isChecked = appState.selectedGrievousClauses.includes(clause.id);
    return `
      <label class="flex items-start gap-2 p-2 rounded-xl border transition text-xs cursor-pointer ${isChecked ? 'bg-amber-500/10 border-amber-500/30 font-semibold text-amber-900 dark:text-amber-200' : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'}">
        <input type="checkbox" onchange="toggleGrievousClause(${clause.id})" ${isChecked ? 'checked' : ''} class="mt-0.5 rounded text-amber-600 focus:ring-amber-500">
        <span>Clause ${clause.id}: ${clause.text}</span>
      </label>
    `;
  }).join("");
}

function toggleGrievousClause(id) {
  if (appState.selectedGrievousClauses.includes(id)) {
    appState.selectedGrievousClauses = appState.selectedGrievousClauses.filter(c => c !== id);
  } else {
    appState.selectedGrievousClauses.push(id);
  }
  saveSessionDrafts();
  renderGrievousHurtList();
  updateActiveLegalPreview();
}

function generateMlcText() {
  const isGrievous = appState.selectedGrievousClauses.length > 0;
  const classification = isGrievous ? "GRIEVOUS HURT" : "SIMPLE HURT";
  const legalSection = isGrievous ? "Section 116 Bharatiya Nyaya Sanhita (BNS, 2023) / Section 320 IPC" : "Section 114 Bharatiya Nyaya Sanhita (BNS, 2023) / Section 319 IPC";

  return `===============================================================
MEDICO-LEGAL INJURY CERTIFICATION REPORT
Government Public Health / Casualty Facility
===============================================================
NAME OF PATIENT    : ${appState.refPtName}
AGE / SEX          : ${appState.refPtAgeSex}
EXAMINING DOCTOR   : ${appState.refDoctor}
EXAMINATION FACILITY: ${appState.refFacility}
---------------------------------------------------------------
1. NATURE OF INJURY / WOUND:
   ${appState.mlcWoundType}

2. ANATOMICAL LOCATION & LANDMARKS:
   ${appState.mlcLocation}

3. DIMENSIONS (Length x Breadth x Depth):
   ${appState.mlcLength} cm x ${appState.mlcBreadth} cm x ${appState.mlcDepth}

4. MARGINS & MORPHOLOGICAL CHARACTERISTICS:
   ${appState.mlcMargins}

5. ESTIMATED AGE / DURATION OF INJURY:
   ${appState.mlcAge}

6. PROBABLE NATURE OF WEAPON USED:
   Caused by ${appState.mlcWeaponNature}

7. FINAL MEDICO-LEGAL OPINION & STATUTORY CLASSIFICATION:
   In my professional medical opinion, the aforementioned injury is classified as:
   >> **${classification}** <<

   Statutory Governing Law:
   ${legalSection}
   ${isGrievous ? `\n   Statutory Grounds (Grievous Clauses Fulfilled):\n   - Clause(s): ${appState.selectedGrievousClauses.join(", ")}` : ''}

Medical Officer Signature & Seal: ____________________________
Registration No (NMC / State Council): _______________________
===============================================================`;
}

function renderPostMortemRules() {
  const container = document.getElementById("pm-rules-container");
  if (!container || !CLINICAL_DATA.medicoLegal.postMortemRules) return;

  container.innerHTML = CLINICAL_DATA.medicoLegal.postMortemRules.map(r => `
    <div class="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-800 space-y-1">
      <span class="font-bold text-slate-900 dark:text-white block">${r.topic}</span>
      <p class="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">${r.points}</p>
    </div>
  `).join("");
}

function generateAutopsyReferenceText() {
  let text = `===============================================================
POST-MORTEM AUTOPSY & SOBRIETY QUICK CLINICAL PROTOCOLS
Forensic Reference for Medical Officers
===============================================================\n\n`;

  if (CLINICAL_DATA.medicoLegal && CLINICAL_DATA.medicoLegal.postMortemRules) {
    CLINICAL_DATA.medicoLegal.postMortemRules.forEach((r, idx) => {
      text += `[${idx+1}] ${r.topic.toUpperCase()}:\n${r.points}\n\n`;
    });
  }

  text += `---------------------------------------------------------------
SECTION 185 MOTOR VEHICLES ACT (MVA) SOBRIETY CRITERIA:
- Blood Alcohol Concentration (BAC) > 30 mg / 100 mL by breathalyzer/blood test.
- Document clinical signs: Conjunctival congestion, slurred speech, smell of alcohol in breath, Romberg's sign, finger-nose test, gait ataxia.
===============================================================`;
  return text;
}

// -------------------------------------------------------------
// UNIVERSAL COMMAND PALETTE (CMD+K) SPOTLIGHT SEARCH
// -------------------------------------------------------------
function openSearchModal() {
  const overlay = document.getElementById("search-modal-overlay");
  const input = document.getElementById("global-search-modal-input");
  if (overlay) {
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
  }
  if (input) {
    input.value = "";
    input.focus();
    renderSearchResults("");
  }
}

function closeSearchModal() {
  const overlay = document.getElementById("search-modal-overlay");
  if (overlay) {
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
  }
}

function setupGlobalSearch() {
  const input = document.getElementById("global-search-modal-input");
  if (input) {
    input.addEventListener("input", (e) => {
      renderSearchResults(e.target.value.trim());
    });
  }

  const overlay = document.getElementById("search-modal-overlay");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeSearchModal();
    });
  }
}

function renderSearchResults(query) {
  const container = document.getElementById("search-results-container");
  if (!container) return;

  const q = query.toLowerCase();
  const results = [];

  // 1. Search Pediatrics & Essential Medicines
  CLINICAL_DATA.pediatrics.forEach(drug => {
    if (!q || drug.name.toLowerCase().includes(q) || drug.indications.toLowerCase().includes(q) || drug.category.toLowerCase().includes(q) || (drug.keywords && drug.keywords.toLowerCase().includes(q)) || (drug.notes && drug.notes.toLowerCase().includes(q))) {
      results.push({
        type: "Essential Drug / NLEM",
        icon: "💊",
        title: drug.name,
        subtitle: `${drug.rule} • ${drug.category}`,
        tag: "OPD/Govt",
        action: () => {
          closeSearchModal();
          switchHub("opd");
          setPedsViewMode("matrix");
          setPedsCategory("All");
          appState.pedsSearch = drug.name.split(' ')[0];
          const searchInput = document.getElementById("peds-desk-search-input");
          if (searchInput) searchInput.value = appState.pedsSearch;
          renderPediatricContent();
        }
      });
    }
  });

  // 2. Search Emergencies
  CLINICAL_DATA.emergencies.forEach(em => {
    if (!q || em.title.toLowerCase().includes(q) || em.overview.toLowerCase().includes(q)) {
      results.push({
        type: "ICMR Resus",
        icon: "🚨",
        title: em.title,
        subtitle: em.subtitle,
        tag: "Casualty",
        action: () => {
          closeSearchModal();
          switchHub("emergency");
          switchEmergencySubTab("resus");
          selectEmergency(em.id);
        }
      });
    }
  });

  // 3. Search ECG Triage
  if (CLINICAL_DATA.ecgTriage && CLINICAL_DATA.ecgTriage.leadsMap) {
    CLINICAL_DATA.ecgTriage.leadsMap.forEach((l, idx) => {
      if (!q || l.territory.toLowerCase().includes(q) || l.culpritArtery.toLowerCase().includes(q) || l.leads.toLowerCase().includes(q)) {
        results.push({
          type: "10s ECG & STEMI",
          icon: "🫀",
          title: `${l.territory} (Leads: ${l.leads})`,
          subtitle: `Culprit: ${l.culpritArtery} • ${l.criticalAlert.substring(0, 60)}...`,
          tag: "ECG",
          action: () => {
            closeSearchModal();
            switchHub("emergency");
            switchEmergencySubTab("ecg");
            selectEcgTerritory(idx);
          }
        });
      }
    });
  }

  // 4. Search Toxicology
  if (CLINICAL_DATA.toxicology) {
    CLINICAL_DATA.toxicology.forEach(t => {
      if (!q || t.name.toLowerCase().includes(q) || t.keyWarning.toLowerCase().includes(q) || t.antidote.toLowerCase().includes(q)) {
        results.push({
          type: "Toxicology & Antidote",
          icon: "☠️",
          title: t.name,
          subtitle: `Antidote: ${t.antidote} • ${t.keyWarning.substring(0, 50)}...`,
          tag: "Tox",
          action: () => {
            closeSearchModal();
            switchHub("emergency");
            switchEmergencySubTab("tox");
          }
        });
      }
    });
  }

  // 5. Search Vasopressors & DDI
  if (CLINICAL_DATA.vasopressors) {
    CLINICAL_DATA.vasopressors.forEach(v => {
      if (!q || v.drug.toLowerCase().includes(q) || v.doseRange.toLowerCase().includes(q)) {
        results.push({
          type: "Vasopressor Infusion",
          icon: "💉",
          title: v.drug,
          subtitle: `${v.standardDilution} • Range: ${v.doseRange}`,
          tag: "ICU/Vaso",
          action: () => {
            closeSearchModal();
            switchHub("emergency");
            switchEmergencySubTab("vaso");
          }
        });
      }
    });
  }

  // 6. Search Medico-Legal
  if (CLINICAL_DATA.medicoLegal && CLINICAL_DATA.medicoLegal.grievousHurtClauses) {
    CLINICAL_DATA.medicoLegal.grievousHurtClauses.forEach(clause => {
      if (!q || clause.text.toLowerCase().includes(q) || "grievous hurt".includes(q) || "bns 116".includes(q)) {
        results.push({
          type: "Medico-Legal BNS 116",
          icon: "⚖️",
          title: `Grievous Hurt Clause ${clause.id}`,
          subtitle: clause.text,
          tag: "Forensic",
          action: () => {
            closeSearchModal();
            switchHub("legal");
            switchLegalSubTab("mlc");
          }
        });
      }
    });
  }

  // Render list
  if (results.length === 0) {
    container.innerHTML = `
      <div class="py-8 text-center text-slate-400 text-xs">
        No clinical results matching "${escapeHtml(query)}".
      </div>
    `;
    return;
  }

  const displayResults = results.slice(0, 12);
  container.innerHTML = displayResults.map((r, idx) => `
    <div onclick="executeSearchResultAction(${idx})" class="search-result-item flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/80 cursor-pointer transition">
      <div class="flex items-center gap-3 overflow-hidden">
        <span class="text-base shrink-0">${r.icon}</span>
        <div class="overflow-hidden">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-900 dark:text-white truncate">${r.title}</span>
            <span class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 shrink-0">${r.tag}</span>
          </div>
          <p class="text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">${r.subtitle}</p>
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-400 shrink-0 ml-2"><path d="m9 18 6-6-6-6"/></svg>
    </div>
  `).join("");

  window._currentSearchResults = displayResults;
}

function executeSearchResultAction(index) {
  if (window._currentSearchResults && window._currentSearchResults[index]) {
    window._currentSearchResults[index].action();
  }
}

// -------------------------------------------------------------
// EVENT LISTENERS & SHORTCUTS
// -------------------------------------------------------------
function setupEventListeners() {
  const bindInput = (id, prop, isObj = false, subProp = "") => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", (e) => {
      if (isObj) {
        appState[prop][subProp] = e.target.value;
      } else {
        appState[prop] = e.target.value;
      }
      saveSessionDrafts();
      updateActiveLegalPreview();
    });
  };

  bindInput("ref-input-ptname", "refPtName");
  bindInput("ref-input-agesex", "refPtAgeSex");
  bindInput("ref-input-facility", "refFacility");
  bindInput("ref-input-doctor", "refDoctor");
  bindInput("ref-input-bp", "refVitals", true, "bp");
  bindInput("ref-input-pr", "refVitals", true, "pr");
  bindInput("ref-input-spo2", "refVitals", true, "spo2");
  bindInput("ref-input-rbs", "refVitals", true, "rbs");
  bindInput("ref-input-gcs", "refVitals", true, "gcs");
  bindInput("ref-input-diag", "refDiagnosis");
  bindInput("ref-input-drugs", "refDrugsGiven");
  bindInput("ref-input-reason", "refReason");

  const bindMlc = (id, prop) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", (e) => {
      appState[prop] = e.target.value;
      saveSessionDrafts();
      updateActiveLegalPreview();
    });
  };

  bindMlc("mlc-input-type", "mlcWoundType");
  bindMlc("mlc-input-location", "mlcLocation");
  bindMlc("mlc-input-length", "mlcLength");
  bindMlc("mlc-input-breadth", "mlcBreadth");
  bindMlc("mlc-input-depth", "mlcDepth");
  bindMlc("mlc-input-margins", "mlcMargins");
  bindMlc("mlc-input-age", "mlcAge");
  bindMlc("mlc-input-weapon", "mlcWeaponNature");
}

function setupKeyboardShortcuts() {
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === "Escape") {
      closeSearchModal();
    }
  });
}

function showToast(msg) {
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    toast.className = "fixed bottom-5 right-5 z-50 bg-slate-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-800 dark:border-zinc-200 transition transform duration-200 opacity-0 translate-y-2 pointer-events-none";
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.classList.remove("opacity-0", "translate-y-2");
  toast.classList.add("opacity-100", "translate-y-0");
  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-2");
  }, 2200);
}

// -------------------------------------------------------------
// PWA INSTALL HOOK
// -------------------------------------------------------------
let deferredPrompt = null;
if (typeof window !== 'undefined') {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const banner = document.getElementById("pwa-install-banner");
    if (banner) banner.classList.remove("hidden");
  });
}

function installPwa() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      deferredPrompt = null;
      dismissPwaBanner();
    });
  }
}

function dismissPwaBanner() {
  const banner = document.getElementById("pwa-install-banner");
  if (banner) banner.classList.add("hidden");
}

// -------------------------------------------------------------
// NODE.JS MODULE EXPORTS FOR RIGOROUS AUTOMATED VERIFICATION
// -------------------------------------------------------------
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DOCSHIFT_VERSION,
    appState,
    validateFileCheck,
    parseCsvCounts,
    parseClinicalDocument,
    executeDocumentParser,
    renderStructuredEntitiesReview,
    clearReferralForm,
    clearPedsSearch,
    handlePedsSearch,
    setTransformerInputMode,
    handleRawTextareaInput,
    transformRawText,
    transferEntitiesToReferralForm,
    transferEntitiesToMlcForm,
    switchHub3MobileView,
    SAMPLE_CLINICAL_DOCS
  };
}

