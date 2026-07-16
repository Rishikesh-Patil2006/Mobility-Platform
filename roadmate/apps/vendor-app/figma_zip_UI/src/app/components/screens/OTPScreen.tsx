import { useState, useRef } from "react";
import { NavigateFn } from "../../types";
import { ArrowLeft, MessageSquare } from "lucide-react";

export function OTPScreen({ navigate }: { navigate: NavigateFn }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) inputs.current[idx - 1]?.focus();
  };

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-4 pb-6" style={{ background: "linear-gradient(135deg, #1D4ED8, #1E40AF)" }}>
        <button onClick={() => navigate("register")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-6">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white" style={{ fontSize: 24, fontWeight: 800 }}>OTP Verification</h1>
        <p className="text-blue-100 text-sm mt-1">Step 2 of 6</p>
      </div>

      <div className="mx-4 -mt-4 bg-white rounded-3xl shadow-xl px-6 py-8">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h2 className="text-center text-foreground mb-2" style={{ fontSize: 18, fontWeight: 700 }}>Enter OTP</h2>
        <p className="text-center text-muted-foreground text-sm mb-8">
          We sent a 6-digit code to{" "}
          <span className="text-foreground font-semibold">+91 98765 43210</span>
        </p>

        {/* OTP boxes */}
        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKey(e, i)}
              className="w-11 h-13 rounded-xl border-2 text-center text-xl font-bold outline-none transition-all"
              style={{
                borderColor: digit ? "#1D4ED8" : "#E2E8F0",
                background: digit ? "#EFF6FF" : "#F8FAFC",
                color: "#0F172A",
                height: 52
              }}
            />
          ))}
        </div>

        <div className="flex justify-center mb-6">
          <span className="text-muted-foreground text-sm">Didn't receive? </span>
          <button className="text-primary font-bold text-sm ml-1">Resend OTP</button>
        </div>

        <div className="text-center text-xs text-muted-foreground mb-6">
          Resend available in <span className="text-primary font-semibold">00:45</span>
        </div>

        <button
          onClick={() => navigate("business-profile")}
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #1D4ED8, #1E40AF)" }}
        >
          Verify & Continue →
        </button>
      </div>
    </div>
  );
}
