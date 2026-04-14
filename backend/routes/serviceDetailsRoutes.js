const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { serviceDetails, services } = require('../config/schema');
const { eq } = require('drizzle-orm');

// @route   GET /api/service-details/:serviceId
// @desc    Get service details by service ID
router.get('/:serviceId', async (req, res) => {
  try {
    const serviceId = parseInt(req.params.serviceId);
    // Also fetch the parent service mapping
    const basicServiceQuery = await db.select().from(services).where(eq(services.id, serviceId));
    if (basicServiceQuery.length === 0) return res.status(404).json({ msg: 'Service not found' });

    const detailQuery = await db.select().from(serviceDetails).where(eq(serviceDetails.serviceId, serviceId));
    
    // Combine them to ease frontend matching
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
router.put('/:serviceId', async (req, res) => {
  try {
    const serviceId = parseInt(req.params.serviceId);
    const { 
      description, descriptionAm, requirements, requirementsAm, officerName, officerNameAm, officerRole, officerRoleAm, 
      officerPhoto, contactPhone, contactEmail, officeNumber, 
      hours, additionalDetails, additionalDetailsAm, bannerPhoto
    } = req.body;

    // Check if it already exists
    const existing = await db.select().from(serviceDetails).where(eq(serviceDetails.serviceId, serviceId));

    if (existing.length > 0) {
      // Update
      const updated = await db.update(serviceDetails)
        .set({
          description, descriptionAm, requirements, requirementsAm, officerName, officerNameAm, officerRole, officerRoleAm, 
          officerPhoto, contactPhone, contactEmail, officeNumber, 
          hours, additionalDetails, additionalDetailsAm, bannerPhoto
        })
        .where(eq(serviceDetails.serviceId, serviceId))
        .returning();
      res.json(updated[0]);
    } else {
      // Insert
      const inserted = await db.insert(serviceDetails)
        .values({
          serviceId, description, descriptionAm, requirements, requirementsAm, officerName, officerNameAm, officerRole, officerRoleAm, 
          officerPhoto, contactPhone, contactEmail, officeNumber, 
          hours, additionalDetails, additionalDetailsAm, bannerPhoto
        })
        .returning();
      res.json(inserted[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/service-details/:serviceId
// @desc    Delete service details by service ID
router.delete('/:serviceId', async (req, res) => {
  try {
    const serviceId = parseInt(req.params.serviceId);
    
    // Check if service details exist
    const existing = await db.select().from(serviceDetails).where(eq(serviceDetails.serviceId, serviceId));
    
    if (existing.length === 0) {
      return res.status(404).json({ msg: 'Service details not found' });
    }

    // Delete the service details
    await db.delete(serviceDetails).where(eq(serviceDetails.serviceId, serviceId));
    
    res.json({ msg: 'Service details deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
