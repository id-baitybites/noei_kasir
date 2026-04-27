import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import { LayoutDashboard, ShoppingCart, Package, BrainCircuit, History, Settings, LogOut, HelpCircle, Bell } from 'lucide-react';
import './styles/App.scss';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="logo">
        <BrainCircuit size={32} />
      </div>
      
      <div className="nav-items">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
          <LayoutDashboard size={24} />
        </Link>
        <Link to="/pos" className={`nav-link ${isActive('/pos') ? 'active' : ''}`}>
          <ShoppingCart size={24} />
        </Link>
        <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
          <Package size={24} />
        </Link>
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
        <div className="nav-link">
          <LogOut size={24} />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-layout">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
