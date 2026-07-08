import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Film } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = null || useState(''); // small hack to avoid React import issue if not present but we imported it
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.data.user.role !== 'admin') {
        setError('Access denied: Admins only');
      } else {
        localStorage.setItem('adminToken', data.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="glass-panel p-6 animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="flex-col items-center justify-center mb-6">
          <div className="p-4" style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Film size={40} className="text-gradient" />
          </div>
          <h2 className="text-gradient">Admin Dashboard</h2>
          <p className="input-label mt-4">Sign in to control the cinema system</p>
        </div>

        {error && <div className="p-4 mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', borderRadius: 'var(--border-radius-md)' }}>{error}</div>}

        <form onSubmit={handleLogin} className="flex-col gap-4">
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
