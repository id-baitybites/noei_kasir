const db = require('../db');

class ProductService {
  async getAllProducts() {
    const { rows } = await db.query('SELECT * FROM products ORDER BY name ASC');
    return rows;
  }

  async getProductById(id) {
    const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    return rows[0];
  }

  async createProduct(productData) {
    const { name, description, price, stock, category } = productData;
    const { rows } = await db.query(
      'INSERT INTO products (name, description, price, stock, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, stock, category]
    );
    return rows[0];
  }

  async updateProduct(id, productData) {
    const { name, description, price, stock, category } = productData;
    const { rows } = await db.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, category = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [name, description, price, stock, category, id]
    );
    return rows[0];
  }

  async deleteProduct(id) {
    await db.query('DELETE FROM products WHERE id = $1', [id]);
    return { success: true };
  }

  async getLowStockProducts(threshold = 10) {
    const { rows } = await db.query('SELECT * FROM products WHERE stock <= $1', [threshold]);
    return rows;
  }
}

module.exports = new ProductService();
