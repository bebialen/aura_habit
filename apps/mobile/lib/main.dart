import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'models.dart';
import 'repository.dart';

const obsidian = Color(0xff050505);
const cobalt = Color(0xff2e5bff);
const muted = Color(0x66ffffff);

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  Object? firebaseError;
  StackTrace? firebaseStackTrace;

  try {
    // Keep startup bounded so a missing or invalid Firebase configuration
    // cannot leave Android showing the native launch screen forever.
    await Firebase.initializeApp().timeout(const Duration(seconds: 15));
  } catch (error, stackTrace) {
    firebaseError = error;
    firebaseStackTrace = stackTrace;
  }

  runApp(
    firebaseError == null
        ? const AuraApp()
        : StartupErrorApp(error: firebaseError, stackTrace: firebaseStackTrace),
  );
}

class StartupErrorApp extends StatelessWidget {
  const StartupErrorApp({required this.error, this.stackTrace, super.key});

  final Object error;
  final StackTrace? stackTrace;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Aura startup error',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: obsidian,
        colorScheme: ColorScheme.fromSeed(
          seedColor: cobalt,
          brightness: Brightness.dark,
        ),
      ),
      home: Scaffold(
        body: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Aura',
                    style: TextStyle(fontSize: 48, fontWeight: FontWeight.w300),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Unable to start Firebase',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Add the Firebase Android configuration file at '
                    'android/app/google-services.json, then rebuild the app.',
                    style: TextStyle(color: muted, height: 1.5),
                  ),
                  const SizedBox(height: 20),
                  SelectableText(
                    error.toString(),
                    style: const TextStyle(color: Colors.redAccent),
                  ),
                  if (stackTrace != null) ...[
                    const SizedBox(height: 12),
                    ExpansionTile(
                      tilePadding: EdgeInsets.zero,
                      title: const Text('Technical details'),
                      children: [SelectableText(stackTrace.toString())],
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class AuraApp extends StatelessWidget {
  const AuraApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Aura',
      theme: ThemeData(
          brightness: Brightness.dark,
          scaffoldBackgroundColor: obsidian,
          colorScheme: ColorScheme.fromSeed(
              seedColor: cobalt, brightness: Brightness.dark)),
      home: const AuthGate());
}

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});
  @override
  Widget build(BuildContext context) => StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting)
          return const Loading();
        return snapshot.data == null ? const SignInScreen() : const AppShell();
      });
}

class Loading extends StatelessWidget {
  const Loading({super.key});
  @override
  Widget build(BuildContext context) => const Scaffold(
      body: Center(child: CircularProgressIndicator(color: cobalt)));
}

class SignInScreen extends StatelessWidget {
  const SignInScreen({super.key});
  Future<void> login(BuildContext context) async {
    try {
      final result =
          await FirebaseAuth.instance.signInWithProvider(GoogleAuthProvider());
      if (result.user != null)
        await AuraRepository(FirebaseAuth.instance, FirebaseFirestore.instance)
            .initializeUser(result.user!);
    } catch (error) {
      if (context.mounted)
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('Sign in failed: $error')));
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      body: Center(
          child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Aura',
                        style: TextStyle(
                            fontSize: 58, fontWeight: FontWeight.w300)),
                    const SizedBox(height: 8),
                    const Text('ELEVATE YOUR DAILY PERFORMANCE.',
                        style: TextStyle(
                            color: muted, fontSize: 10, letterSpacing: 3)),
                    const SizedBox(height: 42),
                    SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: FilledButton(
                            onPressed: () => login(context),
                            child: const Text('Sign in with Google')))
                  ]))));
}

class AppShell extends StatefulWidget {
  const AppShell({super.key});
  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int index = 0;
  final pages = const [
    DashboardScreen(),
    WorkoutsScreen(),
    NutritionScreen(),
    HabitsScreen()
  ];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const Header(),
            Expanded(child: IndexedStack(index: index, children: pages)),
            NavigationBar(
              selectedIndex: index,
              onDestinationSelected: (value) => setState(() => index = value),
              destinations: const [
                NavigationDestination(
                    icon: Icon(Icons.dashboard_outlined), label: 'Home'),
                NavigationDestination(
                    icon: Icon(Icons.fitness_center), label: 'Train'),
                NavigationDestination(icon: Icon(Icons.apple), label: 'Eat'),
                NavigationDestination(
                    icon: Icon(Icons.check_circle_outline), label: 'Habits'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class Header extends StatelessWidget {
  const Header({super.key});
  @override
  Widget build(BuildContext context) => Padding(
      padding: const EdgeInsets.fromLTRB(24, 18, 18, 10),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Aura',
              style: TextStyle(fontSize: 25, fontWeight: FontWeight.w300)),
          Text('PERFORMANCE',
              style: TextStyle(
                  color: Color(0x33ffffff), fontSize: 8, letterSpacing: 3))
        ]),
        IconButton(
            onPressed: () => FirebaseAuth.instance.signOut(),
            icon: const Icon(Icons.logout, color: muted))
      ]));
}

Widget page(Widget child) => SingleChildScrollView(
    padding: const EdgeInsets.fromLTRB(24, 8, 24, 30), child: child);
Widget panel(Widget child) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(18),
    decoration: BoxDecoration(
        color: const Color(0x0dffffff),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0x1affffff))),
    child: child);
Widget title(String value, String subtitle) =>
    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(value,
          style: const TextStyle(fontSize: 34, fontWeight: FontWeight.w300)),
      Text(subtitle.toUpperCase(),
          style: const TextStyle(color: muted, fontSize: 9, letterSpacing: 2))
    ]);

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final content = <Widget>[
      title('Today', 'Focus on the next small win.'),
      const SizedBox(height: 22),
      panel(const Text('Your daily performance',
          style: TextStyle(fontSize: 24, color: cobalt))),
      const SizedBox(height: 22),
      const Text("TODAY'S HABITS",
          style: TextStyle(color: muted, fontSize: 9, letterSpacing: 2)),
      const SizedBox(height: 8),
      panel(const Text('Open Habits to manage your daily checklist.',
          style: TextStyle(color: muted))),
      const SizedBox(height: 18),
      OutlinedButton.icon(
          onPressed: () => showFoodDialog(
              context,
              AuraRepository(
                  FirebaseAuth.instance, FirebaseFirestore.instance)),
          icon: const Icon(Icons.add, color: cobalt),
          label: const Text('QUICK LOG')),
    ];
    return page(Column(
        crossAxisAlignment: CrossAxisAlignment.start, children: content));
  }
}

class WorkoutsScreen extends StatelessWidget {
  const WorkoutsScreen({super.key});
  @override
  Widget build(BuildContext context) => StreamBuilder<List<Workout>>(
      stream: AuraRepository(FirebaseAuth.instance, FirebaseFirestore.instance)
          .workouts(),
      builder: (context, snapshot) {
        final workouts = snapshot.data ?? <Workout>[];
        final total =
            workouts.fold<double>(0, (sum, workout) => sum + workout.volume);
        return page(
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          title('Train', 'Build strength with intention.'),
          const SizedBox(height: 22),
          panel(Text('${total.toStringAsFixed(0)} kg total volume',
              style: const TextStyle(fontSize: 24, color: cobalt))),
          const SizedBox(height: 18),
          SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                  onPressed: () => showWorkoutDialog(
                      context,
                      AuraRepository(
                          FirebaseAuth.instance, FirebaseFirestore.instance)),
                  icon: const Icon(Icons.add),
                  label: const Text('LOG WORKOUT'))),
          const SizedBox(height: 22),
          const Text('RECENT SESSIONS',
              style: TextStyle(color: muted, fontSize: 9, letterSpacing: 2)),
          ...workouts.map((workout) => panel(ListTile(
              title: Text(workout.name),
              subtitle: Text('${workout.date} Â· ${workout.duration} mins'),
              trailing: Text('${workout.volume.toStringAsFixed(0)} kg'))))
        ]));
      });
}

class NutritionScreen extends StatelessWidget {
  const NutritionScreen({super.key});
  @override
  Widget build(BuildContext context) => StreamBuilder<List<FoodLog>>(
      stream: AuraRepository(FirebaseAuth.instance, FirebaseFirestore.instance)
          .foods(),
      builder: (context, snapshot) {
        final foods = (snapshot.data ?? <FoodLog>[])
            .where((food) => food.date == dateKey())
            .toList();
        final calories = foods.fold<int>(0, (sum, food) => sum + food.calories);
        return page(
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          title('Eat', 'Fuel the work you put in.'),
          const SizedBox(height: 22),
          panel(Text('$calories kcal today',
              style: const TextStyle(fontSize: 26, color: cobalt))),
          const SizedBox(height: 18),
          SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                  onPressed: () => showFoodDialog(
                      context,
                      AuraRepository(
                          FirebaseAuth.instance, FirebaseFirestore.instance)),
                  icon: const Icon(Icons.add, color: cobalt),
                  label: const Text('LOG MEAL'))),
          const SizedBox(height: 22),
          ...foods.map((food) => panel(ListTile(
              title: Text(food.name),
              subtitle: Text(food.time),
              trailing: Text('${food.calories} kcal'))))
        ]));
      });
}

class HabitsScreen extends StatelessWidget {
  const HabitsScreen({super.key});
  @override
  Widget build(BuildContext context) => StreamBuilder<List<Habit>>(
      stream: AuraRepository(FirebaseAuth.instance, FirebaseFirestore.instance)
          .habits(),
      builder: (context, snapshot) {
        final habits = snapshot.data ?? <Habit>[];
        final repo =
            AuraRepository(FirebaseAuth.instance, FirebaseFirestore.instance);
        final input = TextEditingController();
        return page(
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          title('Habits', 'Small actions, repeated daily.'),
          const SizedBox(height: 22),
          Row(children: [
            Expanded(
                child: TextField(
                    controller: input,
                    decoration: const InputDecoration(hintText: 'New habit'))),
            IconButton.filled(
                onPressed: () {
                  if (input.text.trim().isNotEmpty) {
                    repo.addHabit(input.text, habits.length);
                    input.clear();
                  }
                },
                icon: const Icon(Icons.add))
          ]),
          const SizedBox(height: 18),
          if (habits.isEmpty)
            panel(const Text('No habits yet.', style: TextStyle(color: muted)))
          else
            ...habits.map((habit) => panel(ListTile(
                title: Text(habit.name),
                trailing: IconButton(
                    onPressed: () => repo.removeHabit(habit.id),
                    icon: const Icon(Icons.delete_outline, color: muted)))))
        ]));
      });
}

Future<void> showFoodDialog(BuildContext context, AuraRepository repo) async {
  final name = TextEditingController();
  final calories = TextEditingController();
  await showDialog(
      context: context,
      builder: (_) => AlertDialog(
              title: const Text('Log food'),
              content: Column(mainAxisSize: MainAxisSize.min, children: [
                TextField(
                    controller: name,
                    decoration: const InputDecoration(hintText: 'Food name')),
                TextField(
                    controller: calories,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(hintText: 'Calories'))
              ]),
              actions: [
                TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('CANCEL')),
                FilledButton(
                    onPressed: () {
                      final value = int.tryParse(calories.text);
                      if (name.text.trim().isNotEmpty &&
                          value != null &&
                          value > 0) {
                        repo.addFood(name: name.text, calories: value);
                        Navigator.pop(context);
                      }
                    },
                    child: const Text('ADD'))
              ]));
}

Future<void> showWorkoutDialog(
    BuildContext context, AuraRepository repo) async {
  final name = TextEditingController();
  final duration = TextEditingController();
  final exercise = TextEditingController();
  await showDialog(
      context: context,
      builder: (_) => AlertDialog(
              title: const Text('Log workout'),
              content: Column(mainAxisSize: MainAxisSize.min, children: [
                TextField(
                    controller: name,
                    decoration:
                        const InputDecoration(hintText: 'Workout name')),
                TextField(
                    controller: duration,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(hintText: 'Duration')),
                TextField(
                    controller: exercise,
                    decoration: const InputDecoration(hintText: 'Exercise'))
              ]),
              actions: [
                TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('CANCEL')),
                FilledButton(
                    onPressed: () {
                      if (name.text.trim().isNotEmpty &&
                          exercise.text.trim().isNotEmpty) {
                        repo.addWorkout(
                            name.text, int.tryParse(duration.text) ?? 0, [
                          Exercise(
                              id: DateTime.now()
                                  .millisecondsSinceEpoch
                                  .toString(),
                              name: exercise.text,
                              sets: 1,
                              reps: 1,
                              weight: 0)
                        ]);
                        Navigator.pop(context);
                      }
                    },
                    child: const Text('SAVE'))
              ]));
}
