const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const authenticate = require('../middlewares/authenticate');
const authorizeRoles = require('../middlewares/authorizeRoles');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

// Ensure only SUPER_ADMIN accounts access these routes
router.use(authenticate);
router.use(authorizeRoles('SUPER_ADMIN'));

// ── GET ALL VENDORS ──
router.get('/vendors', async (req, res, next) => {
  try {
    const { status } = req.query;

    const queryOptions = {
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            status: true,
          }
        }
      }
    };

    if (status) {
      queryOptions.where = { approvalStatus: status };
    }

    const vendors = await prisma.vendorProfile.findMany(queryOptions);

    res.status(200).json(new ApiResponse(200, vendors, 'All vendors fetched successfully'));
  } catch (error) {
    next(error);
  }
});

// ── UPDATE VENDOR STATUS (APPROVE / REJECT / BLOCK / SUSPEND) ──
router.put('/vendors/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPROVED | REJECTED | SUSPENDED | BLOCKED | PENDING_APPROVAL

    const validStatuses = ['APPROVED', 'REJECTED', 'SUSPENDED', 'BLOCKED', 'PENDING_APPROVAL', 'DRAFT'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, 'Invalid approval status value');
    }

    // Check if vendor profile exists
    const vendor = await prisma.vendorProfile.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!vendor) {
      throw new ApiError(404, 'Vendor profile not found');
    }

    // Perform state transition
    const updated = await prisma.$transaction(async (tx) => {
      const updatedProfile = await tx.vendorProfile.update({
        where: { id },
        data: { approvalStatus: status }
      });

      // Synchronize primary user account status
      let userAccountStatus = 'PENDING';
      if (status === 'APPROVED') userAccountStatus = 'ACTIVE';
      else if (status === 'BLOCKED') userAccountStatus = 'BLOCKED';
      else if (status === 'SUSPENDED') userAccountStatus = 'SUSPENDED';
      else if (status === 'REJECTED') userAccountStatus = 'REJECTED';

      await tx.user.update({
        where: { id: vendor.userId },
        data: { status: userAccountStatus }
      });

      return updatedProfile;
    });

    res.status(200).json(new ApiResponse(200, updated, `Vendor status successfully updated to ${status}`));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
