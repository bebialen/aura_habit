# Business Logic Documentation

This document details the calculations, validation rules, and data transformation logic within Aura Tracker.

## Nutrition Calculations
### 1. Calorie Balance
The dashboard calculates remaining calories for the day:
`Calories Left = Calorie Goal - Total Calories Consumed Today`

### 2. Daily Consumption
Total calories consumed is the sum of all food logs where the date matches the current local date:
`Total = sum(foodLog.calories)`

## Workout Scoring & Tracking
### 1. Training Volume
Workout volume is calculated per exercise and aggregated for the session:
`Exercise Volume = Sets * Reps * Weight`
`Total Workout Volume = sum(Exercise Volumes)`

### 2. Workout Templates
Workout Plans serve as templates. When starting a workout from a plan, the exercises are mapped into a new `Workout` instance, allowing the user to input actual weight performed and view/edit notes while retaining the structure of the plan.

## Habit Tracking Logic
### 1. Completion Status
A habit is considered "done" for the current day if its `id` exists in the `completedIds` array of the `HabitLog` document for the current date (`YYYY-MM-DD`).

### 2. Consistency Heatmap
The dashboard displays a 28-day (4-week) heatmap:
- **Completion Rate**: `(Completed Habits count) / (Total Habits defined)` for each specific day.
- **Visualization**: Opacity of the heatmap cell is tied to this rate (0% to 100%).

## Validation Rules
- **Food Logging**: Requires a `name` and `calories` (positive number).
- **Workout Logging**: Requires a `name` and at least one exercise.
- **Workout Plan Creation**: Requires a `name` and at least one template exercise.
- **Exercise Entry**: Sets and Reps must be provided to calculate volume correctly.

## Data Transformation Logic
- **`todayHabits`**: A computed property that merges the static `Habit` definition with the real-time completion status from `HabitLog`.
- **Date Formatting**: 
  - Firestore logs use `YYYY-MM-DD` for consistent indexing.
  - UI display uses `toLocaleDateString` or short month formats (e.g., "Nov 15") for readability.
