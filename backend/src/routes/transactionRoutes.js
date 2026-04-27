const express = require('express');
const router = express.Router();
const transactionService = require('../services/transactionService');
const { z } = require('zod');

const transactionSchema = z.object({
  items: z.array(z.object({
    product_id: z.number().int().positive(),
    quantity: z.number().int().positive()
  })).min(1),
  payment_method: z.enum(['cash', 'card', 'qr']).optional(),
  user_id: z.number().int().optional()
});

router.post('/', async (req, res, next) => {
  try {
    const validatedData = transactionSchema.parse(req.body);
    const transaction = await transactionService.createTransaction(validatedData);
    res.status(201).json(transaction);
  } catch (err) { 
    if (err.message.includes('Insufficient stock') || err.message.includes('not found')) {
      err.status = 400;
    }
    next(err); 
  }
});

router.get('/daily-summary', async (req, res, next) => {
  try {
    const summary = await transactionService.getDailySales(req.query.date);
    res.json(summary);
  } catch (err) { next(err); }
});

module.exports = router;
