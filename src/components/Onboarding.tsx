import { useState } from "react";
import { UserContext, WorkoutDay } from "../types";
import { generateWorkoutPlan, generateEquipmentDoodle } from "../services/geminiService";
import { Dumbbell, Home, Search, Plus, X, Loader2, Image as ImageIcon } from "lucide-react";

interface OnboardingProps {
  onComplete: (context: UserContext, plan: WorkoutDay[]) => void;
}

const COMMON_GYM_MACHINES = [
  "Treadmill", "Stair Climber", "Elliptical", "Rowing Machine", "Stationary Bike", "Spin Bike", "SkiErg",
  "Cable Crossover", "Functional Trainer", "Smith Machine", "Power Rack", "Half Rack",
  "Leg Press", "Hack Squat", "Leg Extension", "Seated Leg Curl", "Lying Leg Curl", "Standing Calf Raise", "Seated Calf Raise",
  "Lat Pulldown", "Seated Cable Row", "T-Bar Row", "Pec Deck / Fly Machine", "Chest Press Machine", "Incline Chest Press",
  "Shoulder Press Machine", "Lateral Raise Machine", "Assisted Pull-up/Dip", "Preacher Curl Machine", "Tricep Extension Machine", "Tricep Pushdown Cable",
  "Ab Crunch Machine", "Back Extension", "Glute Ham Developer (GHD)", "Hip Thrust Machine", "Hip Abductor/Adductor",
  "Flat Bench", "Incline Bench", "Decline Bench", "Dumbbells", "Barbells", "EZ Curl Bar", "Kettlebells", "Medicine Balls", "Slam Balls", "Plyo Boxes", "Battle Ropes"
];
const COMMON_HOME_EQUIPMENT = [
  "Yoga Mat", "Resistance Bands (Loop)", "Resistance Bands (Tube)", "Adjustable Dumbbells", "Light Dumbbells", "Kettlebell",
  "Pull-up Bar (Doorway)", "Jump Rope", "Ab Roller", "Stability Ball", "BOSU Ball", "Foam Roller",
  "Flat Bench", "Adjustable Bench", "Suspension Trainer (TRX)", "Push-up Bars", "Parallettes", "Ankle Weights",
  "Treadmill", "Stationary Bike", "Rowing Machine", "Sandbag", "Slide Board", "None (Bodyweight)"
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<UserContext>({
    location: "gym",
    equipment: [],
    weight: "",
    height: "",
    gender: "male",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Doodle Modal State
  const [identifyingItem, setIdentifyingItem] = useState<string | null>(null);
  const [doodleUrl, setDoodleUrl] = useState<string | null>(null);
  const [isGeneratingDoodle, setIsGeneratingDoodle] = useState(false);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const toggleEquipment = (item: string) => {
    setContext((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter((i) => i !== item)
        : [...prev.equipment, item],
    }));
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const plan = await generateWorkoutPlan(context);
      onComplete(context, plan.days);
    } catch (error) {
      console.error(error);
      alert("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleIdentify = async (item: string) => {
    setIdentifyingItem(item);
    setDoodleUrl(null);
    setIsGeneratingDoodle(true);
    try {
      const url = await generateEquipmentDoodle(item);
      setDoodleUrl(url);
    } catch (error) {
      console.error(error);
      alert("Failed to generate image.");
      setIdentifyingItem(null);
    } finally {
      setIsGeneratingDoodle(false);
    }
  };

  const closeIdentify = () => {
    setIdentifyingItem(null);
    setDoodleUrl(null);
  };

  const equipmentList =
    context.location === "gym" ? COMMON_GYM_MACHINES : COMMON_HOME_EQUIPMENT;
  const filteredEquipment = equipmentList.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-neo-bg border-l-4 border-r-4 border-neo-black p-6">
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-4xl font-black uppercase mb-8 text-center bg-neo-yellow neo-border neo-shadow inline-block py-2 px-4 mx-auto transform -rotate-2">
          JIMBRO
        </h1>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold uppercase">
              Where do you workout?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setContext({ ...context, location: "gym", equipment: [] });
                  handleNext();
                }}
                className="neo-card p-6 flex flex-col items-center justify-center gap-4 hover:bg-neo-cyan transition-colors"
              >
                <Dumbbell size={48} />
                <span className="font-bold uppercase">Gym</span>
              </button>
              <button
                onClick={() => {
                  setContext({ ...context, location: "home", equipment: [] });
                  handleNext();
                }}
                className="neo-card p-6 flex flex-col items-center justify-center gap-4 hover:bg-neo-pink transition-colors"
              >
                <Home size={48} />
                <span className="font-bold uppercase">Home / Other</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 flex-1 flex flex-col">
            <h2 className="text-2xl font-bold uppercase">
              What equipment do you have?
            </h2>

            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Search equipment..."
                className="neo-input w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto min-h-[200px] border-2 border-neo-black bg-white p-2">
              {filteredEquipment.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-2 border-b-2 border-neo-black last:border-b-0"
                >
                  <span className="font-medium">{item}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleIdentify(item)}
                      className="p-1 neo-border bg-neo-cyan hover:bg-neo-pink transition-colors"
                      title="Identify Machine"
                    >
                      <ImageIcon size={16} />
                    </button>
                    <button
                      onClick={() => toggleEquipment(item)}
                      className={`p-1 neo-border ${context.equipment.includes(item) ? "bg-neo-green" : "bg-neo-bg"}`}
                    >
                      {context.equipment.includes(item) ? (
                        <X size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {context.equipment.map((item) => (
                <span
                  key={item}
                  className="bg-neo-yellow neo-border px-2 py-1 text-xs font-bold flex items-center gap-1"
                >
                  {item}
                  <X
                    size={12}
                    className="cursor-pointer"
                    onClick={() => toggleEquipment(item)}
                  />
                </span>
              ))}
            </div>

            <div className="flex gap-4 mt-auto pt-4">
              <button onClick={handleBack} className="neo-btn bg-white flex-1">
                Back
              </button>
              <button onClick={handleNext} className="neo-btn flex-1">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold uppercase">About You</h2>

            <div className="space-y-4">
              <div>
                <label className="block font-bold uppercase mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  className="neo-input w-full"
                  value={context.weight}
                  onChange={(e) =>
                    setContext({ ...context, weight: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  className="neo-input w-full"
                  value={context.height}
                  onChange={(e) =>
                    setContext({ ...context, height: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Gender</label>
                <select
                  className="neo-input w-full appearance-none"
                  value={context.gender}
                  onChange={(e) =>
                    setContext({ ...context, gender: e.target.value })
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleBack}
                className="neo-btn bg-white flex-1"
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={handleGeneratePlan}
                className="neo-btn flex-1 flex justify-center items-center gap-2"
                disabled={loading || !context.weight || !context.height}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Generate Plan"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Doodle Modal */}
      {identifyingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white neo-border neo-shadow-lg p-6 max-w-sm w-full flex flex-col items-center relative">
            <button onClick={closeIdentify} className="absolute top-2 right-2 p-1 hover:bg-neo-pink neo-border">
              <X size={20} />
            </button>
            <h3 className="text-xl font-black uppercase mb-4 text-center">{identifyingItem}</h3>
            
            {isGeneratingDoodle ? (
              <div className="w-full aspect-square bg-neo-bg neo-border flex flex-col items-center justify-center p-4 text-center">
                <Loader2 size={48} className="animate-spin mb-4" />
                <p className="font-bold uppercase text-sm">Drawing doodle...</p>
              </div>
            ) : doodleUrl ? (
              <img src={doodleUrl} alt={identifyingItem} className="w-full aspect-square object-contain bg-white neo-border mb-4" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full aspect-square bg-neo-bg neo-border flex items-center justify-center p-4 text-center">
                <p className="font-bold uppercase text-sm text-red-500">Failed to load image</p>
              </div>
            )}
            
            <button 
              onClick={() => {
                if (!context.equipment.includes(identifyingItem)) {
                  toggleEquipment(identifyingItem);
                }
                closeIdentify();
              }} 
              className="neo-btn w-full mt-4"
            >
              {context.equipment.includes(identifyingItem) ? 'Added to List' : 'Add to Equipment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
