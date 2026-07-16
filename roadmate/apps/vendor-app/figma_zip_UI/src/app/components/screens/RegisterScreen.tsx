import { NavigateFn } from "../../types";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";

const STEPS = ["Register", "OTP", "Profile", "Docs", "Verify", "Finish"];
const CATEGORIES = ["Car Wash", "Garage", "Denting & Painting", "Service Center", "PUC", "Showroom", "Towing"];

export function RegisterScreen({ navigate }: { navigate: NavigateFn }) {
  const [selectedCategory, setSelectedCategory] = useState("Garage");

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="px-5 pt-4 pb-5" style={{ background: "linear-gradient(135deg, #1D4ED8, #1E40AF)" }}>
        <button onClick={() => navigate("landing")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-4">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white" style={{ fontSize: 22, fontWeight: 800 }}>Vendor Registration</h1>
        <p className="text-blue-100 text-xs mt-1">Join 2,400+ vendors on MoveMate</p>
      </div>

      {/* Step indicator */}
      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: i === 0 ? "#1D4ED8" : i < 1 ? "#22C55E" : "#E2E8F0",
                    color: i <= 0 ? "#fff" : "#94A3B8"
                  }}
                >
                  {i + 1}
                </div>
                <span className="text-[9px] mt-1 font-semibold" style={{ color: i === 0 ? "#1D4ED8" : "#94A3B8" }}>{step}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-4 h-0.5 mx-0.5 mb-4" style={{ background: i < 0 ? "#1D4ED8" : "#E2E8F0" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="mx-4 mt-4 bg-white rounded-3xl shadow-lg px-6 py-7 space-y-4 mb-6">
        {[
          { label: "Owner Name", placeholder: "e.g. Rajesh Patil", value: "Rajesh Patil" },
          { label: "Mobile Number", placeholder: "e.g. 9876543210", value: "9876543210" },
          { label: "Email Address", placeholder: "e.g. rajesh@gmail.com", value: "rajesh.patil@gmail.com" },
        ].map(({ label, placeholder, value }) => (
          <div key={label}>
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{label}</label>
            <input
              className="w-full mt-1 px-4 py-3 bg-input-background rounded-xl text-sm outline-none border border-border focus:border-primary"
              placeholder={placeholder}
              defaultValue={value}
            />
          </div>
        ))}

        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Business Category</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all"
                style={{
                  borderColor: selectedCategory === cat ? "#1D4ED8" : "#E2E8F0",
                  background: selectedCategory === cat ? "#EFF6FF" : "#F8FAFC",
                  color: selectedCategory === cat ? "#1D4ED8" : "#64748B"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate("otp")}
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg mt-2 transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #1D4ED8, #1E40AF)" }}
        >
          Continue →
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already a vendor?{" "}
          <button onClick={() => navigate("login")} className="text-primary font-bold">Login</button>
        </p>
      </div>
    </div>
  );
}
