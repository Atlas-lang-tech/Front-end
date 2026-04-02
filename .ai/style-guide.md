# AI Style Guide: Minimal Duolingo

This document is intended for AI agents (and developers) to ensure perfect design consistency when creating or styling new components in the project. If you are generating or modifying UI code, you **MUST** follow these rules.

## 1. Introduction & Design Philosophy
- **Style**: Minimal Duolingo (playful, minimalistic, gamified, yet clean).
- **Vibe**: Friendly design that invites user interaction. No strict "corporate" or realistic look.
- **Key Feature (3D Effect)**: Completely abandon soft blurred shadows (`box-shadow` with blur). Instead, use hard, solid downward offsets (hard shadows / solid borders) to create the feeling of physical buttons and cards.

## 2. Color Palette (Tailwind & Variables)
The project uses custom CSS variables integrated with Tailwind. You must use them **exclusively**. Do not hardcode colors in HEX (like `#f97316`); always use Tailwind utility classes mapping to our CSS variables.

### Backgrounds
- `bg-background` (or `var(--bg)`): Main page background. Light gray in light mode, deep dark in dark mode.
- `bg-card` (or `var(--surface-color)`): Background for cards, panels, and modals. Stands out against the page background.
- `bg-muted`: Subdued background for secondary cards or container blocks.

### Typography Colors
- `text-foreground` (or `var(--text)`): Base text color (for paragraphs).
- `text-h` (use for H1-H6): High contrast color for headings (almost black in light mode, white in dark mode).
- `text-muted-foreground`: Secondary text (hints, descriptions, dates).

### Accents
- `Primary` (`bg-primary`, `text-primary`): Main accent color — **Orange**. Use for main CTAs.
- `Secondary` (`bg-secondary`, `text-secondary`): Secondary accent color — **Blue**.
- `Destructive`: For errors and destructive actions (Red).

## 3. Shapes, Radiuses, and Shadows (CRITICAL)

### Border Radius
A playful style requires larger border radiuses than usual.
- **Buttons, Inputs, Small Badges**: `--radius` (typically 12px) `rounded-xl`.
- **Cards, Modals, Large Panels**: `rounded-2xl` or `rounded-3xl` (approx 20px).
- **NO sharp corners** (`rounded-none` is strictly forbidden for interactive elements).

### 3D Shadows (Hard Shadows)
This is the core of the "Duolingo" style.
- **Forbidden**: `shadow-md`, `shadow-lg` (anything with blur).
- **How to style buttons**: A button must have a thick bottom border or a hard bottom shadow.
  - Example with custom shadow: `shadow-[0_4px_0_var(--border)]` (or specific variable colors).
  - Or using the pre-defined variable: `box-shadow: var(--shadow)`.

### Interactive States (Hover / Active)
To make a button feel gamified, it must physically "press down":
- **Default state**: `translate-y-0 shadow-[0_4px_0_var(--primary-border)]` (custom hard shadow underneath).
- **Hover state**: Slightly lighten or change the background color.
- **Active state (Clicked)**: The button must move down, and the shadow must compress or disappear completely. Example: `active:translate-y-1 active:shadow-none` (or `shadow-[0_0px_0...]`). This creates the physical button press illusion.

## 4. Typography
- **Text and Headings (`font-sans`)**: Nunito. Headings (h1, h2) should be bold (`font-bold` or `font-semibold`) with slightly tighter kerning (`tracking-tight`).
- **Code and Data (`font-mono`)**: JetBrains Mono. Use for counters, badges, and statistics. Code tags should be wrapped in a styling block: `bg-code-bg rounded-md px-2 py-1`.

## 5. Components (AI Reference)

Here are code snippets and instructions on how to build specific components:

### Card
```html
<!-- Card container: uses border-border, bg-card, hard shadow, and large border-radius. -->
<div class="bg-card text-card-foreground border-2 border-border/20 shadow-[0_4px_0_var(--border)] rounded-2xl p-6">
  <h3 class="text-h font-bold text-xl mb-2">Card Title</h3>
  <p class="text-muted-foreground">Card content goes here.</p>
</div>
```

### Primary Button
```html
<!-- Hard orange shadow at the bottom. On click (active), the shadow disappears and the button moves down. -->
<button class="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl transition-all duration-150 ease-in-out shadow-[0_4px_0_var(--primary-border)] active:translate-y-1 active:shadow-none hover:opacity-90">
  Continue
</button>
```

### Input Field
```html
<!-- Thick border, focus highlights the field with the accent ring color -->
<input class="w-full bg-input text-foreground border-2 border-border/30 rounded-xl px-4 py-3 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all font-sans" placeholder="Type here..." />
```

## 6. AI Checklist (Self-Validation Rules)
1. **No Gradients**: Components must look "flat". Apply solid `bg-{color}` only.
2. **No Soft Blur**: If you generated a generic `shadow-lg`, replace it with a hard shadow (e.g., `shadow-[0_4px_0_var(--border)]`).
3. **Is Dark Mode working?**: Make sure you never hardcode `text-black` or `bg-white`. Always use `--foreground`, `--card`, `--background` so that the style automatically responds to `.dark` class or queries.
4. **Typography**: Ensure H1s are genuinely large and distinct. The text should not blend in.
5. **Border-Radius**: Ensure there are absolutely no sharp corners in the UI. Buttons = `rounded-xl`, Cards = `rounded-2xl` or `rounded-3xl`.
