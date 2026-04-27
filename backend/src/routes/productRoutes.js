const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const { z } = require('zod');

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  category: z.string().optional()
});

router.get('/', async (req, res, next) => {
  try {
    let products;
    if (req.query.low_stock) {
      products = await productService.getLowStockProducts(req.query.threshold);
    } else {
      products = await productService.getAllProducts();
    }
    res.json(products);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const validatedData = productSchema.parse(req.body);
    const product = await productService.createProduct(validatedData);
    res.status(201).json(product);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const validatedData = productSchema.parse(req.body);
    const product = await productService.updateProduct(req.params.id, validatedData);
    res.json(product);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;
