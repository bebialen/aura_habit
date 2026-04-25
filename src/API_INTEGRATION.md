# API Integration Documentation

Aura Tracker integrates with **Firebase** for authentication and data persistence.

## Infrastructure
- **Backend-as-a-Service**: Firebase
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore (NoSQL)
- **SDK**: Firebase Web SDK v10+

## Authentication Approach
The application uses **Google OAuth** for user authentication.
- **Method**: `signInWithPopup` with `GoogleAuthProvider`.
- **Persistence**: Managed automatically by the Firebase SDK.
- **User Initialization**: Upon first login, a user document is created in the `users` collection with default settings (e.g., `calorieGoal: 2500`).

## Firestore Schema & Endpoints
Data is organized in a user-centric sub-collection structure:

| Collection Path | Description |
|---|---|
| `/users/{uid}` | User profile and global settings. |
| `/users/{uid}/habits` | Definitions for daily habits. |
| `/users/{uid}/habitLogs` | Daily completion records (keyed by date string `YYYY-MM-DD`). |
| `/users/{uid}/workouts` | Logged workout sessions with exercise details. |
| `/users/{uid}/workoutPlans` | Reusable workout templates. |
| `/users/{uid}/foodLogs` | Entries for meals and snacks. |

## Request/Response Formats
Data is exchanged as JSON objects mapping to the interfaces defined in `types.ts`.
- **Dates**: Stored as `ISO 8601` strings or simple date strings (e.g., `Nov 15`).
- **IDs**: Client-generated using `Date.now().toString()` or Firestore auto-generated IDs.

## Error Handling Patterns
A centralized error service (`services/firestoreErrorHandler.ts`) manages API errors:
- **Serialization**: Errors are wrapped with `OperationType` (CREATE, LIST, DELETE, etc.) and the target document `path`.
- **Auth Context**: Error logs include the current user's UID and provider info to assist in debugging permission issues.
- **Feedback**: Errors are logged to the console and can be caught by the root `ErrorBoundary` component.
