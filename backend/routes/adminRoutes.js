const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { admins } = require('../config/schema');
const { eq, sql } = require('drizzle-orm');
const authMiddleware = require('./authMiddleware');

// Get current admin details (permissions) by email
router.get('/me', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ msg: 'Email is required' });

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const adminRows = await db.select().from(admins).where(
      sql`LOWER(${admins.email}) = ${normalizedEmail}`
    );

    if (adminRows.length === 0) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    const admin = adminRows[0];
    const robustAdmin = {
      ...admin,
      isPrimary: admin.isPrimary || admin.is_primary,
      canManageAnnouncements: admin.canManageAnnouncements || admin.can_manage_announcements,
      canManageServices: admin.canManageServices || admin.can_manage_services,
      canManageCategories: admin.canManageCategories || admin.can_manage_categories,
      canManageGallery: admin.canManageGallery || admin.can_manage_gallery,
      canViewDashboard: admin.canViewDashboard || admin.can_view_dashboard,
      canManageAdmins: admin.canManageAdmins || admin.can_manage_admins,
      canAddAdmins: admin.canAddAdmins || admin.can_add_admins,
      canEditAdmins: admin.canEditAdmins || admin.can_edit_admins,
      canDeleteAdmins: admin.canDeleteAdmins || admin.can_delete_admins,
      messageAccess: admin.messageAccess || admin.message_access
    };

    res.json(robustAdmin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Public route to check if an email is approved
router.get('/check/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const adminRows = await db.select().from(admins).where(eq(admins.email, email));
    if (adminRows.length > 0) {
      res.json({ approved: true });
    } else {
      res.json({ approved: false });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// All routes below require authentication
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
      email: admins.email,
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
    username, email, password, 
    canAddAdmins, canDeleteAdmins, canEditAdmins, canManageAdmins,
    canManageAnnouncements, canManageServices, canManageCategories, canManageGallery,
    canViewDashboard, messageAccess 
  } = req.body;

  try {
    // Check if email exists
    if (email) {
      const existingEmail = await db.select().from(admins).where(eq(admins.email, email));
      if (existingEmail.length > 0) {
        return res.status(400).json({ msg: 'Email already assigned to another admin' });
      }
    }

    // Check if username exists
    const existingAdmin = await db.select().from(admins).where(eq(admins.username, username));
    if (existingAdmin.length > 0) {
      return res.status(400).json({ msg: 'Admin already exists' });
    }

    const insertValues = {
      username,
      email,
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
       insertValues.passwordHash = await bcrypt.hash(password, salt);
    }

    const newAdmin = await db.insert(admins).values(insertValues).returning({
      id: admins.id,
      username: admins.username,
      email: admins.email
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
    username, email, password, 
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
      email: email,
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
        username: admins.username,
        email: admins.email
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
