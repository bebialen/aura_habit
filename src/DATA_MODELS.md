# Data Models

This document outlines the data structures used in the Aura Tracker application.

## Core Models

### Habit
Represents a daily habit to be tracked.
- **`id`** (string): Unique identifier.
- **`name`** (string): Display name of the habit.
- **`done`** (boolean): Current status for the today's log (dynamically computed in the UI).
- **`userId`** (string): ID of the user who owns this habit.
- **`order`** (number): Display order in the list.

**Sample JSON**:
```json
{
  "id": "1712760000000",
  "name": "Meditation",
  "done": false,
  "userId": "user_123",
  "order": 0
}
```

### HabitLog
Records the completion of habits for a specific date.
- **`date`** (string): ISO format date (YYYY-MM-DD).
- **`completedIds`** (string[]): Array of habit IDs completed on this date.
- **`userId`** (string): ID of the user who owns this log.

**Sample JSON**:
```json
{
  "date": "2024-04-10",
  "completedIds": ["1712760000000", "1712760000001"],
  "userId": "user_123"
}
```

### Workout
Represents a completed workout session.
- **`id`** (string): Unique identifier.
- **`name`** (string): Name of the session.
- **`date`** (string): Human-readable date (e.g., "Apr 10").
- **`volume`** (number): Total weight lifted (kg).
- **`duration`** (number): Duration of the session in minutes.
- **`exercises`** (Exercise[]): List of exercises performed.
- **`userId`** (string): ID of the user.

**Sample JSON**:
```json
{
  "id": "1712760000000",
  "name": "Push Day",
  "date": "Apr 10",
  "volume": 2500,
  "duration": 45,
  "userId": "user_123",
  "exercises": [
    { "id": "ex1", "name": "Bench Press", "sets": 3, "reps": 10, "weight": 60 }
  ]
}
```

### WorkoutPlan
A template for a workout session.
- **`id`** (string): Unique identifier.
- **`name`** (string): Name of the plan.
- **`exercises`** (Exercise[]): Template exercises with target sets/reps.
- **`userId`** (string): ID of the user.

### Exercise
A component of a workout or workout plan.
- **`id`** (string): Unique identifier.
- **`name`** (string): Name of the exercise.
- **`sets`** (number): Number of sets.
- **`reps`** (number): Number of repetitions per set.
- **`weight`** (number): Weight used (kg).

### FoodLog
Represents a logged meal or food item.
- **`id`** (string): Unique identifier.
- **`name`** (string): Name of the food.
- **`calories`** (number): Calories in kcal.
- **`protein`** (number): Protein in grams.
- **`carbs`** (number): Carbohydrates in grams.
- **`fats`** (number): Fats in grams.
- **`time`** (string): Logged time (e.g., "08:30 AM").
- **`date`** (string): ISO format date (YYYY-MM-DD).
- **`userId`** (string): ID of the user.

**Sample JSON**:
```json
{
  "id": "1712760000000",
  "name": "Oatmeal",
  "calories": 350,
  "protein": 12,
  "carbs": 55,
  "fats": 7,
  "time": "08:30 AM",
  "date": "2024-04-10",
  "userId": "user_123"
}
```

## Firestore Collections

- **`users/{uid}`**: Root user document (holds `calorieGoal`).
- **`users/{uid}/habits/{id}`**: User-defined habits.
- **`users/{uid}/habitLogs/{date}`**: Daily habit completion records.
- **`users/{uid}/workouts/{id}`**: History of workout sessions.
- **`users/{uid}/foodLogs/{id}`**: Daily food intake history.
- **`users/{uid}/workoutPlans/{id}`**: Reusable workout templates.
