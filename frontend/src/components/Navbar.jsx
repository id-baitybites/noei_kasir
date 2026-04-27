import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, BrainCircuit } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
          <BrainCircuit className="w-8 h-8" />
          <span>Noei Kasir</span>
        </Link>
        
        <div className="flex gap-6">
          <Link 
            to="/" 
            className={`flex items-center gap-1 font-medium ${isActive('/') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-500'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link 
            to="/pos" 
            className={`flex items-center gap-1 font-medium ${isActive('/pos') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-500'}`}
          >
            <ShoppingCart className="w-4 h-4" />
            POS Screen
          </Link>
          <Link 
            to="/products" 
            className={`flex items-center gap-1 font-medium ${isActive('/products') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-500'}`}
          >
            <Package className="w-4 h-4" />
            Products
          </Link>
        </div>
        
        <div className="text-sm font-medium text-gray-500">
          v1.0.0 (MCP Ready)
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
