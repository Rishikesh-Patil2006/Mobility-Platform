const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const ApiResponse = require('../utils/ApiResponse');

// Fallback Mock Service Providers mapping standard listing details
const mockProviders = [
  { id: '1', name: 'Speed Auto Garage', category: 'Garage', rating: 4.8, reviews: 312, distance: '0.8 km', address: 'Near Civil Hospital, Jalgaon', open: true, hours: '9 AM – 8 PM', phone: '+91 98765 43210', emoji: '🔧' },
  { id: '2', name: 'Patil Motors & Garage', category: 'Garage', rating: 4.6, reviews: 218, distance: '1.4 km', address: 'Station Road, Jalgaon', open: true, hours: '8 AM – 9 PM', phone: '+91 98765 43211', emoji: '🔧' },
  { id: '3', name: 'Royal Garage Center', category: 'Garage', rating: 4.5, reviews: 184, distance: '2.1 km', address: 'Navi Peth, Jalgaon', open: false, hours: '9 AM – 7 PM', phone: '+91 98765 43212', emoji: '🔧' },
  { id: '4', name: 'Crystal Car Wash', category: 'Car Wash', rating: 4.7, reviews: 245, distance: '1.2 km', address: 'MG Road, Jalgaon', open: true, hours: '7 AM – 9 PM', phone: '+91 98765 44210', emoji: '🫧' },
  { id: '5', name: 'Rescue Towing 24x7', category: 'Towing', rating: 4.9, reviews: 189, distance: '1.0 km', address: 'Mumbai Highway, Jalgaon', open: true, hours: '24 Hours', phone: '+91 98765 55210', emoji: '🛻' },
  { id: '6', name: 'Jalgaon PUC Center', category: 'PUC Center', rating: 4.6, reviews: 312, distance: '2.1 km', address: 'NH-6, Near Toll Plaza, Jalgaon', open: true, hours: '9 AM – 7 PM', phone: '+91 98765 66210', emoji: '💨' }
];

// ── GET CATEGORIES LIST ──
router.get('/categories', async (req, res, next) => {
  try {
    let categories = await prisma.serviceCategory.findMany();
    
    // Fail-safe seeding check
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

// ── GET PROVIDERS / VENDORS LIST ──
router.get('/providers', async (req, res, next) => {
  try {
    const { category } = req.query;

    // Fetch approved vendors from DB
    const dbVendors = await prisma.vendorProfile.findMany({
      where: {
        approvalStatus: 'APPROVED',
      },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          }
        }
      }
    });

    // Map database models to client-ready layout objects
    const databaseList = dbVendors.map((v) => ({
      id: v.id,
      name: v.businessName,
      category: category || 'Garage', // Fallback or dynamic
      rating: 4.5,
      reviews: 42,
      distance: '1.5 km',
      address: v.address || 'Jalgaon, MH',
      open: true,
      hours: '9 AM - 7 PM',
      phone: v.user.phone || '+91 98765 43210',
    }));

    // Combine database providers with our high-fidelity mock list
    let combinedList = [...mockProviders, ...databaseList];

    // Filter by category parameter if specified
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

module.exports = router;
