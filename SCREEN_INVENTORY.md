# Screen Inventory: Aura Tracker

## 1. Auth Screen
- **Path**: Root (Condition: `!user`)
- **Purpose**: Initial landing and Google login.
- **Layout**: Center-aligned vertical stack.
- **Components**: Logo, Subtitle, Google Login Button.
- **User Interactions**: "Sign in with Google" button click.

## 2. Dashboard View
- **Path**: `activeTab === 'dashboard'`
- **Purpose**: High-level daily performance overview.
- **Layout**: 2-column Bento grid.
- **Components**:
  - Calorie Progress Card (Radial).
  - Consistency Heatmap Card.
  - Streak Counter Card.
  - Strength Trend Bar Chart Card.
  - Daily Habits List (with inline toggles).
  - Quick Log FAB/Button.
- **Data**: Daily calorie delta, 28-day habit logs, active habits.
- **Navigation**: Quick Log modal, Navigation tabs.

## 3. Workouts View (Train)
- **Path**: `activeTab === 'workouts'`
- **Purpose**: Manage plans and log lifting sessions.
- **Layout**: Single column scrollable list.
- **Components**:
  - Total Volume Summary Card.
  - Workout Plans Section (List of plans with "Start" and "Delete").
  - Quick Start Section ("Empty Session" button).
  - Recent Sessions Section (History cards).
- **Data**: Total cumulative volume, workout plans, historical workout logs.
- **Navigation**: Create Plan Modal, Workout Logger Modal.

## 4. Nutrition View (Eat)
- **Path**: `activeTab === 'nutrition'`
- **Purpose**: Calorie and macro tracking.
- **Layout**: Vertical stack with grid sections.
- **Components**:
  - Daily Goal Card (Radial + Text).
  - Macro Grid (3 cards: Protein, Carbs, Fats with progress bars).
  - "Log Meal" Button.
  - "Today's Log" Section (Chronological list of food cards).
- **Data**: Daily macro targets (fixed), food logs for current date.
- **Navigation**: Food Logger Modal.

## 5. Habits View (Habits)
- **Path**: `activeTab === 'habits'`
- **Purpose**: Configuration of recurring habits.
- **Layout**: Header -> Input Form -> List.
- **Components**:
  - New Habit Input + Add Button.
  - Habit List (Cards with name, toggle status, edit, and delete).
  - Empty State illustration.
- **Data**: Master list of user habits.
- **Navigation**: Tab bar.

---

## Modals & Overlays
- **Quick Log Modal**: Simple grid to choose between "Log Food" and "Log Workout".
- **Food Logger Modal**: Search bar, quick-add list, and custom entry form.
- **Workout Logger Modal**: Form for name, duration, and dynamic list of exercises (sets/reps/weight).
- **Plan Creator Modal**: Template builder with reorderable exercise list.

---

## Navigation Tree
```text
[ Auth Screen ]
       |
       v
[ Main Layout ]
       |
       +--- [ Dashboard (Home) ] <---> [ Quick Log Modal ]
       |                                    |--- [ Food Logger Modal ]
       |                                    |--- [ Workout Logger Modal ]
       |
       +--- [ Workouts (Train) ] <---> [ Plan Creator Modal ]
       |                               <---> [ Workout Logger Modal (Plan-based) ]
       |
       +--- [ Nutrition (Eat) ]  <---> [ Food Logger Modal ]
       |
       +--- [ Habits (Habits) ]
```
