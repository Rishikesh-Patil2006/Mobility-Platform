import { NavigateFn } from "../../types";
import { ArrowLeft, Phone, MessageCircle, Car, Calendar, Clock, MapPin, FileText } from "lucide-react";

export function VisitorProfileScreen({ navigate }: { navigate: NavigateFn }) {
  return (
    <div className="min-h-full bg-background pb-8">
      <div className="px-5 pt-4 pb-16" style={{ background: "linear-gradient(135deg,#1D4ED8,#1E40AF)" }}>
        <button onClick={() => navigate("visitor-details")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-4">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white" style={{ fontSize: 20, fontWeight: 800 }}>Visitor Profile</h1>
      </div>

      {/* Avatar card */}
      <div className="mx-4 -mt-10 bg-white rounded-3xl shadow-xl px-6 py-5 mb-4">
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
            SC
          </div>
          <div className="flex-1">
            <p className="font-black text-foreground" style={{ fontSize: 17 }}>Sunil Chaudhari</p>
            <p className="text-muted-foreground text-xs">Visitor ID: VIS-001</p>
            <div className="mt-1">
              <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full">In Progress</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Phone, label: "Mobile", value: "+91 98765 01234", color: "#22C55E" },
            { icon: Car, label: "Vehicle No.", value: "MH20 AB1234", color: "#1D4ED8" },
            { icon: Car, label: "Vehicle Type", value: "Sedan (Honda City)", color: "#7C3AED" },
            { icon: FileText, label: "Service", value: "Engine Repair", color: "#F59E0B" },
            { icon: Calendar, label: "Date", value: "13 Jun 2024", color: "#EF4444" },
            { icon: Clock, label: "Time", value: "10:30 AM", color: "#06B6D4" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">{label}</p>
                <p className="text-foreground text-xs font-semibold">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mx-4 bg-white rounded-2xl shadow-sm px-5 py-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-primary" />
          <p className="font-bold text-foreground text-sm">Notes</p>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Customer reported engine knocking noise at high speed. Inspection revealed worn piston rings. Informed customer of estimated cost ₹4,500. Approved to proceed.
        </p>
      </div>

      {/* Location */}
      <div className="mx-4 bg-white rounded-2xl shadow-sm px-5 py-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-primary" />
          <p className="font-bold text-foreground text-sm">Location</p>
        </div>
        <p className="text-muted-foreground text-sm">Near Railway Station, Jalgaon – 425001, Maharashtra</p>
      </div>

      {/* Action buttons */}
      <div className="mx-4 flex gap-3">
        <button className="flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-green-500 text-white shadow-lg active:scale-95">
          <Phone className="w-5 h-5" /> Call Customer
        </button>
        <button className="flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-green-600 text-white shadow-lg active:scale-95">
          <MessageCircle className="w-5 h-5" /> WhatsApp
        </button>
      </div>
    </div>
  );
}
