/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, TrendingUp, CheckCircle2, ChevronRight, Plus } from 'lucide-react';
import { BentoCard } from '../components/BentoCard';
import { RadialProgress } from '../components/RadialProgress';
import { Habit, HabitLog } from '../types';
import { motion } from 'motion/react';

interface DashboardViewProps {
  habits: Habit[];
  habitLogs: HabitLog[];
  toggleHabit: (id: string) => void;
  caloriesConsumed: number;
  calorieGoal: number;
  onLogClick: () => void;
}

const HabitHeatmap: React.FC<{ habitLogs: HabitLog[], habits: Habit[] }> = ({ habitLogs, habits }) => {
  const today = new Date();
  const days = Array.from({ length: 28 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (27 - i));
    const dateStr = date.toISOString().split('T')[0];
    const log = habitLogs.find(l => l.date === dateStr);
    const completionRate = habits.length > 0 ? (log?.completedIds.length || 0) / habits.length : 0;
    return { date: dateStr, rate: completionRate };
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-white/30 text-[8px] font-medium uppercase tracking-[0.3em]">Consistency Heatmap</span>
        <span className="text-white/10 text-[7px] uppercase font-medium tracking-[0.2em]">Last 4 Weeks</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, i) => (
          <div 
            key={day.date} 
            className="aspect-square rounded-sm relative group"
            style={{ 
              backgroundColor: day.rate > 0 ? `rgba(46, 91, 255, ${Math.max(0.1, day.rate)})` : 'rgba(255, 255, 255, 0.03)',
              border: day.rate > 0 ? '1px solid rgba(46, 91, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white/10 backdrop-blur-md rounded text-[8px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-white/5">
              {day.date}: {Math.round(day.rate * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  habits, 
  habitLogs,
  toggleHabit, 
  caloriesConsumed, 
  calorieGoal,
  onLogClick
}) => {
  const caloriesLeft = calorieGoal - caloriesConsumed;
  const calorieProgress = (caloriesConsumed / calorieGoal) * 100;
  const habitsDone = habits.filter(h => h.done).length;

  return (
    <div className="grid grid-cols-2 gap-4">
      <BentoCard className="col-span-2 flex-row items-center justify-between py-8" delay={0.1}>
        <div className="flex flex-col">
          <span className="text-white/30 text-[8px] font-medium uppercase tracking-[0.3em] mb-1">Calories Left</span>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-light tracking-tight">{caloriesLeft.toLocaleString()}</span>
            <span className="text-white/20 text-[10px] font-medium uppercase tracking-[0.2em]">kcal</span>
          </div>
        </div>
        <RadialProgress progress={calorieProgress} />
      </BentoCard>

      <BentoCard className="col-span-2" delay={0.15}>
        <HabitHeatmap habitLogs={habitLogs} habits={habits} />
      </BentoCard>

      <BentoCard delay={0.2}>
        <div className="flex justify-between items-start mb-4">
          <Calendar size={18} className="text-cobalt" />
          <span className="text-[8px] font-medium text-cobalt bg-cobalt/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Hot</span>
        </div>
        <span className="text-white/30 text-[8px] font-medium uppercase tracking-[0.3em] mb-1">Streak</span>
        <span className="text-4xl font-light tracking-tight">12</span>
        <span className="text-white/20 text-[8px] font-medium uppercase tracking-[0.2em] ml-1">Days</span>
      </BentoCard>

      <BentoCard delay={0.3}>
        <div className="flex justify-between items-start mb-4">
          <TrendingUp size={18} className="text-white/70" />
        </div>
        <span className="text-white/30 text-[8px] font-medium uppercase tracking-[0.3em] mb-1">Strength</span>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-light tracking-tight text-cobalt">+12%</span>
        </div>
        <div className="h-10 flex items-end gap-1">
          {[40, 60, 45, 70, 65, 85, 80].map((h, i) => (
            <div key={i} className="flex-1 bg-cobalt/20 rounded-t-sm relative group">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className="absolute bottom-0 left-0 right-0 bg-cobalt rounded-t-sm"
              />
            </div>
          ))}
        </div>
      </BentoCard>

      <BentoCard className="col-span-2" delay={0.4}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-white/30 text-[8px] font-medium uppercase tracking-[0.3em]">Daily Habits</span>
          <span className="text-white/20 text-[8px] font-medium uppercase tracking-widest">{habitsDone} / {habits.length}</span>
        </div>
        <div className="space-y-3">
          {habits.map((habit) => (
            <div 
              key={habit.id} 
              onClick={() => toggleHabit(habit.id)}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${habit.done ? 'bg-cobalt border-cobalt' : 'border-white/10'}`}>
                  {habit.done && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <span className={`text-sm font-medium ${habit.done ? 'text-white/90' : 'text-white/40'}`}>{habit.name}</span>
              </div>
              <ChevronRight size={14} className="text-white/10 group-hover:text-white/30 transition-colors" />
            </div>
          ))}
        </div>
      </BentoCard>

      <BentoCard className="col-span-2 flex-row gap-4 p-3" delay={0.5}>
        <button 
          onClick={onLogClick}
          className="flex-1 h-12 rounded-xl bg-cobalt flex items-center justify-center gap-2 font-medium uppercase tracking-widest text-[10px] cobalt-glow active:scale-95 transition-transform"
        >
          <Plus size={18} />
          Quick Log
        </button>
      </BentoCard>
    </div>
  );
};
