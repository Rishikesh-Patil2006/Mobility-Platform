import { NavigateFn } from "../../types";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { useState } from "react";

const DOCS = [
  { id: "aadhaar-front", label: "Aadhaar Card — Front", required: true },
  { id: "aadhaar-back", label: "Aadhaar Card — Back", required: true },
  { id: "pan", label: "PAN Card", required: true },
  { id: "gst", label: "GST Certificate", required: false },
  { id: "shop-license", label: "Shop License", required: true },
];

export function DocumentVerificationScreen({ navigate }: { navigate: NavigateFn }) {
  const [uploaded, setUploaded] = useState<Set<string>>(new Set(["aadhaar-front", "aadhaar-back", "pan"]));

  const toggle = (id: string) => {
    setUploaded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-full bg-background pb-8">
      <div className="px-5 pt-4 pb-5" style={{ background: "linear-gradient(135deg, #1D4ED8, #1E40AF)" }}>
        <button onClick={() => navigate("business-profile")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-4">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white" style={{ fontSize: 20, fontWeight: 800 }}>Upload Documents</h1>
        <p className="text-blue-100 text-xs mt-1">Step 4 of 6 — Secure & verified upload</p>
      </div>

      <div className="mx-4 mt-4 bg-white rounded-3xl shadow-lg px-6 py-6 space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-xs font-semibold">📋 All documents must be clear and legible. Verification takes 24–48 hours.</p>
        </div>

        {DOCS.map(({ id, label, required }) => (
          <div key={id} onClick={() => toggle(id)} className="cursor-pointer">
            <div
              className="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all"
              style={{
                borderColor: uploaded.has(id) ? "#22C55E" : "#E2E8F0",
                background: uploaded.has(id) ? "#F0FDF4" : "#F8FAFC"
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: uploaded.has(id) ? "#22C55E" : "#EFF6FF" }}
              >
                {uploaded.has(id)
                  ? <CheckCircle className="w-6 h-6 text-white" />
                  : <Upload className="w-5 h-5 text-primary" />
                }
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">
                  {uploaded.has(id) ? "Uploaded ✓" : `Tap to upload${required ? " *" : " (optional)"}`}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="text-xs text-muted-foreground text-center">
          * Required documents
        </div>

        <button
          onClick={() => navigate("admin-verification")}
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #1D4ED8, #1E40AF)" }}
        >
          Submit for Verification →
        </button>
      </div>
    </div>
  );
}
