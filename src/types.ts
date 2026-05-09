export interface UserContext {
  location: "gym" | "home" | "other";
  otherLocation?: string;
  equipment: string[];
  weight: string;
  height: string;
  gender: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  duration?: number;
  notes?: string;
  completedSets?: number;
}

export interface WorkoutDay {
  dayOfWeek: string;
  focus: string;
  exercises: Exercise[];
}

export interface UserProfile {
  streak: number;
  points: number;
  totalWorkouts: number;
}

export interface AppState {
  userContext: UserContext | null;
  workoutPlan: WorkoutDay[] | null;
  profile: UserProfile;
}
