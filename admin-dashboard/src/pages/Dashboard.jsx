import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Users, Film, CalendarCheck, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/statistics');
        setStats(data.data);
      } catch (err) {
        console.error('Failed to fetch statistics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard data...</div>;
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'var(--accent-primary)', bg: 'rgba(59, 130, 246, 0.1)' },
    { label: 'Active Movies', value: stats?.totalMovies || 0, icon: Film, color: 'var(--accent-secondary)', bg: 'rgba(139, 92, 246, 0.1)' },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: CalendarCheck, color: 'var(--accent-warning)', bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'var(--accent-success)', bg: 'rgba(16, 185, 129, 0.1)' },
  ];

  return (
    <div className="p-6 h-full flex-col">
      <h1 className="mb-6">Dashboard Overview</h1>
      
      <div className="flex gap-6 w-full mb-6" style={{ flexWrap: 'wrap' }}>
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card flex items-center justify-between" style={{ flex: '1 1 200px' }}>
              <div>
                <p className="input-label mb-2">{stat.label}</p>
                <h2 style={{ fontSize: '2rem' }}>{stat.value}</h2>
              </div>
              <div className="p-4" style={{ backgroundColor: stat.bg, color: stat.color, borderRadius: '50%' }}>
                <Icon size={32} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="card w-full" style={{ flex: 1 }}>
        <h3 className="mb-4">Recent Activity</h3>
        <p className="text-secondary">Dashboard activity chart or recent bookings feed can be displayed here in the future.</p>
      </div>
    </div>
  );
};

export default Dashboard;
