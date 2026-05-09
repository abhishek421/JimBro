import { UserProfile, UserContext } from "../types";
import { Flame, Trophy, Activity, User } from "lucide-react";

interface ProfileProps {
  profile: UserProfile;
  context: UserContext;
}

export default function Profile({ profile, context }: ProfileProps) {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center gap-4 bg-white neo-border neo-shadow p-4">
        <div className="w-16 h-16 bg-neo-yellow neo-border rounded-full flex items-center justify-center">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase">JimBro User</h2>
          <p className="font-bold text-gray-600">
            Level {Math.floor(profile.points / 100) + 1}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neo-orange neo-border neo-shadow p-4 flex flex-col items-center justify-center text-center transform -rotate-2">
          <Flame size={32} className="mb-2" />
          <span className="text-3xl font-black">{profile.streak}</span>
          <span className="font-bold uppercase text-xs">Day Streak</span>
        </div>

        <div className="bg-neo-green neo-border neo-shadow p-4 flex flex-col items-center justify-center text-center transform rotate-2">
          <Trophy size={32} className="mb-2" />
          <span className="text-3xl font-black">{profile.points}</span>
          <span className="font-bold uppercase text-xs">Points</span>
        </div>

        <div className="bg-neo-cyan neo-border neo-shadow p-4 flex flex-col items-center justify-center text-center col-span-2">
          <Activity size={32} className="mb-2" />
          <span className="text-3xl font-black">{profile.totalWorkouts}</span>
          <span className="font-bold uppercase text-xs">Total Workouts</span>
        </div>
      </div>

      <div className="neo-card p-4 mt-8">
        <h3 className="font-black uppercase text-lg border-b-2 border-neo-black pb-2 mb-4">
          Your Stats
        </h3>
        <ul className="space-y-3">
          <li className="flex justify-between font-bold">
            <span>Location</span>
            <span className="uppercase bg-neo-yellow px-2 border-2 border-neo-black">
              {context.location}
            </span>
          </li>
          <li className="flex justify-between font-bold">
            <span>Weight</span>
            <span>{context.weight} kg</span>
          </li>
          <li className="flex justify-between font-bold">
            <span>Height</span>
            <span>{context.height} cm</span>
          </li>
          <li className="flex justify-between font-bold">
            <span>Gender</span>
            <span className="capitalize">{context.gender}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
