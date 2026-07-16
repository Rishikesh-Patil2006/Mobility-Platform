import { useState } from "react";
import type { ReactNode } from "react";
import { NavigateFn } from "../../types";
import { Bell, User, Search, MapPin, Edit3, Users, Wrench, Car, Droplets, Shield, Truck, Home, List, Settings, ChevronRight } from "lucide-react";

const BUSINESS_TYPES = ["Garage", "Car Wash", "PUC Center", "Service Center", "Towing"];

const DASHBOARDS: Record<string, {
  color: string; gradient: string; icon: ReactNode;
  name: string; tagline: string; stats: [string, string][];
  activities: { title: string; sub: string; time: string; status: string }[];
}> = {
  "Garage": {
    color: "#1D4ED8", gradient: "linear-gradient(135deg,#1D4ED8,#1E40AF)",
    icon: <Wrench className="w-6 h-6 text-white" />,
    name: "Patil Auto Garage", tagline: "Premium auto repairs since 2012",
    stats: [["Today's Jobs", "8"], ["Completed", "142"], ["Rating", "4.8★"], ["Revenue", "₹12,400"]],
    activities: [
      { title: "Engine repair — Honda City", sub: "Sunil Chaudhari · MH20 AB1234", time: "10:30 AM", status: "In Progress" },
      { title: "Tyre change — Maruti Swift", sub: "Priya Desai · MH20 CD5678", time: "9:00 AM", status: "Completed" },
      { title: "Battery replace — Hyundai i20", sub: "Amit Sharma · MH20 EF9012", time: "8:15 AM", status: "Completed" },
    ]
  },
  "Car Wash": {
    color: "#0EA5E9", gradient: "linear-gradient(135deg,#0EA5E9,#0369A1)",
    icon: <Droplets className="w-6 h-6 text-white" />,
    name: "SparkClean Car Wash", tagline: "Shine your ride every day",
    stats: [["Today's Washes", "23"], ["Completed", "890"], ["Rating", "4.7★"], ["Revenue", "₹8,200"]],
    activities: [
      { title: "Full wash — Toyota Innova", sub: "Rahul Patil · MH20 AB3344", time: "11:00 AM", status: "In Progress" },
      { title: "Interior clean — Tata Nexon", sub: "Sneha More · MH20 GH5566", time: "10:15 AM", status: "Completed" },
      { title: "Polish — Honda Amaze", sub: "Vikas Jain · MH20 IJ7788", time: "9:00 AM", status: "Completed" },
    ]
  },
  "PUC Center": {
    color: "#10B981", gradient: "linear-gradient(135deg,#10B981,#047857)",
    icon: <Shield className="w-6 h-6 text-white" />,
    name: "GreenCheck PUC Center", tagline: "Certified PUC testing in Jalgaon",
    stats: [["Today's Tests", "34"], ["Completed", "2,100"], ["Rating", "4.9★"], ["Revenue", "₹5,440"]],
    activities: [
      { title: "PUC Test — Bajaj Pulsar", sub: "Deepak Sonawane · MH20 KL1122", time: "11:30 AM", status: "Completed" },
      { title: "PUC Test — Maruti Wagon R", sub: "Anjali Patil · MH20 MN3344", time: "10:45 AM", status: "Completed" },
      { title: "PUC Test — Hero Splendor", sub: "Kiran Borse · MH20 OP5566", time: "10:00 AM", status: "Completed" },
    ]
  },
  "Service Center": {
    color: "#7C3AED", gradient: "linear-gradient(135deg,#7C3AED,#5B21B6)",
    icon: <Car className="w-6 h-6 text-white" />,
    name: "MultiCare Service Center", tagline: "Authorised multi-brand service",
    stats: [["Today's Jobs", "12"], ["Completed", "560"], ["Rating", "4.8★"], ["Revenue", "₹28,600"]],
    activities: [
      { title: "Full service — Mahindra XUV", sub: "Ganesh Kulkarni · MH20 QR7788", time: "9:30 AM", status: "In Progress" },
      { title: "AC repair — Hyundai Creta", sub: "Pooja Desai · MH20 ST9900", time: "8:45 AM", status: "Completed" },
      { title: "Brake service — Honda Jazz", sub: "Sanjay Wani · MH20 UV1122", time: "8:00 AM", status: "Completed" },
    ]
  },
  "Towing": {
    color: "#F59E0B", gradient: "linear-gradient(135deg,#F59E0B,#D97706)",
    icon: <Truck className="w-6 h-6 text-white" />,
    name: "QuickTow Jalgaon", tagline: "24/7 roadside assistance",
    stats: [["Active Orders", "3"], ["Today's Jobs", "9"], ["Rating", "4.6★"], ["Revenue", "₹18,000"]],
    activities: [
      { title: "Towing — Tata Tiago", sub: "Rupesh Naik · NH753, Jalgaon", time: "Live", status: "Active" },
      { title: "Breakdown assist — Maruti Alto", sub: "Meena Patil · Ring Road, Jalgaon", time: "10:20 AM", status: "Completed" },
      { title: "Flat tyre — Honda Activa", sub: "Yash Sonar · Chalisgaon Road", time: "9:45 AM", status: "Completed" },
    ]
  }
};

const STATUS_COLOR: Record<string, string> = {
  "In Progress": "#F59E0B", "Completed": "#22C55E", "Active": "#EF4444"
};

export function DashboardScreen({ navigate }: { navigate: NavigateFn }) {
  const [bizType, setBizType] = useState("Garage");
  const [activeNav, setActiveNav] = useState("home");
  const dash = DASHBOARDS[bizType];

  return (
    <div className="min-h-full bg-background flex flex-col">
      {/* Header */}
      <div className="px-5 pt-4 pb-16" style={{ background: dash.gradient }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-blue-200" />
            <span className="text-blue-100 text-xs font-semibold">Jalgaon, Maharashtra</span>
          </div>
          <div className="flex gap-3">
            <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => navigate("profile")} className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
              <span className="text-primary font-black text-sm">RP</span>
            </button>
          </div>
        </div>

        <h2 className="text-white" style={{ fontSize: 20, fontWeight: 800 }}>Good Morning, Rajesh! 👋</h2>
        <p className="text-blue-100 text-xs mt-0.5">Here's your business overview</p>

        {/* Business type selector */}
        <div className="flex gap-1.5 mt-4 overflow-x-auto pb-1">
          {BUSINESS_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setBizType(t)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                background: bizType === t ? "#fff" : "rgba(255,255,255,0.2)",
                color: bizType === t ? dash.color : "#fff"
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 -mt-12 px-4 space-y-4 pb-24 overflow-y-auto">
        {/* Search bar */}
        <div className="bg-white rounded-2xl shadow-lg flex items-center gap-3 px-4 py-3">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input className="flex-1 text-sm outline-none bg-transparent text-foreground" placeholder="Search services, customers..." />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {dash.stats.map(([label, val]) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm p-4">
              <p className="text-muted-foreground text-xs">{label}</p>
              <p className="font-bold text-foreground mt-1" style={{ fontSize: 20 }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Business card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="px-5 py-4" style={{ background: `${dash.gradient}` }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                {dash.icon}
              </div>
              <div>
                <p className="text-white font-bold">{dash.name}</p>
                <p className="text-blue-100 text-xs">{dash.tagline}</p>
              </div>
            </div>
          </div>
          <div className="px-5 py-4 flex gap-3">
            <button
              onClick={() => navigate("edit-business")}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 flex items-center justify-center gap-1.5 transition-all active:scale-95"
              style={{ borderColor: dash.color, color: dash.color, background: "#EFF6FF" }}
            >
              <Edit3 className="w-4 h-4" /> Edit Business
            </button>
            <button
              onClick={() => navigate("visitor-details")}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 text-white transition-all active:scale-95"
              style={{ background: dash.gradient }}
            >
              <Users className="w-4 h-4" /> Visitors
            </button>
          </div>
        </div>

        {/* Towing quick action */}
        {bizType === "Towing" && (
          <button
            onClick={() => navigate("towing-order")}
            className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg animate-pulse"
            style={{ background: "linear-gradient(135deg,#EF4444,#DC2626)" }}
          >
            🚨 View Active Towing Order
          </button>
        )}

        {/* Recent activity */}
        <div className="bg-white rounded-3xl shadow-lg px-5 py-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground" style={{ fontSize: 15 }}>Recent Activity</h3>
            <button className="text-primary text-xs font-semibold flex items-center gap-0.5">
              See all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {dash.activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "#EFF6FF" }}>
                  {dash.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{a.title}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{a.sub}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: `${STATUS_COLOR[a.status]}18`, color: STATUS_COLOR[a.status] }}>
                    {a.status}
                  </span>
                  <p className="text-muted-foreground text-xs mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] bg-white border-t border-border px-2 py-2 flex items-center justify-around">
        {[
          { id: "home", icon: <Home className="w-5 h-5" />, label: "Home" },
          { id: "listings", icon: <List className="w-5 h-5" />, label: "Listings" },
          { id: "manage", icon: <Settings className="w-5 h-5" />, label: "Manage" },
          { id: "profile", icon: <User className="w-5 h-5" />, label: "Profile" },
        ].map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => { setActiveNav(id); if (id === "profile") navigate("profile"); }}
            className="flex flex-col items-center gap-0.5 px-4 py-1"
            style={{ color: activeNav === id ? dash.color : "#94A3B8" }}
          >
            {icon}
            <span className="text-xs font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
