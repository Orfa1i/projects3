/*
 * ─────────────────────────────────────────────────────────────
 *  CONTENT FILE — the only file you need to edit for text and images.
 * ─────────────────────────────────────────────────────────────
 *  Image paths are relative to index.html. Put files in assets/<project>/.
 *  Any field left empty ("" or []) shows a labelled placeholder on screen,
 *  so nothing is ever invented to fill the gap.
 *
 *  screens: up to 3 real interface screenshots.
 *           The first one is the dominant screen; the others sit behind it in depth.
 *           { src: "assets/kitten/viewer.png", alt: "Kitten viewer with a CT series open" }
 *  note:    a short line for stated prototype limitations (shown small, never hidden).
 *  lines:   up to 2 short supporting sentences (purpose / value).
 *  accent:  the world's highlight colour — set it from the real brand once the logo arrives.
 */

/* Auto-advance: moves to the next project every `seconds` after a page has fully arrived.
   loop: after the last project it returns to the first. Press P (or the play/pause button) to pause. */
window.AUTOPLAY = { enabled: true, seconds: 5, loop: true };

/* Presenters shown on each page (top left). */
window.PRESENTERS = {
  kitten: ["Mohammed Orfali"],
  hospital: ["Mohammed Orfali"],
  ecobeauty: ["Zainab Kamil"]
};

window.PROJECTS = {
  /* Source: "Kitten Brand & Design Reference" and "Kitten — Cases" artifacts, plus the DICOM viewer screenshot supplied in chat */
  kitten: {
    eyebrow: "Kitten",
    title: "Kitten",
    subtitle: "Medical Imaging AI Workstation",
    logo: "",            // wordmark is set in the brand face (League Spartan); add a logo file here if you have one
    intro:
      "A worklist of DICOM cases, a diagnostic studio for reading them and a report, in one workstation where AI models sit alongside the reader.",
    lines: [
      "Cases move from Fresh to Pending to Approved, so every study shows where it stands."
    ],
    note: "Prototype connected to a mock PACS node. Not for diagnostic use.",
    screens: [
      { src: "assets/kitten/kitten-dicom-viewer.jpg", alt: "Kitten DICOM viewer showing an axial chest CT" },
      { src: "assets/kitten/kitten-cases-table.png", alt: "Kitten Cases worklist with MR, CT, CR and US studies" }
    ],
    accent: "#00BF63"
  },

  /* Source: "Virtual Hospital by Asklevia" landing page, "Case Intake" and "Staff Roster" artifacts.
     The seven agents themselves live in js/agents.js. */
  hospital: {
    eyebrow: "Asklevia",
    title: "A whole hospital, wherever the patient is.",
    subtitle: "",
    logo: "assets/virtual-hospital/vh-logo.svg",
    intro:
      "Video consultations, patient records and AI-assisted diagnosis in one clinical workspace. The system drafts the differential. Your clinicians make the call.",
    lines: [
      "Every AI finding shows its confidence and waits for clinician review."
    ],
    note: "Synthetic data only: patient profiles are generated with Synthea for development and testing, never for real clinical care. AI output supports clinical judgment and does not replace it.",
    screens: [
      { src: "assets/virtual-hospital/vh-case-intake.png", alt: "Virtual Hospital Case Intake with synthetic patients" },
      { src: "assets/virtual-hospital/vh-differential-card.png", alt: "AI-assisted ranked differential awaiting clinician review" }
    ],
    agentsCaption: "Seven specialist AI agents. Each reasons from its own reference text, and a physician signs every report.",
    accent: "#2B2FD9"
  },

  ecobeauty: {
    eyebrow: "EcoBeauty",
    title: "Turning unwanted beauty products into value, not waste.",
    logo: "assets/ecobeauty/eco-logo.png",
    intro:
      "An AI-powered platform that creates a circular system for beauty products, recovering both what is inside and the packaging around it.",
    lines: [
      "Drop products at partner pharmacies and beauty stores, confirm with a QR code, and earn EcoScore points based on real environmental impact."
    ],
    note: "Starting with a limited set of makeup and skincare categories, then expanding gradually.",
    closing:
      "What was thrown away becomes given, what was wasted becomes reused, and what polluted becomes recycled.",
    flow: {
      scan:      { title: "Scan",      text: "Barcode, batch code or PAO symbol" },
      ai:        { title: "AI review", text: "Identifies the product and checks its condition" },
      repurpose: { title: "Repurpose", text: "Valuable ingredients go to partner manufacturers" },
      recycle:   { title: "Recycle",   text: "Plastic, glass and aluminum containers go to recycling partners" },
      repurposeOut: "Soap, candles, detergents, art pigments",
      recycleOut: "High-quality raw materials",
      handoff: "Empty container continues to recycling"
    },
    accent: "#e2b65c"
  }
};
