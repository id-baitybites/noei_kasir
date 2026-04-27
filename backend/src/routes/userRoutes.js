const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Get all users (Super Admin only)
router.get('/', authenticate, authorize(['super-admin']), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user (Super Admin only)
router.delete('/:id', authenticate, authorize(['super-admin']), async (req, res) => {
  try {
    const { id } = req.params;
    // Prevent deleting self
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
