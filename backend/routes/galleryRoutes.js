const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { gallery } = require('../config/schema');
const { desc, eq } = require('drizzle-orm');
const authMiddleware = require('./authMiddleware');
const { checkPerm } = require('./adminRoleMiddleware');
const cloudinary = require('../config/cloudinary');

// @route   GET /api/gallery
// @desc    Get all gallery images
router.get('/', async (req, res) => {
  try {
    const result = await db.select().from(gallery).orderBy(desc(gallery.createdAt));
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/gallery
// @desc    Add a gallery image (URL & publicId already uploaded via /api/upload)
router.post('/', authMiddleware, checkPerm('canManageGallery'), async (req, res) => {
  try {
    const { title, titleAm, url, publicId, size, description, descriptionAm, date } = req.body;
    const newImage = await db.insert(gallery).values({
      title,
      titleAm,
      url,
      publicId,
      size,
      description,
      descriptionAm,
      date
    }).returning();
    res.json(newImage[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/gallery/:id
// @desc    Update image metadata (and optionally the URL/publicId if re-uploaded)
router.put('/:id', authMiddleware, checkPerm('canManageGallery'), async (req, res) => {
  try {
    const { title, titleAm, url, publicId, size, description, descriptionAm, date } = req.body;
    const updated = await db.update(gallery)
      .set({ title, titleAm, url, publicId, size, description, descriptionAm, date })
      .where(eq(gallery.id, parseInt(req.params.id)))
      .returning();

    if (updated.length === 0) return res.status(404).json({ msg: 'Image not found' });
    res.json(updated[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete an image from DB and Cloudinary
router.delete('/:id', authMiddleware, checkPerm('canManageGallery'), async (req, res) => {
  try {
    const result = await db.delete(gallery)
      .where(eq(gallery.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) return res.status(404).json({ msg: 'Image not found' });

    // Delete from Cloudinary if we have a public_id stored
    const publicId = result[0].publicId;
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.error('Cloudinary delete warning:', cloudErr.message);
        // Non-fatal — DB record is already gone
      }
    }

    res.json({ msg: 'Image removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
