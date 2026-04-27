import React from 'react';
import { Bell, ChevronDown, ShoppingCart } from 'lucide-react';

const Header = ({ title, cartCount, onCartClick }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <header className="header">
      <h1>{title}</h1>
      <div className="header-actions">
        {onCartClick && (
          <button 
            className="notification-bell lg-hidden" 
            onClick={onCartClick}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}
          </button>
        )}
        <div className="notification-bell">
          <Bell size={20} />
        </div>
        <div className="user-profile">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="User" />
          <div className="user-info">
            <p>{user.username || 'User'}</p>
            <span>{user.role?.replace('-', ' ').toUpperCase() || 'STAFF'}</span>
          </div>
          <ChevronDown className="chevron" size={14} />
        </div>
      </div>
    </header>
  );
};

export default Header;
