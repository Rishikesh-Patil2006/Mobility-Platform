import { NavigateFn } from "../../types";
import { Clock, FileSearch, RefreshCw } from "lucide-react";

export function AdminVerificationScreen({ navigate }: { navigate: NavigateFn }) {
  return (
    <div className="min-h-full bg-background flex flex-col items-center justify-center px-6 py-12">
      {/* Animated icon */}
      <div className="w-28 h-28 rounded-full bg-amber-50 border-4 border-amber-200 flex items-center justify-center mb-6">
        <Clock className="w-14 h-14 text-amber-500" />
      </div>

      <h1 className="text-foreground text-center mb-3" style={{ fontSize: 24, fontWeight: 800 }}>Under Review</h1>
      <p className="text-muted-foreground text-center text-sm leading-relaxed mb-8 max-w-xs">
        Your application is under review. Our team is verifying your business documents and profile details. This usually takes 24–48 hours.
      </p>

      {/* Status steps */}
      <div className="w-full bg-white rounded-3xl shadow-lg px-6 py-5 mb-8 space-y-4">
        {[
          { label: "Application Submitted", done: true, icon: "✓" },
          { label: "Documents Under Review", done: true, icon: "🔍" },
          { label: "Admin Verification", done: false, icon: "⏳" },
          { label: "Account Activation", done: false, icon: "🎉" },
        ].map(({ label, done, icon }) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: done ? "#EFF6FF" : "#F1F5F9", border: done ? "2px solid #1D4ED8" : "2px solid #E2E8F0" }}
            >
              {icon}
            </div>
            <span className="text-sm font-semibold" style={{ color: done ? "#0F172A" : "#94A3B8" }}>{label}</span>
            {done && <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>}
          </div>
        ))}
      </div>

      {/* Reference */}
      <div className="w-full bg-blue-50 rounded-2xl px-5 py-4 mb-6">
        <p className="text-xs text-muted-foreground">Application Reference</p>
        <p className="text-primary font-bold">MM-VND-2024-JLG-4821</p>
      </div>

      <button
        onClick={() => navigate("account-approved")}
        className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
        style={{ background: "linear-gradient(135deg, #1D4ED8, #1E40AF)" }}
      >
        <RefreshCw className="w-4 h-4" /> Check Status
      </button>

      <p className="text-muted-foreground text-xs mt-4 text-center">We'll notify you via SMS & email when approved</p>
    </div>
  );
}
