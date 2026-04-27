import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { BrainCircuit, Lock, User, AlertCircle } from 'lucide-react';
import '../styles/App.scss'; // Reuse variables

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data } = await authApi.login({ username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
      
      // Redirect based on role
      if (data.user.role === 'cashier') navigate('/pos');
      else if (data.user.role === 'stock-admin') navigate('/products');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#111827' 
    }}>
      <div className="login-card" style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '2rem',
        width: '100%',
        maxWdith: '400px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            background: '#7c3aed', 
            padding: '1rem', 
            borderRadius: '1rem', 
            color: 'white',
            marginBottom: '1rem'
          }}>
            <BrainCircuit size={40} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827' }}>Noei Kasir</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Secure Point of Sale Access</p>
        </div>

        {error && (
          <div style={{ 
            background: '#fef2f2', 
            color: '#ef4444', 
            padding: '0.75rem', 
            borderRadius: '0.75rem', 
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
              <input
                required
                type="text"
                placeholder="Enter your username"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem 0.75rem 3rem', 
                  borderRadius: '0.75rem', 
                  border: '1px solid #e5e7eb',
                  outline: 'none'
                }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
              <input
                required
                type="password"
                placeholder="••••••••"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem 0.75rem 3rem', 
                  borderRadius: '0.75rem', 
                  border: '1px solid #e5e7eb',
                  outline: 'none'
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            style={{ 
              background: '#7c3aed', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '1rem', 
              fontWeight: 800, 
              border: 'none', 
              cursor: 'pointer',
              marginTop: '1rem',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
