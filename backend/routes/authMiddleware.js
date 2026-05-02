const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { admins } = require('../config/schema');
const { eq, sql } = require('drizzle-orm');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Unauthorized: No token provided' });
  }

  try {
    // 1. Try legacy JWT verification
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_woreda_05');
      req.admin = decoded.admin;
      return next();
    } catch (err) {}

    // 2. Clerk/Email Logic
    const userEmail = req.header('X-Admin-Email');
    if (!userEmail) {
      console.error('Auth failure: No X-Admin-Email header provided');
      return res.status(401).json({ msg: 'Unauthorized: No admin email header' });
    }

    const normalizedEmail = userEmail.toLowerCase().trim();
    const adminRows = await db.select().from(admins).where(
      sql`LOWER(${admins.email}) = ${normalizedEmail}`
    );

    if (adminRows.length > 0) {
      const admin = adminRows[0];
      
      // ENSURE BOTH CAMELCASE AND SNAKE_CASE ARE AVAILABLE FOR MIDDLEWARE COMPATIBILITY
      req.admin = {
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

      console.log(`Authenticated Admin: ${req.admin.username} (${userEmail})`);
      return next();
    }

    console.error(`Auth failure: Email ${userEmail} not found in database`);
    res.status(401).json({ msg: 'Unauthorized: Admin email not recognized in system' });
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ msg: 'Internal server error during auth' });
  }
};

module.exports = authMiddleware;
