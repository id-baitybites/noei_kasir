import React, { useState, useEffect } from 'react';
import { productApi, transactionApi } from '../api';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote } from 'lucide-react';

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
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
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product_id !== productId));
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

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async (method) => {
    if (cart.length === 0) return alert('Cart is empty');
    
    try {
      await transactionApi.create({
        items: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
        payment_method: method
      });
      alert('Transaction Successful!');
      setCart([]);
      fetchProducts(); // Refresh stock
    } catch (error) {
      alert('Checkout failed: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
      {/* Products Selection */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2">
          {filteredProducts.map(product => (
            <button 
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className={`p-4 rounded-xl border text-left transition-all ${
                product.stock <= 0 ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed' : 'bg-white border-gray-200 hover:border-indigo-500 hover:shadow-md'
              }`}
            >
              <h4 className="font-bold text-gray-800 line-clamp-1">{product.name}</h4>
              <p className="text-sm text-gray-500">{product.category}</p>
              <div className="mt-2 flex justify-between items-end">
                <span className="text-indigo-600 font-bold">${product.price}</span>
                <span className={`text-xs ${product.stock < 10 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                  Stock: {product.stock}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart / Checkout */}
      <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            Current Cart <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">{cart.length}</span>
          </h2>
          <button onClick={() => setCart([])} className="text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product_id} className="flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                  <p className="text-xs text-gray-500">${item.price} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.product_id, -1)} className="p-1 rounded bg-gray-100 hover:bg-gray-200"><Minus className="w-3 h-3" /></button>
                  <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product_id, 1)} className="p-1 rounded bg-gray-100 hover:bg-gray-200"><Plus className="w-3 h-3" /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-indigo-600">${total.toFixed(2)}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleCheckout('cash')}
              className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Banknote className="w-5 h-5" />
              Cash
            </button>
            <button 
              onClick={() => handleCheckout('card')}
              className="flex items-center justify-center gap-2 py-3 bg-indigo-600 rounded-lg font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <CreditCard className="w-5 h-5" />
              Card / QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
