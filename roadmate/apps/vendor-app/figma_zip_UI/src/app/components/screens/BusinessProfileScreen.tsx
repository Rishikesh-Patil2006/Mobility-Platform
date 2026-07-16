import { NavigateFn } from "../../types";
import { ArrowLeft, Camera, MapPin } from "lucide-react";

const SERVICES = ["Car Repair", "Oil Change", "Engine Repair", "Battery", "Tyre Service", "Wheel Alignment"];

export function BusinessProfileScreen({ navigate }: { navigate: NavigateFn }) {
  return (
    <div className="min-h-full bg-background pb-8">
      <div className="px-5 pt-4 pb-5" style={{ background: "linear-gradient(135deg, #1D4ED8, #1E40AF)" }}>
        <button onClick={() => navigate("otp")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-4">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white" style={{ fontSize: 20, fontWeight: 800 }}>Complete Business Profile</h1>
        <p className="text-blue-100 text-xs mt-1">Step 3 of 6 — Tell customers about your business</p>
      </div>

      <div className="mx-4 mt-4 bg-white rounded-3xl shadow-lg px-6 py-6 space-y-4">
        {/* Upload shop image */}
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Shop Image</label>
          <div className="mt-2 border-2 border-dashed border-blue-200 rounded-2xl h-32 flex flex-col items-center justify-center bg-blue-50 cursor-pointer active:bg-blue-100">
            <Camera className="w-8 h-8 text-primary mb-2" />
            <span className="text-primary text-sm font-semibold">Upload Shop Photo</span>
            <span className="text-muted-foreground text-xs">JPG, PNG up to 5MB</span>
          </div>
        </div>

        {[
          { label: "Business Type", value: "Garage", type: "text" },
          { label: "Shop Name", value: "Patil Auto Garage", type: "text" },
          { label: "Shop Address", value: "Near Railway Station, Jalgaon", type: "text" },
          { label: "State", value: "Maharashtra", type: "text" },
          { label: "City", value: "Jalgaon", type: "text" },
        ].map(({ label, value }) => (
          <div key={label}>
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{label}</label>
            <input
              className="w-full mt-1 px-4 py-3 bg-input-background rounded-xl text-sm outline-none border border-border focus:border-primary"
              defaultValue={value}
            />
          </div>
        ))}

        {/* Location */}
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Location</label>
          <button className="w-full mt-1 px-4 py-3 bg-blue-50 rounded-xl text-sm font-semibold text-primary border border-blue-200 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Use Current Location (Jalgaon, MH)
          </button>
        </div>

        {/* Services */}
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Services Offered</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {SERVICES.map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-primary border border-blue-200">{s}</span>
            ))}
          </div>
        </div>

        {/* About */}
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">About Business</label>
          <textarea
            className="w-full mt-1 px-4 py-3 bg-input-background rounded-xl text-sm outline-none border border-border focus:border-primary resize-none"
            rows={3}
            defaultValue="Patil Auto Garage offers expert car and bike repair services in Jalgaon. 10+ years of experience with certified mechanics."
          />
        </div>

        <button
          onClick={() => navigate("document-verification")}
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #1D4ED8, #1E40AF)" }}
        >
          Save & Continue →
        </button>
      </div>
    </div>
  );
}
