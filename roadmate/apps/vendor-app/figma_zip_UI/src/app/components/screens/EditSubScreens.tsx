import { useState, type ReactNode } from "react";
import { NavigateFn } from "../../types";
import { ArrowLeft, Camera, Video, Plus, X, Check, Clock, Facebook, Instagram, Youtube, Globe } from "lucide-react";

function ScreenShell({ title, sub, back, navigate, children }: {
  title: string; sub: string; back: Parameters<NavigateFn>[0];
  navigate: NavigateFn; children: ReactNode;
}) {
  return (
    <div className="min-h-full bg-background pb-8">
      <div className="px-5 pt-4 pb-5" style={{ background: "linear-gradient(135deg,#1D4ED8,#1E40AF)" }}>
        <button onClick={() => navigate(back)} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-4">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white" style={{ fontSize: 20, fontWeight: 800 }}>{title}</h1>
        <p className="text-blue-100 text-xs mt-1">{sub}</p>
      </div>
      <div className="mx-4 mt-4 bg-white rounded-3xl shadow-lg px-6 py-6 space-y-5">
        {children}
        <button
          onClick={() => navigate("edit-business")}
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg,#1D4ED8,#1E40AF)" }}
        >
          Save & Continue →
        </button>
      </div>
    </div>
  );
}

export function AddPhotosScreen({ navigate }: { navigate: NavigateFn }) {
  const photos = ["#DBEAFE", "#EDE9FE", "#D1FAE5", "#FEF9C3", "#FFE4E6", "#E0F2FE"];
  return (
    <ScreenShell title="Add Photos / Videos" sub="Showcase your shop & services" back="edit-business" navigate={navigate}>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">Upload Photos</p>
        <div className="grid grid-cols-3 gap-2">
          {photos.map((bg, i) => (
            <div key={i} className="aspect-square rounded-xl flex items-center justify-center relative" style={{ background: bg }}>
              {i < 4 ? (
                <>
                  <Camera className="w-6 h-6 text-primary opacity-60" />
                  <button className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </>
              ) : (
                <Plus className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">Upload Videos</p>
        <div className="border-2 border-dashed border-blue-200 rounded-2xl h-24 flex flex-col items-center justify-center bg-blue-50 cursor-pointer">
          <Video className="w-7 h-7 text-primary mb-1" />
          <span className="text-primary text-sm font-semibold">Add Video</span>
          <span className="text-muted-foreground text-xs">MP4, up to 50MB</span>
        </div>
      </div>
    </ScreenShell>
  );
}

export function BusinessNameScreen({ navigate }: { navigate: NavigateFn }) {
  return (
    <ScreenShell title="Business Name" sub="Your name appears in search results" back="edit-business" navigate={navigate}>
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Business Name</label>
        <input
          className="w-full mt-1 px-4 py-3 bg-input-background rounded-xl text-sm outline-none border border-border focus:border-primary"
          defaultValue="Patil Auto Garage"
        />
      </div>
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <p className="text-green-800 text-sm font-bold">Verified Service Provider</p>
          <p className="text-green-600 text-xs">Your business is verified by MoveMate</p>
        </div>
      </div>
    </ScreenShell>
  );
}

export function ContactDetailsScreen({ navigate }: { navigate: NavigateFn }) {
  const [contacts, setContacts] = useState([{ name: "Rajesh Patil", designation: "Owner", mobile: "9876543210", whatsapp: "9876543210", email: "rajesh.patil@gmail.com" }]);

  return (
    <ScreenShell title="Contact Details" sub="Customers will reach you here" back="edit-business" navigate={navigate}>
      {contacts.map((c, i) => (
        <div key={i} className="space-y-3 pb-4 border-b border-border last:border-0">
          {i > 0 && <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Contact #{i + 1}</p>}
          {[
            { label: "Contact Person Name", key: "name", value: c.name },
            { label: "Designation", key: "designation", value: c.designation },
            { label: "Mobile Number", key: "mobile", value: c.mobile },
            { label: "WhatsApp Number", key: "whatsapp", value: c.whatsapp },
            { label: "Email", key: "email", value: c.email },
          ].map(({ label, key, value }) => (
            <div key={key}>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{label}</label>
              <input className="w-full mt-1 px-4 py-3 bg-input-background rounded-xl text-sm outline-none border border-border focus:border-primary" defaultValue={value} />
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={() => setContacts(prev => [...prev, { name: "", designation: "", mobile: "", whatsapp: "", email: "" }])}
        className="w-full py-3 rounded-xl border-2 border-dashed border-blue-300 text-primary font-bold text-sm flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add Another Contact Person
      </button>
    </ScreenShell>
  );
}

export function BusinessTimingsScreen({ navigate }: { navigate: NavigateFn }) {
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [universal, setUniversal] = useState(true);
  return (
    <ScreenShell title="Business Timings" sub="Let customers know when you're open" back="edit-business" navigate={navigate}>
      {/* Universal toggle */}
      <div className="flex items-center justify-between bg-blue-50 rounded-2xl px-4 py-3">
        <div>
          <p className="text-sm font-bold text-foreground">Universal Schedule</p>
          <p className="text-xs text-muted-foreground">Apply same timings to all days</p>
        </div>
        <button
          onClick={() => setUniversal(!universal)}
          className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
          style={{ background: universal ? "#1D4ED8" : "#CBD5E1" }}
        >
          <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style={{ left: universal ? "calc(100% - 22px)" : "2px" }} />
        </button>
      </div>

      {universal ? (
        <div className="space-y-3">
          {[
            { label: "Open Time", value: "09:00 AM" },
            { label: "Close Time", value: "08:00 PM" },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{label}</label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input className="w-full pl-10 pr-4 py-3 bg-input-background rounded-xl text-sm outline-none border border-border focus:border-primary" defaultValue={value} />
              </div>
            </div>
          ))}
          <button className="w-full py-3 rounded-xl border-2 border-dashed border-blue-300 text-primary font-bold text-sm flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Another Time Slot
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {DAYS.map(day => (
            <div key={day} className="flex items-center gap-3">
              <span className="text-sm font-semibold w-24 text-foreground">{day}</span>
              <input className="flex-1 px-3 py-2 bg-input-background rounded-xl text-xs outline-none border border-border" defaultValue="09:00 AM" />
              <span className="text-muted-foreground text-xs">–</span>
              <input className="flex-1 px-3 py-2 bg-input-background rounded-xl text-xs outline-none border border-border" defaultValue="08:00 PM" />
            </div>
          ))}
        </div>
      )}
    </ScreenShell>
  );
}

export function BusinessCategoriesScreen({ navigate }: { navigate: NavigateFn }) {
  const ALL = ["Car Repair", "Bike Service", "Oil Change", "Engine Repair", "Battery Service", "Tyre Service", "PUC", "Car Wash", "Denting & Painting", "Towing", "AC Service", "Wheel Alignment"];
  const [selected, setSelected] = useState(new Set(["Car Repair", "Oil Change", "Engine Repair", "Battery Service", "Tyre Service"]));

  const toggle = (s: string) => setSelected(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });

  return (
    <ScreenShell title="Business Categories" sub="Select all services you offer" back="edit-business" navigate={navigate}>
      <p className="text-xs text-muted-foreground">Tap to select / deselect services</p>
      <div className="flex flex-wrap gap-2">
        {ALL.map(s => (
          <button
            key={s}
            onClick={() => toggle(s)}
            className="px-4 py-2 rounded-full text-sm font-bold border-2 transition-all"
            style={{
              borderColor: selected.has(s) ? "#1D4ED8" : "#E2E8F0",
              background: selected.has(s) ? "#1D4ED8" : "#F8FAFC",
              color: selected.has(s) ? "#fff" : "#64748B"
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{selected.size} service{selected.size !== 1 ? "s" : ""} selected</p>
    </ScreenShell>
  );
}

export function SocialMediaScreen({ navigate }: { navigate: NavigateFn }) {
  const FIELDS = [
    { icon: Facebook, label: "Facebook URL", placeholder: "facebook.com/patilgarage", color: "#1877F2" },
    { icon: Instagram, label: "Instagram URL", placeholder: "instagram.com/patilgarage", color: "#E1306C" },
    { icon: ({ color: _c }: { color?: string; className?: string }) => <span className="text-green-600 font-black text-sm">W</span>, label: "WhatsApp Link", placeholder: "wa.me/919876543210", color: "#25D366" },
    { icon: Youtube, label: "YouTube URL", placeholder: "youtube.com/@patilgarage", color: "#FF0000" },
    { icon: Globe, label: "Website URL", placeholder: "patilgarage.in", color: "#6366F1" },
  ];

  return (
    <ScreenShell title="Social Media" sub="Connect your online presence" back="edit-business" navigate={navigate}>
      {FIELDS.map(({ icon: Icon, label, placeholder, color }) => (
        <div key={label}>
          <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{label}</label>
          <div className="relative mt-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <input className="w-full pl-10 pr-4 py-3 bg-input-background rounded-xl text-sm outline-none border border-border focus:border-primary" placeholder={placeholder} />
          </div>
        </div>
      ))}
    </ScreenShell>
  );
}
