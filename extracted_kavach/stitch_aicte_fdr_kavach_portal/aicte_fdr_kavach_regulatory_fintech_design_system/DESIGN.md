---
name: AICTE-FDR-Kavach Regulatory FinTech Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#6b3700'
  on-tertiary: '#ffffff'
  tertiary-container: '#8d4b00'
  on-tertiary-container: '#ffcba3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Public Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-lg:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-md:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-numeric:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-badge:
    fontFamily: Public Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style
The design system powers an institutional-grade regulatory portal dedicated to Fixed Deposit Receipt (FDR) verification, joint encashment mandates, and institutional security deposit lifecycle monitoring for statutory bodies. The interface conveys unyielding legal authority, institutional resilience, and absolute fiduciary fidelity. The audience spans AICTE regional monitoring officers, commercial bank nodal managers, chartered accountants, and academic institutional heads. 

The aesthetic model synthesizes **Corporate Modern** with **Technical Precision Minimalist** architectures, adhering strictly to the Guidelines for Indian Government Websites (GIGW 3.0) and WCAG 2.1 AA mandates. Layouts present dense, scannable data views without visual bloat. The tone is deliberate, disciplined, and audited: decorative gradients and playful motifs are replaced by structured hairline dividers, discrete status pillars, and monospaced cryptographic and currency legibility.

## Colors
The palette balances constitutional authority with modern high-frequency financial interfaces:

- **Canvas & Surface Framework**: The root viewport canvas utilizes `#F8FAFC` (Slate 50), with component cards constructed on `#FFFFFF`. Modal backdrops, header banners, and institutional command consoles invoke `#0F172A` (Deep Slate Navy) to project statutory gravity and anchor critical regulatory actions.
- **Primary Statutory Color (`#1D4ED8`)**: A focused Royal Indigo/Blue delivering a contrast ratio exceeding 4.5:1 against light surfaces, reserved for primary workflow transitions, authenticated actions, verified institutional identity badges, and focus rings.
- **Secondary Structural Tone (`#0F172A`)**: Deep Slate/Navy deployed for high-order typographic hierarchy, master navigation rails, table column headers, and cryptographic summary panels.
- **Regulatory Accents & Semantic Tiers**:
  - **Warning / Pending Audit (`#D97706`)**: Warm amber for pending dual-signatory approvals, upcoming maturity notices, and provisional submissions.
  - **Verified / Liquidity Active (`#059669`)**: Emerald green strictly reserved for active deposits, authenticated verification hashes, and compliant audits.
  - **Statutory Alert / Violation (`#DC2626`)**: Crimson alert designated for lien breaches, expired mandates, signature mismatches, and encashment disputes.
  - **Neutral Grid Tier**: `#64748B` for secondary captions and breadcrumbs; `#CBD5E1` for structural 1px data grids; `#E2E8F0` for interior section separating lines.

## Typography
Typographic rules strictly partition administrative text from verifiable institutional records:

- **Public Sans** commands body copy, administrative controls, section titles, and government form labeling. Its mechanical, accessible structure guarantees optimum legibility across various screen resolutions and assistive technologies.
- **JetBrains Mono** governs all quantitative, regulatory, and cryptographic data: FDR registration numbers, Bank IFSC codes, Indian Rupee (₹) amounts, SHA-256 validation signatures, and timestamp logs. Monospaced rendering ensures accurate tabular scanning and eliminates misreads of variable-width numbers.
- **Casing Rules**: Metric identifiers and status badges are rendered in uppercase with deliberate letter spacing (`0.05em`) to emphasize transactional finality. Paragraph content maintains sentence casing with a 1.5 line-height ratio to prevent fatigue during extended audit reviews.

## Layout & Spacing
The layout follows a responsive 12-column grid system tuned for dense tabular data and institutional review panes:

- **Grid Alignment**: Employs a dense 8px grid baseline (`0.5rem` = 8px base factor). Desktop screens (>1280px) use `gutter-desktop` (24px) with fixed page containment up to 1440px max-width to maintain visual connection between action columns and row data. Tablet (768px - 1024px) scales to 8 columns with 16px gutters, while mobile displays (<768px) drop to a 4-column flow with a strict 16px outer margin.
- **Information Density**: Padding within table cells, validation checklists, and form field clusters maintains an efficient ratio (`space-sm` vertically, `space-md` horizontally). This prevents artificial white space from causing horizontal scrolling on complex reconciliation ledgers.
- **Mobile Reflow**: Dense tabular layouts convert to stacked transaction cards on screens under 768px. In these cards, critical identifiers (FDR Number, Value, Status) sit atop collapsible accordions housing validation audit trails.

## Elevation & Depth
Elevation minimizes decorative drop shadows, relying instead on structural outlines, subtle tonal stacking, and high-contrast delineation:

- **Surface Tiers**:
  - **Base Canvas**: `#F8FAFC`
  - **Structural Paneling**: `#FFFFFF` with a crisp `1px solid #E2E8F0` border.
  - **Command Bars & Headers**: `#0F172A` with an active bottom edge indicator in `#1D4ED8` (2px).
- **Shadow System**: Restricted to interactive float states and modal confirmation alerts to keep print-to-PDF reports clean.
  - **Resting Cards**: No shadow (`box-shadow: none`). Separation relies entirely on border tokens.
  - **Dropdowns & Popovers**: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)`.
  - **Modals & Dual-Signatory Prompts**: `0 20px 25px -5px rgba(15, 23, 42, 0.2), 0 8px 10px -6px rgba(15, 23, 42, 0.1)`.
- **Accessibility & Focus Indicators**: All interactive elements display a distinct `2px solid #1D4ED8` outline with an offset of `2px` under active keyboard focus, preventing ambiguous navigational states.

## Shapes
The shape language uses subtle, controlled curves (Level 1: Soft) to balance technical precision with an accessible feel:

- **Inputs, Buttons, and Form Modules**: Set to `0.25rem` (4px). This soft border radius preserves structural rectangularity across dense data fields without appearing harsh.
- **Containers, Cards, and Data Grid Wrappers**: Employ `0.5rem` (8px, `rounded-lg`) along outer boundaries while retaining clean 90-degree internal intersections for unified cell grids.
- **Badge Elements & Status Indicators**: Bounded at `0.25rem` (4px). Pill or rounded-full treatments are intentionally avoided to distinguish actionable controls from regulatory status labels.

## Components

### Buttons
- **Primary Statutory Action**: Solid `#1D4ED8` background, `#FFFFFF` text, 4px corner radius, font-size 14px, font-weight 600. Hover: `#1E40AF`. Active: `#1E3A8A`. Disabled: `#CBD5E1` with `#94A3B8` text.
- **Secondary Administrative Action**: Transparent fill, 1px solid `#CBD5E1`, `#0F172A` text. Hover: `#F1F5F9`.
- **Destructive/Encashment Action**: Transparent fill with 1px solid `#DC2626`, `#DC2626` text. Hover: `#DC2626` solid with `#FFFFFF` text.

### Badges & Status Indicators
Always combines a 12px semantic SVG icon, an uppercase label rendered in `label-badge` typography, and high-contrast color pairs:
- **Active / Lien Marked**: Emerald tier (`bg: #ECFDF5`, `border: 1px solid #A7F3D0`, `text: #065F46`).
- **Pending Bank Verification**: Amber tier (`bg: #FFFBEB`, `border: 1px solid #FDE68A`, `text: #92400E`).
- **Matured / Action Required**: Blue tier (`bg: #EFF6FF`, `border: 1px solid #BFDBFE`, `text: #1E40AF`).
- **Defaulter / Mismatch Disputed**: Crimson tier (`bg: #FEF2F2`, `border: 1px solid #FECACA`, `text: #991B1B`).

### Form Inputs & Controls
- **Input Fields**: Height 40px, `#FFFFFF` fill, 1px solid `#CBD5E1`, internal horizontal padding 12px. Placeholder text in `#94A3B8`. Error state triggers 1px solid `#DC2626` accompanied by an inline alert icon and explanatory error text below.
- **Monetary Inputs**: Fixed prefix container housing the `₹` symbol in `#64748B`, with the entered amount displayed using `label-numeric` (JetBrains Mono).
- **Checkboxes & Radios**: 18px square/circle with 2px borders in `#64748B`. Checked state applies `#1D4ED8` fill with a high-contrast white checkmark icon.

### Data Grids & Inspection Cards
- **Table Headers**: Background `#F8FAFC`, uppercase 12px text in `#475569`, 1px solid bottom border in `#CBD5E1`.
- **Table Rows**: Alternating micro-striping (`#FFFFFF` to `#FBFDFE`), cell borders `1px solid #F1F5F9`, row hover `#F1F5F9`.
- **Card Panels**: Crisp 1px border (`#E2E8F0`), `#FFFFFF` surface, containing a distinct header band with metadata labels clearly differentiated from dynamic values.

### Specialized Regulatory Components
- **Dual-Signatory Confirmation Rail**: A split verification card displaying AICTE Approver and Bank Nodal Officer digital signature markers side-by-side, complete with verification hash snippets and time logs.
- **FDR Integrity Stamp**: A persistent status badge containing the issuing bank's logo token, IFSC validation mark, and an active digital ledger synchronization indicator.