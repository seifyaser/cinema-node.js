import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Film, Users, MapPin, CalendarCheck, LogOut, UserCircle, Clock } from 'lucide-react';
import api from '../utils/api';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setAdminUser(data.data.user);
      } catch (err) {
        console.error('Failed to fetch user', err);
      }
    };
    fetchMe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/movies', label: 'Movies', icon: Film },
    { path: '/showtimes', label: 'Showtimes', icon: Clock },
    { path: '/halls', label: 'Halls', icon: MapPin },
    { path: '/bookings', label: 'Bookings', icon: CalendarCheck },
    { path: '/users', label: 'Users', icon: Users },
  ];

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '250px', margin: '1rem', display: 'flex', flexDirection: 'column' }}>
        <div className="p-6">
          <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Cinema Admin</h2>
          
          {adminUser && (
            <div className="flex items-center gap-3 mb-6 p-3" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--border-radius-md)' }}>
              <UserCircle size={32} className="text-secondary" />
              <div className="flex-col">
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Welcome back,</span>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{adminUser.name}</span>
              </div>
            </div>
          )}

          <nav className="flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 p-4 rounded-md transition-fast ${isActive ? 'btn-primary' : 'hover:bg-slate-800'}`}
                  style={{
                    backgroundColor: isActive ? '' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-6 mt-auto">
          <button onClick={handleLogout} className="btn btn-secondary w-full flex items-center justify-center gap-2">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 animate-fade-in">
        <div className="glass-panel" style={{ minHeight: 'calc(100vh - 3rem)' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
