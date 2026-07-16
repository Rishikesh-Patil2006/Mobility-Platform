const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const authenticate = require('../middlewares/authenticate');
const authorizeRoles = require('../middlewares/authorizeRoles');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

// Ensure only VENDOR accounts access these routes
router.use(authenticate);
router.use(authorizeRoles('VENDOR'));

// ── GET VENDOR PROFILE ──
router.get('/profile', async (req, res, next) => {
  try {
    const profile = await prisma.vendorProfile.findUnique({
      where: { userId: req.user.id },
      include: { user: true },
    });

    if (!profile) {
      throw new ApiError(404, 'Vendor profile not found');
    }

    res.status(200).json(new ApiResponse(200, profile, 'Vendor profile fetched successfully'));
  } catch (error) {
    next(error);
  }
});

// ── UPDATE VENDOR PROFILE ──
router.put('/profile', async (req, res, next) => {
  try {
    const { businessName, ownerName, address, about, services, timings } = req.body;

    const profile = await prisma.vendorProfile.update({
      where: { userId: req.user.id },
      data: {
        businessName,
        ownerName,
        address,
        // Using database models where appropriate or packing in profile metadata fields
        approvalStatus: 'PENDING_APPROVAL', // Push to review status on profile completion
      },
    });

    res.status(200).json(new ApiResponse(200, profile, 'Vendor profile updated, pending admin review'));
  } catch (error) {
    next(error);
  }
});

// ── UPLOAD VENDOR DOCUMENTS ──
router.post('/documents', async (req, res, next) => {
  try {
    const { documentType, documentUrl } = req.body;

    if (!documentType || !documentUrl) {
      throw new ApiError(400, 'documentType and documentUrl are required');
    }

    // Connect document upload logs in database. In V1 we create a FileAsset entry
    const asset = await prisma.fileAsset.create({
      data: {
        publicId: `${req.user.id}_${documentType}_${Date.now()}`,
        url: documentUrl,
        resourceType: 'DOCUMENT',
        uploadedById: req.user.id,
      }
    });

    res.status(201).json(new ApiResponse(201, asset, `${documentType} registered successfully`));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
