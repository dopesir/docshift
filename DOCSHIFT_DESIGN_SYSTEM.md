# DOCSHIFT — DESIGN SYSTEM & SPECIFICATION SPEC

**Product:** DocShift — Indian Clinical Operating Workbench  
**Version:** 2.0 Production Release  
**Design Lead:** Design Systems Lead & Clinical Ergonomist  

---

## 1. Visual Direction & Identity

DocShift is designed not as a consumer website, but as a **High-Precision Medical Flight Instrument (Clinical HUD)**.
- **Aesthetic:** Swiss-inspired functionalism, Linear-grade precision, Aviation cockpit clarity.
- **Atmosphere:** Authoritative, calm, trustworthy, zero unnecessary ornament.
- **Primary Goal:** Enable an Indian Medical Officer to examine a patient, calculate a critical pediatric or resus dose in 1.5 seconds, and generate statutory referral or medico-legal documentation with zero friction.

---

## 2. Color System & Semantic Tokens

All color pairings are engineered to surpass **WCAG AAA Contrast Standards (>= 7:1 for normal text, >= 4.5:1 for large text and icons)** under hospital lighting conditions.

### Neutral Surface Scale
| Token | Light Value | Dark Value (Night Shift) | Semantic Usage |
| :--- | :--- | :--- | :--- |
| `surface-canvas` | `#f8fafc` (Slate 50) | `#09090b` (Zinc 950) | Global application background |
| `surface-subtle` | `#f1f5f9` (Slate 100) | `#141417` (Zinc 900) | Segmented dock backgrounds, secondary cards |
| `surface-elevated`| `#ffffff` (White) | `#1e1e24` (Zinc 850) | Primary interactive cards, modals, table rows |
| `border-subtle` | `rgba(226, 232, 240, 0.8)` | `rgba(39, 39, 42, 0.8)` | Standard 1px card and divider boundaries |
| `border-strong` | `#cbd5e1` (Slate 300) | `#3f3f46` (Zinc 700) | Active inputs, focused elements, key steppers |

### Clinical Semantic Accents
| Token | Hex (Light / Dark) | Meaning & Functional Trigger |
| :--- | :--- | :--- |
| `clinical-critical` | `#ef4444` / `#f87171` | Emergency resuscitation, absolute contraindications, STEMI, shock |
| `clinical-warning` | `#f59e0b` / `#fbbf24` | Toxicology warnings, BNS 116 Grievous hurt clauses, relative contraindications |
| `clinical-safe` | `#10b981` / `#34d399` | Offline lock verified, safe medication parameters, IDSP surveillance logging |
| `clinical-accent` | `#4f46e5` / `#818cf8` | Point-of-care calculated doses, syringe pump rates, primary actions |
| `clinical-info` | `#0284c7` / `#38bdf8` | Clinical footnotes, WHO guidance notes, PALS tape parameters |

---

## 3. Typography & Numerical Precision

### Font Stack
- **Primary Interface:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`
  - Font features: `font-feature-settings: "cv02", "cv03", "cv04", "cv11"`
- **Calculations, Dosing, Timers, Legal Codes:** `JetBrains Mono`, `SFMono-Regular`, `Consolas`, `monospace`
  - Font features: `font-variant-numeric: tabular-nums`

### Type Scale Hierarchy
| Level | Font Size | Weight | Line Height | Application |
| :--- | :--- | :--- | :--- | :--- |
| `display-lg` | 28px (1.75rem) | Black (900) | 1.1 | Live patient weight, total shift footfall |
| `title-lg` | 18px (1.125rem) | Bold (700) | 1.25 | Emergency protocol titles, major modal headers |
| `title-md` | 14px (0.875rem) | Bold (700) | 1.3 | Card titles, drug names, statutory sections |
| `body-sm` | 12px (0.75rem) | Medium (500) | 1.4 | Dosage instructions, contraindication checklist, inputs |
| `caption` | 10px (0.625rem) | Semibold (600) | 1.3 | Category chips, formulation supply strength, table th |
| `micro-badge` | 9px (0.5625rem) | Black (900) | 1.0 | Severity tags (CRITICAL, ALERT, BNS 116), Form P codes |

---

## 4. Spacing, Borders & Radius

- **Grid System:** Strict 4px / 8px incremental scale (`p-1` = 4px, `p-2` = 8px, `p-3` = 12px, `p-4` = 16px, `p-5` = 20px, `p-6` = 24px).
- **Corner Radii:**
  - Standard Cards & Modals: `rounded-2xl` (16px)
  - Interactive Buttons & Inputs: `rounded-xl` (12px)
  - Chips & Mini Steppers: `rounded-lg` (8px)
  - Micro Badges & Status Dots: `rounded-md` (6px) or `rounded-full`
- **Shadows:** Restrained micro-elevations (`shadow-2xs`, `shadow-xs`, `shadow-sm`) — avoiding muddy diffused drop shadows.

---

## 5. Reusable Component Primitives

### 1. Tactile Steppers & Weight Sliders
- Designed for rapid single-finger tapping on touchscreens or clicking on desktop trackpads.
- Features prominent `-1k`, `-`, `+`, `+1k` buttons with active scale transforms (`active:scale-95`).
- Live weight readout in centered tabular bold numbers (`12.0 kg`).

### 2. Segmented Master Docks (Desktop & Mobile)
- Desktop: Floating pill segmented bar in header with smooth active pill background.
- Mobile: Tactile bottom dock with safe-area bottom padding and active tab highlighting.

### 3. Dosage Matrix Table
- High-density glanceable row structure.
- Columns: Generic Name -> Supply Strength -> Calculated Dose (Bold Indigo) -> Frequency & Notes -> 1-Tap Copy.
- Hover states with subtle background tints (`hover:bg-zinc-50/80` / `dark:hover:bg-zinc-800/40`).

### 4. Official Clinical Stationery (Pre-Referral & Medico-Legal)
- High-fidelity official Government of India medical certificate layout.
- Crisp headers, structured tabular fields, legal disclaimers, and NMC doctor seal box.
- Seamless dual-mode: Visual screen rendering and print media formatting (`@media print`).

### 5. Universal Command Palette (`Cmd+K`)
- Centered backdrop overlay with instant fuzzy search input.
- Real-time categorized result cards with domain badges (`OPD`, `Casualty`, `ECG`, `Tox`, `ICU`, `Forensic`).
- Full keyboard navigation (`Up`, `Down`, `Enter`, `Esc`).

### 6. Clinical Document Upload Dropzone & File Indicators
- **Border:** 2px dashed `border-slate-300` / `dark:border-zinc-700`, transitioning to `border-indigo-500` and `bg-indigo-500/10` on drag-over.
- **File Metadata Banner:** Rounded-xl card with file icon, name truncate, size indicator (`14.2 KB`), and quick remove action.
- **Supported Formats:** Inline badge display for `.TXT, .JSON, .CSV, .MD` (5 MB max).

### 7. Multi-Stage Progress Indicators
- **Container:** Rounded-full track `bg-slate-200` / `dark:bg-zinc-800` (h-2).
- **Bar:** Dynamic width transition `bg-indigo-600` with 300ms ease.
- **Stage Labels:** 4-column monospace grid marking `1. Validate`, `2. Parse Vitals`, `3. BNS Structure`, `4. Stationery`.

### 8. Actionable Error Alerts & Remediation
- **Container:** `bg-rose-500/10` with `border-rose-500/30` hairline border.
- **Structure:** 
  1. Header: What Happened (e.g. `Document Parsing Failure`).
  2. Subtext: Why it happened (e.g. `File is empty or unsupported MIME type`).
  3. Action Footnote: What to do next (e.g. `Load Sample Note` or `Choose Another File`).

---

## 6. Responsive Breakpoints & Viewport Rules

| Breakpoint | Target Devices | Layout Adaptations |
| :--- | :--- | :--- |
| **`>= 1280px` (Desktop XL)** | 24"-27" Hospital Monitors | 12-column dual-pane split view, sticky command HUD, persistent sidebar |
| **`1024px - 1279px` (Desktop LG)** | 13"-15" Laptops | 12-column grid with reduced lateral padding, full dosage table density |
| **`768px - 1023px` (Tablet)** | iPad / Android Tablets | 2-column stacked layout, larger touch targets (48px), responsive scroll tables |
| **`375px - 767px` (Mobile)** | MO Smartphones / On-Duty Phones | Single-column vertical stack, fixed bottom 3-hub dock, drawer tally sheet |

---

## 7. Accessibility & Human Factors

1. **WCAG AAA Contrast:** All text elements meet a minimum 7:1 contrast ratio against their respective surface tokens.
2. **Keyboard Navigation:** Full focus rings (`focus:ring-2 focus:ring-indigo-500`) on all interactive buttons, inputs, checkboxes, and tabs.
3. **Screen-Reader Semantics:** Explicit ARIA landmark roles (`role="tablist"`, `role="tab"`, `role="region"`, `role="dialog"`, `aria-live="polite"`).
4. **Touch Target Size:** All interactive buttons and stepper click areas have a minimum physical bounding box of `44px x 44px`.
5. **Reduced Motion:** Respects `prefers-reduced-motion: reduce` by disabling non-critical transition scales.

## 6. Motion & Micro-Interactions

Motion is utilized **only to communicate state changes**, never as decorative distraction.
- **Duration:** 100ms – 180ms ease-out transitions.
- **Button Feedback:** Subtle tactile press scale (`scale-[0.98]`).
- **Copy / Share Feedback:** Button label morphs to "✓ Copied!" in emerald accent for 1.8 seconds.
- **20WBCT Timer Alert:** High-visibility flashing emergency banner with audible click tone and clear clinical action recommendation.
- **Reduced Motion:** Fully honors `@media (prefers-reduced-motion: reduce)`.

---

## 7. Responsive Breakpoint Rules

| Viewport | Target Device | Layout Behavior |
| :--- | :--- | :--- |
| `>= 1280px` | Desktop / Clinic Workstation | Full 3-Hub top dock, 2-column Casualty Resus grid, side-by-side Medico-Legal split pane. |
| `1024px – 1279px` | Hospital Tablet / Laptop | Adjusted grid columns; full table horizontal scroll with sticky headers. |
| `768px – 1023px` | iPad / Android Tablet | Top dock switches to responsive icon-labels; collapsible drawers stay touch-friendly. |
| `< 768px` | Smartphone (360px – 430px) | Fixed tactile bottom dock; stacked 1-column cards; full-width touch targets; bottom safe-area offset. |
