import React, { useState, useEffect } from 'react';
import { transactionApi } from '../api';
import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [summary, setSummary] = useState({ total_transactions: 0, total_revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await transactionApi.getSummary();
        setSummary(data || { total_transactions: 0, total_revenue: 0 });
      } catch (error) {
        console.error('Error fetching summary:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const stats = [
    { label: "Today's Sales", value: `$${summary.total_revenue || 0}`, icon: DollarSign, color: "bg-green-500" },
    { label: "Transactions", value: summary.total_transactions || 0, icon: ShoppingBag, color: "bg-blue-500" },
    { label: "Growth", value: "+12%", icon: TrendingUp, color: "bg-purple-500" },
    { label: "Low Stock", value: "3 Items", icon: AlertTriangle, color: "bg-orange-500" },
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
          <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
          <div className="text-center py-10 text-gray-400">
            <p>Transaction list will appear here.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">AI Agent Insights (MCP)</h2>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <p className="text-indigo-800 text-sm italic">
              "Your stock for 'Coffee Beans' is low. Would you like me to generate a restock order?"
            </p>
            <div className="mt-3 flex gap-2">
              <button className="bg-indigo-600 text-white px-3 py-1 rounded text-xs">Execute Restock</button>
              <button className="bg-white text-indigo-600 border border-indigo-600 px-3 py-1 rounded text-xs">Dismiss</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
