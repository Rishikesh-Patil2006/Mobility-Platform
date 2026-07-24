const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const prisma = require('../config/prisma');
const ApiResponse = require('../utils/ApiResponse');

const DB_FILE = path.join(__dirname, '..', 'mock_db.json');

// Helper to read JSON DB
const readDb = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = { services: [], syncedListings: {} };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return { services: [], syncedListings: {} };
  }
};

// Helper to write JSON DB
const writeDb = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to write mock JSON DB:', e);
  }
};

// Fallback Mock Service Providers mapping standard listing details
const mockProviders = [
  { id: 'g1', name: 'Speed Auto Garage', category: 'Garage', rating: 4.8, reviews: 312, distance: 0.8, address: 'Near Civil Hospital, Jalgaon', open: true, hours: '9 AM – 8 PM', phone: '+91 98765 43210', verified: true, price: 199, duration: '30 mins', services: [
    { name: 'Engine Overhaul', price: 8500 },
    { name: 'Brake Service', price: 499 },
    { name: 'AC Repair & Refill', price: 1200 },
    { name: 'Wheel Alignment', price: 350 },
    { name: 'Oil Change', price: 1599 }
  ]},
  { id: 'w1', name: 'Crystal Car Wash', category: 'Car Wash', rating: 4.7, reviews: 245, distance: 1.2, address: 'MG Road, Jalgaon', open: true, hours: '7 AM – 9 PM', phone: '+91 98765 44210', verified: true, price: 299, duration: '20 mins', services: [
    { name: 'Exterior Foam Wash', price: 299 },
    { name: 'Interior Deep Cleaning', price: 999 }
  ]},
  { id: 't1', name: 'Rescue Towing 24x7', category: 'Towing', rating: 4.9, reviews: 189, distance: 1.0, address: 'Mumbai Highway, Jalgaon', open: true, hours: '24 Hours', phone: '+91 98765 55210', verified: true, price: 999, duration: '15 mins', services: [
    { name: 'Flatbed Towing', price: 1999 },
    { name: 'Hydraulic Underlift Towing', price: 999 }
  ]},
  { id: 'p1', name: 'Jalgaon PUC Center', category: 'PUC Center', rating: 4.6, reviews: 312, distance: 2.1, address: 'NH-6, Toll Plaza, Jalgaon', open: true, hours: '9 AM – 7 PM', phone: '+91 98765 66210', verified: true, price: 99, duration: '10 mins', services: [
    { name: 'Petrol / CNG Emission Test', price: 99 },
    { name: 'Diesel PUC Testing', price: 120 }
  ]}
];

// ── GET CATEGORIES LIST ──
router.get('/categories', async (req, res, next) => {
  try {
    let categories = [];
    try {
      categories = await prisma.serviceCategory.findMany();
    } catch (e) {
      // Offline
    }
    
    if (categories.length === 0) {
      categories = [
        { id: 'c1', name: 'Garage', description: 'Repairs & general maintenance' },
        { id: 'c2', name: 'Car Wash', description: 'Washing, detailing, waxing' },
        { id: 'c3', name: 'Towing', description: 'Breakdown roadside assistance' },
        { id: 'c4', name: 'PUC Center', description: 'Emission checks & PUC certificates' },
        { id: 'c5', name: 'Denting & Painting', description: 'Body shop & scratch repairs' },
        { id: 'c6', name: 'Service Center', description: 'Scheduled inspections & tuning' },
        { id: 'c7', name: 'Showroom', description: 'Authorized brand outlets' }
      ];
    }

    res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully'));
  } catch (error) {
    next(error);
  }
});

// ── GET PROVIDERS / VENDORS LIST FOR CUSTOMER APP ──
router.get('/providers', async (req, res, next) => {
  try {
    const { category } = req.query;
    let databaseList = [];

    try {
      // Fetch approved vendors from DB
      const dbVendors = await prisma.vendorProfile.findMany({
        where: { approvalStatus: 'APPROVED' },
        include: { user: { select: { email: true, phone: true } } }
      });

      databaseList = dbVendors.map((v) => ({
        id: v.id,
        name: v.businessName,
        category: category || 'Garage',
        rating: 4.5,
        reviews: 42,
        distance: 1.5,
        address: v.address || 'Jalgaon, MH',
        open: true,
        hours: '9 AM - 7 PM',
        phone: v.user.phone || '+91 98765 43210',
        verified: true,
        price: 199,
        duration: '30 mins',
        services: []
      }));
    } catch (e) {
      // Offline
    }

    // Merge active synced listings from JSON DB
    const db = readDb();
    const synced = Object.values(db.syncedListings || {});
    
    // Convert synced listings array to provider layout format
    const dynamicProviders = synced.map((list) => {
      if (!list || list.length === 0) return null;
      const first = list[0];
      return {
        id: first.id.split('-')[0], // Extract vendor ID
        name: first.businessName,
        category: first.category,
        rating: first.rating || 4.8,
        reviews: 12,
        distance: 1.1,
        address: 'Jalgaon MIDC, MH',
        open: true,
        hours: '9 AM – 7 PM',
        phone: '+91 98765 43210',
        verified: first.verified,
        price: first.price,
        duration: '30 Mins',
        services: list.map((s) => ({ name: s.name, price: s.price, subcategory: s.subcategory, description: s.description, images: s.images }))
      };
    }).filter(Boolean);

    let combinedList = [...mockProviders, ...databaseList, ...dynamicProviders];

    // Filter duplicates by name
    const seen = new Set();
    combinedList = combinedList.filter((item) => {
      const duplicate = seen.has(item.name.toLowerCase());
      seen.add(item.name.toLowerCase());
      return !duplicate;
    });

    if (category) {
      combinedList = combinedList.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.status(200).json(new ApiResponse(200, combinedList, 'Providers fetched successfully'));
  } catch (error) {
    next(error);
  }
});

// ── CRUD ROUTES FOR VENDOR SERVICES ──
router.get('/', (req, res) => {
  const { vendorId } = req.query;
  const db = readDb();
  const list = db.services.filter((s) => s.vendorId === vendorId);
  res.json(new ApiResponse(200, list, 'Services fetched'));
});

router.post('/', (req, res) => {
  const service = req.body;
  const db = readDb();
  
  const idx = db.services.findIndex((s) => s.id === service.id);
  if (idx > -1) {
    db.services[idx] = service;
  } else {
    db.services.push(service);
  }
  
  writeDb(db);
  res.json(new ApiResponse(200, service, 'Service saved'));
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.services = db.services.filter((s) => s.id !== id);
  writeDb(db);
  res.json(new ApiResponse(200, null, 'Service deleted'));
});

// ── SYNC SERVICES LIST TO CUSTOMER APP ROUTE ──
router.post('/sync-list', (req, res) => {
  const { vendorId, services } = req.body;
  const db = readDb();
  
  if (!db.syncedListings) db.syncedListings = {};
  db.syncedListings[vendorId] = services;
  
  writeDb(db);
  res.json(new ApiResponse(200, services, 'Listings synchronized'));
});

// ── BOOKINGS API ENDPOINTS ──
router.get('/bookings', (req, res) => {
  const db = readDb();
  res.json(new ApiResponse(200, db.bookings || [], 'Bookings fetched'));
});

router.post('/bookings', (req, res) => {
  const booking = req.body;
  const db = readDb();
  if (!db.bookings) db.bookings = [];
  
  const idx = db.bookings.findIndex((b) => b.id === booking.id);
  if (idx > -1) db.bookings[idx] = booking;
  else db.bookings.unshift(booking);

  writeDb(db);
  res.json(new ApiResponse(200, booking, 'Booking saved'));
});

router.put('/bookings/:id', (req, res) => {
  const { id } = req.params;
  const updated = req.body;
  const db = readDb();
  if (!db.bookings) db.bookings = [];

  const idx = db.bookings.findIndex((b) => b.id === id);
  if (idx > -1) db.bookings[idx] = updated;
  else db.bookings.unshift(updated);

  writeDb(db);
  res.json(new ApiResponse(200, updated, 'Booking updated'));
});

// ── ENQUIRIES API ENDPOINTS ──
router.get('/enquiries', (req, res) => {
  const db = readDb();
  res.json(new ApiResponse(200, db.enquiries || [], 'Enquiries fetched'));
});

router.post('/enquiries', (req, res) => {
  const enquiry = req.body;
  const db = readDb();
  if (!db.enquiries) db.enquiries = [];

  const idx = db.enquiries.findIndex((e) => e.id === enquiry.id);
  if (idx > -1) db.enquiries[idx] = enquiry;
  else db.enquiries.unshift(enquiry);

  writeDb(db);
  res.json(new ApiResponse(200, enquiry, 'Enquiry saved'));
});

router.put('/enquiries/:id', (req, res) => {
  const { id } = req.params;
  const updated = req.body;
  const db = readDb();
  if (!db.enquiries) db.enquiries = [];

  const idx = db.enquiries.findIndex((e) => e.id === id);
  if (idx > -1) db.enquiries[idx] = updated;
  else db.enquiries.unshift(updated);

  writeDb(db);
  res.json(new ApiResponse(200, updated, 'Enquiry updated'));
});

router.delete('/enquiries/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  if (db.enquiries) {
    db.enquiries = db.enquiries.filter((e) => e.id !== id);
    writeDb(db);
  }
  res.json(new ApiResponse(200, null, 'Enquiry deleted'));
});

// ── REVIEWS API ENDPOINTS ──
router.get('/reviews', (req, res) => {
  const db = readDb();
  res.json(new ApiResponse(200, db.reviews || [], 'Reviews fetched'));
});

router.post('/reviews/reply', (req, res) => {
  const { reviewId, replyText } = req.body;
  const db = readDb();
  if (!db.reviews) db.reviews = [];

  const idx = db.reviews.findIndex((r) => r.id === reviewId);
  if (idx > -1) {
    db.reviews[idx].vendorReply = {
      replyText,
      replyDate: 'Just now',
    };
    db.reviews[idx].isResolved = true;
    writeDb(db);
    return res.json(new ApiResponse(200, db.reviews[idx], 'Reply posted'));
  }
  res.status(404).json(new ApiResponse(404, null, 'Review not found'));
});

router.delete('/reviews/reply/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  if (db.reviews) {
    const idx = db.reviews.findIndex((r) => r.id === id);
    if (idx > -1) {
      delete db.reviews[idx].vendorReply;
      writeDb(db);
    }
  }
  res.json(new ApiResponse(200, null, 'Reply deleted'));
});

// ── PROMOTIONS & MARKETING API ENDPOINTS ──
router.get('/promotions', (req, res) => {
  const db = readDb();
  res.json(new ApiResponse(200, {
    offers: db.offers || [],
    coupons: db.coupons || [],
    banners: db.banners || [],
  }, 'Promotions fetched'));
});

router.post('/promotions', (req, res) => {
  const { type, item } = req.body;
  const db = readDb();

  if (type === 'offer') {
    if (!db.offers) db.offers = [];
    const idx = db.offers.findIndex((o) => o.id === item.id);
    if (idx > -1) db.offers[idx] = item;
    else db.offers.unshift(item);
  } else if (type === 'coupon') {
    if (!db.coupons) db.coupons = [];
    const idx = db.coupons.findIndex((c) => c.id === item.id);
    if (idx > -1) db.coupons[idx] = item;
    else db.coupons.unshift(item);
  } else if (type === 'banner') {
    if (!db.banners) db.banners = [];
    const idx = db.banners.findIndex((b) => b.id === item.id);
    if (idx > -1) db.banners[idx] = item;
    else db.banners.unshift(item);
  }

  writeDb(db);
  res.json(new ApiResponse(200, item, 'Promotion saved'));
});

router.delete('/promotions/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  if (db.offers) db.offers = db.offers.filter((o) => o.id !== id);
  if (db.coupons) db.coupons = db.coupons.filter((c) => c.id !== id);
  if (db.banners) db.banners = db.banners.filter((b) => b.id !== id);
  writeDb(db);
  res.json(new ApiResponse(200, null, 'Promotion deleted'));
});

// ── SETTINGS API ENDPOINTS ──
router.get('/settings', (req, res) => {
  const db = readDb();
  res.json(new ApiResponse(200, {
    businessConfig: db.businessConfig || {
      workingRadius: 15,
      languagesSpoken: ['English', 'Hindi', 'Marathi'],
      supportedVehicleTypes: ['Hatchback', 'Sedan', 'SUV', 'EV', '2-Wheeler'],
    },
    privacy: db.privacy || {
      businessVisibility: true,
      displayContactNumber: true,
      displayWhatsApp: true,
      displayEmail: true,
      displayAddress: true,
      displayBusinessHours: true,
    },
  }, 'Settings fetched'));
});

router.put('/settings', (req, res) => {
  const { businessConfig, privacy } = req.body;
  const db = readDb();
  if (businessConfig) db.businessConfig = businessConfig;
  if (privacy) db.privacy = privacy;
  writeDb(db);
  res.json(new ApiResponse(200, { businessConfig: db.businessConfig, privacy: db.privacy }, 'Settings updated'));
});

// ── SUBSCRIPTION API ENDPOINTS ──
router.get('/subscription', (req, res) => {
  const db = readDb();
  res.json(new ApiResponse(200, {
    subscription: db.subscription || {
      planId: 'plan-pro',
      planName: 'Professional',
      status: 'Active',
      renewalDate: '2026-08-22',
      daysRemaining: 31,
      autoRenewal: true,
      premiumBadgeActive: true,
      unlockedFeatures: [
        'Unlimited Services',
        'Featured Vendor Access',
        'Promotions & Banners',
        'Advanced Analytics',
      ],
    },
  }, 'Subscription fetched'));
});

router.post('/subscription/upgrade', (req, res) => {
  const { subscription } = req.body;
  const db = readDb();
  if (subscription) {
    db.subscription = subscription;
    writeDb(db);
  }
  res.json(new ApiResponse(200, db.subscription, 'Subscription updated successfully'));
});

// ── FULL VENDOR SYNC & CUSTOMER/ADMIN FETCH ENDPOINTS ──
router.post('/sync-all', (req, res) => {
  const payload = req.body;
  const db = readDb();
  db.vendorFullSync = {
    ...db.vendorFullSync,
    ...payload,
    lastSyncedAt: new Date().toISOString(),
  };
  writeDb(db);
  res.json(new ApiResponse(200, db.vendorFullSync, 'Full vendor state synchronized to backend'));
});

router.get('/vendor-full-profile', (req, res) => {
  const db = readDb();
  res.json(new ApiResponse(200, db.vendorFullSync || {}, 'Vendor full profile fetched'));
});

module.exports = router;
