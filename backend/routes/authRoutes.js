const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { admins } = require('../config/schema');
const { eq } = require('drizzle-orm');

// @route   POST /api/auth/login
// @desc    Authenticate admin & get token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const adminRows = await db.select().from(admins).where(eq(admins.username, username));
    if (adminRows.length === 0) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const admin = adminRows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Return jsonwebtoken
    const payload = {
      admin: {
        id: admin.id,
        username: admin.username,
        canAddAdmins: admin.canAddAdmins,
        canDeleteAdmins: admin.canDeleteAdmins,
        canEditAdmins: admin.canEditAdmins,
        canManageAdmins: admin.canManageAdmins,
        canManageAnnouncements: admin.canManageAnnouncements,
        canManageServices: admin.canManageServices,
        canManageCategories: admin.canManageCategories,
        canManageGallery: admin.canManageGallery,
        canViewDashboard: admin.canViewDashboard,
        messageAccess: admin.messageAccess,
        isPrimary: admin.isPrimary,
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret_key_woreda_05',
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: payload.admin });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

const authMiddleware = require('./authMiddleware');

// @route   POST /api/auth/change-password
// @desc    Change logged-in admin's password
router.post('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.admin.id;

  try {
    const adminRows = await db.select().from(admins).where(eq(admins.id, adminId));
    if (adminRows.length === 0) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    const admin = adminRows[0];

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await db.update(admins).set({ passwordHash }).where(eq(admins.id, adminId));

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
