/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Clock, Plus, Trash2, Brain, Star } from 'lucide-react';
import { BentoCard } from '../components/BentoCard';
import { StudySession, StudyGoal } from '../types';

interface StudyViewProps {
  sessions: StudySession[];
  goals: StudyGoal[];
  onAddSession: (session: Omit<StudySession, 'id' | 'userId' | 'date'>) => void;
  onRemoveSession: (id: string) => void;
  onAddGoal: (goal: Omit<StudyGoal, 'id' | 'userId'>) => void;
  onRemoveGoal: (id: string) => void;
}

export const StudyView: React.FC<StudyViewProps> = ({ 
  sessions, 
  goals, 
  onAddSession, 
  onRemoveSession,
  onAddGoal,
  onRemoveGoal
}) => {
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [newSession, setNewSession] = useState({ subject: '', duration: '', notes: '', focusScore: 5 });

  const totalStudyTime = sessions.reduce((acc, s) => acc + s.duration, 0);
  const avgFocus = sessions.length > 0 
    ? (sessions.reduce((acc, s) => acc + (s.focusScore || 0), 0) / sessions.length).toFixed(1)
    : 0;

  const handleAddSession = () => {
    if (!newSession.subject || !newSession.duration) return;
    onAddSession({
      subject: newSession.subject,
      duration: Number(newSession.duration),
      notes: newSession.notes,
      focusScore: newSession.focusScore
    });
    setNewSession({ subject: '', duration: '', notes: '', focusScore: 5 });
    setIsAddingSession(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-light tracking-tight">Study Tracker</h2>
        <p className="text-white/30 text-[8px] font-medium uppercase tracking-[0.3em]">Optimize your learning and track deep focus.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <BentoCard className="p-5 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-cobalt/10 flex items-center justify-center">
              <Clock size={20} className="text-cobalt" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-light tracking-tight">{totalStudyTime}m</div>
            <div className="text-white/30 text-[8px] font-bold uppercase tracking-widest mt-1">Total Study Time</div>
          </div>
        </BentoCard>

        <BentoCard className="p-5 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Brain size={20} className="text-purple-500" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-light tracking-tight">{avgFocus}</div>
            <div className="text-white/30 text-[8px] font-bold uppercase tracking-widest mt-1">Avg Focus Score</div>
          </div>
        </BentoCard>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Recent Sessions</h4>
          <button 
            onClick={() => setIsAddingSession(true)}
            className="flex items-center gap-2 text-cobalt text-[10px] font-bold uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            <Plus size={14} /> Add Session
          </button>
        </div>

        {isAddingSession && (
          <BentoCard className="p-5 space-y-4">
            <input 
              placeholder="Subject (e.g. Mathematics)" 
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-cobalt transition-colors"
              value={newSession.subject}
              onChange={e => setNewSession({...newSession, subject: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input 
                  type="number"
                  placeholder="Minutes" 
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 focus:outline-none focus:border-cobalt transition-colors"
                  value={newSession.duration}
                  onChange={e => setNewSession({...newSession, duration: e.target.value})}
                />
              </div>
              <div className="relative">
                <Brain className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <select 
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 focus:outline-none focus:border-cobalt transition-colors appearance-none"
                  value={newSession.focusScore}
                  onChange={e => setNewSession({...newSession, focusScore: Number(e.target.value)})}
                >
                  {[1,2,3,4,5].map(v => (
                    <option key={v} value={v} className="bg-obsidian text-white">Focus: {v}</option>
                  ))}
                </select>
              </div>
            </div>
            <textarea 
              placeholder="Session notes..." 
              className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-cobalt transition-colors resize-none"
              value={newSession.notes}
              onChange={e => setNewSession({...newSession, notes: e.target.value})}
            />
            <div className="flex gap-2">
              <button 
                onClick={handleAddSession}
                className="flex-1 h-12 bg-cobalt rounded-xl font-bold text-[10px] uppercase tracking-widest"
              >
                Save Session
              </button>
              <button 
                onClick={() => setIsAddingSession(false)}
                className="h-12 px-6 bg-white/5 rounded-xl font-bold text-[10px] uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </BentoCard>
        )}

        <div className="space-y-3">
          {sessions.map((session, i) => (
            <BentoCard key={session.id} className="p-4 flex items-center justify-between" delay={i * 0.1}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <BookOpen size={18} className="text-white/40" />
                </div>
                <div>
                  <div className="font-bold text-sm">{session.subject}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-white/30 text-[10px] font-medium">{session.duration} mins</span>
                    <span className="text-white/10 text-[10px]">•</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={8} 
                          className={i < (session.focusScore || 0) ? 'text-cobalt fill-cobalt' : 'text-white/10'} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onRemoveSession(session.id)}
                className="p-2 text-white/10 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </BentoCard>
          ))}

          {sessions.length === 0 && !isAddingSession && (
            <div className="py-12 flex flex-col items-center justify-center text-center glass border-dashed">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <BookOpen size={24} className="text-white/20" />
              </div>
              <p className="text-white/30 text-[8px] font-medium uppercase tracking-[0.3em]">No study sessions today.<br/>Time to hit the books!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
