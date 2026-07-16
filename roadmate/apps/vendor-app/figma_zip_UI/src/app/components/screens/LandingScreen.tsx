import { NavigateFn } from "../../types";
import { Truck, Star } from "lucide-react";

export function LandingScreen({ navigate }: { navigate: NavigateFn }) {
  return (
    <div className="min-h-full flex flex-col" style={{ background: "linear-gradient(160deg, #1D4ED8 0%, #1E40AF 40%, #1E3A8A 100%)" }}>
      {/* Top decorative circles */}
      <div className="absolute top-[-60px] right-[-40px] w-48 h-48 rounded-full opacity-10 bg-white" />
      <div className="absolute top-20 right-8 w-24 h-24 rounded-full opacity-10 bg-white" />

      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-8 relative">
        {/* Logo */}
        <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center shadow-2xl mb-6">
          <Truck className="w-12 h-12 text-blue-700" />
        </div>

        {/* App name */}
        <h1 className="text-white text-center mb-1" style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>
          MoveMate
        </h1>
        <div className="bg-white/20 rounded-full px-4 py-1 mb-6">
          <span className="text-white/90 text-sm font-semibold tracking-widest uppercase">Vendor</span>
        </div>

        <p className="text-blue-100 text-center text-base leading-relaxed mb-10 max-w-xs">
          Grow your mobility business with us. Reach more customers in Jalgaon and beyond.
        </p>

        {/* Stats row */}
        <div className="flex gap-8 mb-12">
          {[["2,400+", "Vendors"], ["18K+", "Customers"], ["4.8★", "Rating"]].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="text-white font-bold" style={{ fontSize: 18 }}>{val}</div>
              <div className="text-blue-200 text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="px-6 pb-10 space-y-3">
        <button
          onClick={() => navigate("login")}
          className="w-full bg-white py-4 rounded-2xl shadow-lg transition-all active:scale-95"
          style={{ color: "#1D4ED8", fontSize: 16, fontWeight: 700 }}
        >
          Login
        </button>
        <button
          onClick={() => navigate("register")}
          className="w-full border-2 border-white/50 py-4 rounded-2xl transition-all active:scale-95"
          style={{ color: "#ffffff", fontSize: 16, fontWeight: 700, background: "rgba(255,255,255,0.1)" }}
        >
          Register as Vendor
        </button>
        <p className="text-blue-200 text-xs text-center pt-1">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
