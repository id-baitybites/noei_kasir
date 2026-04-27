import React, { useState, useEffect } from 'react';
import { productApi } from '../api';
import { Plus, Edit, Trash2, Package, X, Bell, ChevronDown } from 'lucide-react';
import '../styles/Products.scss';

const ProductModal = ({ isOpen, onClose, onSubmit, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        category: product.category || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: ''
      });
    }
  }, [product]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Product Name</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <div className="quick-categories">
              {['Cakes', 'Honey', 'Crafts'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={formData.category === cat ? 'active' : ''}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or type custom category..."
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price</label>
              <input
                required
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                required
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await productApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => 
    activeCategory === 'All' || p.category === activeCategory
  );

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productApi.delete(id);
        fetchProducts();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingProduct) {
        await productApi.update(editingProduct.id, data);
      } else {
        await productApi.create(data);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      alert('Operation failed: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  return (
    <div className="content-area">
      <header className="header">
        <h1>Products Management</h1>
        <div className="header-actions">
          <div className="notification-bell">
            <Bell size={20} />
          </div>
          <div className="user-profile">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
            <div className="user-info">
              <p>Noei Admin</p>
              <span>SUPERUSER</span>
            </div>
            <ChevronDown size={14} />
          </div>
        </div>
      </header>

      <div className="products-page">
        <div className="page-header">
          <div className="title-area">
            <p>Manage your inventory and pricing with ease.</p>
          </div>
          <div className="header-actions">
            <select 
              className="category-select"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button onClick={handleCreate} className="add-btn">
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '4rem 0', color: '#9ca3af' }}>
                    <Package size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>No products found. Add some to get started.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <span className="product-name">{product.name}</span>
                      <span className="product-desc">{product.description}</span>
                    </td>
                    <td>
                      <span className="category-badge">{product.category || 'General'}</span>
                    </td>
                    <td>
                      <span className="price">${parseFloat(product.price).toFixed(2)}</span>
                    </td>
                    <td>
                      <span className={`stock-badge ${product.stock < 10 ? 'low-stock' : 'in-stock'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button onClick={() => handleEdit(product)} className="edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmit}
        product={editingProduct}
      />
    </div>
  );
};

export default Products;

