/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Habit {
  id: string;
  name: string;
  done: boolean;
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  volume: number; // in kg
  duration: number; // in mins
  exercises?: Exercise[];
  userId: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  exercises: Exercise[];
  userId: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface FoodLog {
  id: string;
  name: string;
  calories: number;
  time: string;
  protein: number;
  carbs: number;
  fats: number;
  userId: string;
  date: string;
}

export interface HabitLog {
  date: string; // YYYY-MM-DD
  completedIds: string[];
}

export type ViewType = 'dashboard' | 'workouts' | 'nutrition' | 'habits';
