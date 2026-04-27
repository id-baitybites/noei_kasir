import React, { useState, useEffect } from 'react';
import { transactionApi, productApi } from '../api';
import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

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
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Noei Kasir Admin.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-lg text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Recent Transactions</h2>
            <button className="text-indigo-600 text-sm font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p>No transactions yet.</p>
              </div>
            ) : (
              recentTransactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded text-indigo-600">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Order #{tx.id}</p>
                      <p className="text-xs text-gray-500">{format(new Date(tx.created_at), 'HH:mm - MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">${parseFloat(tx.total_amount).toFixed(2)}</p>
                    <p className="text-xs text-gray-500 uppercase">{tx.payment_method}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4">AI Agent Insights (MCP)</h2>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <p className="text-indigo-800 text-sm italic">
                {lowStockCount > 0 
                  ? `"You have ${lowStockCount} items with low stock. Would you like me to generate a restock report?"`
                  : `"Inventory levels are healthy. I'll keep monitoring for any stockouts."`}
              </p>
              {lowStockCount > 0 && (
                <div className="mt-3 flex gap-2">
                  <button className="bg-indigo-600 text-white px-3 py-1 rounded text-xs">Generate Report</button>
                  <button className="bg-white text-indigo-600 border border-indigo-600 px-3 py-1 rounded text-xs">Dismiss</button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl shadow-lg text-white">
            <h3 className="font-bold text-lg mb-2">MCP Power</h3>
            <p className="text-indigo-100 text-sm mb-4">
              Connect your AI agent to the MCP endpoint at <code className="bg-white bg-opacity-20 px-1 rounded">/mcp</code> to enable autonomous inventory management.
            </p>
            <button className="w-full py-2 bg-white text-indigo-600 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors">
              View MCP Docs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

