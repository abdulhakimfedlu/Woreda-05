const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { admins } = require('../config/schema');
const { eq } = require('drizzle-orm');
const authMiddleware = require('./authMiddleware');

// All routes here require authentication
router.use(authMiddleware);

// Middleware to check if user has manage admins permission
const checkManagePerms = (permissionKey) => {
  return (req, res, next) => {
    if (!req.admin[permissionKey] && !req.admin.canManageAdmins) {
      return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

// @route   GET /api/admins
// @desc    Get all admins
router.get('/', checkManagePerms('canManageAdmins'), async (req, res) => {
  try {
    const result = await db.select({
      id: admins.id,
      username: admins.username,
      canAddAdmins: admins.canAddAdmins,
      canDeleteAdmins: admins.canDeleteAdmins,
      canEditAdmins: admins.canEditAdmins,
      canManageAdmins: admins.canManageAdmins,
      canManageAnnouncements: admins.canManageAnnouncements,
      canManageServices: admins.canManageServices,
      canManageCategories: admins.canManageCategories,
      canManageGallery: admins.canManageGallery,
      canViewDashboard: admins.canViewDashboard,
      messageAccess: admins.messageAccess,
      isPrimary: admins.isPrimary,
      createdAt: admins.createdAt
    }).from(admins);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/admins
// @desc    Create a new admin
router.post('/', checkManagePerms('canAddAdmins'), async (req, res) => {
  const { 
    username, password, 
    canAddAdmins, canDeleteAdmins, canEditAdmins, canManageAdmins,
    canManageAnnouncements, canManageServices, canManageCategories, canManageGallery,
    canViewDashboard, messageAccess 
  } = req.body;

  try {
    // Check if admin exists
    const existingAdmin = await db.select().from(admins).where(eq(admins.username, username));
    if (existingAdmin.length > 0) {
      return res.status(400).json({ msg: 'Admin already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = await db.insert(admins).values({
      username,
      passwordHash,
      canAddAdmins: !!canAddAdmins,
      canDeleteAdmins: !!canDeleteAdmins,
      canEditAdmins: !!canEditAdmins,
      canManageAdmins: !!canManageAdmins,
      canManageAnnouncements: !!canManageAnnouncements,
      canManageServices: !!canManageServices,
      canManageCategories: !!canManageCategories,
      canManageGallery: !!canManageGallery,
      canViewDashboard: !!canViewDashboard,
      messageAccess: messageAccess || 'None'
    }).returning({
      id: admins.id,
      username: admins.username
    });

    res.json(newAdmin[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admins/:id
// @desc    Update an admin
router.put('/:id', checkManagePerms('canEditAdmins'), async (req, res) => {
  const { 
    username, password, 
    canAddAdmins, canDeleteAdmins, canEditAdmins, canManageAdmins,
    canManageAnnouncements, canManageServices, canManageCategories, canManageGallery,
    canViewDashboard, messageAccess 
  } = req.body;
  const adminId = parseInt(req.params.id);

  try {
    // Cannot edit the primary super admin unless it's the primary super admin editing themselves
    const targetAdminRows = await db.select().from(admins).where(eq(admins.id, adminId));
    if (targetAdminRows.length === 0) return res.status(404).json({ msg: 'Admin not found' });
    
    if (targetAdminRows[0].isPrimary && !req.admin.isPrimary) {
      return res.status(403).json({ msg: 'Cannot edit the primary super admin' });
    }

    const updateFields = {
      username: username,
      canAddAdmins: !!canAddAdmins,
      canDeleteAdmins: !!canDeleteAdmins,
      canEditAdmins: !!canEditAdmins,
      canManageAdmins: !!canManageAdmins,
      canManageAnnouncements: !!canManageAnnouncements,
      canManageServices: !!canManageServices,
      canManageCategories: !!canManageCategories,
      canManageGallery: !!canManageGallery,
      canViewDashboard: !!canViewDashboard,
      messageAccess: messageAccess || 'None'
    };

    if (password) {
       const salt = await bcrypt.genSalt(10);
       updateFields.passwordHash = await bcrypt.hash(password, salt);
    }

    const updated = await db.update(admins)
      .set(updateFields)
      .where(eq(admins.id, adminId))
      .returning({
        id: admins.id,
        username: admins.username
      });
    
    if (updated.length === 0) return res.status(404).json({ msg: 'Admin not found' });
    res.json(updated[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/admins/:id
// @desc    Delete an admin
router.delete('/:id', checkManagePerms('canDeleteAdmins'), async (req, res) => {
  const adminId = parseInt(req.params.id);
  
  try {
    const targetAdminRows = await db.select().from(admins).where(eq(admins.id, adminId));
    if (targetAdminRows.length === 0) return res.status(404).json({ msg: 'Admin not found' });

    if (targetAdminRows[0].isPrimary) {
      return res.status(403).json({ msg: 'Cannot delete the primary super admin' });
    }
    
    // Prevent deleting oneself
    if (adminId === req.admin.id) {
       return res.status(400).json({ msg: 'Cannot delete your own account' });
    }

    const result = await db.delete(admins).where(eq(admins.id, adminId)).returning({ id: admins.id });
    if (result.length === 0) return res.status(404).json({ msg: 'Admin not found' });
    res.json({ msg: 'Admin removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/admins/:id/transfer-primary
// @desc    Transfer primary ownership to another admin
router.post('/:id/transfer-primary', async (req, res) => {
  const targetAdminId = parseInt(req.params.id);
  const { password } = req.body;
  
  try {
    // Only current primary admin can do this
    if (!req.admin.isPrimary) {
      return res.status(403).json({ msg: 'Only the Primary Super Admin can transfer ownership' });
    }

    if (targetAdminId === req.admin.id) {
       return res.status(400).json({ msg: 'You are already the primary admin' });
    }

    // Verify current admin's password
    const currentAdminRows = await db.select().from(admins).where(eq(admins.id, req.admin.id));
    if (currentAdminRows.length === 0) return res.status(404).json({ msg: 'Session error' });
    
    const isMatch = await bcrypt.compare(password, currentAdminRows[0].passwordHash);
    if (!isMatch) return res.status(400).json({ msg: 'Incorrect password verification' });

    // Ensure target admin exists
    const targetAdminRows = await db.select().from(admins).where(eq(admins.id, targetAdminId));
    if (targetAdminRows.length === 0) return res.status(404).json({ msg: 'Target admin not found' });

    // Perform transfer
    await db.transaction(async (tx) => {
       // Promote target admin
       await tx.update(admins).set({ 
         isPrimary: true,
         canAddAdmins: true,
         canDeleteAdmins: true,
         canEditAdmins: true,
         canManageAdmins: true
       }).where(eq(admins.id, targetAdminId));

       // Demote current admin
       await tx.update(admins).set({ isPrimary: false }).where(eq(admins.id, req.admin.id));
    });

    res.json({ msg: 'Ownership transferred successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
