import { NavigateFn } from "../../types";
import { ArrowLeft, Phone, MessageCircle, Eye, Search, Filter } from "lucide-react";

const VISITORS = [
  { id: "VIS-001", name: "Sunil Chaudhari", phone: "9876501234", vehicle: "MH20 AB1234", service: "Engine Repair", date: "13 Jun 2024", time: "10:30 AM", status: "In Progress" },
  { id: "VIS-002", name: "Priya Desai", phone: "9876502345", vehicle: "MH20 CD5678", service: "Tyre Change", date: "13 Jun 2024", time: "09:00 AM", status: "Completed" },
  { id: "VIS-003", name: "Amit Sharma", phone: "9876503456", vehicle: "MH20 EF9012", service: "Battery Replace", date: "12 Jun 2024", time: "03:15 PM", status: "Completed" },
  { id: "VIS-004", name: "Ganesh Kulkarni", phone: "9876504567", vehicle: "MH20 GH3456", service: "Oil Change", date: "12 Jun 2024", time: "11:00 AM", status: "Completed" },
  { id: "VIS-005", name: "Meena Borse", phone: "9876505678", vehicle: "MH20 IJ7890", service: "AC Service", date: "11 Jun 2024", time: "02:00 PM", status: "Completed" },
];

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  "In Progress": { bg: "#FEF3C7", text: "#D97706" },
  "Completed": { bg: "#D1FAE5", text: "#065F46" },
};

export function VisitorDetailsScreen({ navigate }: { navigate: NavigateFn }) {
  return (
    <div className="min-h-full bg-background pb-8">
      <div className="px-5 pt-4 pb-6" style={{ background: "linear-gradient(135deg,#1D4ED8,#1E40AF)" }}>
        <button onClick={() => navigate("dashboard")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-4">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white" style={{ fontSize: 22, fontWeight: 800 }}>Visitor Details</h1>
            <p className="text-blue-100 text-xs mt-0.5">{VISITORS.length} visitors today</p>
          </div>
          <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <Filter className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mx-4 -mt-4 mb-4 bg-white rounded-2xl shadow-lg flex items-center gap-3 px-4 py-3">
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <input className="flex-1 text-sm outline-none bg-transparent" placeholder="Search visitors, vehicle..." />
      </div>

      {/* Stats chips */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto pb-1">
        {[["All", "5"], ["Today", "2"], ["Completed", "4"], ["In Progress", "1"]].map(([l, c]) => (
          <button key={l} className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white shadow-sm text-xs font-bold flex items-center gap-1 border border-border">
            <span className="text-foreground">{l}</span>
            <span className="bg-primary text-white rounded-full px-1.5 py-0.5" style={{ fontSize: 10 }}>{c}</span>
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3">
        {VISITORS.map((v) => (
          <div key={v.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {v.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{v.name}</p>
                    <p className="text-muted-foreground text-xs">{v.id}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: STATUS_STYLE[v.status]?.bg ?? "#F1F5F9", color: STATUS_STYLE[v.status]?.text ?? "#64748B" }}>
                  {v.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
                {[
                  ["Vehicle", v.vehicle],
                  ["Service", v.service],
                  ["Date", v.date],
                  ["Time", v.time],
                ].map(([k, val]) => (
                  <div key={k}>
                    <p className="text-muted-foreground text-xs">{k}</p>
                    <p className="text-foreground text-xs font-semibold">{val}</p>
                  </div>
                ))}
              </div>

              <p className="text-muted-foreground text-xs mb-3">📞 {v.phone}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate("visitor-profile")}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border-2 flex items-center justify-center gap-1"
                  style={{ borderColor: "#1D4ED8", color: "#1D4ED8", background: "#EFF6FF" }}
                >
                  <Eye className="w-3.5 h-3.5" /> View Details
                </button>
                <button className="w-10 h-9 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-white" />
                </button>
                <button className="w-10 h-9 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
