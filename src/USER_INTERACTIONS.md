# User Interactions Documentation

This document describes the interactive elements, gestures, and feedback mechanisms in Aura Tracker.

## 1. Authentication & Navigation
- **Login**: A full-screen "Sign in with Google" button. Uses Google OAuth popup.
- **Logout**: An icon button in the header that signs the user out.
- **Navigation Bar**: A bottom fixed navigation bar with four tabs (Home, Train, Eat, Habits). 
  - **Interaction**: Clicking a tab switches the view with a horizontal sliding animation.
  - **Feedback**: A background pill highlights the active tab using a spring animation.

## 2. Forms & Validation
| Form | Elements | Validation Rules |
|---|---|---|
| **Quick Log** | Two large cards: "Log Food" and "Log Workout". | None (Navigation only). |
| **Log Food** | Search input, Quick Add buttons, Custom Entry (Name, Calories, Macros). | "Add Custom Food" button is disabled unless Name and Calories are provided. |
| **Log Workout** | Workout Name, Duration, Exercise Name, Sets, Reps, Weight. | "Finish Workout" is disabled if Name is missing or 0 exercises are added. |
| **Create Workout Plan** | Plan Name, Exercise Template inputs. | "Save Workout Plan" is disabled if Name is missing or 0 exercises are added. |

## 3. Gestures & Specialized Interactions
- **Habit Toggling**: Clicking a habit row in the Dashboard or Habits view toggles its completion status.
- **Drag & Drop**: In the **Workout Plan Form**, users can reorder exercises using a vertical drag gesture (powered by `framer-motion`'s `Reorder` component).
- **Modal Closure**: Modals can be closed by:
  - Clicking the "X" button.
  - Clicking the darkened backdrop.
- **Heatmap Hover**: Hovering over a cell in the Consistency Heatmap displays a tooltip with the date and completion percentage.

## 4. Feedback Mechanisms
- **Loading States**: A custom CSS spinner (`animate-spin`) is shown during initial authentication and data fetching.
- **Haptic-like Visuals**: 
  - **Bento Cards**: Clickable cards scale down slightly (`active:scale-[0.98]`) when pressed.
  - **Buttons**: Primary buttons feature a `cobalt-glow` and scale down (`active:scale-95`).
- **Animations**:
  - **View Transitions**: Views fade and slide horizontally using `AnimatePresence`.
  - **Progress Bars**: Radial and linear progress bars animate from 0% to the target value on mount.
  - **List Items**: Adding/removing items (like exercises) uses layout animations for smooth transitions.

## 5. Error States & Handling
- **Firestore Errors**: Centralized handling via `handleFirestoreError`. If a write/read fails, an error is thrown and caught by the `ErrorBoundary`.
- **Error Boundary**: A fallback UI that prevents the entire app from crashing, providing a consistent error message and logging details for debugging.
- **Connection Test**: On mount, the app tests the Firebase connection and logs a console error if the client is offline.
