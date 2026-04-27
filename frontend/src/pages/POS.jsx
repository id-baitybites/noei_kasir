import React, { useState, useEffect } from 'react';
import { productApi, transactionApi } from '../api';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, ShoppingCart, Bell, ChevronDown, Star, Tag, X } from 'lucide-react';
import '../styles/POS.scss';

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const getCategoryCount = (category) => {
    if (category === 'All') return products.length;
    return products.filter(p => p.category === category).length;
  };

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, product_id: product.id, quantity: 1 }];
    });
    // Automatically open cart on mobile when item is added
    if (window.innerWidth <= 1024) setIsCartOpen(true);
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.product_id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = subtotal * 0.1;
  const tax = subtotal * 0.05;
  const total = subtotal - discount + tax;

  const handleCheckout = async (method) => {
    if (cart.length === 0) return alert('Cart is empty');
    
    try {
      await transactionApi.create({
        items: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
        payment_method: method
      });
      alert('Transaction Successful!');
      setCart([]);
      setIsCartOpen(false);
      fetchProducts();
    } catch (error) {
      alert('Checkout failed: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="main-layout">
      {/* Center Area */}
      <div className="content-area">
        <header className="header">
          <h1>Checkout Order</h1>
          <div className="header-actions">
            <button 
              className="notification-bell lg-hidden" 
              onClick={() => setIsCartOpen(true)}
              style={{ position: 'relative', border: 'none', cursor: 'pointer' }}
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span style={{ 
                  position: 'absolute', top: -5, right: -5, background: '#7c3aed', 
                  color: 'white', borderRadius: '50%', width: 18, height: 18, 
                  fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  {cart.length}
                </span>
              )}
            </button>
            <div className="notification-bell">
              <Bell size={20} />
            </div>
            <div className="user-profile">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mahmoud" alt="User" />
              <div className="user-info">
                <p>Mahmoud Abbas</p>
                <span>KSR-001</span>
              </div>
              <ChevronDown className="chevron" size={14} />
            </div>
          </div>
        </header>

        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`tab ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat === 'All' ? 'All Items' : cat}
              <span className="count">{getCategoryCount(cat)}</span>
            </button>
          ))}
          <div style={{ marginLeft: 'auto' }}>
            <Search size={20} color="#6b7280" />
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="image-container">
                <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${product.name}`} alt={product.name} />
              </div>
              <div className="card-info">
                <h3>{product.name}</h3>
                <p>{product.description || "Premium quality product selected for your needs."}</p>
              </div>
              <div className="status-row">
                <span className={`stock-badge ${product.stock < 10 ? 'low-stock' : 'in-stock'}`}>
                    {product.stock < 10 ? 'Low Stock' : 'In Stock'}: {product.stock}
                </span>
              </div>
              <div className="footer-row">
                <span className="price">${parseFloat(product.price).toFixed(2)}</span>
                <button 
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className="add-btn"
                >
                    Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar Overlay */}
      {isCartOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 999 }} 
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Right Sidebar */}
      <div className={`order-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Order Details</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            className="lg-hidden"
          >
            <X size={24} color="#6b7280" />
          </button>
          <Plus size={20} className="md-hidden" />
        </div>

        <div className="customer-section">
          <div className="label-row">
            <span>Customer Name</span>
            <span className="add-new">+ Add New</span>
          </div>
          <div className="customer-picker">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mick" alt="Customer" />
            <div className="info">
              <p>Mick Krasinski</p>
              <span>No loyalty points</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
              <ShoppingCart size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product_id} className="cart-item">
                <div className="item-img">
                   <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${item.name}`} alt={item.name} />
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <div className="meta">
                    <span className="rating"><Star size={12} fill="currentColor" /> 4.8</span>
                    <span>(1230)</span>
                  </div>
                  <div className="options">
                    <span>Size: <b>45</b></span>
                    <span>Color: <div style={{ width: 12, height: 12, background: '#111827', borderRadius: 2 }}></div></span>
                  </div>
                </div>
                <div className="item-price-qty">
                  <p className="price">${parseFloat(item.price).toFixed(2)}</p>
                  <div className="qty-controls">
                    <button onClick={() => updateQuantity(item.product_id, -1)}><Minus size={12} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, 1)}><Plus size={12} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="checkout-summary">
          <div className="discount-banner">
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={16} color="#7c3aed" />
                <span>Discount 10%</span>
             </div>
             <span className="change-btn">Change</span>
          </div>

          <div className="summary-row">
            <span>Sub Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row discount">
            <span>Discount (10%)</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Sales Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total Payment</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button onClick={() => handleCheckout('card')} className="process-btn">
            Process Transactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
