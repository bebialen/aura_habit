/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Dumbbell, Plus, ArrowUpRight, Trash2, Play } from 'lucide-react';
import { BentoCard } from '../components/BentoCard';
import { Workout, WorkoutPlan } from '../types';

interface WorkoutsViewProps {
  workouts: Workout[];
  workoutPlans: WorkoutPlan[];
  onStartWorkout: (plan?: WorkoutPlan) => void;
  onAddPlan: () => void;
  onRemovePlan: (id: string) => void;
}

export const WorkoutsView: React.FC<WorkoutsViewProps> = ({ 
  workouts, 
  workoutPlans, 
  onStartWorkout, 
  onAddPlan, 
  onRemovePlan 
}) => {
  const totalVolume = workouts.reduce((acc, w) => acc + w.volume, 0);

  return (
    <div className="space-y-6">
      <BentoCard className="flex-row justify-between items-center">
        <div>
          <span className="text-white/30 text-[8px] font-medium uppercase tracking-[0.3em] mb-1">Total Volume</span>
          <h3 className="text-4xl font-light tracking-tight text-cobalt">{totalVolume.toLocaleString()} <span className="text-[10px] font-medium uppercase tracking-[0.2em] ml-1">kg</span></h3>
        </div>
        <div className="w-12 h-12 rounded-xl bg-cobalt/10 flex items-center justify-center">
          <Dumbbell size={24} className="text-cobalt" />
        </div>
      </BentoCard>

      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-white/30 text-[8px] font-medium uppercase tracking-[0.3em]">Workout Plans</h4>
          <button 
            onClick={onAddPlan}
            className="text-cobalt text-[8px] font-medium uppercase tracking-[0.3em] flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <Plus size={12} />
            Create Plan
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {workoutPlans.length === 0 ? (
            <div className="glass p-8 text-center border-dashed border-white/5 rounded-[32px]">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Dumbbell size={24} className="text-white/20" />
              </div>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">No plans created yet.</p>
            </div>
          ) : (
            workoutPlans.map((plan) => (
              <BentoCard key={plan.id} className="p-0 overflow-hidden group">
                <div className="p-5 flex justify-between items-start">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => onStartWorkout(plan)}
                      className="w-12 h-12 rounded-2xl bg-cobalt/10 flex items-center justify-center text-cobalt hover:bg-cobalt hover:text-white transition-all cobalt-glow active:scale-95"
                    >
                      <Play size={22} fill="currentColor" />
                    </button>
                    <div>
                      <h5 className="font-bold text-base tracking-tight mb-0.5">{plan.name}</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{plan.exercises.length} Exercises</span>
                        <span className="text-white/10 text-[10px]">•</span>
                        <span className="text-cobalt/60 text-[10px] font-bold uppercase tracking-widest">Template</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemovePlan(plan.id)}
                    className="p-2 text-white/5 hover:text-red-500/50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {plan.exercises.length > 0 && (
                  <div className="px-5 pb-5 pt-1 flex flex-wrap gap-2">
                    {plan.exercises.slice(0, 3).map((ex, i) => (
                      <div key={ex.id} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/40">
                        {ex.name}
                      </div>
                    ))}
                    {plan.exercises.length > 3 && (
                      <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/20">
                        +{plan.exercises.length - 3} More
                      </div>
                    )}
                  </div>
                )}
              </BentoCard>
            ))
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-white/30 text-[8px] font-medium uppercase tracking-[0.3em] px-1">Quick Start</h4>
        <button 
          onClick={() => onStartWorkout()}
          className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between px-6 group hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cobalt flex items-center justify-center cobalt-glow">
              <Plus size={20} />
            </div>
            <span className="font-light uppercase tracking-widest text-sm">Empty Session</span>
          </div>
          <ArrowUpRight size={20} className="text-white/20 group-hover:text-cobalt transition-colors" />
        </button>
      </div>

      <div className="space-y-2">
        <h4 className="text-white/30 text-[8px] font-medium uppercase tracking-[0.3em] px-1 mb-3">Recent Sessions</h4>
        {workouts.length === 0 ? (
          <div className="glass p-12 text-center">
            <p className="text-white/20 text-sm italic">No sessions logged yet.</p>
          </div>
        ) : (
          workouts.map((workout, i) => (
            <BentoCard key={workout.id} className="p-4" delay={i * 0.05}>
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-bold text-lg">{workout.name}</h5>
                  <span className="text-white/40 text-xs">{workout.date}</span>
                </div>
                <div className="text-right">
                  <div className="font-light tracking-tight text-cobalt text-xl">{workout.volume.toLocaleString()} kg</div>
                  <div className="text-white/20 text-[8px] uppercase font-medium tracking-widest">{workout.duration} mins</div>
                </div>
              </div>
            </BentoCard>
          ))
        )}
      </div>
    </div>
  );
};
