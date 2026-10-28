import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'models.dart';

class AuraRepository {
  AuraRepository(this.auth, this.db);
  final FirebaseAuth auth;
  final FirebaseFirestore db;
  String get uid => auth.currentUser!.uid;
  CollectionReference<Map<String, dynamic>> _collection(String name) => db.collection('users').doc(uid).collection(name);

  Stream<List<Habit>> habits() => _collection('habits').orderBy('order').snapshots().map((s) => s.docs.map((d) => Habit.fromJson(d.data())).toList());
  Stream<List<HabitLog>> habitLogs() => _collection('habitLogs').snapshots().map((s) => s.docs.map((d) => HabitLog.fromJson(d.data())).toList());
  Stream<List<Workout>> workouts() => _collection('workouts').orderBy('date', descending: true).snapshots().map((s) => s.docs.map((d) => Workout.fromJson(d.data())).toList());
  Stream<List<WorkoutPlan>> plans() => _collection('workoutPlans').snapshots().map((s) => s.docs.map((d) => WorkoutPlan.fromJson(d.data())).toList());
  Stream<List<FoodLog>> foods() => _collection('foodLogs').orderBy('time', descending: true).snapshots().map((s) => s.docs.map((d) => FoodLog.fromJson(d.data())).toList());
  Stream<int> calorieGoal() => db.collection('users').doc(uid).snapshots().map((s) => (s.data()?['calorieGoal'] as num?)?.toInt() ?? 2500);

  Future<void> initializeUser(User user) => db.collection('users').doc(user.uid).set({'uid': user.uid, 'email': user.email, 'displayName': user.displayName, 'calorieGoal': 2500, 'createdAt': DateTime.now().toIso8601String()}, SetOptions(merge: true));
  String _id() => DateTime.now().millisecondsSinceEpoch.toString();
  Future<void> addHabit(String name, int order) async { final id = _id(); await _collection('habits').doc(id).set({'id': id, 'name': name.trim(), 'done': false, 'userId': uid, 'order': order}); }
  Future<void> removeHabit(String id) => _collection('habits').doc(id).delete();
  Future<void> toggleHabit(String id, List<String> completed) async { final today = dateKey(); final next = completed.contains(id) ? completed.where((x) => x != id).toList() : [...completed, id]; final batch = db.batch(); batch.update(_collection('habits').doc(id), {'done': !completed.contains(id)}); batch.set(_collection('habitLogs').doc(today), {'date': today, 'completedIds': next, 'userId': uid}, SetOptions(merge: true)); await batch.commit(); }
  Future<void> addFood({required String name, required int calories, double protein = 0, double carbs = 0, double fats = 0}) { final id = _id(); final now = DateTime.now(); final time = "${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}"; return _collection('foodLogs').doc(id).set({'id': id, 'name': name.trim(), 'calories': calories, 'protein': protein, 'carbs': carbs, 'fats': fats, 'userId': uid, 'date': dateKey(now), 'time': time}); }
  Future<void> addWorkout(String name, int duration, List<Exercise> exercises) { final id = _id(); return _collection('workouts').doc(id).set({'id': id, 'name': name.trim(), 'duration': duration, 'volume': exercises.fold<double>(0, (sum, e) => sum + e.volume), 'exercises': exercises.map((e) => e.toJson()).toList(), 'date': '${DateTime.now().month}/${DateTime.now().day}', 'userId': uid}); }
  Future<void> addPlan(String name, List<Exercise> exercises) { final id = _id(); return _collection('workoutPlans').doc(id).set({'id': id, 'name': name.trim(), 'exercises': exercises.map((e) => e.toJson()).toList(), 'userId': uid}); }
  Future<void> removePlan(String id) => _collection('workoutPlans').doc(id).delete();
}
