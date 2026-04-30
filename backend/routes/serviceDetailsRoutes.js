const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { serviceDetails, services } = require('../config/schema');
const { eq } = require('drizzle-orm');
const authMiddleware = require('./authMiddleware');
const { checkPerm } = require('./adminRoleMiddleware');
const cloudinary = require('../config/cloudinary');

// @route   GET /api/service-details/:serviceId
// @desc    Get service details by service ID
router.get('/:serviceId', async (req, res) => {
  try {
    const serviceId = parseInt(req.params.serviceId);
    const basicServiceQuery = await db.select().from(services).where(eq(services.id, serviceId));
    if (basicServiceQuery.length === 0) return res.status(404).json({ msg: 'Service not found' });

    const detailQuery = await db.select().from(serviceDetails).where(eq(serviceDetails.serviceId, serviceId));

    return res.json({
      ...basicServiceQuery[0],
      details: detailQuery.length > 0 ? detailQuery[0] : null
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/service-details/:serviceId
// @desc    Upsert service details by service ID
router.put('/:serviceId', authMiddleware, checkPerm('canManageServices'), async (req, res) => {
  try {
    const serviceId = parseInt(req.params.serviceId);
    const {
      description, descriptionAm, requirements, requirementsAm,
      officerName, officerNameAm, officerRole, officerRoleAm,
      officerPhoto, officerPhotoPublicId,
      contactPhone, contactEmail, officeNumber,
      hours, additionalDetails, additionalDetailsAm,
      bannerPhoto, bannerPhotoPublicId
    } = req.body;

    const fields = {
      description, descriptionAm, requirements, requirementsAm,
      officerName, officerNameAm, officerRole, officerRoleAm,
      officerPhoto, officerPhotoPublicId,
      contactPhone, contactEmail, officeNumber,
      hours, additionalDetails, additionalDetailsAm,
      bannerPhoto, bannerPhotoPublicId
    };

    const existing = await db.select().from(serviceDetails).where(eq(serviceDetails.serviceId, serviceId));

    if (existing.length > 0) {
      const updated = await db.update(serviceDetails)
        .set(fields)
        .where(eq(serviceDetails.serviceId, serviceId))
        .returning();
      res.json(updated[0]);
    } else {
      const inserted = await db.insert(serviceDetails)
        .values({ serviceId, ...fields })
        .returning();
      res.json(inserted[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/service-details/:serviceId
// @desc    Delete service details by service ID (also cleans up Cloudinary assets)
router.delete('/:serviceId', authMiddleware, checkPerm('canManageServices'), async (req, res) => {
  try {
    const serviceId = parseInt(req.params.serviceId);

    const existing = await db.select().from(serviceDetails).where(eq(serviceDetails.serviceId, serviceId));
    if (existing.length === 0) return res.status(404).json({ msg: 'Service details not found' });

    const record = existing[0];

    // Delete photos from Cloudinary
    const toDestroy = [record.officerPhotoPublicId, record.bannerPhotoPublicId].filter(Boolean);
    for (const pid of toDestroy) {
      try { await cloudinary.uploader.destroy(pid); } catch (e) { /* non-fatal */ }
    }

    await db.delete(serviceDetails).where(eq(serviceDetails.serviceId, serviceId));
    res.json({ msg: 'Service details deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
