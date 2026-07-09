# Roadmate Technical Specifications Document

**File Name:** `Roadmate_TECH_SPECS.md`  
**Product:** Roadmate V1  
**Product Type:** Smart Mobility Ecosystem  
**Apps Covered:** Roadmate Customer Mobile App, Roadmate Vendor Mobile App, Roadmate Admin Web Application, Roadmate Backend API  
**Prepared For:** Student development team building the first real version of Roadmate  
**Updated Technical Decisions:** JavaScript only, Expo for mobile apps, no Expo for admin web, FCM notifications, Cloudinary for images/files, payment gateway removed for now.

---

## 0. Final Technical Decisions

These are the latest confirmed changes for Roadmate V1.

| Area | Final Decision |
|---|---|
| Programming Language | Use **JavaScript**. |
| Customer App | Use **React Native with Expo**. |
| Vendor App | Use **React Native with Expo**. |
| Super Admin | Build as a **React Web Application with Vite**, do **not** use Expo. |
| Backend | Use **Node.js + Express.js** with JavaScript. |
| Database | Use **PostgreSQL**. |
| ORM | Use **Prisma ORM**. |
| Authentication | Use **JWT Access Token + Refresh Token**. |
| Notifications | Use **FCM - Firebase Cloud Messaging**. |
| Image/File Storage | Use **Cloudinary**. |
| Payment Gateway | Remove for now. Do not build payment UI, payment API, payment tables, commission, or settlement in V1. |

Important rule: since we are using JavaScript, do not create `.ts`, `.tsx`, or `types` folders for TypeScript types. Use `.js` and `.jsx` files. For validation, use `Yup`, `Joi`, or `Zod` as normal JavaScript validation schemas.

---

## 1. Tech Stack

### 1.1 Recommended Architecture

Roadmate V1 should be built as one full-stack system with three frontend apps and one common backend.

```txt
Roadmate Customer App - Expo React Native
Roadmate Vendor App   - Expo React Native
Roadmate Admin Web    - React + Vite Web App
              ↓
Roadmate Backend API  - Node.js + Express.js
              ↓
PostgreSQL Database + Prisma ORM
              ↓
Cloudinary for uploaded images/files
Firebase FCM for notifications
```

Roadmate V1 focuses on customer vehicle management, document status, nearby service discovery, vendor onboarding, vendor approval, and admin control.

Booking, online payment, commission, and settlement are not included in V1.

---

### 1.2 Frontend - Customer App and Vendor App

Both mobile apps should use **Expo React Native with JavaScript**.

| Item | Recommendation | Why |
|---|---|---|
| Mobile Framework | React Native with Expo | Easy setup, fast development, good for Android/iOS, beginner-friendly. |
| Language | JavaScript | Current requirement says do not use TypeScript. |
| Navigation | React Navigation | Best for mobile navigation such as auth flow, dashboard, details, profile, tabs. |
| State Management | Zustand | Simple and easy for students. Use it for auth, selected vehicle, location, vendor profile. |
| API Calls | Axios + TanStack Query | Axios handles requests. TanStack Query handles loading, error, caching, refetching. |
| Forms | React Hook Form | Useful for login, OTP, add vehicle, vendor registration, business profile forms. |
| Validation | Yup or Zod | Used for form validation in JavaScript. |
| Secure Storage | Expo SecureStore | Better than AsyncStorage for access tokens and refresh tokens. |
| Normal Local Storage | AsyncStorage | Use for non-sensitive data like selected vehicle ID, onboarding flags, UI state. |
| Notifications | FCM through Firebase + Expo Notifications | Used for vendor approval alerts, document expiry alerts, admin alerts, and customer/vendor notifications. |
| Image Picker | Expo ImagePicker | Used for profile photo, shop image, vendor photos, and document upload selection. |
| File Upload | FormData + Axios | Upload selected files/images to backend, backend sends them to Cloudinary. |
| UI Styling | NativeWind or React Native Paper | Helps create clean blue-white UI quickly. |
| Icons | Lucide React Native | Clean icon set for dashboard, services, documents, and settings. |
| Maps/Directions | Mock MapMyIndia-style screen in V1 | Real MapMyIndia integration can be added later. |

Important Expo notes:

1. Customer app and Vendor app can run with Expo during development.
2. For production FCM push notifications, use EAS Build and Firebase configuration.
3. Do not depend only on Expo Go for final notification testing because real FCM behavior needs a proper development/production build.
4. Keep Android package names separate:
   - Customer App: `com.roadmate.customer`
   - Vendor App: `com.roadmate.vendor`

---

### 1.3 Frontend - Roadmate Admin Web Application

Roadmate Admin is a **web application**, not a mobile app.

Do **not** use Expo for the admin website.

| Item | Recommendation | Why |
|---|---|---|
| Framework | React with Vite | Fast web development, simple setup, best for admin dashboards. |
| Language | JavaScript | Current requirement says no TypeScript. |
| Routing | React Router | Handles dashboard, vendors, customers, services, complaints, reports, settings. |
| State Management | Zustand | Simple global state for admin auth, filters, selected records, UI state. |
| API Calls | Axios + TanStack Query | Clean backend connection and better data fetching. |
| UI Library | Tailwind CSS + shadcn/ui style components | Professional admin dashboard UI. |
| Charts | Recharts | Dashboard KPIs, service overview, vendor statistics. |
| Tables | TanStack Table | Vendor list, customer list, complaints list, service-wise vendors. |
| Notifications UI | In-app notification panel + FCM support | Admin can see vendor registration, complaint, and system alerts. |
| Image Preview | Cloudinary secure URLs | Admin can preview vendor documents, shop images, and profile images. |

Admin web app will run in browser:

```txt
Development URL: http://localhost:5173
Production URL: https://admin.roadmate.in
```

---

### 1.4 Backend

| Item | Recommendation | Why |
|---|---|---|
| Runtime | Node.js | Same JavaScript ecosystem as frontend. |
| Framework | Express.js with JavaScript | Simple, beginner-friendly, and good for REST APIs. |
| API Style | REST API | Easy to understand for student team. |
| ORM | Prisma ORM | Helps work with PostgreSQL without writing too much raw SQL. |
| Database | PostgreSQL | Strong relational database for users, vehicles, vendors, documents, services. |
| Authentication | JWT Access Token + Refresh Token | Secure role-based login for customer, vendor, and admin. |
| Password Hashing | bcrypt | Stores passwords securely. |
| Validation | Joi or Zod | Validates request body, params, and query data. |
| File Upload | Multer memory storage + Cloudinary SDK | Backend receives file and uploads to Cloudinary. |
| Notifications | Firebase Admin SDK | Backend sends FCM push notifications. |
| Logging | Winston or Pino | Helps debug backend errors. |
| Security | Helmet, CORS, rate limiting | Protects backend APIs. |

Backend should be a common API for all three frontends:

```txt
Customer App  ─┐
Vendor App    ├── Roadmate Backend API ─── PostgreSQL
Admin Web     ┘
```

---

### 1.5 Database

| Item | Recommendation | Why |
|---|---|---|
| Database | PostgreSQL | Strong relational database for Roadmate data. |
| ORM | Prisma | Clean model definitions and migrations. |
| Primary Key | UUID | Safer for public APIs than simple auto-increment IDs. |
| Timezone | `timestamptz` | Correct handling of date/time. |
| JSON Support | `jsonb` | Useful for platform settings, metadata, logs, FCM payloads. |

---

### 1.6 Authentication

Use JWT authentication.

Roadmate should use:

1. **Access Token**
   - Short life, for example 15 minutes.
   - Sent in `Authorization: Bearer <token>` header.
   - Used for protected API requests.

2. **Refresh Token**
   - Longer life, for example 7 to 30 days.
   - Stored in database as a hashed value.
   - Used to generate a new access token.

3. **JWT Payload**

```json
{
  "sub": "user_id",
  "role": "customer | vendor | super_admin",
  "customer_id": "optional_customer_profile_id",
  "vendor_id": "optional_vendor_profile_id",
  "session_id": "refresh_token_id",
  "iat": 1234567890,
  "exp": 1234569999
}
```

Do not store Aadhaar number, PAN number, passwords, or full document details in JWT.

---

### 1.7 Notifications - FCM

Use **Firebase Cloud Messaging** for push notifications.

#### Frontend responsibility

Customer app and Vendor app should:

1. Ask notification permission.
2. Get FCM device token.
3. Send FCM token to backend.
4. Listen for foreground notifications.
5. Handle notification click/open action.

Admin web app can support browser notifications later, but in V1 it must at least show in-app notifications from backend.

#### Backend responsibility

Backend should:

1. Store FCM tokens in `fcm_device_tokens`.
2. Send notifications using Firebase Admin SDK.
3. Store notification records in `notifications`.
4. Send role-specific notifications.

#### Important notification examples

| Event | Receiver | Notification |
|---|---|---|
| Vendor submits profile | Super Admin | New vendor approval request. |
| Admin approves vendor | Vendor | Your Roadmate account is approved. |
| Admin rejects vendor | Vendor | Your Roadmate account was rejected with reason. |
| Document expiring soon | Customer | Your PUC/Insurance is expiring soon. |
| Complaint status updated | Customer/Vendor | Your complaint status has changed. |
| New visitor lead | Vendor | A customer viewed/called your business. |

---

### 1.8 Image and File Storage - Cloudinary

Use **Cloudinary** for images and uploaded files.

#### What should be uploaded to Cloudinary?

| File Type | Example |
|---|---|
| Customer profile image | User profile photo |
| Vendor shop image | Garage/car wash shop image |
| Vendor business photos | Listing photos/videos |
| Vendor documents | Aadhaar, PAN, GST, shop license |
| Vehicle documents | PUC, RC, Driving License, Insurance PDF/image, if uploaded manually |

#### Upload approach

Recommended approach:

```txt
Frontend selects file/image
        ↓
Frontend sends file to backend using FormData
        ↓
Backend uploads file to Cloudinary
        ↓
Cloudinary returns secure_url and public_id
        ↓
Backend saves metadata in file_assets table
        ↓
Frontend displays image using Cloudinary secure_url
```

Do not upload directly from frontend using unsigned upload for sensitive documents. Vendor documents should go through backend so auth and role checks are enforced.

---

### 1.9 Removed for Now - Payment Gateway

Payment gateway is removed for now.

Do not add:

1. Razorpay
2. Stripe
3. PhonePe
4. Paytm
5. Payment UI screens
6. Payment API routes
7. Commission tables
8. Settlement tables
9. Booking payment status
10. Revenue settlement logic

Admin dashboard can show simple count-based reports in V1, but not real payment or revenue settlement.

---

## 2. Folder Structure

Roadmate should be organised as a monorepo.

```txt
roadmate/
│
├── apps/
│   ├── customer-app/                 # Expo React Native app
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── logos/
│   │   │
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── common/
│   │   │   │   ├── forms/
│   │   │   │   ├── cards/
│   │   │   │   └── layout/
│   │   │   │
│   │   │   ├── navigation/
│   │   │   │   ├── AuthNavigator.jsx
│   │   │   │   ├── AppNavigator.jsx
│   │   │   │   └── BottomTabs.jsx
│   │   │   │
│   │   │   ├── screens/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── SplashScreen.jsx
│   │   │   │   │   ├── WelcomeScreen.jsx
│   │   │   │   │   ├── LoginScreen.jsx
│   │   │   │   │   └── OtpVerificationScreen.jsx
│   │   │   │   │
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── CustomerDashboardScreen.jsx
│   │   │   │   │   └── VehicleSwitcherScreen.jsx
│   │   │   │   │
│   │   │   │   ├── vehicles/
│   │   │   │   │   ├── AddVehicleScreen.jsx
│   │   │   │   │   └── VehicleDetailsScreen.jsx
│   │   │   │   │
│   │   │   │   ├── documents/
│   │   │   │   │   ├── InformationHubScreen.jsx
│   │   │   │   │   └── DocumentDetailScreen.jsx
│   │   │   │   │
│   │   │   │   ├── services/
│   │   │   │   │   ├── ServiceHomeScreen.jsx
│   │   │   │   │   ├── ProviderListScreen.jsx
│   │   │   │   │   ├── ProviderDetailScreen.jsx
│   │   │   │   │   └── DirectionScreen.jsx
│   │   │   │   │
│   │   │   │   ├── notifications/
│   │   │   │   │   └── NotificationListScreen.jsx
│   │   │   │   │
│   │   │   │   └── profile/
│   │   │   │       ├── ProfileScreen.jsx
│   │   │   │       └── SettingsScreen.jsx
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── apiClient.js
│   │   │   │   ├── authApi.js
│   │   │   │   ├── vehicleApi.js
│   │   │   │   ├── documentApi.js
│   │   │   │   ├── serviceProviderApi.js
│   │   │   │   ├── uploadApi.js
│   │   │   │   └── notificationApi.js
│   │   │   │
│   │   │   ├── store/
│   │   │   │   ├── authStore.js
│   │   │   │   ├── vehicleStore.js
│   │   │   │   ├── locationStore.js
│   │   │   │   └── notificationStore.js
│   │   │   │
│   │   │   ├── schemas/
│   │   │   │   ├── auth.schema.js
│   │   │   │   ├── vehicle.schema.js
│   │   │   │   ├── document.schema.js
│   │   │   │   └── service.schema.js
│   │   │   │
│   │   │   ├── constants/
│   │   │   │   ├── roles.js
│   │   │   │   ├── documentStatus.js
│   │   │   │   ├── serviceCategories.js
│   │   │   │   └── colors.js
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── dateUtils.js
│   │   │       ├── documentStatus.js
│   │   │       ├── validators.js
│   │   │       ├── cloudinaryFileHelper.js
│   │   │       └── fcmHelper.js
│   │   │
│   │   ├── App.js
│   │   ├── app.json
│   │   ├── babel.config.js
│   │   ├── eas.json
│   │   └── package.json
│   │
│   ├── vendor-app/                   # Expo React Native app
│   │   ├── assets/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── common/
│   │   │   │   ├── forms/
│   │   │   │   ├── cards/
│   │   │   │   └── layout/
│   │   │   │
│   │   │   ├── navigation/
│   │   │   │   ├── VendorAuthNavigator.jsx
│   │   │   │   ├── VendorAppNavigator.jsx
│   │   │   │   └── VendorBottomTabs.jsx
│   │   │   │
│   │   │   ├── screens/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── VendorLandingScreen.jsx
│   │   │   │   │   ├── VendorLoginScreen.jsx
│   │   │   │   │   ├── VendorRegisterScreen.jsx
│   │   │   │   │   └── VendorOtpScreen.jsx
│   │   │   │   │
│   │   │   │   ├── onboarding/
│   │   │   │   │   ├── BusinessProfileScreen.jsx
│   │   │   │   │   ├── VendorDocumentUploadScreen.jsx
│   │   │   │   │   ├── PendingApprovalScreen.jsx
│   │   │   │   │   └── AccountApprovedScreen.jsx
│   │   │   │   │
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── VendorDashboardScreen.jsx
│   │   │   │   │
│   │   │   │   ├── business/
│   │   │   │   │   ├── EditBusinessScreen.jsx
│   │   │   │   │   ├── BusinessPhotosScreen.jsx
│   │   │   │   │   ├── BusinessContactScreen.jsx
│   │   │   │   │   ├── BusinessTimingsScreen.jsx
│   │   │   │   │   ├── BusinessCategoriesScreen.jsx
│   │   │   │   │   └── SocialLinksScreen.jsx
│   │   │   │   │
│   │   │   │   ├── visitors/
│   │   │   │   │   ├── VisitorListScreen.jsx
│   │   │   │   │   └── VisitorDetailScreen.jsx
│   │   │   │   │
│   │   │   │   ├── towing/
│   │   │   │   │   └── ActiveTowingLeadScreen.jsx
│   │   │   │   │
│   │   │   │   ├── notifications/
│   │   │   │   │   └── VendorNotificationListScreen.jsx
│   │   │   │   │
│   │   │   │   └── profile/
│   │   │   │       └── VendorProfileScreen.jsx
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── apiClient.js
│   │   │   │   ├── vendorAuthApi.js
│   │   │   │   ├── vendorProfileApi.js
│   │   │   │   ├── vendorDocumentApi.js
│   │   │   │   ├── visitorApi.js
│   │   │   │   ├── uploadApi.js
│   │   │   │   └── notificationApi.js
│   │   │   │
│   │   │   ├── store/
│   │   │   │   ├── vendorAuthStore.js
│   │   │   │   ├── vendorProfileStore.js
│   │   │   │   └── notificationStore.js
│   │   │   │
│   │   │   ├── schemas/
│   │   │   │   ├── vendor.schema.js
│   │   │   │   ├── business.schema.js
│   │   │   │   ├── document.schema.js
│   │   │   │   └── lead.schema.js
│   │   │   │
│   │   │   ├── constants/
│   │   │   │   ├── vendorStatus.js
│   │   │   │   ├── businessCategories.js
│   │   │   │   └── colors.js
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── dateUtils.js
│   │   │       ├── validators.js
│   │   │       ├── cloudinaryFileHelper.js
│   │   │       └── fcmHelper.js
│   │   │
│   │   ├── App.js
│   │   ├── app.json
│   │   ├── babel.config.js
│   │   ├── eas.json
│   │   └── package.json
│   │
│   └── admin-web/                    # React Vite web app, no Expo
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   │   ├── common/
│       │   │   ├── layout/
│       │   │   ├── tables/
│       │   │   ├── charts/
│       │   │   └── forms/
│       │   │
│       │   ├── pages/
│       │   │   ├── auth/
│       │   │   │   └── AdminLoginPage.jsx
│       │   │   ├── dashboard/
│       │   │   │   └── AdminDashboardPage.jsx
│       │   │   ├── vendors/
│       │   │   │   ├── VendorListPage.jsx
│       │   │   │   └── VendorDetailPage.jsx
│       │   │   ├── customers/
│       │   │   │   ├── CustomerListPage.jsx
│       │   │   │   └── CustomerDetailPage.jsx
│       │   │   ├── services/
│       │   │   │   ├── ServiceManagementPage.jsx
│       │   │   │   └── ServiceVendorListPage.jsx
│       │   │   ├── complaints/
│       │   │   │   ├── ComplaintListPage.jsx
│       │   │   │   └── ComplaintDetailPage.jsx
│       │   │   ├── reports/
│       │   │   │   └── ReportsOverviewPage.jsx
│       │   │   ├── notifications/
│       │   │   │   └── AdminNotificationsPage.jsx
│       │   │   └── settings/
│       │   │       └── PlatformSettingsPage.jsx
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx
│       │   │   └── ProtectedRoute.jsx
│       │   │
│       │   ├── services/
│       │   │   ├── apiClient.js
│       │   │   ├── adminAuthApi.js
│       │   │   ├── adminVendorApi.js
│       │   │   ├── adminCustomerApi.js
│       │   │   ├── adminServiceApi.js
│       │   │   ├── adminComplaintApi.js
│       │   │   └── notificationApi.js
│       │   │
│       │   ├── store/
│       │   │   └── adminAuthStore.js
│       │   │
│       │   ├── schemas/
│       │   │   ├── admin.schema.js
│       │   │   ├── vendor.schema.js
│       │   │   └── customer.schema.js
│       │   │
│       │   └── utils/
│       │       ├── dateUtils.js
│       │       └── formatters.js
│       │
│       ├── index.html
│       ├── vite.config.js
│       └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js
│   │   │   ├── database.js
│   │   │   ├── jwt.js
│   │   │   ├── cloudinary.js
│   │   │   └── firebase.js
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── auth.service.js
│   │   │   │   ├── auth.validation.js
│   │   │   │   └── token.service.js
│   │   │   │
│   │   │   ├── users/
│   │   │   ├── customers/
│   │   │   ├── vehicles/
│   │   │   ├── vehicle-documents/
│   │   │   ├── vendors/
│   │   │   ├── vendor-documents/
│   │   │   ├── services/
│   │   │   ├── leads/
│   │   │   ├── complaints/
│   │   │   ├── notifications/
│   │   │   ├── files/
│   │   │   └── admin/
│   │   │
│   │   ├── middlewares/
│   │   │   ├── authenticate.js
│   │   │   ├── authorizeRoles.js
│   │   │   ├── requireVendorApproval.js
│   │   │   ├── validateRequest.js
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   │
│   │   ├── routes/
│   │   │   └── index.js
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── dateUtils.js
│   │   │   ├── documentStatus.js
│   │   │   └── uploadToCloudinary.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.js
│   │
│   ├── package.json
│   └── README.md
│
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── constants/
│       │   │   ├── roles.js
│       │   │   ├── documentTypes.js
│       │   │   ├── serviceCategories.js
│       │   │   └── status.js
│       │   ├── schemas/
│       │   └── validators/
│       └── package.json
│
├── docs/
│   ├── Roadmate_PRD_V1.pdf
│   └── Roadmate_TECH_SPECS.md
│
├── .env.example
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

### Important folder structure rules

1. Do not use `.ts` or `.tsx`.
2. Use `.js` for logic files.
3. Use `.jsx` for React screen/component files.
4. Do not create `types` folder.
5. Use `schemas` folder for validation schemas.
6. Use `constants` folder for fixed values like roles, status, categories.
7. Keep frontend business logic outside screen files.
8. Keep API calls inside `services` folder.
9. Keep app state inside `store` folder.
10. Keep reusable UI inside `components` folder.

---

## 3. Database Schema

### 3.1 Database Notes

Database: **PostgreSQL**  
ORM: **Prisma ORM**

Common database rules:

1. Use `uuid` primary keys.
2. Use `created_at` and `updated_at` in all main tables.
3. Use `deleted_at` where soft delete is useful.
4. Store actual files/images in Cloudinary.
5. Store only Cloudinary metadata in PostgreSQL.
6. Store FCM device tokens for push notifications.
7. Do not create payment, booking, commission, or settlement tables in V1.

---

### 3.2 PostgreSQL Enums

```sql
CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'super_admin');

CREATE TYPE account_status AS ENUM ('active', 'pending', 'suspended', 'blocked', 'rejected');

CREATE TYPE vendor_approval_status AS ENUM (
  'draft',
  'pending_approval',
  'approved',
  'rejected',
  'suspended',
  'blocked'
);

CREATE TYPE vehicle_type AS ENUM ('car', 'bike', 'scooty', 'ev');

CREATE TYPE fuel_type AS ENUM ('petrol', 'diesel', 'cng', 'electric', 'hybrid', 'other');

CREATE TYPE vehicle_document_type AS ENUM (
  'puc_certificate',
  'rc_book',
  'driving_license',
  'insurance'
);

CREATE TYPE vendor_document_type AS ENUM (
  'aadhaar_front',
  'aadhaar_back',
  'pan',
  'gst_certificate',
  'shop_license'
);

CREATE TYPE document_status AS ENUM (
  'pending',
  'valid',
  'expiring_soon',
  'expired',
  'rejected'
);

CREATE TYPE verification_source AS ENUM (
  'manual_mock',
  'digilocker',
  'parivahan',
  'iib',
  'insurance_api'
);

CREATE TYPE lead_status AS ENUM ('new', 'viewed', 'contacted', 'closed');

CREATE TYPE towing_lead_status AS ENUM ('new', 'accepted', 'rejected', 'completed', 'cancelled');

CREATE TYPE complaint_status AS ENUM ('open', 'in_progress', 'resolved', 'rejected');

CREATE TYPE complaint_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TYPE notification_type AS ENUM (
  'vendor_registration',
  'vendor_approval',
  'complaint',
  'document_expiry',
  'lead',
  'system'
);

CREATE TYPE media_type AS ENUM ('image', 'video', 'document');

CREATE TYPE otp_purpose AS ENUM ('login', 'register', 'vendor_register', 'password_reset');

CREATE TYPE otp_channel AS ENUM ('email', 'sms');
```

---

### 3.3 Table: `users`

Stores login and role information for customers, vendors, and super admins.

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key, default `gen_random_uuid()` |
| full_name | varchar(120) | Not null |
| email | varchar(150) | Unique, nullable |
| mobile_number | varchar(20) | Unique, nullable |
| password_hash | text | Nullable, required for password login |
| role | user_role | Not null |
| auth_provider | varchar(30) | Default `email`, values like `email`, `google` |
| google_uid | varchar(150) | Unique, nullable |
| account_status | account_status | Default `active` |
| is_email_verified | boolean | Default `false` |
| is_mobile_verified | boolean | Default `false` |
| last_login_at | timestamptz | Nullable |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |
| deleted_at | timestamptz | Nullable |

Relationships:

- One user can have one customer profile.
- One user can have one vendor profile.
- One user can have one admin profile.
- One user can have many refresh tokens.
- One user can have many FCM device tokens.
- One user can receive many notifications.

---

### 3.4 Table: `otp_verifications`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to `users.id`, nullable |
| purpose | otp_purpose | Not null |
| channel | otp_channel | Not null |
| target | varchar(150) | Email or mobile number |
| otp_hash | text | Not null |
| expires_at | timestamptz | Not null |
| verified_at | timestamptz | Nullable |
| attempt_count | integer | Default `0` |
| created_at | timestamptz | Default `now()` |

---

### 3.5 Table: `refresh_tokens`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to `users.id`, not null |
| token_hash | text | Not null |
| device_id | varchar(120) | Nullable |
| device_name | varchar(120) | Nullable |
| ip_address | inet | Nullable |
| user_agent | text | Nullable |
| expires_at | timestamptz | Not null |
| revoked_at | timestamptz | Nullable |
| created_at | timestamptz | Default `now()` |

---

### 3.6 Table: `fcm_device_tokens`

Stores FCM tokens for push notifications.

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to `users.id`, not null |
| fcm_token | text | Not null |
| platform | varchar(20) | `android`, `ios`, or `web` |
| app_type | varchar(30) | `customer_app`, `vendor_app`, or `admin_web` |
| device_id | varchar(120) | Nullable |
| device_name | varchar(120) | Nullable |
| is_active | boolean | Default `true` |
| last_used_at | timestamptz | Nullable |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |

Recommended constraints:

- `UNIQUE(user_id, fcm_token)`

Relationships:

- One user can have many FCM tokens because the same user may login on multiple devices.

---

### 3.7 Table: `customer_profiles`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to `users.id`, unique, not null |
| profile_photo_asset_id | uuid | Foreign key to `file_assets.id`, nullable |
| city | varchar(80) | Example: Jalgaon |
| state | varchar(80) | Example: Maharashtra |
| pincode | varchar(10) | Nullable |
| latitude | numeric(10,7) | Nullable |
| longitude | numeric(10,7) | Nullable |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |

---

### 3.8 Table: `admin_profiles`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to `users.id`, unique, not null |
| designation | varchar(100) | Example: Super Admin |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |

---

### 3.9 Table: `vehicles`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| customer_id | uuid | Foreign key to `customer_profiles.id`, not null |
| vehicle_number | varchar(20) | Not null |
| vehicle_type | vehicle_type | Not null |
| brand | varchar(80) | Not null |
| model | varchar(80) | Not null |
| fuel_type | fuel_type | Not null |
| manufacturing_year | integer | Nullable |
| is_selected | boolean | Default `false` |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |
| deleted_at | timestamptz | Nullable |

Recommended constraints:

- `UNIQUE(customer_id, vehicle_number)`
- Only one selected vehicle per customer should be controlled in backend logic.

---

### 3.10 Table: `vehicle_documents`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| vehicle_id | uuid | Foreign key to `vehicles.id`, not null |
| document_type | vehicle_document_type | Not null |
| document_number | varchar(100) | Nullable |
| owner_name | varchar(120) | Nullable |
| issue_date | date | Nullable |
| expiry_date | date | Nullable |
| status | document_status | Default `pending` |
| verified_via | verification_source | Default `manual_mock` |
| file_asset_id | uuid | Foreign key to `file_assets.id`, nullable |
| last_synced_at | timestamptz | Nullable |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |

Recommended constraints:

- `UNIQUE(vehicle_id, document_type)`

Business logic:

- More than 30 days remaining: `valid`
- Expiring within 30 days: `expiring_soon`
- Expiry date passed: `expired`

---

### 3.11 Table: `service_categories`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| slug | varchar(80) | Unique, not null |
| name | varchar(100) | Not null |
| description | text | Nullable |
| icon_name | varchar(80) | Nullable |
| is_active | boolean | Default `true` |
| sort_order | integer | Default `0` |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |

Seed V1 categories:

| slug | name |
|---|---|
| garage | Garage |
| car_wash | Car Wash |
| towing | Towing |
| puc_center | PUC Center |
| denting_painting | Denting and Painting |
| service_center | Service Center |
| showroom | Showroom |
| driver_service | Driver Service |

---

### 3.12 Table: `vendor_profiles`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to `users.id`, unique, not null |
| owner_name | varchar(120) | Not null |
| business_name | varchar(150) | Nullable until profile completion |
| primary_category_id | uuid | Foreign key to `service_categories.id`, nullable |
| shop_address | text | Nullable |
| state | varchar(80) | Nullable |
| city | varchar(80) | Nullable |
| pincode | varchar(10) | Nullable |
| latitude | numeric(10,7) | Nullable |
| longitude | numeric(10,7) | Nullable |
| about_business | text | Nullable |
| shop_image_asset_id | uuid | Foreign key to `file_assets.id`, nullable |
| approval_status | vendor_approval_status | Default `draft` |
| approved_by | uuid | Foreign key to `users.id`, nullable |
| approved_at | timestamptz | Nullable |
| rejection_reason | text | Nullable |
| suspended_reason | text | Nullable |
| average_rating | numeric(3,2) | Default `0.00` |
| review_count | integer | Default `0` |
| total_profile_views | integer | Default `0` |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |
| deleted_at | timestamptz | Nullable |

---

### 3.13 Table: `vendor_services`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| vendor_id | uuid | Foreign key to `vendor_profiles.id`, not null |
| category_id | uuid | Foreign key to `service_categories.id`, not null |
| service_name | varchar(120) | Nullable |
| description | text | Nullable |
| price_range | varchar(80) | Nullable |
| is_primary | boolean | Default `false` |
| is_active | boolean | Default `true` |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |

---

### 3.14 Table: `vendor_documents`

Stores vendor verification documents. Files are stored in Cloudinary, and file details are stored in `file_assets`.

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| vendor_id | uuid | Foreign key to `vendor_profiles.id`, not null |
| document_type | vendor_document_type | Not null |
| document_number | varchar(100) | Nullable |
| file_asset_id | uuid | Foreign key to `file_assets.id`, not null |
| status | document_status | Default `pending` |
| rejection_reason | text | Nullable |
| verified_by | uuid | Foreign key to `users.id`, nullable |
| verified_at | timestamptz | Nullable |
| uploaded_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |

Recommended constraints:

- `UNIQUE(vendor_id, document_type)`

---

### 3.15 Table: `vendor_photos`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| vendor_id | uuid | Foreign key to `vendor_profiles.id`, not null |
| file_asset_id | uuid | Foreign key to `file_assets.id`, not null |
| media_type | media_type | `image` or `video` |
| caption | varchar(200) | Nullable |
| sort_order | integer | Default `0` |
| created_at | timestamptz | Default `now()` |

---

### 3.16 Table: `vendor_contacts`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| vendor_id | uuid | Foreign key to `vendor_profiles.id`, not null |
| contact_person_name | varchar(120) | Not null |
| designation | varchar(80) | Nullable |
| mobile_number | varchar(20) | Not null |
| whatsapp_number | varchar(20) | Nullable |
| email | varchar(150) | Nullable |
| is_primary | boolean | Default `false` |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |

---

### 3.17 Table: `vendor_timings`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| vendor_id | uuid | Foreign key to `vendor_profiles.id`, not null |
| day_of_week | smallint | 0 = Sunday, 1 = Monday, ..., 6 = Saturday |
| open_time | time | Nullable when closed |
| close_time | time | Nullable when closed |
| is_closed | boolean | Default `false` |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |

---

### 3.18 Table: `vendor_social_links`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| vendor_id | uuid | Foreign key to `vendor_profiles.id`, not null |
| platform | varchar(50) | Example: facebook, instagram, whatsapp, youtube, website |
| url | text | Not null |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |

---

### 3.19 Table: `visitor_leads`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| vendor_id | uuid | Foreign key to `vendor_profiles.id`, not null |
| customer_id | uuid | Foreign key to `customer_profiles.id`, nullable |
| vehicle_id | uuid | Foreign key to `vehicles.id`, nullable |
| category_id | uuid | Foreign key to `service_categories.id`, nullable |
| customer_name | varchar(120) | Nullable |
| mobile_number | varchar(20) | Nullable |
| vehicle_number | varchar(20) | Nullable |
| vehicle_type | vehicle_type | Nullable |
| service_type_text | varchar(120) | Nullable |
| lead_source | varchar(50) | Example: `provider_view`, `call_now`, `directions`, `share` |
| visit_date | date | Nullable |
| arrival_time | time | Nullable |
| status | lead_status | Default `new` |
| notes | text | Nullable |
| address | text | Nullable |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |

---

### 3.20 Table: `towing_leads`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| vendor_id | uuid | Foreign key to `vendor_profiles.id`, not null |
| customer_id | uuid | Foreign key to `customer_profiles.id`, nullable |
| vehicle_id | uuid | Foreign key to `vehicles.id`, nullable |
| customer_name | varchar(120) | Nullable |
| mobile_number | varchar(20) | Nullable |
| gps_latitude | numeric(10,7) | Nullable |
| gps_longitude | numeric(10,7) | Nullable |
| pickup_address | text | Nullable |
| service_type | varchar(120) | Default `Towing` |
| vehicle_details | text | Nullable |
| distance_km | numeric(6,2) | Nullable |
| status | towing_lead_status | Default `new` |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |

---

### 3.21 Table: `complaints`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| created_by_user_id | uuid | Foreign key to `users.id`, not null |
| against_user_id | uuid | Foreign key to `users.id`, nullable |
| vendor_id | uuid | Foreign key to `vendor_profiles.id`, nullable |
| subject | varchar(200) | Not null |
| description | text | Not null |
| priority | complaint_priority | Default `medium` |
| status | complaint_status | Default `open` |
| assigned_admin_id | uuid | Foreign key to `users.id`, nullable |
| resolution_note | text | Nullable |
| resolved_at | timestamptz | Nullable |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |

---

### 3.22 Table: `notifications`

Stores notification records shown inside apps and admin website.

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to `users.id`, nullable |
| title | varchar(160) | Not null |
| message | text | Not null |
| type | notification_type | Not null |
| entity_type | varchar(80) | Nullable |
| entity_id | uuid | Nullable |
| fcm_sent | boolean | Default `false` |
| fcm_sent_at | timestamptz | Nullable |
| payload | jsonb | Nullable |
| is_read | boolean | Default `false` |
| read_at | timestamptz | Nullable |
| created_at | timestamptz | Default `now()` |

---

### 3.23 Table: `file_assets`

Stores Cloudinary metadata for uploaded documents, photos, and images.

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| uploaded_by_user_id | uuid | Foreign key to `users.id`, nullable |
| original_file_name | varchar(255) | Not null |
| mime_type | varchar(120) | Not null |
| file_size_bytes | bigint | Not null |
| media_type | media_type | Not null |
| purpose | varchar(80) | Example: `vendor_document`, `shop_image`, `vehicle_document`, `profile_photo` |
| cloudinary_public_id | text | Not null |
| cloudinary_secure_url | text | Not null |
| cloudinary_resource_type | varchar(30) | Example: `image`, `video`, `raw`, `auto` |
| cloudinary_folder | varchar(150) | Example: `roadmate/vendor-documents` |
| created_at | timestamptz | Default `now()` |

Relationships:

- One file can be linked to customer profile photo.
- One file can be linked to vehicle documents.
- One file can be linked to vendor documents.
- One file can be linked to vendor photos.
- One file can be linked to vendor shop image.

---

### 3.24 Table: `platform_settings`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| setting_key | varchar(120) | Primary key |
| setting_value | jsonb | Not null |
| description | text | Nullable |
| updated_by | uuid | Foreign key to `users.id`, nullable |
| updated_at | timestamptz | Default `now()` |

Example settings:

- `brand_name`
- `default_city`
- `document_expiry_warning_days`
- `support_email`
- `support_phone`
- `enabled_service_categories`
- `fcm_notifications_enabled`
- `cloudinary_upload_enabled`

---

### 3.25 Table: `audit_logs`

| Column Name | Type | Constraints / Notes |
|---|---|---|
| id | uuid | Primary key |
| actor_user_id | uuid | Foreign key to `users.id`, nullable |
| action | varchar(120) | Example: `vendor_approved`, `vendor_rejected`, `login_success` |
| entity_type | varchar(80) | Example: `vendor`, `customer`, `vehicle_document` |
| entity_id | uuid | Nullable |
| metadata | jsonb | Nullable |
| created_at | timestamptz | Default `now()` |

---

### 3.26 Main Database Relationships Summary

```txt
users 1 ─── 1 customer_profiles
users 1 ─── 1 vendor_profiles
users 1 ─── 1 admin_profiles

users 1 ─── many refresh_tokens
users 1 ─── many otp_verifications
users 1 ─── many fcm_device_tokens
users 1 ─── many notifications

customer_profiles 1 ─── many vehicles
vehicles 1 ─── many vehicle_documents

vendor_profiles many ─── many service_categories
vendor_profiles 1 ─── many vendor_services
vendor_profiles 1 ─── many vendor_documents
vendor_profiles 1 ─── many vendor_photos
vendor_profiles 1 ─── many vendor_contacts
vendor_profiles 1 ─── many vendor_timings
vendor_profiles 1 ─── many vendor_social_links
vendor_profiles 1 ─── many visitor_leads
vendor_profiles 1 ─── many towing_leads

customer_profiles 1 ─── many visitor_leads
vehicles 1 ─── many visitor_leads

users 1 ─── many complaints
vendor_profiles 1 ─── many complaints

file_assets 1 ─── many vehicle_documents
file_assets 1 ─── many vendor_documents
file_assets 1 ─── many vendor_photos
file_assets 1 ─── many profile/shop images
```

---

## 4. User Roles and Auth

### 4.1 User Roles

| Role | App / Website | Description |
|---|---|---|
| customer | Roadmate Customer App | Vehicle owner who can add vehicles, view documents, and find nearby services. |
| vendor | Roadmate Vendor App | Service provider who can register business, upload documents, and manage business after approval. |
| super_admin | Roadmate Admin Web Application | Platform admin who manages vendors, customers, services, complaints, reports, and settings. |

---

### 4.2 Auth Strategy

Authentication process:

1. User enters email/mobile or uses Google login.
2. Backend validates request.
3. Backend sends OTP for login/registration.
4. User verifies OTP.
5. Backend creates or finds user account.
6. Backend returns:
   - Access token
   - Refresh token
   - User role
   - Profile status
7. Mobile app stores tokens in Expo SecureStore.
8. Admin web stores token in secure browser storage approach.
9. Every protected request sends token in Authorization header.
10. Frontend sends FCM token to backend after login.

---

### 4.3 Role Enforcement

Role enforcement must happen in backend, not only frontend.

Use middleware:

```txt
authenticate()
authorizeRoles("customer")
authorizeRoles("vendor")
authorizeRoles("super_admin")
requireVendorApproval()
```

Example routes:

```txt
GET /api/customer/vehicles
Middleware: authenticate + authorizeRoles(customer)

GET /api/vendor/dashboard
Middleware: authenticate + authorizeRoles(vendor) + requireVendorApproval

POST /api/admin/vendors/:vendorId/approve
Middleware: authenticate + authorizeRoles(super_admin)
```

---

### 4.4 Customer Permissions

Customer can:

- Register and login.
- Add vehicles.
- View and manage own vehicles.
- View document status for own vehicles.
- Upload profile image or vehicle document image/file if required.
- View nearby service providers.
- Filter providers.
- Open provider detail.
- Call provider.
- Open directions.
- Share provider details.
- Receive FCM notifications.
- Create complaint.

Customer cannot:

- Access vendor dashboard.
- Access admin website.
- Approve vendors.
- View other customers' vehicle data.
- Edit vendor business profile.

Backend rule:

```txt
customer_profiles.user_id must match logged-in user id.
vehicles.customer_id must match logged-in customer's customer profile id.
vehicle_documents.vehicle_id must belong to logged-in customer's vehicle.
```

---

### 4.5 Vendor Permissions

Vendor can:

- Register business.
- Complete business profile.
- Upload shop image and verification documents to Cloudinary through backend.
- View pending approval status.
- Receive FCM notification after approval/rejection.
- Access vendor dashboard only after approval.
- Edit own business information.
- Upload business photos/videos.
- Add contacts, timings, categories, and social links.
- View own visitor leads.
- View own towing leads if category is towing.
- Contact visitors using call or WhatsApp.

Vendor cannot:

- Approve own account.
- Access customer private document data.
- Manage other vendors.
- Access admin settings.
- Change platform-level service categories.
- Access payment/commission/settlement modules in V1.

Backend rule:

```txt
vendor_profiles.user_id must match logged-in user id.
vendor_profiles.approval_status must be 'approved' before dashboard access.
vendor_id in request path must match logged-in vendor profile id.
```

---

### 4.6 Super Admin Permissions

Super Admin can:

- Login to Roadmate Admin web app.
- View dashboard KPIs.
- Manage vendors.
- Approve, reject, suspend, block, or activate vendors.
- View uploaded vendor documents from Cloudinary secure URLs.
- View customers.
- View customer profiles.
- Manage service categories.
- View complaints.
- Update complaint status.
- View reports overview.
- Manage platform settings.
- View admin notifications.
- Send notifications through backend if required.

Super Admin cannot:

- Directly change government document data without valid source/API.
- Use payment, commission, or settlement flows in V1.
- Use real DigiLocker, Parivahan, IIB, or MapMyIndia integration until those integrations are implemented.

---

## 5. Module List

### 5.1 Roadmate Customer App Modules

| Module | Main Pages | Purpose |
|---|---|---|
| Auth Module | Splash, Welcome, Login, OTP Verification | Handles customer login and session. |
| Dashboard Module | Customer Dashboard, Vehicle Switcher | Shows user info, location, selected vehicle, and document status. |
| Vehicle Module | Add Vehicle, Vehicle Details | Allows customer to add and manage vehicles. |
| Information Hub Module | Information Hub, Document Detail | Shows PUC, RC Book, Driving License, and Insurance status. |
| Services Module | Service Home, Provider List, Provider Detail | Helps customer find nearby mobility services. |
| Directions Module | Direction Screen | Shows route-style screen for provider location. |
| Notifications Module | Notification List, FCM Handler | Shows app notifications and handles push notification clicks. |
| Upload Module | Profile Image Upload, Document Upload | Sends selected images/files to backend and Cloudinary. |
| Profile Module | Profile, Settings | Shows customer profile and basic settings. |

---

### 5.2 Roadmate Vendor App Modules

| Module | Main Pages | Purpose |
|---|---|---|
| Vendor Auth Module | Vendor Landing, Vendor Login, Vendor Register, Vendor OTP | Handles vendor registration and login. |
| Vendor Onboarding Module | Business Profile, Document Upload, Pending Approval, Account Approved | Handles business profile and document verification steps. |
| Vendor Dashboard Module | Vendor Dashboard | Shows business summary, location, visitors, and recent activity. |
| Business Management Module | Edit Business, Photos/Videos, Contact Details, Timings, Categories, Social Links | Allows vendor to update business listing details. |
| Upload Module | Shop Image, Business Photos, Verification Documents | Uploads selected images/files to backend and Cloudinary. |
| Visitors Module | Visitor List, Visitor Detail | Shows customer visitor/lead information. |
| Towing Module | Active Towing Lead | Shows towing lead information for towing vendors. |
| Notifications Module | Vendor Notifications, FCM Handler | Shows approval/rejection/lead notifications. |
| Vendor Profile Module | Vendor Profile | Shows vendor account and business profile. |

---

### 5.3 Roadmate Admin Web Modules

| Module | Main Pages | Purpose |
|---|---|---|
| Admin Auth Module | Admin Login | Handles super admin login. |
| Admin Dashboard Module | Dashboard | Shows KPIs and recent platform activity. |
| Vendor Management Module | Vendor List, Vendor Detail | Allows admin to view, approve, reject, suspend, block, or activate vendors. |
| Customer Management Module | Customer List, Customer Detail | Allows admin to view customer profiles and vehicles. |
| Service Management Module | Service Management, Service-wise Vendor List | Allows admin to manage service categories and service-wise vendors. |
| Complaints Module | Complaint List, Complaint Detail | Allows admin to manage customer/vendor complaints. |
| Reports Module | Reports Overview | Shows basic reports overview for V1. |
| Notifications Module | Admin Notifications | Shows vendor registration, complaint, and system updates. |
| Settings Module | Platform Settings | Allows admin to manage platform settings. |

Important: Roadmate Admin is a web app only. Do not use Expo in admin web.

---

### 5.4 Backend Modules

| Backend Module | Main Responsibility |
|---|---|
| Auth Module | Login, OTP verification, JWT, refresh token, logout. |
| User Module | Common user data and roles. |
| Customer Module | Customer profile and location. |
| Vehicle Module | Add vehicle, list vehicles, select vehicle. |
| Vehicle Document Module | Store document status and document details. |
| Service Category Module | Manage Garage, Car Wash, Towing, PUC, Denting, Service Center, etc. |
| Vendor Module | Vendor registration, business profile, approval status, listing search. |
| Vendor Document Module | Upload and verify vendor documents. |
| Vendor Business Module | Photos, contacts, timings, categories, social links. |
| Lead Module | Visitor leads and towing leads. |
| Complaint Module | Create and manage complaints. |
| Notification Module | Store notifications and send FCM push notifications. |
| File Module | Upload files to Cloudinary and store metadata. |
| Admin Module | Admin dashboard, vendor approval, customer list, reports overview, settings. |

---

## 6. Key Data Flows

### Flow 1: Customer Login, FCM Registration, Add Vehicle, and View Document Status

1. Customer opens Roadmate Customer App.
2. Splash screen checks if access token exists in Expo SecureStore.
3. If no valid session exists, customer goes to Welcome/Login screen.
4. Customer enters email/mobile or chooses Google login.
5. Backend creates OTP and sends it through mock SMS/email provider.
6. Customer enters OTP.
7. Backend verifies OTP.
8. Backend creates customer user if new user.
9. Backend returns JWT access token and refresh token.
10. App stores tokens in Expo SecureStore.
11. App asks notification permission.
12. App gets FCM token.
13. App sends FCM token to backend.
14. Backend stores token in `fcm_device_tokens`.
15. Customer reaches dashboard.
16. Customer taps Add Vehicle.
17. Customer enters vehicle number, vehicle type, brand, model, and fuel type.
18. Backend creates record in `vehicles`.
19. Backend creates initial records in `vehicle_documents`.
20. Customer opens Information Hub.
21. App calls backend for selected vehicle documents.
22. Backend returns document status.
23. App shows valid, expiring soon, or expired state.

Main tables:

- `users`
- `customer_profiles`
- `refresh_tokens`
- `fcm_device_tokens`
- `vehicles`
- `vehicle_documents`
- `notifications`

---

### Flow 2: Vendor Registration, Cloudinary Upload, and Admin Approval

1. Vendor opens Roadmate Vendor App.
2. Vendor taps Register as Vendor.
3. Vendor enters owner name, mobile number, email, and business category.
4. Backend creates user with role `vendor`.
5. Backend creates vendor profile with status `draft`.
6. Backend sends OTP.
7. Vendor enters OTP.
8. Backend verifies OTP.
9. Vendor app asks notification permission.
10. Vendor app gets FCM token.
11. Vendor app sends FCM token to backend.
12. Backend stores token in `fcm_device_tokens`.
13. Vendor completes business profile.
14. Vendor selects shop image using Expo ImagePicker.
15. Vendor app sends image to backend using FormData.
16. Backend uploads image to Cloudinary.
17. Backend saves Cloudinary metadata in `file_assets`.
18. Vendor uploads Aadhaar front, Aadhaar back, PAN, GST certificate, and shop license.
19. Backend uploads documents/images to Cloudinary.
20. Backend stores document records in `vendor_documents`.
21. Backend changes vendor status to `pending_approval`.
22. Backend creates admin notification.
23. Backend sends FCM notification to admin if admin FCM token is available.
24. Admin logs in to Roadmate Admin web app.
25. Admin opens Vendor Management.
26. Admin reviews vendor details and Cloudinary document URLs.
27. Admin approves or rejects vendor.
28. If approved, backend changes status to `approved`.
29. Backend sends FCM notification to vendor: account approved.
30. Vendor can now access dashboard and appear in customer service search.

Main tables:

- `users`
- `vendor_profiles`
- `vendor_documents`
- `file_assets`
- `service_categories`
- `vendor_services`
- `notifications`
- `fcm_device_tokens`
- `audit_logs`

---

### Flow 3: Customer Searches Nearby Service and Contacts Provider

1. Customer opens Roadmate Customer App.
2. Customer goes to Services module.
3. App gets customer city/location.
4. App shows categories like Garage, Car Wash, Towing, PUC Center, Denting and Painting, Service Center.
5. Customer selects category.
6. App calls backend:

```txt
GET /api/customer/service-providers?category=garage&city=Jalgaon&filter=nearest
```

7. Backend checks service category.
8. Backend finds vendors linked with selected category.
9. Backend returns only approved vendors.
10. App shows provider list.
11. Customer filters by Top Rated, Open Now, or Nearest.
12. Customer opens provider detail.
13. Backend creates visitor lead with lead source `provider_view`.
14. Customer taps Call Now.
15. App opens phone dialer.
16. Backend updates or creates lead source `call_now`.
17. Customer taps Directions.
18. App opens mock MapMyIndia-style direction screen.
19. Backend updates lead source `directions`.
20. Customer taps Share.
21. App opens native share sheet.
22. Backend updates lead source `share`.
23. Backend may send FCM notification to vendor: new customer interaction/lead.

Main tables:

- `service_categories`
- `vendor_profiles`
- `vendor_services`
- `vendor_contacts`
- `vendor_timings`
- `vendor_photos`
- `visitor_leads`
- `notifications`
- `fcm_device_tokens`

Important rule:

```txt
Only approved vendors should appear in customer search.
Booking and payment are not included.
```

---

## 7. Suggested API Endpoints

### 7.1 Auth APIs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/request-otp` | Public | Request OTP for login or registration. |
| POST | `/api/auth/verify-otp` | Public | Verify OTP and return tokens. |
| POST | `/api/auth/google-login` | Public | Login using Google. |
| POST | `/api/auth/refresh-token` | Public | Generate new access token using refresh token. |
| POST | `/api/auth/logout` | Logged-in user | Revoke refresh token. |
| GET | `/api/auth/me` | Logged-in user | Get current logged-in user profile. |

---

### 7.2 FCM Notification APIs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/notifications/fcm-token` | Logged-in user | Save or update FCM token. |
| DELETE | `/api/notifications/fcm-token` | Logged-in user | Deactivate FCM token on logout. |
| GET | `/api/notifications` | Logged-in user | Get in-app notifications. |
| PATCH | `/api/notifications/:notificationId/read` | Logged-in user | Mark one notification as read. |
| PATCH | `/api/notifications/read-all` | Logged-in user | Mark all notifications as read. |

---

### 7.3 File Upload APIs - Cloudinary

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/files/upload` | Logged-in user | Upload image/file to Cloudinary through backend. |
| GET | `/api/files/:fileId` | Logged-in user | Get uploaded file metadata. |
| DELETE | `/api/files/:fileId` | Owner/Admin | Delete or deactivate file record if allowed. |

Upload request should use `multipart/form-data`.

Common upload purposes:

```txt
profile_photo
shop_image
vendor_document
vendor_photo
vehicle_document
```

---

### 7.4 Customer APIs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/customer/profile` | Customer | Get customer profile. |
| PATCH | `/api/customer/profile` | Customer | Update customer profile. |
| GET | `/api/customer/vehicles` | Customer | List own vehicles. |
| POST | `/api/customer/vehicles` | Customer | Add new vehicle. |
| GET | `/api/customer/vehicles/:vehicleId` | Customer | Get vehicle detail. |
| PATCH | `/api/customer/vehicles/:vehicleId/select` | Customer | Mark selected vehicle. |
| GET | `/api/customer/vehicles/:vehicleId/documents` | Customer | Get vehicle documents. |
| GET | `/api/customer/documents/:documentId` | Customer | Get document detail. |

---

### 7.5 Service Discovery APIs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/services/categories` | Logged-in user | List service categories. |
| GET | `/api/customer/service-providers` | Customer | Search providers by category, city, nearest, open now, top rated. |
| GET | `/api/customer/service-providers/:vendorId` | Customer | Get provider detail. |
| POST | `/api/customer/service-providers/:vendorId/lead` | Customer | Track provider view, call, direction, or share action. |

---

### 7.6 Vendor APIs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/vendor/register` | Public | Start vendor registration. |
| GET | `/api/vendor/profile` | Vendor | Get own vendor profile. |
| PATCH | `/api/vendor/profile` | Vendor | Update business profile. |
| POST | `/api/vendor/documents` | Vendor | Upload vendor document and connect Cloudinary file. |
| GET | `/api/vendor/approval-status` | Vendor | Check approval status. |
| GET | `/api/vendor/dashboard` | Approved Vendor | Get dashboard data. |
| PATCH | `/api/vendor/business` | Approved Vendor | Edit business details. |
| POST | `/api/vendor/photos` | Approved Vendor | Upload business photo/video. |
| GET | `/api/vendor/visitors` | Approved Vendor | View visitor leads. |
| GET | `/api/vendor/visitors/:leadId` | Approved Vendor | View visitor detail. |
| GET | `/api/vendor/towing-leads` | Approved Towing Vendor | View towing leads. |

---

### 7.7 Admin APIs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/admin/dashboard` | Super Admin | Get dashboard KPIs. |
| GET | `/api/admin/vendors` | Super Admin | List vendors with filters. |
| GET | `/api/admin/vendors/:vendorId` | Super Admin | View vendor detail. |
| POST | `/api/admin/vendors/:vendorId/approve` | Super Admin | Approve vendor. |
| POST | `/api/admin/vendors/:vendorId/reject` | Super Admin | Reject vendor. |
| POST | `/api/admin/vendors/:vendorId/suspend` | Super Admin | Suspend vendor. |
| POST | `/api/admin/vendors/:vendorId/block` | Super Admin | Block vendor. |
| POST | `/api/admin/vendors/:vendorId/activate` | Super Admin | Activate vendor. |
| GET | `/api/admin/customers` | Super Admin | List customers. |
| GET | `/api/admin/customers/:customerId` | Super Admin | View customer detail. |
| GET | `/api/admin/services` | Super Admin | View service categories. |
| PATCH | `/api/admin/services/:categoryId` | Super Admin | Update service category. |
| GET | `/api/admin/complaints` | Super Admin | List complaints. |
| PATCH | `/api/admin/complaints/:complaintId` | Super Admin | Update complaint status. |
| GET | `/api/admin/reports/overview` | Super Admin | View basic reports overview. |
| GET | `/api/admin/settings` | Super Admin | View platform settings. |
| PATCH | `/api/admin/settings/:settingKey` | Super Admin | Update platform setting. |

No payment APIs should be created in V1.

---

## 8. V1 Build Priority

### Phase 1: Project Setup

1. Setup monorepo.
2. Setup Customer App using Expo React Native JavaScript.
3. Setup Vendor App using Expo React Native JavaScript.
4. Setup Admin Web using React + Vite JavaScript.
5. Setup Backend using Node.js + Express.js JavaScript.
6. Setup PostgreSQL and Prisma.
7. Setup `.env.example`.

---

### Phase 2: Backend Foundation

1. Setup Express server.
2. Setup Prisma schema.
3. Setup PostgreSQL connection.
4. Setup JWT authentication.
5. Setup OTP mock service.
6. Setup role-based middleware.
7. Setup Cloudinary config.
8. Setup Firebase Admin SDK for FCM.
9. Setup file upload module.
10. Setup notification module.

---

### Phase 3: Customer App

1. Auth screens.
2. Secure token storage.
3. FCM token registration.
4. Customer dashboard.
5. Add vehicle.
6. Vehicle switcher.
7. Information Hub.
8. Document detail.
9. Service category list.
10. Provider list.
11. Provider detail.
12. Call, Directions, and Share actions.
13. Notification list.

---

### Phase 4: Vendor App

1. Vendor landing and auth.
2. Secure token storage.
3. FCM token registration.
4. Vendor registration.
5. Business profile.
6. Shop image upload to Cloudinary through backend.
7. Document upload to Cloudinary through backend.
8. Pending approval screen.
9. Account approved notification.
10. Vendor dashboard after approval.
11. Edit business details.
12. Visitor list and visitor detail.
13. Towing lead screen.

---

### Phase 5: Admin Web

1. Admin login.
2. Admin dashboard.
3. Vendor list.
4. Vendor detail.
5. Cloudinary document preview.
6. Vendor approval/rejection.
7. Customer list.
8. Service management.
9. Complaints.
10. Settings.
11. Reports overview.
12. Notifications panel.

---

### Phase 6: Testing and Cleanup

1. Test all login flows.
2. Test JWT role protection.
3. Test FCM token save.
4. Test FCM notifications for vendor approval.
5. Test Cloudinary image/document upload.
6. Test customer vehicle flow.
7. Test document status.
8. Test service category filtering.
9. Test vendor registration and approval.
10. Test admin actions.
11. Remove any old payment UI, payment routes, commission, and settlement references.
12. Remove old names like MoveMate, Rydo, and MobilityPlatform.
13. Keep only Roadmate and Roadmate Admin branding.

---

## 9. Important V1 Decisions

1. Use JavaScript, not TypeScript.
2. Customer mobile app must use Expo.
3. Vendor mobile app must use Expo.
4. Super Admin must be a web application using React + Vite.
5. Do not use Expo for Super Admin.
6. Use FCM for notifications.
7. Use Cloudinary for images and uploaded files.
8. Use PostgreSQL as database.
9. Use Prisma ORM.
10. Use JWT for authentication.
11. Do not add payment gateway for now.
12. Do not add booking, payment, commission, and settlement in V1.
13. Customer service flow is discovery based: View Provider, Call Now, Directions, and Share.
14. Vendor app should focus on registration, approval, business profile, Cloudinary upload, notifications, and leads.
15. Admin website should focus on vendor approval, customer view, services, complaints, reports overview, settings, and notifications.
16. Real government and map integrations can be added later after mock V1 is stable.

---

## 10. Development Rules for Student Team

1. Do not start coding without reading the PRD and this Technical Specifications document.
2. Use JavaScript everywhere.
3. Do not create `.ts` or `.tsx` files.
4. Use `.jsx` for React and React Native components.
5. Use `.js` for services, utilities, stores, backend files, and config files.
6. Customer and Vendor apps should be Expo apps.
7. Admin web should be React + Vite, not Expo.
8. Keep frontend and backend separate but in the same monorepo.
9. Use clear file names.
10. Do not put all code in one file.
11. Do not write business logic directly inside screen components.
12. Use API service files for backend calls.
13. Use schemas for validation instead of TypeScript types.
14. Use middleware for auth and roles.
15. Never trust frontend role checks only.
16. Always check role and ownership in backend.
17. Store passwords using bcrypt.
18. Store refresh tokens as hash, not plain text.
19. Do not store Aadhaar/PAN sensitive data in JWT.
20. Store uploaded images/files in Cloudinary, not inside project folders.
21. Store Cloudinary metadata in `file_assets`.
22. Register FCM token after login.
23. Deactivate FCM token on logout if possible.
24. Do not build payment or booking unless V1 scope changes.
25. Keep UI branding consistent with Roadmate.
26. Use environment variables for secrets.
27. Keep `.env` out of GitHub.
28. Commit code module by module.
29. Test with seed data before connecting real APIs.
30. Use mock integrations first, then replace with real services later.

---

## 11. Environment Variables

Create `.env.example` in the backend.

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=postgresql://postgres:password@localhost:5432/roadmate_db

JWT_ACCESS_SECRET=replace_with_access_secret
JWT_REFRESH_SECRET=replace_with_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

OTP_EXPIRY_MINUTES=5

CORS_ORIGIN=http://localhost:5173

CLOUDINARY_CLOUD_NAME=replace_with_cloud_name
CLOUDINARY_API_KEY=replace_with_api_key
CLOUDINARY_API_SECRET=replace_with_api_secret
CLOUDINARY_FOLDER=roadmate

FIREBASE_PROJECT_ID=replace_with_project_id
FIREBASE_CLIENT_EMAIL=replace_with_client_email
FIREBASE_PRIVATE_KEY=replace_with_private_key

MAPMYINDIA_API_KEY=mock_for_v1
DIGILOCKER_CLIENT_ID=mock_for_v1
DIGILOCKER_CLIENT_SECRET=mock_for_v1
PARIVAHAN_API_KEY=mock_for_v1
IIB_API_KEY=mock_for_v1
```

Mobile app environment examples:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000/api
EXPO_PUBLIC_APP_NAME=Roadmate
```

Admin web environment examples:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Roadmate Admin
```

No payment gateway environment variables should be added in V1.

---

## 12. Package Recommendations

### 12.1 Customer App and Vendor App

```bash
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npm install zustand
npm install axios
npm install @tanstack/react-query
npm install react-hook-form
npm install yup
npm install expo-secure-store
npm install @react-native-async-storage/async-storage
npm install expo-notifications
npm install expo-device
npm install expo-image-picker
npm install expo-file-system
npm install lucide-react-native
```

### 12.2 Admin Web

```bash
npm install react-router-dom
npm install zustand
npm install axios
npm install @tanstack/react-query
npm install react-hook-form
npm install yup
npm install recharts
npm install @tanstack/react-table
npm install lucide-react
```

### 12.3 Backend

```bash
npm install express cors helmet express-rate-limit dotenv
npm install prisma @prisma/client
npm install jsonwebtoken bcrypt
npm install joi
npm install multer cloudinary
npm install firebase-admin
npm install winston
npm install nodemon --save-dev
```

---

## 13. Final Notes

Roadmate V1 should be treated as a clean and realistic first production-style project.

The most important updated technical decisions are:

1. **JavaScript only**
2. **Expo for Customer and Vendor mobile apps**
3. **React + Vite web app for Roadmate Admin**
4. **FCM for notifications**
5. **Cloudinary for images and uploaded files**
6. **No payment gateway for now**

Roadmate V1 should first prove that:

- Customers can manage vehicles and documents.
- Customers can find nearby approved service providers.
- Vendors can register, upload documents, and get approved.
- Uploaded images/files are stored through Cloudinary.
- Users receive important notifications through FCM.
- Admin can control vendors, services, customers, complaints, reports overview, and settings.
- Roles and permissions are enforced correctly from the backend.
