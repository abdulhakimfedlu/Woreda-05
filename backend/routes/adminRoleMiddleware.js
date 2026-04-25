const checkPerm = (permKey) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ msg: 'Unauthorized: No admin session' });
    }
    
    // Primary admin or user with specific perm is allowed
    // Also, admins with canManageAdmins historically had broad permissions, but we'll stick to isPrimary or specific perm as requested.
    if (req.admin.isPrimary || req.admin[permKey]) {
      return next();
    }
    
    return res.status(403).json({ msg: `Access denied: Requires ${permKey} permission` });
  };
};

const checkMessageAccess = (requiredAccessLevel) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    
    if (req.admin.isPrimary) {
      return next();
    }
    
    const userAccess = req.admin.messageAccess || 'None';
    
    if (userAccess === 'None') {
      return res.status(403).json({ msg: 'Access denied: You have no message access' });
    }
    
    if (userAccess === 'Both' || requiredAccessLevel === 'Any') {
      return next();
    }
    
    if (userAccess === requiredAccessLevel) {
      return next();
    }
    
    return res.status(403).json({ msg: `Access denied: Requires ${requiredAccessLevel} message access` });
  };
};

module.exports = {
  checkPerm,
  checkMessageAccess
};
