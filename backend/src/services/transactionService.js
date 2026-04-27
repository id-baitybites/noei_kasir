const db = require('../db');

class TransactionService {
  async createTransaction(transactionData) {
    const { items, payment_method, user_id } = transactionData;
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      let totalAmount = 0;
      const transactionItems = [];

      // 1. Calculate total and validate stock
      for (const item of items) {
        const { product_id, quantity } = item;
        
        const { rows: productRows } = await client.query(
          'SELECT * FROM products WHERE id = $1 FOR UPDATE',
          [product_id]
        );
        
        const product = productRows[0];
        if (!product) {
          throw new Error(`Product with ID ${product_id} not found`);
        }
        
        if (product.stock < quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        const itemTotal = product.price * quantity;
        totalAmount += itemTotal;
        
        transactionItems.push({
          product_id,
          quantity,
          price_at_time: product.price
        });
      }

      // 2. Insert Transaction
      const { rows: transRows } = await client.query(
        'INSERT INTO transactions (total_amount, payment_method, user_id) VALUES ($1, $2, $3) RETURNING *',
        [totalAmount, payment_method || 'cash', user_id]
      );
      const transaction = transRows[0];

      // 3. Insert items and update stock
      for (const item of transactionItems) {
        await client.query(
          'INSERT INTO transaction_items (transaction_id, product_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)',
          [transaction.id, item.product_id, item.quantity, item.price_at_time]
        );

        await client.query(
          'UPDATE products SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );

        await client.query(
          'INSERT INTO stock_logs (product_id, change, reason, transaction_id) VALUES ($1, $2, $3, $4)',
          [item.product_id, -item.quantity, 'SALE', transaction.id]
        );
      }

      await client.query('COMMIT');
      return transaction;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getDailySales(date = new Date().toISOString().split('T')[0]) {
    const { rows } = await db.query(
      `SELECT 
        COUNT(id) as total_transactions,
        SUM(total_amount) as total_revenue
       FROM transactions 
       WHERE DATE(created_at) = $1`,
      [date]
    );
    return rows[0];
  }
}

module.exports = new TransactionService();
