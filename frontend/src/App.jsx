import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import Login from './pages/Login';
import { LayoutDashboard, ShoppingCart, Package, BrainCircuit, History, Settings, LogOut, HelpCircle, Bell } from 'lucide-react';
import './styles/App.scss';

const ProtectedRoute = ({ user, roles, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Role-based visibility
  const canSeeDashboard = ['super-admin', 'store-admin'].includes(user?.role);
  const canSeePOS = ['super-admin', 'cashier'].includes(user?.role);
  const canSeeProducts = ['super-admin', 'stock-admin', 'store-admin'].includes(user?.role);

  return (
    <div className="sidebar">
      <div className="logo">
        <BrainCircuit size={32} />
      </div>
      
      <div className="nav-items">
        {canSeeDashboard && (
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <LayoutDashboard size={24} />
          </Link>
        )}
        {canSeePOS && (
          <Link to="/pos" className={`nav-link ${isActive('/pos') ? 'active' : ''}`}>
            <ShoppingCart size={24} />
          </Link>
        )}
        {canSeeProducts && (
          <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
            <Package size={24} />
          </Link>
        )}
        <div className="nav-link">
          <History size={24} />
        </div>
        <div className="nav-link">
          <HelpCircle size={24} />
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="nav-link">
          <Settings size={24} />
        </div>
        <div className="nav-link" onClick={onLogout}>
          <LogOut size={24} />
        </div>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        {user && <Sidebar user={user} onLogout={handleLogout} />}
        <main className={user ? "main-layout" : "auth-layout"}>
          <Routes>
            <Route path="/login" element={<Login onLogin={setUser} />} />
            
            <Route path="/" element={
              <ProtectedRoute user={user} roles={['super-admin', 'store-admin']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/pos" element={
              <ProtectedRoute user={user} roles={['super-admin', 'cashier']}>
                <POS />
              </ProtectedRoute>
            } />
            
            <Route path="/products" element={
              <ProtectedRoute user={user} roles={['super-admin', 'stock-admin', 'store-admin']}>
                <Products />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
