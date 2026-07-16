import { NavigateFn } from "../../types";
import { ArrowLeft, Star, MapPin, Phone, Mail, Tag, Edit, LogOut, Shield, ChevronRight } from "lucide-react";

export function ProfileScreen({ navigate }: { navigate: NavigateFn }) {
  return (
    <div className="min-h-full bg-background pb-8">
      <div className="px-5 pt-4 pb-16" style={{ background: "linear-gradient(135deg,#1D4ED8,#1E40AF)" }}>
        <button onClick={() => navigate("dashboard")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-4">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white" style={{ fontSize: 22, fontWeight: 800 }}>My Profile</h1>
      </div>

      {/* Profile card */}
      <div className="mx-4 -mt-10 bg-white rounded-3xl shadow-xl px-6 py-5 mb-4">
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
          <div className="w-18 h-18 rounded-2xl bg-primary flex items-center justify-center text-white font-black flex-shrink-0" style={{ width: 68, height: 68, fontSize: 24 }}>
            RP
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-black text-foreground" style={{ fontSize: 17 }}>Patil Auto Garage</p>
              <Shield className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-muted-foreground text-xs">Rajesh Patil · Owner</p>
            <div className="flex items-center gap-1 mt-1">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
              <span className="text-xs text-muted-foreground ml-1">4.8 (142 reviews)</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          {[
            { icon: Phone, label: "Mobile Number", value: "+91 98765 43210", color: "#22C55E" },
            { icon: Mail, label: "Email", value: "rajesh.patil@gmail.com", color: "#1D4ED8" },
            { icon: MapPin, label: "Location", value: "Near Railway Station, Jalgaon – 425001", color: "#EF4444" },
            { icon: Tag, label: "Category", value: "Garage / Service Center", color: "#7C3AED" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="flex-1">
                <p className="text-muted-foreground text-xs">{label}</p>
                <p className="text-foreground text-sm font-semibold">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business details */}
      <div className="mx-4 bg-white rounded-2xl shadow-sm px-5 py-4 mb-4">
        <p className="font-bold text-foreground text-sm mb-3">Business Details</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Account ID", "MM-VND-JLG-4821"],
            ["Member Since", "Jun 2022"],
            ["Status", "Active ✓"],
            ["Plan", "Professional"],
          ].map(([k, v]) => (
            <div key={k} className="bg-background rounded-xl px-3 py-2">
              <p className="text-muted-foreground text-xs">{k}</p>
              <p className="text-foreground text-sm font-bold">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mx-4 bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        {[
          { icon: Edit, label: "Edit Profile", color: "#1D4ED8", action: () => navigate("edit-business") },
          { icon: Shield, label: "Account Security", color: "#7C3AED", action: () => {} },
          { icon: Star, label: "My Reviews", color: "#F59E0B", action: () => {} },
        ].map(({ icon: Icon, label, color, action }) => (
          <button key={label} onClick={action} className="w-full flex items-center gap-3 px-5 py-4 border-b border-border last:border-0 active:bg-background">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <span className="flex-1 text-sm font-semibold text-foreground text-left">{label}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      <div className="mx-4">
        <button
          onClick={() => navigate("landing")}
          className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 border-2 border-red-200 text-red-600 bg-red-50 active:scale-95"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );
}
