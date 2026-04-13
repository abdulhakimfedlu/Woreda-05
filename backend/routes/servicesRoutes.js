const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { services } = require('../config/schema');
const { desc, eq } = require('drizzle-orm');

// @route   GET /api/services
// @desc    Get all services
router.get('/', async (req, res) => {
  try {
    const result = await db.select().from(services).orderBy(desc(services.createdAt));
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/services/:id
// @desc    Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.select().from(services).where(eq(services.id, parseInt(req.params.id)));
    if (result.length === 0) return res.status(404).json({ msg: 'Service not found' });
    res.json(result[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/services
// @desc    Create a service
router.post('/', async (req, res) => {
  try {
    const { title, titleAm, department, departmentAm, category } = req.body;
    const newService = await db.insert(services).values({
      title,
      titleAm,
      department,
      departmentAm,
      category
    }).returning();
    res.json(newService[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/services/:id
// @desc    Update a service
router.put('/:id', async (req, res) => {
  try {
    const { title, titleAm, department, departmentAm, category } = req.body;
    const updated = await db.update(services)
      .set({ title, titleAm, department, departmentAm, category })
      .where(eq(services.id, parseInt(req.params.id)))
      .returning();
    
    if (updated.length === 0) return res.status(404).json({ msg: 'Service not found' });
    res.json(updated[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete a service
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.delete(services).where(eq(services.id, parseInt(req.params.id))).returning();
    if (result.length === 0) return res.status(404).json({ msg: 'Service not found' });
    res.json({ msg: 'Service removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
