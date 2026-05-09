import { useState, useEffect } from "react";
import { AppState, UserContext, WorkoutDay } from "./types";
import Onboarding from "./components/Onboarding";
import Planner from "./components/Planner";
import Tracker from "./components/Tracker";
import Profile from "./components/Profile";
import { Activity, Calendar, User } from "lucide-react";

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem("jimbro_state");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      userContext: null,
      workoutPlan: null,
      profile: {
        streak: 0,
        points: 0,
        totalWorkouts: 0,
      },
    };
  });

  const [currentTab, setCurrentTab] = useState<
    "planner" | "tracker" | "profile"
  >("planner");

  useEffect(() => {
    localStorage.setItem("jimbro_state", JSON.stringify(state));
  }, [state]);

  const handleOnboardingComplete = (
    context: UserContext,
    plan: WorkoutDay[],
  ) => {
    setState((prev) => ({
      ...prev,
      userContext: context,
      workoutPlan: plan,
    }));
    setCurrentTab("tracker");
  };

  const handleWorkoutComplete = (pointsEarned: number) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        streak: prev.profile.streak + 1,
        points: prev.profile.points + pointsEarned,
        totalWorkouts: prev.profile.totalWorkouts + 1,
      },
    }));
  };

  if (!state.userContext || !state.workoutPlan) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-neo-bg border-l-4 border-r-4 border-neo-black relative">
      <header className="bg-neo-yellow border-b-4 border-neo-black p-4 sticky top-0 z-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          JIMBRO
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {currentTab === "planner" && <Planner plan={state.workoutPlan} />}
        {currentTab === "tracker" && (
          <Tracker
            plan={state.workoutPlan}
            onWorkoutComplete={handleWorkoutComplete}
          />
        )}
        {currentTab === "profile" && (
          <Profile profile={state.profile} context={state.userContext} />
        )}
      </main>

      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t-4 border-neo-black flex justify-around p-2 z-10">
        <button
          onClick={() => setCurrentTab("planner")}
          className={`flex flex-col items-center p-2 flex-1 ${currentTab === "planner" ? "bg-neo-cyan neo-border neo-shadow-sm translate-x-[-2px] translate-y-[-2px]" : ""}`}
        >
          <Calendar className="w-6 h-6 mb-1" />
          <span className="text-xs font-bold uppercase">Plan</span>
        </button>
        <button
          onClick={() => setCurrentTab("tracker")}
          className={`flex flex-col items-center p-2 flex-1 mx-2 ${currentTab === "tracker" ? "bg-neo-green neo-border neo-shadow-sm translate-x-[-2px] translate-y-[-2px]" : ""}`}
        >
          <Activity className="w-6 h-6 mb-1" />
          <span className="text-xs font-bold uppercase">Track</span>
        </button>
        <button
          onClick={() => setCurrentTab("profile")}
          className={`flex flex-col items-center p-2 flex-1 ${currentTab === "profile" ? "bg-neo-pink neo-border neo-shadow-sm translate-x-[-2px] translate-y-[-2px]" : ""}`}
        >
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs font-bold uppercase">Profile</span>
        </button>
      </nav>
    </div>
  );
}
