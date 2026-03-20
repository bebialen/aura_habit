/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, Plus } from 'lucide-react';
import { BentoCard } from '../components/BentoCard';
import { RadialProgress } from '../components/RadialProgress';
import { FoodLog } from '../types';
import { motion } from 'motion/react';

interface NutritionViewProps {
  logs: FoodLog[];
  goal: number;
  consumed: number;
  onAddFood: () => void;
}

export const NutritionView: React.FC<NutritionViewProps> = ({ logs, goal, consumed, onAddFood }) => {
  const protein = logs.reduce((acc, log) => acc + log.protein, 0);
  const carbs = logs.reduce((acc, log) => acc + log.carbs, 0);
  const fats = logs.reduce((acc, log) => acc + log.fats, 0);

  return (
    <div className="space-y-4">
      <BentoCard className="flex-row items-center justify-between py-6">
        <div className="flex flex-col gap-1">
          <span className="text-white/30 text-[8px] font-medium uppercase tracking-[0.3em] mb-1">Daily Goal</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-light tracking-tight text-cobalt">{consumed}</span>
            <span className="text-white/20 text-[10px] font-medium uppercase tracking-[0.2em] ml-1">/ {goal} kcal</span>
          </div>
        </div>
        <RadialProgress progress={(consumed / goal) * 100} size={80} strokeWidth={6} />
      </BentoCard>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Protein', val: `${protein}g`, target: '180g', p: (protein / 180) * 100 },
          { label: 'Carbs', val: `${carbs}g`, target: '250g', p: (carbs / 250) * 100 },
          { label: 'Fats', val: `${fats}g`, target: '70g', p: (fats / 70) * 100 },
        ].map((macro, i) => (
          <BentoCard key={i} className="p-3 items-center" delay={i * 0.1}>
            <span className="text-[7px] font-medium uppercase tracking-[0.2em] text-white/20 mb-1">{macro.label}</span>
            <span className="text-xl font-light tracking-tight">{macro.val}</span>
            <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(macro.p, 100)}%` }}
                className="h-full bg-cobalt" 
              />
            </div>
          </BentoCard>
        ))}
      </div>

      <button 
        onClick={onAddFood}
        className="w-full h-14 rounded-2xl glass flex items-center justify-center gap-2 font-medium uppercase tracking-widest text-[10px] hover:bg-white/10 transition-colors"
      >
        <Plus size={18} className="text-cobalt" />
        Log Meal
      </button>

      <div className="space-y-2">
        <h4 className="text-white/30 text-[8px] font-medium uppercase tracking-[0.3em] px-1 mb-3">Today's Log</h4>
        {logs.map((log, i) => (
          <BentoCard key={log.id} className="p-4 flex-row justify-between items-center" delay={i * 0.1}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Flame size={18} className="text-orange-500/50" />
              </div>
              <div>
                <h5 className="font-medium text-sm">{log.name}</h5>
                <span className="text-white/20 text-[8px] uppercase font-medium tracking-widest">{log.time}</span>
              </div>
            </div>
            <span className="font-light tracking-tight text-white/60">{log.calories} kcal</span>
          </BentoCard>
        ))}
      </div>
    </div>
  );
};
