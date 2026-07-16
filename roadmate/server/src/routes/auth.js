const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { z } = require('zod');

const prisma = require('../config/prisma');
const { generateAccessToken, generateRefreshToken } = require('../config/jwt');
const authenticate = require('../middlewares/authenticate');
const validateRequest = require('../middlewares/validateRequest');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

// Zod validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  role: z.enum(['CUSTOMER', 'VENDOR', 'SUPER_ADMIN']),
  firstName: z.string().optional(), // For Customer
  lastName: z.string().optional(),  // For Customer
  businessName: z.string().optional(), // For Vendor
  ownerName: z.string().optional(),    // For Vendor
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

// ── REGISTER CONTROLLER ──
router.post('/register', validateRequest(registerSchema), async (req, res, next) => {
  try {
    const { email, password, phone, role, firstName, lastName, businessName, ownerName } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ApiError(400, 'User with this email already exists');
    }

    if (phone) {
      const existingPhone = await prisma.user.findFirst({ where: { phone } });
      if (existingPhone) {
        throw new ApiError(400, 'User with this phone number already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          phone,
          password: hashedPassword,
          role,
          status: role === 'SUPER_ADMIN' ? 'ACTIVE' : 'PENDING',
        },
      });

      if (role === 'CUSTOMER') {
        await tx.customerProfile.create({
          data: {
            userId: newUser.id,
            firstName: firstName || 'User',
            lastName: lastName || 'Customer',
          },
        });
      } else if (role === 'VENDOR') {
        await tx.vendorProfile.create({
          data: {
            userId: newUser.id,
            businessName: businessName || 'My Workshop',
            ownerName: ownerName || 'Shop Owner',
            approvalStatus: 'DRAFT',
          },
        });
      }

      return newUser;
    });

    // Remove password hash from response
    delete user.password;

    res.status(201).json(new ApiResponse(201, user, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
});

// ── LOGIN CONTROLLER ──
router.post('/login', validateRequest(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        customerProfile: true,
        vendorProfile: true,
        adminProfile: true,
      },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Strip password
    delete user.password;

    res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
          user,
        },
        'Logged in successfully'
      )
    );
  } catch (error) {
    next(error);
  }
});

// ── REFRESH TOKEN CONTROLLER ──
router.post('/refresh', validateRequest(refreshSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const dbToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!dbToken || dbToken.expiresAt < new Date()) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const newAccessToken = generateAccessToken(dbToken.user);

    res.status(200).json(
      new ApiResponse(
        200,
        { accessToken: newAccessToken },
        'Access token refreshed'
      )
    );
  } catch (error) {
    next(error);
  }
});

// ── LOGOUT CONTROLLER ──
router.post('/logout', validateRequest(refreshSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
  } catch (error) {
    next(error);
  }
});

// ── AUTH ME (CURRENT USER PROFILE DETAILS) ──
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        customerProfile: true,
        vendorProfile: true,
        adminProfile: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    delete user.password;

    res.status(200).json(new ApiResponse(200, user, 'Current user profile fetched'));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
