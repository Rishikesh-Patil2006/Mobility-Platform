import { NavigateFn } from "../../types";
import { ArrowLeft, Phone, MessageCircle, MapPin, Navigation, Truck, User, Car, Ruler, AlertCircle } from "lucide-react";

export function TowingOrderScreen({ navigate }: { navigate: NavigateFn }) {
  return (
    <div className="min-h-full bg-background pb-8">
      {/* Header */}
      <div className="px-5 pt-4 pb-6" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
        <button onClick={() => navigate("dashboard")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-4">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white" style={{ fontSize: 22, fontWeight: 800 }}>Active Towing Order</h1>
            <p className="text-yellow-100 text-xs mt-0.5">Order #TOW-2024-0613-009</p>
          </div>
          <div className="flex items-center gap-1.5 bg-red-500 rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-white text-xs font-bold">LIVE</span>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="mx-4 -mt-4 mb-4 rounded-3xl overflow-hidden shadow-xl" style={{ height: 160, background: "linear-gradient(135deg,#DBEAFE,#EDE9FE)" }}>
        <div className="h-full flex items-center justify-center flex-col gap-2 relative">
          {/* Fake map grid */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="absolute border-blue-400" style={{ top: `${i * 25}%`, left: 0, right: 0, borderTopWidth: 1 }} />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="absolute border-blue-400" style={{ left: `${i * 16}%`, top: 0, bottom: 0, borderLeftWidth: 1 }} />
            ))}
          </div>
          <MapPin className="w-10 h-10 text-amber-500 drop-shadow" />
          <span className="text-primary font-bold text-sm bg-white rounded-full px-3 py-1 shadow">NH753, Jalgaon — 4.2 km away</span>
        </div>
      </div>

      {/* Customer card */}
      <div className="mx-4 bg-white rounded-3xl shadow-lg px-5 py-5 mb-4">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
            RN
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground">Rupesh Naik</p>
            <p className="text-muted-foreground text-xs">+91 98765 09876</p>
          </div>
          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">Urgent</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: MapPin, label: "GPS Location", value: "NH753, Jalgaon MH", color: "#EF4444" },
            { icon: Truck, label: "Service Type", value: "Vehicle Towing", color: "#F59E0B" },
            { icon: Car, label: "Vehicle", value: "Tata Tiago · MH20 QR9988", color: "#1D4ED8" },
            { icon: Ruler, label: "Distance", value: "4.2 km from shop", color: "#10B981" },
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

      {/* Alert */}
      <div className="mx-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <p className="text-amber-800 text-xs font-semibold">Customer has been waiting for 8 mins. Please respond promptly.</p>
      </div>

      {/* Action buttons */}
      <div className="px-4 space-y-3">
        <button
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg flex items-center justify-center gap-2 active:scale-95"
          style={{ background: "linear-gradient(135deg,#22C55E,#16A34A)" }}
        >
          <Truck className="w-5 h-5" /> Accept Order
        </button>
        <div className="flex gap-3">
          <button className="flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-green-500 text-white shadow active:scale-95">
            <Phone className="w-4 h-4" /> Call Customer
          </button>
          <button className="flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-green-600 text-white shadow active:scale-95">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </button>
        </div>
        <button
          className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 border-2 active:scale-95"
          style={{ borderColor: "#1D4ED8", color: "#1D4ED8", background: "#EFF6FF" }}
        >
          <Navigation className="w-5 h-5" /> View GPS Location
        </button>
      </div>
    </div>
  );
}
