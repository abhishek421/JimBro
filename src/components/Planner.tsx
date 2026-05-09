import { WorkoutDay } from "../types";
import { Dumbbell, Clock } from "lucide-react";

interface PlannerProps {
  plan: WorkoutDay[];
}

export default function Planner({ plan }: PlannerProps) {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-neo-pink neo-border neo-shadow p-4 mb-6 transform -rotate-1">
        <h2 className="text-2xl font-black uppercase">Your Weekly Plan</h2>
        <p className="font-medium mt-1">Crafted by your AI JimBro</p>
      </div>

      <div className="space-y-4">
        {plan.map((day, index) => (
          <div key={index} className="neo-card p-0 overflow-hidden">
            <div className="bg-neo-black text-white p-3 flex justify-between items-center">
              <h3 className="font-bold uppercase text-lg">{day.dayOfWeek}</h3>
              <span className="bg-neo-yellow text-neo-black text-xs font-bold px-2 py-1 uppercase neo-border border-2">
                {day.focus}
              </span>
            </div>

            <div className="p-4 space-y-3">
              {day.exercises.length > 0 ? (
                day.exercises.map((ex, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b-2 border-neo-black pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-bold">{ex.name}</p>
                      {ex.notes && (
                        <p className="text-xs text-gray-600 italic">
                          {ex.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex flex-col items-end">
                      {ex.duration ? (
                        <span className="bg-neo-cyan neo-border border-2 px-2 py-1 text-xs font-bold flex items-center gap-1">
                          <Clock size={12} /> {ex.duration}s
                        </span>
                      ) : (
                        <span className="bg-neo-green neo-border border-2 px-2 py-1 text-xs font-bold flex items-center gap-1">
                          <Dumbbell size={12} /> {ex.sets}x{ex.reps}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center font-bold text-gray-500 italic py-4">
                  Rest Day
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
