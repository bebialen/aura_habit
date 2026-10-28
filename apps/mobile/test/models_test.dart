import 'package:flutter_test/flutter_test.dart';
import '../lib/models.dart';

void main() {
  test('exercise volume matches web calculation', () {
    const exercise = Exercise(id: '1', name: 'Bench', sets: 3, reps: 10, weight: 60);
    expect(exercise.volume, 1800);
  });

  test('date keys are stable and zero padded', () {
    expect(dateKey(DateTime(2026, 1, 2)), '2026-01-02');
  });

  test('food model decodes Firestore numeric values', () {
    final food = FoodLog.fromJson({'id': '1', 'name': 'Banana', 'calories': 105.0, 'time': '08:00', 'protein': 1, 'carbs': 27, 'fats': 0, 'date': '2026-01-02'});
    expect(food.calories, 105);
    expect(food.carbs, 27);
  });
}
