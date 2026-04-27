import React, { useState, useEffect } from 'react';
import { userApi, authApi } from '../api';
import { User, Shield, Users, Plus, Trash2, X, Bell } from 'lucide-react';
import Header from '../components/Header';
import '../styles/Settings.scss';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('staff');
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // New user state
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'cashier' });
  const [error, setError] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = currentUser.role === 'super-admin';

  useEffect(() => {
    if (isSuperAdmin) fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await userApi.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authApi.register(newUser);
      setIsModalOpen(false);
      setNewUser({ username: '', password: '', role: 'cashier' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add staff member');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      await userApi.delete(id);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <div className="content-area">
      <div className="settings-page">
        <Header title="Settings" />

      <div className="settings-grid">
        <div className="settings-nav">
          <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <User size={20} /> Account Profile
          </div>
          {isSuperAdmin && (
            <div className={`nav-item ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}>
              <Users size={20} /> Staff Management
            </div>
          )}
          <div className={`nav-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <Shield size={20} /> Security
          </div>
          <div className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
            <Bell size={20} /> Notifications
          </div>
        </div>

        <div className="settings-content">
          {activeTab === 'staff' && isSuperAdmin && (
            <div className="staff-section">
              <div className="section-header">
                <div>
                  <h2>Staff Management</h2>
                  <p>Create and manage user accounts for your team</p>
                </div>
                <button className="add-btn" onClick={() => setIsModalOpen(true)} style={{
                  background: '#7c3aed', color: 'white', border: 'none', 
                  padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
                }}>
                  <Plus size={20} /> Add Staff
                </button>
              </div>

              <table className="staff-table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Role</th>
                    <th>Joined Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="user-pill">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} alt="" />
                          <span>{u.username}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${u.role}`}>{u.role.replace('-', ' ')}</span>
                      </td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        {u.id !== currentUser.id && (
                          <button onClick={() => handleDeleteUser(u.id)} style={{
                            background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer'
                          }}>
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>My Profile</h2>
              <p>Details for <b>{currentUser.username}</b> ({currentUser.role})</p>
              {/* Profile form would go here */}
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="modal-content" style={{
            background: 'white', width: '100%', maxWidth: '400px', borderRadius: '2rem', overflow: 'hidden'
          }}>
            <div style={{ padding: '1.5rem', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 800 }}>Add New Staff</h3>
              <X size={20} onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }} />
            </div>
            
            <form onSubmit={handleAddStaff} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {error && <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>}
              
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700 }}>Username</label>
                <input 
                  type="text" required
                  style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}
                  value={newUser.username}
                  onChange={e => setNewUser({...newUser, username: e.target.value})}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700 }}>Password</label>
                <input 
                  type="password" required
                  style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700 }}>Assign Role</label>
                <select 
                  style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="cashier">Cashier</option>
                  <option value="stock-admin">Stock Admin</option>
                  <option value="store-admin">Store Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>

              <button type="submit" style={{
                background: '#7c3aed', color: 'white', border: 'none', padding: '1rem', 
                borderRadius: '1rem', fontWeight: 800, marginTop: '1rem', cursor: 'pointer'
              }}>
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default Settings;
