class Exercise {
  const Exercise({required this.id, required this.name, required this.sets, required this.reps, required this.weight, this.notes});
  final String id;
  final String name;
  final int sets;
  final int reps;
  final double weight;
  final String? notes;

  double get volume => sets * reps * weight;
  Map<String, dynamic> toJson() => {'id': id, 'name': name, 'sets': sets, 'reps': reps, 'weight': weight, if (notes != null) 'notes': notes};
  factory Exercise.fromJson(Map<String, dynamic> json) => Exercise(id: '${json['id'] ?? ''}', name: '${json['name'] ?? ''}', sets: (json['sets'] as num?)?.toInt() ?? 0, reps: (json['reps'] as num?)?.toInt() ?? 0, weight: (json['weight'] as num?)?.toDouble() ?? 0, notes: json['notes'] as String?);
}

class Habit {
  const Habit({required this.id, required this.name, required this.done, this.order = 0});
  final String id;
  final String name;
  final bool done;
  final int order;
  factory Habit.fromJson(Map<String, dynamic> json) => Habit(id: '${json['id']}', name: '${json['name'] ?? ''}', done: json['done'] == true, order: (json['order'] as num?)?.toInt() ?? 0);
}

class HabitLog {
  const HabitLog({required this.date, required this.completedIds});
  final String date;
  final List<String> completedIds;
  factory HabitLog.fromJson(Map<String, dynamic> json) => HabitLog(date: '${json['date']}', completedIds: List<String>.from(json['completedIds'] ?? const []));
}

class FoodLog {
  const FoodLog({required this.id, required this.name, required this.calories, required this.time, required this.protein, required this.carbs, required this.fats, required this.date});
  final String id;
  final String name;
  final int calories;
  final String time;
  final double protein;
  final double carbs;
  final double fats;
  final String date;
  factory FoodLog.fromJson(Map<String, dynamic> json) => FoodLog(id: '${json['id']}', name: '${json['name'] ?? ''}', calories: (json['calories'] as num?)?.toInt() ?? 0, time: '${json['time'] ?? ''}', protein: (json['protein'] as num?)?.toDouble() ?? 0, carbs: (json['carbs'] as num?)?.toDouble() ?? 0, fats: (json['fats'] as num?)?.toDouble() ?? 0, date: '${json['date']}');
}

class WorkoutPlan {
  const WorkoutPlan({required this.id, required this.name, required this.exercises});
  final String id;
  final String name;
  final List<Exercise> exercises;
  factory WorkoutPlan.fromJson(Map<String, dynamic> json) => WorkoutPlan(id: '${json['id']}', name: '${json['name'] ?? ''}', exercises: (json['exercises'] as List? ?? const []).map((e) => Exercise.fromJson(Map<String, dynamic>.from(e as Map))).toList());
}

class Workout {
  const Workout({required this.id, required this.name, required this.date, required this.volume, required this.duration, required this.exercises});
  final String id;
  final String name;
  final String date;
  final double volume;
  final int duration;
  final List<Exercise> exercises;
  factory Workout.fromJson(Map<String, dynamic> json) => Workout(id: '${json['id']}', name: '${json['name'] ?? ''}', date: '${json['date'] ?? ''}', volume: (json['volume'] as num?)?.toDouble() ?? 0, duration: (json['duration'] as num?)?.toInt() ?? 0, exercises: (json['exercises'] as List? ?? const []).map((e) => Exercise.fromJson(Map<String, dynamic>.from(e as Map))).toList());
}

String dateKey([DateTime? value]) { final d = value ?? DateTime.now(); return '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}'; }
