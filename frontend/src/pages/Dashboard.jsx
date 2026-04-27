import React, { useState, useEffect } from 'react';
import { transactionApi, productApi } from '../api';
import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle, Clock, ChevronRight, Bell, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import '../styles/Dashboard.scss';

const Dashboard = () => {
  const [summary, setSummary] = useState({ total_transactions: 0, total_revenue: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, transactionsRes, lowStockRes] = await Promise.all([
          transactionApi.getSummary(),
          transactionApi.getAll(5),
          productApi.getLowStock(10)
        ]);
        
        setSummary(summaryRes.data || { total_transactions: 0, total_revenue: 0 });
        setRecentTransactions(transactionsRes.data || []);
        setLowStockCount(lowStockRes.data?.length || 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { label: "Today's Sales", value: `$${parseFloat(summary.total_revenue || 0).toFixed(2)}`, icon: DollarSign, color: "bg-green-500" },
    { label: "Transactions", value: summary.total_transactions || 0, icon: ShoppingBag, color: "bg-blue-500" },
    { label: "Growth", value: "+12%", icon: TrendingUp, color: "bg-purple-500" },
    { label: "Low Stock", value: `${lowStockCount} Items`, icon: AlertTriangle, color: "bg-orange-500" },
  ];

  return (
    <div className="content-area">
      <header className="header">
        <h1>Dashboard Overview</h1>
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

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className={`icon-wrapper ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <p>{stat.label}</p>
              <h3>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0 }}>Recent Transactions</h2>
            <ChevronRight size={20} color="#6b7280" />
          </div>
          <div className="transaction-list">
            {recentTransactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
                <p>No transactions yet.</p>
              </div>
            ) : (
              recentTransactions.map(tx => (
                <div key={tx.id} className="transaction-item">
                  <div className="tx-info">
                    <div className="icon">
                      <Clock size={16} />
                    </div>
                    <div>
                      <h4>Order #{tx.id}</h4>
                      <p>{format(new Date(tx.created_at), 'HH:mm - MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className="tx-amount">
                    <h4>${parseFloat(tx.total_amount).toFixed(2)}</h4>
                    <p>{tx.payment_method}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="section-sidebar">
          <div className="section-card">
            <h2>AI Agent Insights (MCP)</h2>
            <div className="mcp-insight-card">
              <p>
                {lowStockCount > 0 
                  ? `"You have ${lowStockCount} items with low stock. I recommend restocking soon."`
                  : `"Inventory levels are optimal. No immediate actions required."`}
              </p>
              {lowStockCount > 0 && (
                <div className="actions">
                  <button className="primary">Restock Report</button>
                  <button className="secondary">Dismiss</button>
                </div>
              )}
            </div>
            
            <div className="promo-card">
                <h3>Upgrade to Pro</h3>
                <p>Unlock advanced AI analytics and unlimited MCP tool calls.</p>
                <button>Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

