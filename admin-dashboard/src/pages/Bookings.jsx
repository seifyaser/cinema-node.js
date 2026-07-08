import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data.data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading bookings...</div>;

  return (
    <div className="p-6">
      <h1 className="mb-6">System Bookings</h1>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID / Status</th>
              <th>User</th>
              <th>Movie & Showtime</th>
              <th>Seats</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking._id}</span>
                  </div>
                  <span className={`badge mt-2 ${
                    booking.status === 'confirmed' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  <div className="flex-col">
                    <span style={{ fontWeight: 500 }}>{booking.user?.name || 'N/A'}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{booking.user?.email}</span>
                  </div>
                </td>
                <td>
                  <div className="flex-col">
                    <span style={{ fontWeight: 500 }}>{booking.showtime?.movie?.title || 'Unknown'}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {booking.showtime?.hall?.name}
                    </span>
                  </div>
                </td>
                <td>{booking.seats?.length || 0} seat(s)</td>
                <td style={{ fontWeight: 500, color: 'var(--accent-success)' }}>
                  ${booking.totalAmount?.toFixed(2) || '0.00'}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No bookings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
