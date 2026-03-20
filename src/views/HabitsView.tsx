/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Edit2 } from 'lucide-react';
import { BentoCard } from '../components/BentoCard';
import { Habit } from '../types';

interface HabitsViewProps {
  habits: Habit[];
  addHabit: (name: string) => void;
  removeHabit: (id: string) => void;
  toggleHabit: (id: string) => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({ habits, addHabit, removeHabit, toggleHabit }) => {
  const [newHabitName, setNewHabitName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim());
      setNewHabitName('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-light tracking-tight">Manage Habits</h2>
        <p className="text-white/30 text-[8px] font-medium uppercase tracking-[0.3em]">Build consistency and track your daily progress.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="New habit name..."
          className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-cobalt transition-colors"
        />
        <button
          type="submit"
          disabled={!newHabitName.trim()}
          className="w-12 h-12 rounded-xl bg-cobalt flex items-center justify-center cobalt-glow disabled:opacity-50 active:scale-95 transition-all"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="space-y-3">
        {habits.map((habit, i) => (
          <BentoCard key={habit.id} className="p-4 flex-row items-center justify-between" delay={i * 0.05}>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleHabit(habit.id)}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${habit.done ? 'bg-cobalt text-white' : 'bg-white/5 text-white/20 border border-white/10'}`}
              >
                {habit.done ? <CheckCircle2 size={14} /> : <Circle size={14} />}
              </button>
              <span className={`font-medium ${habit.done ? 'text-white/50 line-through' : 'text-white'}`}>
                {habit.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-white/20 hover:text-white/50 transition-colors">
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => removeHabit(habit.id)}
                className="p-2 text-white/20 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </BentoCard>
        ))}

        {habits.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center glass border-dashed">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Plus size={24} className="text-white/20" />
            </div>
            <p className="text-white/30 text-[8px] font-medium uppercase tracking-[0.3em]">No habits added yet.<br/>Start by adding your first one above.</p>
          </div>
        )}
      </div>
    </div>
  );
};
