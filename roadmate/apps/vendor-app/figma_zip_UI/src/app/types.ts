export type Screen =
  | "landing" | "login" | "register" | "otp" | "business-profile"
  | "document-verification" | "admin-verification" | "account-approved"
  | "dashboard" | "edit-business" | "add-photos" | "business-name"
  | "contact-details" | "business-timings" | "business-categories"
  | "social-media" | "visitor-details" | "visitor-profile" | "profile"
  | "towing-order";

export type NavigateFn = (screen: Screen, params?: Record<string, unknown>) => void;
