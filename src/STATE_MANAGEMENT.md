# State Management Documentation

This document outlines how state is managed in the Aura Tracker application.

## State Management Approach
The application uses **React's built-in State Hook (`useState`)** and **Effect Hook (`useEffect`)** for state management, combined with **Firebase Firestore's real-time listeners (`onSnapshot`)**. 

- **Local State**: Component-specific state (e.g., form inputs) is managed with `useState`.
- **Global/Shared State**: Data fetched from Firestore (habits, workouts, nutrition) is managed at the `App.tsx` level and passed down to views via props.
- **Real-time Updates**: Changes in Firestore are automatically reflected in the UI through `onSnapshot` subscriptions.

## Global State (App.tsx)
The following state is managed at the root level:

| State Variable | Type | Description |
|---|---|---|
| `user` | `User | null` | Currently authenticated Firebase user. |
| `activeTab` | `ViewType` | Controls navigation between Dashboard, Workouts, Nutrition, and Habits. |
| `habits` | `Habit[]` | List of all habits defined by the user. |
| `habitLogs` | `HabitLog[]` | Historical record of habit completions. |
| `workouts` | `Workout[]` | List of completed workout sessions. |
| `workoutPlans` | `WorkoutPlan[]` | Saved workout templates/routines. |
| `foodLogs` | `FoodLog[]` | Daily entries for nutrition tracking. |
| `calorieGoal` | `number` | Daily calorie intake target. |
| `isAuthReady` | `boolean` | Tracks if the Firebase Auth listener has initialized. |

## Screen-Level State
- **DashboardView**: Derives daily habit completion and calorie progress from global state props.
- **WorkoutsView**: Filters and displays workout history and plans.
- **NutritionView**: Manages local sorting or filtering of food logs (if applicable).
- **Forms (Modals)**: `FoodLoggingForm`, `WorkoutLoggingForm`, and `WorkoutPlanForm` maintain local `useState` for draft entries before committing to Firestore.

## State Update Patterns
State updates follow a **Command-Query Responsibility Segregation (CQRS)** pattern via Firestore:
1. **Command**: A user action triggers an asynchronous call to Firestore (`setDoc`, `updateDoc`, `deleteDoc`).
2. **Update**: The Firestore SDK updates the remote database.
3. **Sync**: The `onSnapshot` listener in `App.tsx` detects the change and updates the local React state.
4. **Render**: React re-renders components with the fresh data.

## Side Effects
- **Authentication**: `onAuthStateChanged` listens for login/logout events.
- **Real-time Sync**: Multiple `useEffect` hooks in `App.tsx` establish listeners for Firestore collections.
- **Local Storage**: Currently, the app relies primarily on Firestore, but connection testing and initial auth state are handled as side effects.
- **API Calls**: All interactions with Firebase (Auth/Firestore) are treated as asynchronous side effects.
