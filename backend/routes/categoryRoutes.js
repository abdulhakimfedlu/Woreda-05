const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { categories } = require('../config/schema');
const { desc, eq } = require('drizzle-orm');

// @route   GET /api/categories
// @desc    Get all categories
router.get('/', async (req, res) => {
  try {
    const result = await db.select().from(categories).orderBy(categories.categoryNumber);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/categories
// @desc    Create a category
router.post('/', async (req, res) => {
  try {
    const { name, description, categoryNumber } = req.body;
    const newCategory = await db.insert(categories).values({
      name,
      description,
      categoryNumber: categoryNumber ? parseInt(categoryNumber) : 0
    }).returning();
    res.json(newCategory[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
router.put('/:id', async (req, res) => {
  try {
    const { name, description, categoryNumber } = req.body;
    const updated = await db.update(categories)
      .set({ 
        name, 
        description,
        categoryNumber: categoryNumber ? parseInt(categoryNumber) : 0
      })
      .where(eq(categories.id, parseInt(req.params.id)))
      .returning();
    
    if (updated.length === 0) return res.status(404).json({ msg: 'Category not found' });
    res.json(updated[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.delete(categories).where(eq(categories.id, parseInt(req.params.id))).returning();
    if (result.length === 0) return res.status(404).json({ msg: 'Category not found' });
    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
