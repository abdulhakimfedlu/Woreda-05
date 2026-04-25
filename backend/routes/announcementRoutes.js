const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { announcements } = require('../config/schema');
const { desc, eq } = require('drizzle-orm');
const authMiddleware = require('./authMiddleware');
const { checkPerm } = require('./adminRoleMiddleware');

// @route   GET /api/announcements
// @desc    Get all announcements
router.get('/', async (req, res) => {
  try {
    const result = await db.select().from(announcements).orderBy(desc(announcements.createdAt));
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/announcements
// @desc    Create an announcement
router.post('/', authMiddleware, checkPerm('canManageAnnouncements'), async (req, res) => {
  try {
    const { title, titleAm, content, contentAm, status, category, author } = req.body;
    const newAnnouncement = await db.insert(announcements).values({
      title,
      titleAm,
      content,
      contentAm,
      status,
      category,
      author
    }).returning();
    res.json(newAnnouncement[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/announcements/:id
// @desc    Update an announcement
router.put('/:id', authMiddleware, checkPerm('canManageAnnouncements'), async (req, res) => {
  try {
    const { title, titleAm, content, contentAm, status, category, author } = req.body;
    const updated = await db.update(announcements)
      .set({ title, titleAm, content, contentAm, status, category, author })
      .where(eq(announcements.id, parseInt(req.params.id)))
      .returning();
    
    if (updated.length === 0) return res.status(404).json({ msg: 'Announcement not found' });
    res.json(updated[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/announcements/:id
// @desc    Delete an announcement
router.delete('/:id', authMiddleware, checkPerm('canManageAnnouncements'), async (req, res) => {
  try {
    const result = await db.delete(announcements).where(eq(announcements.id, parseInt(req.params.id))).returning();
    if (result.length === 0) return res.status(404).json({ msg: 'Announcement not found' });
    res.json({ msg: 'Announcement removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
