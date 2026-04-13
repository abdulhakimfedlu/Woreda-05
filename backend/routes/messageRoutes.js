const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { messages } = require('../config/schema');
const { desc, eq, count, and } = require('drizzle-orm');

// @route   GET /api/messages
// @desc    Get all messages
router.get('/', async (req, res) => {
  try {
    const result = await db.select().from(messages).orderBy(desc(messages.createdAt));
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/messages/unread-count
// @desc    Get count of unread messages
router.get('/unread-count', async (req, res) => {
  try {
    const result = await db.select({ value: count() }).from(messages).where(eq(messages.isRead, false));
    res.json({ count: result[0].value });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/messages
// @desc    Submit a message
router.post('/', async (req, res) => {
  try {
    const { topic, description, contactInfo, isAnonymous } = req.body;
    
    // Server-side validation
    if (!topic || !description) {
      return res.status(400).json({ msg: 'Topic and Description are required' });
    }
    
    if (!isAnonymous && (!contactInfo || contactInfo.length < 10 || contactInfo.length > 12)) {
      return res.status(400).json({ msg: 'Valid phone number (10-12 digits) required' });
    }

    const newMessage = await db.insert(messages).values({
      topic,
      description,
      contactInfo: isAnonymous ? null : contactInfo,
      isAnonymous: !!isAnonymous,
      isRead: false
    }).returning();
    
    res.json(newMessage[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/messages/:id/read
// @desc    Mark message as read
router.patch('/:id/read', async (req, res) => {
  try {
    const updated = await db.update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, parseInt(req.params.id)))
      .returning();
    
    if (updated.length === 0) return res.status(404).json({ msg: 'Message not found' });
    res.json(updated[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete a message
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.delete(messages).where(eq(messages.id, parseInt(req.params.id))).returning();
    if (result.length === 0) return res.status(404).json({ msg: 'Message not found' });
    res.json({ msg: 'Message removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
