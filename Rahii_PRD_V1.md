## PRD - Roadmate V1

Smart Mobility Ecosystem with Customer App, Vendor App, and Super Admin

Website

## Product Requirements Document

Prepared from the Raw Requirement. Updated branding decision: both mobile apps will currently

use the same product name, Roadmate.

## Branding Update

Customer Mobile App name: Roadmate

Vendor Mobile App name: Roadmate

Super Admin Website name: Roadmate Admin

Old mixed names such as MoveMate Vendor, Rydo, and MobilityPlatform should be removed from the V1 product documentation and replaced with Roadmate branding.

This PRD is written in simple language so a student team can understand what to build first, what to keep for later, and how to measure success.


## 1. Product Overview

Roadmate is a smart mobility ecosystem for India. It helps vehicle owners manage vehicle documents and find nearby mobility services from one mobile app.

The platform has three parts: a Roadmate customer mobile app, a Roadmate vendor mobile app, and a Roadmate Admin website. Version 1 will focus on document management, service discovery, vendor onboarding, vendor approval, and basic admin control.

Booking, online payment, commission, and settlement are not included in Version 1 because the current customer app flow is mainly focused on call, directions, and provider discovery.

## 2. Target Users

## 2.1 Customer / Vehicle Owner

- \- Owns a car, bike, scooty, or EV.

- \- Wants to store or view PUC, RC Book, Driving License, and Insurance status.

- \- Wants to find nearby garage, car wash, towing, PUC center, denting, or service center.

- \- Wants quick actions like Call Now, Directions, and Share.

## 2.2 Vendor / Service Provider

- \- Garage, car wash center, PUC center, towing provider, service center, denting-painting shop, or showroom.

- \- Wants to register business online and appear in nearby service search.

- \- Wants to manage business profile, contact details, timings, photos, and services.

- \- Needs admin approval before accessing the full vendor dashboard.

## 2.3 Super Admin

- \- Platform owner or admin team.

- \- Manages vendors, customers, service categories, complaints, reports, and settings.

- \- Approves, rejects, suspends, blocks, or activates vendors.

- \- Controls Roadmate platform data and operations from the admin website.

## 3. Core Features for Version 1 (Must-have)

## 3.1 Roadmate Customer App

- \- Splash screen and welcome screen.

- \- Login using Google or Email.

- \- OTP verification.

- \- Save login session so returning users go directly to dashboard.

- \- Personalized dashboard with user name, profile photo, email, location, notification icon, and menu.

- \- Add vehicle details such as vehicle number, vehicle type, brand, model, and fuel type.

- \- Support multiple vehicles for one user.

- \- Switch selected vehicle from dashboard.


- \- Show selected vehicle document status on dashboard.

- \- Information Hub for PUC Certificate, RC Book, Driving License, and Insurance.

- \- Document detail page with vehicle number, owner name, model, issue date, expiry date, document number, status, verified via, and last synced date.

- \- Document status colors: green for valid, orange for expiring soon, and red for expired.

- \- Document actions: Download PDF, Share, and View Full Document.

- \- Nearby services module similar to Justdial.

- \- Service categories: Garage, Car Wash, Towing, PUC Center, Denting, and Service Center.

- \- Filters: Top Rated, Open Now, and Nearest.

- \- Provider card with name, rating, reviews, distance, address, open/closed status, working hours, and phone number.

- \- Provider detail page with business details, photos, address, timings, phone number, and services offered.

- \- Actions: Call Now, Directions, and Share.

- \- MapMyIndia-style direction screen showing current location, provider location, route line, distance, ETA, traffic status, and Start Navigation button.

## 3.2 Roadmate Vendor App

- \- Vendor landing page.

- \- Vendor login.

- \- Register as vendor.

- \- Vendor registration form with owner name, mobile number, email, and business category.

- \- Business categories: Car Wash, Garage, Denting and Painting, Service Center, PUC, Showroom, and Towing.

- \- OTP verification after registration.

- \- Business profile completion with shop image, business type, shop name, shop address, state, city, location, services offered, and about business.

- \- Document upload for Aadhaar front, Aadhaar back, PAN, GST certificate, and shop license.

- \- Vendor application status: pending until admin approval.

- \- Account approved screen after admin approves the vendor.

- \- Vendor dashboard after approval.

- \- Dashboard should show location, notification, profile icon, welcome banner, search bar, business card, visitors, recent activity, and bottom navigation.

- \- Bottom navigation: Home, Listings, Manage, and Profile.

- \- Edit business details including photos/videos, business name, contact details, business timings, business categories, and social media.

- \- Visitor list with visitor ID, name, phone number, vehicle number, service type, date, arrival time, status, view details, call, and WhatsApp.

- \- Visitor profile with vehicle details, interested service, date, time, notes, address, call, and WhatsApp actions.

- \- Towing vendors can view towing lead details such as customer name, phone number, GPS location, service type, vehicle details, distance, call, WhatsApp, and location view.

## 3.3 Roadmate Admin Website


- \- Super admin login.

- \- Dashboard with KPIs such as total vendors, total customers, pending approvals, total services, and recent activities.

- \- Vendor management with search and filters.

- \- Vendor profile detail page.

- \- Vendor actions: approve, reject, suspend, block, and activate.

- \- Customer management with customer list and customer profile.

- \- Service management for Garage, Towing, Car Wash, PUC, Driver Service, Denting and Painting, and Service Center.

- \- Service-wise vendor list.

- \- Complaints management with status filters.

- \- Reports overview for admin understanding.

- \- Platform settings.

- \- Admin notifications for vendor registration, complaint, and system updates.

- \- Role-based access foundation for customer, vendor, and super admin.

## 4. Out of Scope for Version 1 (Not Building Yet)

- \- Full service booking system.

- \- Online payment system.

- \- Payment gateway integration.

- \- Platform commission system.

- \- Vendor settlement system.

- \- Customer service tracking after booking.

- \- Rate and review after completed booking.

- \- Advanced revenue analytics.

- \- Full report export in PDF, Excel, and CSV.

- \- Real DigiLocker API integration.

- \- Real Parivahan API integration.

- \- Real IIB insurance API integration.

- \- Real MapMyIndia live API integration.

- \- AI features.

- \- Referral and loyalty system.

- \- Multi-city rollout.

- \- Emergency SOS.

- \- Live GPS tracking.

- \- QR payments.

- \- Scanner feature.

- \- Advanced fraud detection and advanced audit logs.


## 5. User Roles and Permissions

| Role | Can Do | Cannot Do |
| --- | --- | --- |
| Customer / Vehicle | Register and login, add vehicles, manage | Approve vendors, manage other users, |
| Owner | vehicle documents, view nearby services, | access admin dashboard, change |
|   | filter providers, call providers, open directions, | platform settings, or edit vendor |
|   | and share provider details. | business data. |
| Vendor / Service | Register business, complete profile, upload | Approve own account, access |
| Provider | documents, wait for approval, manage | customer private document data, |
|   | business information, add photos, update | manage other vendors, access super |
|   | timings, view visitors or leads, and contact | admin settings, or change platform |
|   | visitors. | rules. |
| Super Admin | Login to admin website, manage vendors, | Directly change government document |
|   | approve or reject vendors, manage | data, verify documents without valid |
|   | customers, manage services, view | source/API, or use |
|   | complaints, view reports, and update platform | payment/commission features in V1 if |
|   | settings. | kept out of scope. |

## 6. Key Business Rules

- \- Both mobile apps must currently use the same product name: Roadmate.

- \- Super Admin Website should use Roadmate Admin branding.

- \- Old names such as MoveMate Vendor, Rydo, and MobilityPlatform should not be used in V1 product screens or documentation.

- \- A customer must login before accessing the Roadmate customer dashboard.

- \- A customer can add more than one vehicle.

- \- Vehicle document status must change based on the selected vehicle.

- \- Every document must show clear status: valid, expiring soon, or expired.

- \- RC Book and Driving License should be planned for DigiLocker verification.

- \- Insurance should be planned for IIB or insurance API verification.

- \- PUC source must be finalized before production: DigiLocker or Parivahan.

- \- A vendor cannot access the full vendor dashboard until the super admin approves the account.

- \- Vendor must upload all required verification documents before approval.

- \- Admin can approve, reject, suspend, block, or activate vendors.

- \- When a customer selects a service category, only related vendors should be shown.

- \- Example: if the customer selects Garage, only garage vendors should appear.

- \- Version 1 customer flow should focus on provider discovery, call, directions, and share.

- \- Booking, payment, commission, and settlement must remain future scope unless the team officially changes V1 scope.

- \- The UI should follow a clean, premium, blue-white design.

- \- Jalgaon can be used as the demo city, but the system should be designed for future multi-city support.

- \- Current prototype is frontend-only, so backend, database, APIs, authentication, document verification, maps, notifications, and security must be developed separately.


## 7. Success Criteria

Roadmate Version 1 will be considered successful when the following points are achieved:

- \- Customer can register and login successfully.

- \- Customer can add and manage multiple vehicles.

- \- Customer can switch selected vehicle from dashboard.

- \- Customer can view PUC, RC Book, Driving License, and Insurance status.

- \- Customer can see valid, expiring soon, and expired document states clearly.

- \- Customer can search nearby services by category.

- \- Customer can filter service providers by Top Rated, Open Now, and Nearest.

- \- Customer can open provider detail page.

- \- Customer can call a provider from the app.

- \- Customer can open directions for a provider.

- \- Customer can share provider details.

- \- Vendor can register successfully in the Roadmate vendor app.

- \- Vendor can complete business profile.

- \- Vendor can upload required verification documents.

- \- Vendor account stays pending until admin approval.

- \- Admin can approve or reject a vendor.

- \- Approved vendor can access vendor dashboard.

- \- Vendor can update business details, timings, photos, categories, and social links.

- \- Admin can view customers, vendors, services, complaints, reports overview, and settings.

- \- All V1 screens use consistent Roadmate branding.

- \- The project clearly separates V1 features from future features.

- \- The PRD is ready for backend planning, database design, API planning, and development tasks.

End of PRD
