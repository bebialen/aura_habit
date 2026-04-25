# Component Library

This document catalogs the reusable components used in the Aura Tracker application, following an Atomic Design approach.

## Atoms
Basic building blocks of the UI.

### RadialProgress
A circular progress indicator used to visualize goal completion.
- **Props**:
  - `progress` (number): Percentage of completion (0-100).
  - `size` (number, optional): Diameter in pixels. Default: `120`.
  - `strokeWidth` (number, optional): Thickness of the progress ring. Default: `8`.
  - `label` (string, optional): Text displayed below the percentage. Default: `"kcal"`.
  - `color` (string, optional): CSS color for the progress bar. Default: `var(--color-cobalt)`.
- **Structure**: SVG-based circle with `motion.circle` for animation.
- **Usage**: Dashboard calorie tracking, Nutrition view macro tracking.
- **Example**:
  ```tsx
  <RadialProgress progress={75} size={80} label="protein" color="#ff0000" />
  ```

### Icons (Lucide-React)
The app uses `lucide-react` for its iconography.
- **Commonly Used**: `LayoutDashboard`, `Dumbbell`, `Apple`, `CheckCircle2`, `Plus`, `Search`, `Flame`, `Clock`, `ChevronRight`, `LogOut`, `LogIn`, `GripVertical`, `Edit2`, `Save`, `X`.

---

## Molecules
Simple composites of atoms.

### BentoCard
A container component for the "Bento Grid" layout style.
- **Props**:
  - `children` (ReactNode): Content to be displayed inside the card.
  - `className` (string, optional): Additional CSS classes.
  - `delay` (number, optional): Animation delay for entry. Default: `0`.
  - `onClick` (function, optional): Click handler for interactive cards.
- **Structure**: `motion.div` with a glassmorphism effect (blur + semi-transparent background).
- **Usage**: Everywhere in the app to wrap content.
- **Example**:
  ```tsx
  <BentoCard delay={0.1}>
    <h3 className="text-xl">Title</h3>
    <p>Content goes here...</p>
  </BentoCard>
  ```

### Modal
A full-screen overlay for forms and details.
- **Props**:
  - `isOpen` (boolean): Controls visibility.
  - `onClose` (function): Triggered when clicking the backdrop or close button.
  - `title` (string): Header text.
  - `children` (ReactNode): Modal body content.
- **Structure**: `AnimatePresence` with `motion.div` for backdrop and slide-up panel.
- **Usage**: Quick log, Food logging, Workout logging, Workout plan creation.
- **Example**:
  ```tsx
  <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Item">
    <MyForm />
  </Modal>
  ```

### HabitHeatmap
Visual representation of habit consistency over the last 4 weeks.
- **Props**:
  - `habitLogs` (HabitLog[]): Array of completion history.
  - `habits` (Habit[]): Array of tracked habits.
- **Structure**: 7x4 grid of color-coded squares representing completion rate.
- **Usage**: Dashboard view.

---

## Organisms
Complex sections and views.

### DashboardView
The primary landing screen showing a summary of daily performance.
- **Usage**: Main entry point for the user.
- **Sub-components**: `BentoCard`, `RadialProgress`, `HabitHeatmap`.

### WorkoutsView
Interface for tracking workout sessions and managing plans.
- **Usage**: "Train" tab.
- **Sub-components**: `BentoCard`, `Plus` button, Recent session list.

### NutritionView
Calorie and macro tracking interface.
- **Usage**: "Eat" tab.
- **Sub-components**: `BentoCard`, `RadialProgress`, Macro bars.

### HabitsView
Dedicated management screen for habits.
- **Usage**: "Habits" tab.
- **Sub-components**: `BentoCard`, Habit toggle buttons, Delete buttons.

### Navigation Bar
The sticky bottom navigation component.
- **Usage**: Fixed at the bottom of `App.tsx`.
- **Features**: Framer Motion layout animations for the active tab pill.
