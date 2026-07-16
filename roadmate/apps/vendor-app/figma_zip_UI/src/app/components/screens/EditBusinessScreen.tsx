import { NavigateFn } from "../../types";
import { ArrowLeft, Camera, Building2, Phone, Clock, Tag, Share2, ChevronRight } from "lucide-react";

const CARDS = [
  { icon: Camera, label: "Add Photos / Videos", sub: "Upload shop images and videos", screen: "add-photos" as const, color: "#8B5CF6" },
  { icon: Building2, label: "Business Name", sub: "Update your shop name", screen: "business-name" as const, color: "#1D4ED8" },
  { icon: Phone, label: "Contact Details", sub: "Manage contacts & WhatsApp", screen: "contact-details" as const, color: "#10B981" },
  { icon: Clock, label: "Business Timings", sub: "Set open & close hours", screen: "business-timings" as const, color: "#F59E0B" },
  { icon: Tag, label: "Business Categories", sub: "Select services you offer", screen: "business-categories" as const, color: "#EF4444" },
  { icon: Share2, label: "Social Media", sub: "Facebook, Instagram & more", screen: "social-media" as const, color: "#06B6D4" },
];

export function EditBusinessScreen({ navigate }: { navigate: NavigateFn }) {
  return (
    <div className="min-h-full bg-background pb-8">
      <div className="px-5 pt-4 pb-6" style={{ background: "linear-gradient(135deg,#1D4ED8,#1E40AF)" }}>
        <button onClick={() => navigate("dashboard")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-4">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white" style={{ fontSize: 22, fontWeight: 800 }}>Edit Business</h1>
        <p className="text-blue-100 text-xs mt-1">Patil Auto Garage · Jalgaon</p>
      </div>

      {/* Profile preview */}
      <div className="mx-4 -mt-4 bg-white rounded-3xl shadow-xl px-5 py-5 mb-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
          PA
        </div>
        <div className="flex-1">
          <p className="font-bold text-foreground">Patil Auto Garage</p>
          <p className="text-muted-foreground text-xs">Near Railway Station, Jalgaon</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-500 text-xs">★★★★★</span>
            <span className="text-xs text-muted-foreground">4.8 (142 reviews)</span>
          </div>
        </div>
        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">Active</span>
      </div>

      <div className="mx-4 space-y-3">
        {CARDS.map(({ icon: Icon, label, sub, screen, color }) => (
          <button
            key={label}
            onClick={() => navigate(screen)}
            className="w-full bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4 transition-all active:scale-[0.98]"
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-foreground text-sm">{label}</p>
              <p className="text-muted-foreground text-xs">{sub}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
