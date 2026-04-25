# Asset Inventory

This document lists all visual, auditory, and media assets used in the Aura Tracker project.

## 1. Icons
The application uses the **Lucide React** icon library.

| Icon Name | Usage |
|---|---|
| `LayoutDashboard` | Home/Dashboard Navigation |
| `Dumbbell` | Workout View & Quick Log |
| `Apple` | Nutrition View & Quick Log |
| `CheckCircle2` | Habits View & Checkboxes |
| `Plus` | Add/Create Actions |
| `Search` | Food Database Search |
| `Flame` | Calorie/Food Indicators |
| `Clock` | Duration Indicators |
| `ChevronRight` | List Item Navigation |
| `LogOut` / `LogIn` | Authentication Actions |
| `GripVertical` | Reordering Exercises |
| `Edit2` / `Save` / `X` | Form Editing Actions |
| `Trash2` | Delete Actions |
| `Play` | Starting a Workout Plan |
| `ArrowUpRight` | External/Quick Action Indicators |
| `Calendar` | Streak/Heatmap Section |
| `TrendingUp` | Progress/Strength Section |

## 2. Fonts
- **Primary Font**: **Inter** (Weights: 100, 200, 300, 400, 500, 600, 700).
- **Source**: Loaded via Google Fonts in `index.css`.
- **Fallback**: `ui-sans-serif`, `system-ui`, `sans-serif`.

## 3. Colors (Design Tokens)
Defined in `index.css` under the Tailwind `@theme`:
- **Obsidian**: `#050505` (Background)
- **Cobalt**: `#2E5BFF` (Primary Accent)
- **Slate Border**: `#1A1A1A` (Component Borders)

## 4. Animations
Animations are handled via **Framer Motion** (`motion/react`).
- **Transitions**: Spring-based transitions for modals and navigation.
- **Keyframes**: `pulse-glow` custom CSS animation used for accent highlights.
- **Layout**: `layoutId` used for smooth navigation pill transitions.

## 5. Media & Images
- **Local Images**: None. The app follows a minimalist, code-driven aesthetic.
- **User Avatars**: Fetched dynamically from Google Auth (though currently represented by icons in the header).
- **Placeholders**: SVG shapes and CSS gradients are used for all visual decorations (e.g., `RadialProgress` SVGs).
