import { NavigateFn } from "../../types";
import { CheckCircle, Star } from "lucide-react";

export function AccountApprovedScreen({ navigate }: { navigate: NavigateFn }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-10" style={{ background: "linear-gradient(160deg, #1D4ED8 0%, #1E40AF 60%, #1E3A8A 100%)" }}>
      {/* Confetti-like dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["top-20 left-10", "top-32 right-12", "top-48 left-6", "top-16 right-6"].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-2 h-2 rounded-full opacity-40`} style={{ background: ["#FBBF24", "#34D399", "#F87171", "#A78BFA"][i] }} />
        ))}
      </div>

      {/* Badge */}
      <div className="relative mb-6">
        <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
        {/* Stars */}
        {["-top-2 -right-2", "-bottom-2 -left-2", "-top-2 -left-4"].map((pos, i) => (
          <Star key={i} className={`absolute ${pos} w-5 h-5 text-yellow-400 fill-yellow-400`} />
        ))}
      </div>

      <h1 className="text-white text-center mb-2" style={{ fontSize: 28, fontWeight: 800 }}>Congratulations!</h1>
      <p className="text-blue-100 text-center text-sm mb-8">Your vendor account has been approved successfully</p>

      {/* Account card */}
      <div className="w-full bg-white rounded-3xl shadow-2xl px-6 py-6 mb-8">
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white text-xl font-black">
            RP
          </div>
          <div>
            <p className="font-bold text-foreground">Patil Auto Garage</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">✓ Verified</span>
            </div>
          </div>
        </div>

        {[
          ["Account ID", "MM-VND-2024-JLG-4821"],
          ["Owner", "Rajesh Patil"],
          ["Category", "Garage / Service Center"],
          ["Location", "Jalgaon, Maharashtra"],
          ["Registered On", "13 Jun 2024"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between items-center py-2">
            <span className="text-muted-foreground text-sm">{k}</span>
            <span className="text-foreground text-sm font-semibold">{v}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("dashboard")}
        className="w-full py-4 rounded-2xl font-bold text-base shadow-lg transition-all active:scale-95"
        style={{ background: "#FFFFFF", color: "#1D4ED8" }}
      >
        Go to Dashboard →
      </button>
    </div>
  );
}
