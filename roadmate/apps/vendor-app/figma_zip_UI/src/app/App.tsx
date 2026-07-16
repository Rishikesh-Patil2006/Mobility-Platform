import { useState } from "react";
import { Screen, NavigateFn } from "./types";

import { LandingScreen } from "./components/screens/LandingScreen";
import { LoginScreen } from "./components/screens/LoginScreen";
import { RegisterScreen } from "./components/screens/RegisterScreen";
import { OTPScreen } from "./components/screens/OTPScreen";
import { BusinessProfileScreen } from "./components/screens/BusinessProfileScreen";
import { DocumentVerificationScreen } from "./components/screens/DocumentVerificationScreen";
import { AdminVerificationScreen } from "./components/screens/AdminVerificationScreen";
import { AccountApprovedScreen } from "./components/screens/AccountApprovedScreen";
import { DashboardScreen } from "./components/screens/DashboardScreen";
import { EditBusinessScreen } from "./components/screens/EditBusinessScreen";
import {
  AddPhotosScreen,
  BusinessNameScreen,
  ContactDetailsScreen,
  BusinessTimingsScreen,
  BusinessCategoriesScreen,
  SocialMediaScreen,
} from "./components/screens/EditSubScreens";
import { VisitorDetailsScreen } from "./components/screens/VisitorDetailsScreen";
import { VisitorProfileScreen } from "./components/screens/VisitorProfileScreen";
import { ProfileScreen } from "./components/screens/ProfileScreen";
import { TowingOrderScreen } from "./components/screens/TowingOrderScreen";

function renderScreen(screen: Screen, navigate: NavigateFn) {
  switch (screen) {
    case "landing":             return <LandingScreen navigate={navigate} />;
    case "login":               return <LoginScreen navigate={navigate} />;
    case "register":            return <RegisterScreen navigate={navigate} />;
    case "otp":                 return <OTPScreen navigate={navigate} />;
    case "business-profile":    return <BusinessProfileScreen navigate={navigate} />;
    case "document-verification": return <DocumentVerificationScreen navigate={navigate} />;
    case "admin-verification":  return <AdminVerificationScreen navigate={navigate} />;
    case "account-approved":    return <AccountApprovedScreen navigate={navigate} />;
    case "dashboard":           return <DashboardScreen navigate={navigate} />;
    case "edit-business":       return <EditBusinessScreen navigate={navigate} />;
    case "add-photos":          return <AddPhotosScreen navigate={navigate} />;
    case "business-name":       return <BusinessNameScreen navigate={navigate} />;
    case "contact-details":     return <ContactDetailsScreen navigate={navigate} />;
    case "business-timings":    return <BusinessTimingsScreen navigate={navigate} />;
    case "business-categories": return <BusinessCategoriesScreen navigate={navigate} />;
    case "social-media":        return <SocialMediaScreen navigate={navigate} />;
    case "visitor-details":     return <VisitorDetailsScreen navigate={navigate} />;
    case "visitor-profile":     return <VisitorProfileScreen navigate={navigate} />;
    case "profile":             return <ProfileScreen navigate={navigate} />;
    case "towing-order":        return <TowingOrderScreen navigate={navigate} />;
    default:                    return <LandingScreen navigate={navigate} />;
  }
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");

  const navigate: NavigateFn = (screen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-6 px-4" style={{ background: "#0F172A" }}>
      {/* Label */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20">
        MoveMate Vendor — Android Prototype
      </div>

      {/* Phone frame */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 390,
          height: 844,
          background: "#fff",
          borderRadius: 48,
          boxShadow: "0 0 0 8px #1E293B, 0 0 0 10px #334155, 0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between px-6 pt-3 pb-1 flex-shrink-0 z-10"
          style={{ background: "transparent", position: "absolute", top: 0, left: 0, right: 0 }}
        >
          <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.9)", textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>9:41</span>
          <div className="w-24 h-5 bg-black rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          <div className="flex items-center gap-1" style={{ color: "rgba(255,255,255,0.9)" }}>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><rect x="0" y="4" width="2" height="6" rx="1"/><rect x="3" y="2.5" width="2" height="7.5" rx="1"/><rect x="6" y="1" width="2" height="9" rx="1"/><rect x="9" y="0" width="2" height="10" rx="1"/></svg>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><path d="M7 2C4.5 2 2.3 3.1 0.8 4.8L2.3 6.3C3.3 5.1 4.6 4.3 6.1 4.1V5.8L8.9 3L6.1 0.2V2H7Z"/><path d="M7 2C9.5 2 11.7 3.1 13.2 4.8L11.7 6.3C10.7 5.1 9.4 4.3 7.9 4.1V2H7Z"/><circle cx="7" cy="8" r="1.5"/></svg>
            <svg width="22" height="11" viewBox="0 0 22 11" fill="currentColor"><rect x="0" y="1" width="18" height="9" rx="2" fillOpacity="0.35" stroke="currentColor" strokeWidth="1"/><rect x="1" y="2" width="14" height="7" rx="1.5"/><path d="M19 4V7C20.1 6.5 21 5.8 21 5.5C21 5.2 20.1 4.5 19 4Z"/></svg>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-y-auto" style={{ paddingTop: 44 }}>
          {renderScreen(currentScreen, navigate)}
        </div>

        {/* Home indicator */}
        <div className="flex-shrink-0 flex items-center justify-center py-2">
          <div className="w-24 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Screen nav dots */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 flex-wrap justify-center max-w-sm px-4">
        {(["landing","login","register","otp","business-profile","document-verification","admin-verification","account-approved","dashboard","edit-business","visitor-details","profile","towing-order"] as Screen[]).map(s => (
          <button
            key={s}
            onClick={() => navigate(s)}
            title={s}
            className="w-2 h-2 rounded-full transition-all"
            style={{ background: currentScreen === s ? "#3B82F6" : "rgba(255,255,255,0.3)" }}
          />
        ))}
      </div>
    </div>
  );
}
