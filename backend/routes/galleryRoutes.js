const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { gallery } = require('../config/schema');
const { desc, eq } = require('drizzle-orm');

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
// @desc    Upload/Add a gallery image
router.post('/', async (req, res) => {
  try {
    const { title, titleAm, url, size, description, descriptionAm, date } = req.body;
    const newImage = await db.insert(gallery).values({
      title,
      titleAm,
      url,
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
// @desc    Update an image metadata
router.put('/:id', async (req, res) => {
  try {
    const { title, titleAm, url, size, description, descriptionAm, date } = req.body;
    const updated = await db.update(gallery)
      .set({ title, titleAm, url, size, description, descriptionAm, date })
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
// @desc    Delete an image
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.delete(gallery).where(eq(gallery.id, parseInt(req.params.id))).returning();
    if (result.length === 0) return res.status(404).json({ msg: 'Image not found' });
    res.json({ msg: 'Image removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
