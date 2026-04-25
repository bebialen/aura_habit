# Project Specification: Aura Tracker

## App Name & Purpose
**Aura** is a high-performance personal tracking application designed to help users monitor their physical activity, nutritional intake, and daily habits. It follows a "Bento-style" glassmorphic aesthetic to provide a premium, data-dense, yet clean user experience.

## Features
### 1. Authentication
- **Google Sign-In**: Secure authentication via Firebase Auth and Google Provider.
- **User Profiles**: Automatic creation of user documents in Firestore upon first login.

### 2. Dashboard (Home)
- **Calorie Overview**: Real-time tracking of calories remaining vs. daily goal.
- **Consistency Heatmap**: A 28-day visual grid showing habit completion frequency.
- **Performance Streaks**: Tracks consecutive days of activity.
- **Strength Trend**: Visual bar chart showing weekly progress (mocked with motion-based bars).
- **Daily Habit Quick-View**: Interactive list of today's habits with toggle capability.

### 3. Workout Tracking (Train)
- **Total Volume Tracker**: Cumulative weight moved across all sessions.
- **Workout Plans**: Create reusable templates with specific exercises, sets, reps, and weights.
- **Session Logging**: 
  - Log empty sessions (ad-hoc).
  - Log workouts from pre-defined plans.
  - Real-time volume calculation (`sets * reps * weight`).
- **History**: List of recent sessions with duration and volume summaries.

### 4. Nutrition Tracking (Eat)
- **Calorie Budget**: Dynamic radial progress chart.
- **Macro Breakdown**: Tracking of Protein, Carbs, and Fats against fixed targets.
- **Food Logging**:
  - **Quick Add**: Common items (Protein Shake, Banana, Chicken Breast).
  - **Search**: UI for searching food (database implementation pending).
  - **Custom Entry**: Manual input for name, calories, and macros.
- **Daily Log**: Chronological list of food items consumed.

### 5. Habit Management (Habits)
- **Habit List**: Create and delete daily recurring habits.
- **Interactive Toggling**: Mark habits as done/undone for the current day.
- **Persistence**: Habit logs are stored by date to maintain historical data.

## User Flows
1. **Onboarding**: User lands on the auth screen -> Clicks "Sign in with Google" -> Redirected to Dashboard.
2. **Daily Logging**: User opens app -> Toggles habits on Dashboard -> Clicks "Quick Log" -> Adds a meal or workout session.
3. **Workout Planning**: User goes to "Train" tab -> "Create Plan" -> Adds exercises -> Saves plan -> Starts session using the new plan.
4. **Nutrition Analysis**: User goes to "Eat" tab -> Reviews macro balance -> Logs custom lunch entry.

## Business Logic & Rules
- **Calorie Calculation**: `Calories Left = Goal - Sum(Consumed Calories Today)`.
- **Workout Volume**: Calculated per exercise as `sets * reps * weight`. Total session volume is the sum of all exercise volumes.
- **Habit Completion Rate**: Calculated as `(Completed Habits / Total Habits)`. Used to determine the opacity/intensity of the heatmap cells.
- **Heatmap Logic**: Displays a 28-day window relative to the current date.
- **Data Persistence**: Uses Firebase Firestore with a hierarchical structure: `users/{uid}/{collection}/{docId}`.

## Third-Party Integrations
- **Firebase**: Auth, Firestore database.
- **Lucide React**: Iconography.
- **Framer Motion**: Animations and gestures (Reorder API for workout plans).
- **Tailwind CSS**: Styling and theming.

## Data Flow Architecture
- **State Management**: React `useState` and `useMemo` hooks in the root `App.tsx` component.
- **Real-time Sync**: `onSnapshot` listeners for Firestore collections ensure UI updates instantly when data changes on the server or across devices.
- **Prop Drilling**: Data is passed from `App.tsx` down to specialized view components (`DashboardView`, etc.).
