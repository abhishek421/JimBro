import { useState, useEffect } from "react";
import { WorkoutDay, Exercise } from "../types";
import { Play, Square, Check, Flame, ChevronLeft } from "lucide-react";

interface TrackerProps {
  plan: WorkoutDay[];
  onWorkoutComplete: (points: number) => void;
}

export default function Tracker({ plan, onWorkoutComplete }: TrackerProps) {
  // Get today's workout
  const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayWorkout = plan.find((d) => d.dayOfWeek === todayStr) || plan[0]; // fallback to first day if not found

  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [workoutFinished, setWorkoutFinished] = useState(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Sets state
  const [currentSet, setCurrentSet] = useState(1);

  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      // Timer finished
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const startExercise = (ex: Exercise) => {
    setActiveExercise(ex);
    setCurrentSet(1);
    if (ex.duration) {
      setTimeLeft(ex.duration);
      setTimerActive(false);
    }
  };

  const completeSet = () => {
    if (!activeExercise) return;

    if (currentSet < activeExercise.sets) {
      setCurrentSet((s) => s + 1);
      // Optional: start rest timer here
    } else {
      finishExercise();
    }
  };

  const finishExercise = () => {
    if (!activeExercise) return;
    setCompletedExercises((prev) => [...prev, activeExercise.id]);
    setActiveExercise(null);
    setTimerActive(false);

    // Check if all exercises are done
    if (completedExercises.length + 1 === todayWorkout.exercises.length) {
      setWorkoutFinished(true);
      // Calculate points (simple logic: 10 points per exercise)
      onWorkoutComplete(todayWorkout.exercises.length * 10);
    }
  };

  const toggleTimer = () => setTimerActive(!timerActive);

  if (workoutFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in zoom-in">
        <div className="w-32 h-32 bg-neo-yellow neo-border neo-shadow rounded-full flex items-center justify-center">
          <Flame size={64} className="text-neo-orange" />
        </div>
        <h2 className="text-4xl font-black uppercase text-center">
          Workout
          <br />
          Complete!
        </h2>
        <p className="font-bold text-xl bg-white neo-border px-4 py-2">
          +{todayWorkout.exercises.length * 10} Points Earned
        </p>
      </div>
    );
  }

  if (activeExercise) {
    return (
      <div className="flex flex-col h-full animate-in slide-in-from-right">
        <button
          onClick={() => setActiveExercise(null)}
          className="flex items-center gap-2 font-bold uppercase mb-6 bg-white neo-border px-3 py-2 self-start hover:bg-neo-bg"
        >
          <ChevronLeft size={20} /> Back
        </button>

        <div className="neo-card p-6 flex-1 flex flex-col">
          <h2 className="text-3xl font-black uppercase mb-2">
            {activeExercise.name}
          </h2>
          <p className="font-bold text-gray-600 mb-8">{activeExercise.notes}</p>

          <div className="flex-1 flex flex-col items-center justify-center">
            {activeExercise.duration ? (
              <div className="text-center">
                <div className="text-7xl font-black font-mono mb-8">
                  {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")}
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={toggleTimer}
                    className={`w-16 h-16 rounded-full neo-border neo-shadow flex items-center justify-center ${timerActive ? "bg-neo-pink" : "bg-neo-green"}`}
                  >
                    {timerActive ? (
                      <Square size={24} fill="currentColor" />
                    ) : (
                      <Play size={24} fill="currentColor" className="ml-1" />
                    )}
                  </button>
                </div>
                {timeLeft === 0 && !timerActive && (
                  <button
                    onClick={finishExercise}
                    className="neo-btn w-full mt-8"
                  >
                    Complete Exercise
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full text-center">
                <div className="text-2xl font-bold uppercase mb-2">
                  Set {currentSet} of {activeExercise.sets}
                </div>
                <div className="text-5xl font-black mb-8">
                  {activeExercise.reps} Reps
                </div>

                <button
                  onClick={completeSet}
                  className="w-32 h-32 rounded-full bg-neo-yellow neo-border neo-shadow flex items-center justify-center mx-auto hover:bg-neo-green transition-colors"
                >
                  <Check size={48} strokeWidth={4} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-neo-cyan neo-border neo-shadow p-4 mb-6 transform rotate-1">
        <h2 className="text-2xl font-black uppercase">
          Today: {todayWorkout.dayOfWeek}
        </h2>
        <p className="font-bold mt-1 bg-white inline-block px-2 border-2 border-neo-black">
          {todayWorkout.focus}
        </p>
      </div>

      {todayWorkout.exercises.length === 0 ? (
        <div className="neo-card p-8 text-center">
          <h3 className="text-2xl font-black uppercase mb-2">Rest Day</h3>
          <p className="font-medium">
            Take it easy, JimBro. Your muscles need time to recover.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {todayWorkout.exercises.map((ex, i) => {
            const isCompleted = completedExercises.includes(ex.id);
            return (
              <div
                key={i}
                className={`neo-card p-4 flex items-center justify-between cursor-pointer transition-transform hover:-translate-y-1 ${isCompleted ? "bg-neo-bg opacity-70" : "bg-white"}`}
                onClick={() => !isCompleted && startExercise(ex)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full neo-border flex items-center justify-center ${isCompleted ? "bg-neo-green" : "bg-neo-yellow"}`}
                  >
                    {isCompleted ? (
                      <Check size={16} strokeWidth={4} />
                    ) : (
                      <span className="font-bold">{i + 1}</span>
                    )}
                  </div>
                  <div>
                    <h3
                      className={`font-bold text-lg ${isCompleted ? "line-through" : ""}`}
                    >
                      {ex.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-600">
                      {ex.duration
                        ? `${ex.duration}s`
                        : `${ex.sets} sets × ${ex.reps}`}
                    </p>
                  </div>
                </div>
                {!isCompleted && <Play size={24} className="text-neo-black" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
