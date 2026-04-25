# Design System: Aura (Obsidian Theme)

## Colors
### Base Palette
| Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Obsidian** | `#050505` | Main background color |
| **Cobalt** | `#2E5BFF` | Primary action color, accents, progress bars, highlights |
| **White** | `#FFFFFF` | Primary text, high-emphasis icons |
| **Slate Border** | `#1A1A1A` | Card borders, dividers |

### Semantic Colors
| Usage | Color/Value |
| :--- | :--- |
| **Success** | Cobalt (`#2E5BFF`) |
| **Error/Danger** | `red-500` (`#ef4444`) |
| **Warning/Food** | `orange-500` (`#f97316`) |
| **Muted Text** | `white/30`, `white/20` |
| **Glass Background**| `white/5` with `backdrop-blur-md` |

## Typography
- **Primary Font**: `Inter`, sans-serif.
- **Headings**:
  - `Display (Auth)`: `text-6xl`, light weight, tracking-tight.
  - `Screen Title`: `text-4xl`, light weight.
  - `Section Header`: `text-2xl`, light weight.
  - `Card Title`: `text-sm`, bold/medium.
- **Body & Labels**:
  - `Body`: `text-sm`, medium weight.
  - `Micro Label`: `text-[8px]`, bold, uppercase, tracking-[0.3em] to tracking-[0.5em].
  - `Macro Value`: `text-xl` to `text-4xl`, light/tracking-tight.

## Spacing
- **Container Padding**: `p-6` (24px).
- **Card Padding**: `p-5` (20px).
- **Gaps**:
  - `Grid Gap`: `gap-4` (16px).
  - `Small Stack`: `gap-2` (8px).
- **Navigation Height**: Bottom nav container `p-6`, inner pill `p-2`.

## Shadows & Effects
- **Cobalt Glow**: `0 0 20px rgba(46, 91, 255, 0.2)`
- **Cobalt Glow Strong**: `0 0 30px rgba(46, 91, 255, 0.4)`
- **Glassmorphism**: 
  - Background: `rgba(255, 255, 255, 0.05)`
  - Blur: `12px` to `20px` (backdrop-blur-md/xl).
  - Border: `1px solid rgba(255, 255, 255, 0.1)`

## Border Radius
- **Standard Card**: `rounded-2xl` (1rem / 16px).
- **Bento Large**: `rounded-[32px]` (2rem / 32px).
- **Buttons/Inputs**: `rounded-xl` (12px) or `rounded-2xl` (16px).
- **Small Icons**: `rounded-lg` (8px).

## Transitions & Animations
- **Durations**: `300ms` (standard), `500ms` (layout entry).
- **Easings**: `ease-in-out`, `spring` (for navigation pill).
- **Keyframes**: `pulse-glow` (2s infinite) for interactive elements.

## Breakpoints
- **Mobile First**: Optimized for small screens (`max-w-lg` / `max-w-md` constraints on main containers).

## Icons
- **Library**: `lucide-react`.
- **Primary Icons**: `LayoutDashboard`, `Dumbbell`, `Apple`, `CheckCircle2`, `Plus`, `Search`, `Flame`, `Clock`, `LogOut`, `Trash2`, `Play`.
