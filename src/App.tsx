/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { LayoutDashboard, Dumbbell, Apple, CheckCircle2, Plus, Search, Flame, Clock, ChevronRight, LogOut, LogIn, GripVertical, Edit2, Save, X } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { Habit, Workout, FoodLog, ViewType, Exercise, HabitLog, WorkoutPlan } from './types';
import { Modal } from './components/Modal';
import { DashboardView } from './views/DashboardView';
import { WorkoutsView } from './views/WorkoutsView';
import { NutritionView } from './views/NutritionView';
import { HabitsView } from './views/HabitsView';
import { auth, db } from './firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut, 
  User 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  getDocFromServer,
  writeBatch
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './services/firestoreErrorHandler';
import { ErrorBoundary } from './components/ErrorBoundary';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewType>('dashboard');
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Firestore State
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [calorieGoal, setCalorieGoal] = useState<number>(2500);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | undefined>(undefined);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Auth Listener
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Connection Test
  React.useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  // Firestore Listeners
  React.useEffect(() => {
    if (!user || !isAuthReady) return;

    const habitsRef = collection(db, 'users', user.uid, 'habits');
    const habitsQuery = query(habitsRef, orderBy('order', 'asc'));
    const unsubHabits = onSnapshot(habitsQuery, (snapshot) => {
      setHabits(snapshot.docs.map(d => d.data() as Habit));
    }, (err) => handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/habits`));

    const logsRef = collection(db, 'users', user.uid, 'habitLogs');
    const unsubLogs = onSnapshot(logsRef, (snapshot) => {
      setHabitLogs(snapshot.docs.map(d => d.data() as HabitLog));
    }, (err) => handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/habitLogs`));

    const workoutsRef = collection(db, 'users', user.uid, 'workouts');
    const workoutsQuery = query(workoutsRef, orderBy('date', 'desc'));
    const unsubWorkouts = onSnapshot(workoutsQuery, (snapshot) => {
      setWorkouts(snapshot.docs.map(d => d.data() as Workout));
    }, (err) => handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/workouts`));

    const foodRef = collection(db, 'users', user.uid, 'foodLogs');
    const foodQuery = query(foodRef, orderBy('time', 'desc'));
    const unsubFood = onSnapshot(foodQuery, (snapshot) => {
      setFoodLogs(snapshot.docs.map(d => d.data() as FoodLog));
    }, (err) => handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/foodLogs`));

    const plansRef = collection(db, 'users', user.uid, 'workoutPlans');
    const unsubPlans = onSnapshot(plansRef, (snapshot) => {
      setWorkoutPlans(snapshot.docs.map(d => d.data() as WorkoutPlan));
    }, (err) => handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/workoutPlans`));

    const userRef = doc(db, 'users', user.uid);
    const unsubUser = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setCalorieGoal(snapshot.data().calorieGoal || 2500);
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, `users/${user.uid}`));

    return () => {
      unsubHabits();
      unsubLogs();
      unsubWorkouts();
      unsubFood();
      unsubPlans();
      unsubUser();
    };
  }, [user, isAuthReady]);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Initialize user doc if not exists
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        calorieGoal: 2500,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => signOut(auth);

  const today = new Date().toISOString().split('T')[0];

  const todayHabits = useMemo(() => {
    const todayLog = habitLogs.find(l => l.date === today);
    return habits.map(h => ({
      ...h,
      done: todayLog ? todayLog.completedIds.includes(h.id) : false
    }));
  }, [habits, habitLogs, today]);

  const todayFoodLogs = useMemo(() => 
    foodLogs.filter(log => log.date === today),
  [foodLogs, today]);

  const caloriesConsumed = useMemo(() => 
    todayFoodLogs.reduce((acc, log) => acc + log.calories, 0), 
  [todayFoodLogs]);

  const toggleHabit = async (id: string) => {
    if (!user) return;
    const habit = todayHabits.find(h => h.id === id);
    if (!habit) return;

    const newDone = !habit.done;
    const currentToday = new Date().toISOString().split('T')[0];
    const logRef = doc(db, 'users', user.uid, 'habitLogs', currentToday);
    const habitRef = doc(db, 'users', user.uid, 'habits', id);

    try {
      const batch = writeBatch(db);
      batch.update(habitRef, { done: newDone });

      const currentLog = habitLogs.find(l => l.date === currentToday) || { date: currentToday, completedIds: [], userId: user.uid };
      let newCompletedIds;
      if (newDone) {
        newCompletedIds = [...new Set([...currentLog.completedIds, id])];
      } else {
        newCompletedIds = currentLog.completedIds.filter(cid => cid !== id);
      }
      
      batch.set(logRef, { date: currentToday, completedIds: newCompletedIds, userId: user.uid }, { merge: true });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/habits/${id}`);
    }
  };

  const addHabit = async (name: string) => {
    if (!user) return;
    const id = Date.now().toString();
    const habitRef = doc(db, 'users', user.uid, 'habits', id);
    try {
      await setDoc(habitRef, {
        id,
        name,
        done: false,
        userId: user.uid,
        order: habits.length
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/habits/${id}`);
    }
  };

  const removeHabit = async (id: string) => {
    if (!user) return;
    const habitRef = doc(db, 'users', user.uid, 'habits', id);
    try {
      await deleteDoc(habitRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/habits/${id}`);
    }
  };

  const addFoodLog = async (food: Omit<FoodLog, 'id' | 'time' | 'userId' | 'date'>) => {
    if (!user) return;
    const id = Date.now().toString();
    const today = new Date().toISOString().split('T')[0];
    const foodRef = doc(db, 'users', user.uid, 'foodLogs', id);
    try {
      await setDoc(foodRef, {
        ...food,
        id,
        userId: user.uid,
        date: today,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setIsFoodModalOpen(false);
      setIsQuickLogOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/foodLogs/${id}`);
    }
  };

  const addWorkout = async (workout: Omit<Workout, 'id' | 'date' | 'userId'>) => {
    if (!user) return;
    const id = Date.now().toString();
    const workoutRef = doc(db, 'users', user.uid, 'workouts', id);
    try {
      await setDoc(workoutRef, {
        ...workout,
        id,
        userId: user.uid,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      });
      setIsWorkoutModalOpen(false);
      setIsQuickLogOpen(false);
      setSelectedPlan(undefined);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/workouts/${id}`);
    }
  };

  const addWorkoutPlan = async (plan: Omit<WorkoutPlan, 'id' | 'userId'>) => {
    if (!user) return;
    const id = Date.now().toString();
    const planRef = doc(db, 'users', user.uid, 'workoutPlans', id);
    try {
      await setDoc(planRef, {
        ...plan,
        id,
        userId: user.uid
      });
      setIsPlanModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/workoutPlans/${id}`);
    }
  };

  const removeWorkoutPlan = async (id: string) => {
    if (!user) return;
    const planRef = doc(db, 'users', user.uid, 'workoutPlans', id);
    try {
      await deleteDoc(planRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/workoutPlans/${id}`);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cobalt border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-light tracking-tight mb-2">Aura</h1>
          <p className="text-white/30 text-[10px] font-medium uppercase tracking-[0.5em]">Elevate your daily performance.</p>
        </div>
        <button 
          onClick={login}
          className="w-full max-w-xs h-14 rounded-2xl bg-white text-obsidian font-bold flex items-center justify-center gap-3 hover:bg-white/90 transition-colors"
        >
          <LogIn size={20} />
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-obsidian text-white font-sans selection:bg-cobalt/30 pb-24">
        {/* Header */}
        <header className="p-6 flex justify-between items-center sticky top-0 bg-obsidian/80 backdrop-blur-xl z-50">
          <div className="flex flex-col">
            <h1 className="text-2xl font-light tracking-tight">Aura</h1>
            <span className="text-white/20 text-[8px] uppercase font-medium tracking-[0.4em]">Performance</span>
          </div>
          <button 
            onClick={logout}
            className="w-10 h-10 rounded-full glass flex items-center justify-center border border-white/10 group"
          >
            <LogOut size={16} className="text-white/30 group-hover:text-red-500 transition-colors" />
          </button>
        </header>

        <main className="px-6 max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardView 
                  habits={todayHabits} 
                  habitLogs={habitLogs}
                  toggleHabit={toggleHabit} 
                  caloriesConsumed={caloriesConsumed} 
                  calorieGoal={calorieGoal}
                  onLogClick={() => setIsQuickLogOpen(true)}
                />
              )}
              {activeTab === 'workouts' && (
                <WorkoutsView 
                  workouts={workouts} 
                  workoutPlans={workoutPlans}
                  onStartWorkout={(plan) => {
                    setSelectedPlan(plan);
                    setIsWorkoutModalOpen(true);
                  }} 
                  onAddPlan={() => setIsPlanModalOpen(true)}
                  onRemovePlan={removeWorkoutPlan}
                />
              )}
              {activeTab === 'nutrition' && (
                <NutritionView 
                  logs={todayFoodLogs} 
                  goal={calorieGoal} 
                  consumed={caloriesConsumed}
                  onAddFood={() => setIsFoodModalOpen(true)}
                />
              )}
              {activeTab === 'habits' && (
                <HabitsView 
                  habits={todayHabits}
                  addHabit={addHabit}
                  removeHabit={removeHabit}
                  toggleHabit={toggleHabit}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 p-6 z-50">
          <div className="max-w-md mx-auto glass rounded-[32px] p-2 flex justify-between items-center border border-white/5">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
              { id: 'workouts', icon: Dumbbell, label: 'Train' },
              { id: 'nutrition', icon: Apple, label: 'Eat' },
              { id: 'habits', icon: CheckCircle2, label: 'Habits' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ViewType)}
                className={`relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'text-cobalt' : 'text-white/30 hover:text-white/60'}`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-cobalt/10 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon size={20} className={activeTab === tab.id ? 'cobalt-glow' : ''} />
                <span className="text-[7px] font-medium uppercase tracking-[0.3em] mt-1.5">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Modals */}
        <Modal isOpen={isQuickLogOpen} onClose={() => setIsQuickLogOpen(false)} title="Quick Log">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => { setIsFoodModalOpen(true); setIsQuickLogOpen(false); }}
              className="glass p-6 flex flex-col items-center gap-4 hover:bg-white/10 transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                <Apple size={24} className="text-orange-500" />
              </div>
              <span className="font-light uppercase tracking-widest text-xs">Log Food</span>
            </button>
            <button 
              onClick={() => { setIsWorkoutModalOpen(true); setIsQuickLogOpen(false); }}
              className="glass p-6 flex flex-col items-center gap-4 hover:bg-white/10 transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-cobalt/10 flex items-center justify-center group-hover:bg-cobalt/20 transition-colors">
                <Dumbbell size={24} className="text-cobalt" />
              </div>
              <span className="font-light uppercase tracking-widest text-xs">Log Workout</span>
            </button>
          </div>
        </Modal>

        <Modal isOpen={isFoodModalOpen} onClose={() => setIsFoodModalOpen(false)} title="Log Food">
          <FoodLoggingForm onAdd={addFoodLog} />
        </Modal>

        <Modal isOpen={isWorkoutModalOpen} onClose={() => { setIsWorkoutModalOpen(false); setSelectedPlan(undefined); }} title={selectedPlan ? `Workout: ${selectedPlan.name}` : "Log Workout"}>
          <WorkoutLoggingForm onAdd={addWorkout} initialPlan={selectedPlan} />
        </Modal>

        <Modal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} title="Create Workout Plan">
          <WorkoutPlanForm onAdd={addWorkoutPlan} />
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

const FoodLoggingForm: React.FC<{ onAdd: (food: Omit<FoodLog, 'id' | 'time'>) => void }> = ({ onAdd }) => {
  const [search, setSearch] = useState('');
  const [customEntry, setCustomEntry] = useState({ name: '', calories: '', protein: '', carbs: '', fats: '' });

  const quickAdd = [
    { name: 'Protein Shake', calories: 150, protein: 30, carbs: 5, fats: 2 },
    { name: 'Banana', calories: 105, protein: 1, carbs: 27, fats: 0 },
    { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 4 },
  ];

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
        <input 
          type="text" 
          placeholder="Search food database..." 
          className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 focus:outline-none focus:border-cobalt transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Quick Add</h4>
        <div className="space-y-2">
          {quickAdd.map((food, i) => (
            <button 
              key={i} 
              onClick={() => onAdd(food)}
              className="w-full glass p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Flame size={14} className="text-orange-500/50" />
                </div>
                <span className="font-bold text-sm">{food.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-xs">{food.calories} kcal</span>
                <Plus size={14} className="text-cobalt" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/5">
        <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Custom Entry</h4>
        <div className="grid grid-cols-2 gap-3">
          <input 
            placeholder="Food Name" 
            className="col-span-2 h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-cobalt"
            value={customEntry.name}
            onChange={e => setCustomEntry({...customEntry, name: e.target.value})}
          />
          <input 
            placeholder="Calories" 
            type="number"
            className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-cobalt"
            value={customEntry.calories}
            onChange={e => setCustomEntry({...customEntry, calories: e.target.value})}
          />
          <input 
            placeholder="Protein (g)" 
            type="number"
            className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-cobalt"
            value={customEntry.protein}
            onChange={e => setCustomEntry({...customEntry, protein: e.target.value})}
          />
          <input 
            placeholder="Carbs (g)" 
            type="number"
            className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-cobalt"
            value={customEntry.carbs}
            onChange={e => setCustomEntry({...customEntry, carbs: e.target.value})}
          />
          <input 
            placeholder="Fats (g)" 
            type="number"
            className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-cobalt"
            value={customEntry.fats}
            onChange={e => setCustomEntry({...customEntry, fats: e.target.value})}
          />
        </div>
        <button 
          disabled={!customEntry.name || !customEntry.calories}
          onClick={() => onAdd({
            name: customEntry.name,
            calories: Number(customEntry.calories),
            protein: Number(customEntry.protein || 0),
            carbs: Number(customEntry.carbs || 0),
            fats: Number(customEntry.fats || 0)
          })}
          className="w-full h-12 rounded-xl bg-cobalt font-medium uppercase tracking-widest text-[10px] disabled:opacity-50"
        >
          Add Custom Food
        </button>
      </div>
    </div>
  );
};

const WorkoutLoggingForm: React.FC<{ 
  onAdd: (workout: Omit<Workout, 'id' | 'date' | 'userId'>) => void;
  initialPlan?: WorkoutPlan;
}> = ({ onAdd, initialPlan }) => {
  const [name, setName] = useState(initialPlan?.name || '');
  const [duration, setDuration] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>(initialPlan?.exercises || []);
  const [newExercise, setNewExercise] = useState({ name: '', sets: '', reps: '', weight: '', notes: '' });

  const addExercise = () => {
    if (!newExercise.name || !newExercise.sets || !newExercise.reps) return;
    setExercises([...exercises, {
      id: Date.now().toString(),
      name: newExercise.name,
      sets: Number(newExercise.sets),
      reps: Number(newExercise.reps),
      weight: Number(newExercise.weight || 0),
      notes: newExercise.notes
    }]);
    setNewExercise({ name: '', sets: '', reps: '', weight: '', notes: '' });
  };

  const calculateVolume = () => {
    return exercises.reduce((acc, ex) => acc + (ex.sets * ex.reps * ex.weight), 0);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <input 
          placeholder="Workout Name (e.g. Upper Body)" 
          className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 focus:outline-none focus:border-cobalt"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <div className="relative">
          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            placeholder="Duration (mins)" 
            type="number"
            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 focus:outline-none focus:border-cobalt"
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Exercises</h4>
        
        <div className="space-y-2">
          {exercises.map((ex) => (
            <div key={ex.id} className="glass p-3 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-sm">{ex.name}</div>
                  <div className="text-white/30 text-[10px]">{ex.sets} sets × {ex.reps} reps @ {ex.weight}kg</div>
                </div>
                <div className="text-cobalt font-bold text-xs">{ex.sets * ex.reps * ex.weight}kg</div>
              </div>
              {ex.notes && (
                <div className="text-[10px] text-white/40 italic border-t border-white/5 pt-2">
                  {ex.notes}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="glass p-4 space-y-3">
          <input 
            placeholder="Exercise Name" 
            className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm focus:outline-none focus:border-cobalt"
            value={newExercise.name}
            onChange={e => setNewExercise({...newExercise, name: e.target.value})}
          />
          <div className="grid grid-cols-3 gap-2">
            <input 
              placeholder="Sets" 
              type="number"
              className="h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm focus:outline-none focus:border-cobalt"
              value={newExercise.sets}
              onChange={e => setNewExercise({...newExercise, sets: e.target.value})}
            />
            <input 
              placeholder="Reps" 
              type="number"
              className="h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm focus:outline-none focus:border-cobalt"
              value={newExercise.reps}
              onChange={e => setNewExercise({...newExercise, reps: e.target.value})}
            />
            <input 
              placeholder="Weight" 
              type="number"
              className="h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm focus:outline-none focus:border-cobalt"
              value={newExercise.weight}
              onChange={e => setNewExercise({...newExercise, weight: e.target.value})}
            />
          </div>
          <textarea
            placeholder="Add a note (Markdown supported)..."
            className="w-full h-20 bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-cobalt resize-none"
            value={newExercise.notes}
            onChange={e => setNewExercise({...newExercise, notes: e.target.value})}
          />
          <button 
            onClick={addExercise}
            className="w-full h-10 rounded-lg border border-cobalt/30 text-cobalt font-medium uppercase tracking-widest text-[10px] hover:bg-cobalt/5 transition-colors"
          >
            Add Exercise
          </button>
        </div>
      </div>

      <button 
        disabled={!name || exercises.length === 0}
        onClick={() => onAdd({
          name,
          duration: Number(duration || 0),
          volume: calculateVolume(),
          exercises
        })}
        className="w-full h-14 rounded-2xl bg-cobalt font-medium uppercase tracking-widest text-xs cobalt-glow disabled:opacity-50 transition-all"
      >
        Finish Workout
      </button>
    </div>
  );
};

const WorkoutPlanForm: React.FC<{ onAdd: (plan: Omit<WorkoutPlan, 'id' | 'userId'>) => void }> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExercise, setNewExercise] = useState({ name: '', sets: '', reps: '', notes: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Exercise | null>(null);

  const addExercise = () => {
    if (!newExercise.name || !newExercise.sets || !newExercise.reps) return;
    setExercises([...exercises, {
      id: Date.now().toString(),
      name: newExercise.name,
      sets: Number(newExercise.sets),
      reps: Number(newExercise.reps),
      weight: 0,
      notes: newExercise.notes
    }]);
    setNewExercise({ name: '', sets: '', reps: '', notes: '' });
  };

  const startEditing = (ex: Exercise) => {
    setEditingId(ex.id);
    setEditForm({ ...ex });
  };

  const saveEdit = () => {
    if (!editForm) return;
    setExercises(exercises.map(ex => ex.id === editForm.id ? editForm : ex));
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <div className="space-y-6">
      <input 
        placeholder="Plan Name (e.g. Leg Day)" 
        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 focus:outline-none focus:border-cobalt"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <div className="space-y-4">
        <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Exercises Template</h4>
        
        <Reorder.Group axis="y" values={exercises} onReorder={setExercises} className="space-y-2">
          {exercises.map((ex) => (
            <Reorder.Item 
              key={ex.id} 
              value={ex}
              className="glass p-3 flex flex-col gap-3 cursor-grab active:cursor-grabbing"
            >
              {editingId === ex.id && editForm ? (
                <div className="space-y-3">
                  <input 
                    className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm focus:outline-none focus:border-cobalt"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="number"
                      placeholder="Sets"
                      className="h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm focus:outline-none focus:border-cobalt"
                      value={editForm.sets}
                      onChange={e => setEditForm({ ...editForm, sets: Number(e.target.value) })}
                    />
                    <input 
                      type="number"
                      placeholder="Reps"
                      className="h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm focus:outline-none focus:border-cobalt"
                      value={editForm.reps}
                      onChange={e => setEditForm({ ...editForm, reps: Number(e.target.value) })}
                    />
                  </div>
                  <textarea
                    placeholder="Notes (Markdown supported)"
                    className="w-full h-20 bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-cobalt resize-none"
                    value={editForm.notes}
                    onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={saveEdit}
                      className="flex-1 h-10 rounded-lg bg-cobalt/20 text-cobalt font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Save size={14} /> Save
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="w-10 h-10 rounded-lg bg-white/5 text-white/40 flex items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-white/10" />
                      <div>
                        <div className="font-bold text-sm">{ex.name}</div>
                        <div className="text-white/30 text-[10px]">{ex.sets} sets × {ex.reps} reps</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => startEditing(ex)}
                        className="p-2 text-white/20 hover:text-cobalt transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => setExercises(exercises.filter(e => e.id !== ex.id))}
                        className="p-2 text-white/10 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  {ex.notes && (
                    <div className="ml-7 text-[10px] text-white/40 italic line-clamp-2">
                      {ex.notes}
                    </div>
                  )}
                </div>
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <div className="glass p-4 space-y-3">
          <input 
            placeholder="Exercise Name" 
            className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm focus:outline-none focus:border-cobalt"
            value={newExercise.name}
            onChange={e => setNewExercise({...newExercise, name: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-2">
            <input 
              placeholder="Sets" 
              type="number"
              className="h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm focus:outline-none focus:border-cobalt"
              value={newExercise.sets}
              onChange={e => setNewExercise({...newExercise, sets: e.target.value})}
            />
            <input 
              placeholder="Reps" 
              type="number"
              className="h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm focus:outline-none focus:border-cobalt"
              value={newExercise.reps}
              onChange={e => setNewExercise({...newExercise, reps: e.target.value})}
            />
          </div>
          <textarea
            placeholder="Add a note (Markdown supported)..."
            className="w-full h-20 bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-cobalt resize-none"
            value={newExercise.notes}
            onChange={e => setNewExercise({...newExercise, notes: e.target.value})}
          />
          <button 
            onClick={addExercise}
            className="w-full h-10 rounded-lg border border-cobalt/30 text-cobalt font-medium uppercase tracking-widest text-[10px] hover:bg-cobalt/5 transition-colors"
          >
            Add Exercise to Template
          </button>
        </div>
      </div>

      <button 
        disabled={!name || exercises.length === 0}
        onClick={() => onAdd({ name, exercises })}
        className="w-full h-14 rounded-2xl bg-cobalt font-medium uppercase tracking-widest text-xs cobalt-glow disabled:opacity-50 transition-all"
      >
        Save Workout Plan
      </button>
    </div>
  );
};

export default App;
