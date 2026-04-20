# Style Guide — Admin Dashboard
> Version 2.0 · Financial / Music Distribution Theme · Light & Dark Themes

---

## 1. Overview & Design Philosophy

This design system powers an **Admin Dashboard** for managing users, content, analytics, and settings. The aesthetic is **clean, professional, data-first**. It respects the user's intelligence, avoids visual noise, and communicates trust through restraint.

**Core values:**
- **Clarity over decoration** — every element earns its place
- **Dual-theme parity** — light and dark modes are equal citizens, not afterthoughts
- **Hierarchy through weight** — size and font weight communicate importance, not color alone
- **System fonts only** — no external font dependencies

---

## 2. Color Palette

### 2.1 Brand / Accent Colors

These are identical in both themes.

| Token | Hex | Usage |
|---|---|---|
| `--accent-primary` | `#C0392B` | Primary CTA buttons, active nav links, logo |
| `--accent-primary-hover` | `#A93226` | Hover state of primary buttons |
| `--accent-warm` | `#E67E22` | Bar chart bars, data highlights |
| `--accent-warm-dark` | `#D4811A` | Hover/active state for warm accent |

> **Rule:** Never use accent colors for backgrounds of large areas. They are reserved for interactive elements, progress indicators, and data visualization only.

---

### 2.2 Light Theme

| Token | Hex | Usage |
|---|---|---|
| `--bg-page` | `#F2F2F2` | Overall page background |
| `--bg-card` | `#FFFFFF` | Card / panel surface |
| `--bg-card-secondary` | `#F7F7F7` | Secondary card areas (stat sub-blocks) |
| `--bg-input` | `#FFFFFF` | Input fields, textareas, dropdowns |
| `--border-default` | `#E0E0E0` | Card borders, input borders, dividers |
| `--border-subtle` | `#EBEBEB` | Very light separators |
| `--text-primary` | `#1A1A1A` | Headings, key numbers, main labels |
| `--text-secondary` | `#5A5A5A` | Subtitles, descriptions, helper text |
| `--text-muted` | `#9B9B9B` | Timestamps, tags, placeholder text |
| `--text-label-caps` | `#888888` | Uppercase category labels (e.g., "RETIREMENT") |

---

### 2.3 Dark Theme

| Token | Hex | Usage |
|---|---|---|
| `--bg-page` | `#1A1A1A` | Overall page background |
| `--bg-card` | `#242424` | Card / panel surface |
| `--bg-card-secondary` | `#2E2E2E` | Secondary card areas |
| `--bg-input` | `#2E2E2E` | Input fields, textareas, dropdowns |
| `--border-default` | `#3A3A3A` | Card borders, input borders, dividers |
| `--border-subtle` | `#303030` | Very light separators |
| `--text-primary` | `#F0F0F0` | Headings, key numbers, main labels |
| `--text-secondary` | `#AAAAAA` | Subtitles, descriptions, helper text |
| `--text-muted` | `#666666` | Timestamps, tags, placeholder text |
| `--text-label-caps` | `#777777` | Uppercase category labels |

---

### 2.4 Semantic / Status Colors

| Token | Hex | Usage |
|---|---|---|
| `--status-pending` | `#F39C12` | "Pending" badge dot |
| `--status-success` | `#27AE60` | Confirmed / complete |
| `--status-error` | `#C0392B` | Errors, overdue, delete buttons |
| `--status-neutral` | `#9B9B9B` | Inactive / disabled |

---

## 3. Typography

### 3.1 Font Family

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
```

> **Intent:** System fonts only. Readability and rendering performance matter more than typographic personality. No Google Fonts, no decorative typefaces.

---

### 3.2 Type Scale

| Role | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| **Page Title** | `28px` | `700` | `1.2` | `-0.01em` |
| **Hero Number** | `40px` | `700` | `1.0` | `-0.02em` |
| **Large Number** | `32px` | `700` | `1.1` | `-0.01em` |
| **Card Title** | `18px` | `600` | `1.3` | `0` |
| **Section Label (Caps)** | `11px` | `600` | `1.4` | `0.08em` |
| **Body / Description** | `14px` | `400` | `1.5` | `0` |
| **Small / Meta** | `12px` | `400` | `1.5` | `0` |
| **Button Text** | `14px` | `600` | `1` | `0.01em` |

---

## 4. Layout & Grid

### 4.1 Admin Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│                     Sidebar (260px)                     │
│  ┌─────────┐                                           │
│  │  Logo   │   Dashboard                                │
│  └─────────┘   • Overview    ← active                  │
│                • Analytics                              │
│                Management                               │
│                • Users                                  │
│                • Content                                │
│                System                                   │
│                • Settings                               │
│                                                         │
│  ┌─────────┐                                           │
│  │  User   │                                           │
│  └─────────┘                                           │
└─────────────────────────────────────────────────────────┤
┌─────────────────────────────────────────────────────────┐
│                    Main Content                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Page Title              [Theme] [Actions]       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Stats Grid]                                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                  │
│  │  Stat   │ │  Stat   │ │  Stat   │                  │
│  └─────────┘ └─────────┘ └─────────┘                  │
│                                                         │
│  [Content Area]                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Table / Cards / Chart                          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Sidebar Specs

```css
.sidebar {
  width: 260px;
  background: var(--bg-card);
  border-right: 1px solid var(--border-default);
  padding: 24px;
  display: flex;
  flex-direction: column;
}
```

### 4.3 Main Content Specs

```css
.main-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}
```

### 4.4 Breakpoints

| Breakpoint | Layout |
|---|---|
| `< 768px` (Mobile) | Sidebar hidden, single column |
| `≥ 768px` (Desktop) | Full sidebar + content |

---

## 5. Logo

### 5.1 Panda Logo (Financial Red)

The logo uses the brand's panda mascot with accent colors:

```svg
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Ears with stroke -->
  <circle cx="24" cy="28" r="14" fill="#C0392B" stroke="#A93226" stroke-width="2"/>
  <circle cx="76" cy="28" r="14" fill="#C0392B" stroke="#A93226" stroke-width="2"/>
  <!-- Head with border -->
  <path d="M15 45 C15 15 85 15 85 45 C85 75 75 85 50 85 C25 85 15 75 15 45" 
        fill="#ffffff" stroke="#E0E0E0" stroke-width="3"/>
  <!-- Eye patches -->
  <path d="M22 45 C22 30 42 35 42 50 C42 65 22 65 22 45" fill="#C0392B"/>
  <path d="M78 45 C78 30 58 35 58 50 C58 65 78 65 78 45" fill="#C0392B"/>
  <!-- Eyes -->
  <circle cx="34" cy="45" r="6" fill="#ffffff"/>
  <circle cx="66" cy="45" r="6" fill="#ffffff"/>
  <circle cx="36" cy="45" r="3" fill="#1A1A1A"/>
  <circle cx="64" cy="45" r="3" fill="#1A1A1A"/>
  <!-- Nose -->
  <ellipse cx="50" cy="58" rx="6" ry="4" fill="#C0392B"/>
</svg>
```

**Logo sizes:**
- Sidebar: `40px × 40px`
- Mini (favicon): Use first letter "A" or abbreviated

---

## 6. Navigation

### 6.1 Nav Link

```css
.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.15s ease;
}

.nav-link:hover {
  background: var(--bg-card-secondary);
  color: var(--text-primary);
}

.nav-link.active {
  background: var(--accent-primary);
  color: white;
}
```

### 6.2 Section Labels

```css
.nav-section-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-label-caps);
  margin-top: 20px;
  margin-bottom: 8px;
  margin-left: 4px;
}
```

---

## 7. Card Component

Cards are the primary container unit. Every panel, modal, and data block uses this style.

### 7.1 Visual Specification

```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

[data-theme="dark"] .card {
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
```

---

## 8. Buttons

### 8.1 Primary Button

```css
.btn-primary {
  background: var(--accent-primary);
  color: white;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  height: 44px;
  cursor: pointer;
  transition: background 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover {
  background: var(--accent-primary-hover);
}
```

### 8.2 Secondary Button

```css
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: var(--bg-card-secondary);
}
```

### 8.3 Icon Button

```css
.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--border-default);
  background: var(--bg-card);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: var(--bg-card-secondary);
}

.btn-icon svg {
  width: 20px;
  height: 20px;
}
```

### 8.4 Small Button

```css
.btn-small {
  padding: 6px 12px;
  font-size: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 6px;
  color: var(--text-muted);
  cursor: pointer;
}

.btn-small:hover {
  background: var(--bg-card-secondary);
  color: var(--text-primary);
}
```

### 8.5 Danger Button

```css
.btn-danger {
  background: var(--status-error);
  border: 1px solid var(--status-error);
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  cursor: pointer;
}

.btn-danger:hover {
  background: #A93226;
  border-color: #A93226;
}
```

---

## 9. Form Elements

### 9.1 Input Field

```css
.input-field {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
}

.input-field:focus {
  border-color: var(--accent-primary);
}

.input-field::placeholder {
  color: var(--text-muted);
}
```

### 9.2 Select Field

```css
.select-field {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  appearance: none;
  background-image: url("chevron-down-icon");
  background-repeat: no-repeat;
  background-position: right 14px center;
  cursor: pointer;
}

.select-field:focus {
  border-color: var(--accent-primary);
}
```

### 9.3 Textarea

```css
.textarea-field {
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  line-height: 1.5;
  outline: none;
}

.textarea-field:focus {
  border-color: var(--accent-primary);
}
```

---

## 10. Tables

### 10.1 Table Card

```css
.table-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 24px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
}

tbody tr {
  border-bottom: 1px solid var(--border-subtle);
  transition: background 0.15s ease;
}

tbody tr:hover {
  background: var(--bg-card-secondary);
}

tbody td {
  padding: 16px;
  vertical-align: middle;
}
```

---

## 11. Stat Cards

### 11.1 Stats Grid

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}
```

### 11.2 Stat Card

```css
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-label-caps);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.orange {
  background: rgba(192, 57, 43, 0.1);
  color: var(--accent-primary);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
}
```

---

## 12. Charts

### 12.1 Bar Chart

```css
.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 192px;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--border-default);
}

.bar {
  flex: 1;
  border-radius: 4px 4px 0 0;
  transition: background 0.15s ease;
  cursor: pointer;
  min-height: 20px;
}

.bar:hover {
  background: var(--accent-warm-dark) !important;
}
```

---

## 13. Progress Bars

```css
.progress-track {
  width: 100%;
  height: 4px;
  background: var(--border-default);
  border-radius: 2px;
  margin: 8px 0;
}

.progress-fill {
  height: 100%;
  background: var(--accent-primary);
  border-radius: 2px;
  transition: width 0.4s ease;
}
```

---

## 14. Badges & Status

### 14.1 Badge

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: var(--bg-card-secondary);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}
```

### 14.2 Status Badges

```css
.status-badge.active {
  background: rgba(39, 174, 96, 0.1);
  color: var(--status-success);
}

.status-badge.pending {
  background: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
}

.status-badge.canceled {
  background: rgba(192, 57, 43, 0.1);
  color: var(--status-error);
}
```

### 14.3 Stat Badge

```css
.stat-badge {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
  background: var(--bg-card-secondary);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}
```

---

## 15. User Cells

```css
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border-default);
  background: var(--bg-card-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
}

.user-name-cell {
  font-weight: 500;
  font-size: 14px;
  color: var(--text-primary);
}

.user-email-cell {
  font-size: 12px;
  color: var(--text-muted);
}
```

---

## 16. Icons

- Style: **Line / outline** icons (stroke-based, not filled)
- Stroke width: `1.5px`
- Size: `16px` in lists, `18px–20px` in cards, `24px` in empty states
- Color: `var(--text-secondary)` default; `var(--text-muted)` for decorative
- Corner style: rounded stroke caps and joins (`stroke-linecap: round; stroke-linejoin: round`)
- Recommended library: Lucide Icons, Feather Icons, or Heroicons (outline variant)

---

## 17. Shadows & Elevation

| Level | Usage | Light | Dark |
|---|---|---|---|
| **Level 0** | Flat (no shadow) | none | none |
| **Level 1** | Default cards | `0 1px 4px rgba(0,0,0,0.06)` | `0 1px 6px rgba(0,0,0,0.3)` |
| **Level 2** | Hover / focus | `0 4px 16px rgba(0,0,0,0.1)` | `0 4px 20px rgba(0,0,0,0.4)` |

---

## 18. Border Radius Reference

| Element | Border Radius |
|---|---|
| Cards / Panels | `12px` |
| Buttons | `8px` |
| Input fields | `8px` |
| Small buttons | `6px` |
| Icons in sidebar | `8px` |
| User avatars | `8px` |
| Stat icons | `8px` |
| Pill badges | `20px` |
| Chart bars (top only) | `4px 4px 0 0` |
| Progress bars | `2px` |

---

## 19. Animation & Transitions

| Element | Property | Duration | Easing |
|---|---|---|---|
| Button hover | `background` | `150ms` | `ease` |
| Nav link hover | `all` | `150ms` | `ease` |
| Card hover | `box-shadow` | `200ms` | `ease` |
| Input focus | `border-color` | `150ms` | `ease` |
| Progress bar fill | `width` | `400ms` | `ease` |
| Theme switch | `background, color, border` | `200ms` | `ease` |

---

## 20. Dark / Light Theme Implementation

### CSS Variables Pattern

```css
:root {
  /* Light theme (default) */
  --bg-page: #F2F2F2;
  --bg-card: #FFFFFF;
  --bg-card-secondary: #F7F7F7;
  --bg-input: #FFFFFF;
  --border-default: #E0E0E0;
  --border-subtle: #EBEBEB;
  --text-primary: #1A1A1A;
  --text-secondary: #5A5A5A;
  --text-muted: #9B9B9B;
  --text-label-caps: #888888;
  --accent-primary: #C0392B;
  --accent-primary-hover: #A93226;
  --accent-warm: #E67E22;
}

[data-theme="dark"] {
  --bg-page: #1A1A1A;
  --bg-card: #242424;
  --bg-card-secondary: #2E2E2E;
  --bg-input: #2E2E2E;
  --border-default: #3A3A3A;
  --border-subtle: #303030;
  --text-primary: #F0F0F0;
  --text-secondary: #AAAAAA;
  --text-muted: #666666;
  --text-label-caps: #777777;
}
```

### Theme Toggle Rules

- Toggle applies `data-theme="dark"` on `<html>` element
- All components use CSS variables exclusively — **no hardcoded hex values** in component styles
- Store preference in `localStorage.getItem('theme')`

---

## 21. Accessibility Checklist

- [ ] All text meets **WCAG AA contrast** minimum (4.5:1 for body, 3:1 for large text)
- [ ] Focus states visible on all interactive elements (buttons, inputs, links)
- [ ] `aria-label` on icon-only buttons (e.g., close buttons, theme toggle)
- [ ] All form fields have associated `<label>` elements
- [ ] Color is never the **only** way to convey information
- [ ] Minimum tap target size: `44×44px` on mobile
- [ ] Keyboard navigation works for all interactive elements

---

## 22. Do's and Don'ts

### ✅ Do
- Use the accent red (`#C0392B`) for **primary actions only**
- Keep card padding consistent at `24px`
- Use `text-transform: uppercase` + wide letter-spacing for category labels
- Separate unrelated content into clearly bordered cards
- Use warm orange only for **chart data and data highlights**

### ❌ Don't
- Use red for decorative backgrounds or non-interactive elements
- Mix border-radius values randomly — follow the reference table
- Add more than 2 font sizes within a single card
- Use shadows heavier than Level 2 — it breaks the flat/minimal feel
- Add animations longer than `400ms` anywhere in the dashboard
- Use blue as an accent — it's not part of this palette
- Create gradient backgrounds — everything is solid color

---

*End of Style Guide v2.0*
