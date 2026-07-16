import { useState } from "react";
import { NavigateFn } from "../../types";
import { ArrowLeft, Eye, EyeOff, Phone, Mail } from "lucide-react";

export function LoginScreen({ navigate }: { navigate: NavigateFn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [otpMode, setOtpMode] = useState(false);

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="px-5 pt-4 pb-6" style={{ background: "linear-gradient(135deg, #1D4ED8, #1E40AF)" }}>
        <button onClick={() => navigate("landing")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-6">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white" style={{ fontSize: 26, fontWeight: 800 }}>Welcome Back!</h1>
        <p className="text-blue-100 text-sm mt-1">Sign in to your vendor account</p>
      </div>

      {/* Form card */}
      <div className="mx-4 -mt-4 bg-white rounded-3xl shadow-xl px-6 py-7">
        {/* Toggle */}
        <div className="flex bg-blue-50 rounded-xl p-1 mb-6">
          <button
            onClick={() => setOtpMode(false)}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: !otpMode ? "#1D4ED8" : "transparent", color: !otpMode ? "#fff" : "#64748B" }}
          >
            Password Login
          </button>
          <button
            onClick={() => setOtpMode(true)}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: otpMode ? "#1D4ED8" : "transparent", color: otpMode ? "#fff" : "#64748B" }}
          >
            OTP Login
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Mobile Number / Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                className="w-full pl-10 pr-4 py-3 bg-input-background rounded-xl text-sm outline-none border border-border focus:border-primary"
                placeholder="Enter mobile or email"
                defaultValue="rajesh.patil@gmail.com"
              />
            </div>
          </div>

          {!otpMode && (
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-4 pr-10 py-3 bg-input-background rounded-xl text-sm outline-none border border-border focus:border-primary"
                  placeholder="Enter password"
                  defaultValue="••••••••"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
              <button className="text-primary text-xs font-semibold mt-2 ml-auto block">Forgot Password?</button>
            </div>
          )}

          {otpMode && (
            <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <p className="text-sm text-foreground">We'll send a 6-digit OTP to your registered mobile number</p>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("dashboard")}
          className="w-full mt-6 py-4 rounded-2xl text-white font-bold text-base shadow-lg transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #1D4ED8, #1E40AF)" }}
        >
          {otpMode ? "Send OTP" : "Login"}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-xs">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          New vendor?{" "}
          <button onClick={() => navigate("register")} className="text-primary font-bold">Register here</button>
        </p>
      </div>
    </div>
  );
}
