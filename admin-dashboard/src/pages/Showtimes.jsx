import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trash2, Edit } from 'lucide-react';
import Modal from '../components/Modal';

const Showtimes = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState(null);
  
  const [formData, setFormData] = useState({
    movie: '',
    hall: '',
    date: '',
    startTime: '',
    endTime: '',
    ticketPrice: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [showtimesRes, moviesRes, hallsRes] = await Promise.all([
        api.get('/showtimes'),
        api.get('/movies'),
        api.get('/halls')
      ]);
      setShowtimes(showtimesRes.data.data.showtimes || showtimesRes.data.data || []);
      setMovies(moviesRes.data.data || []);
      setHalls(hallsRes.data.data.halls || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this showtime?')) return;
    try {
      await api.delete(`/showtimes/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete showtime');
    }
  };

  const openAddModal = () => {
    setEditingShowtime(null);
    setFormData({
      movie: movies.length > 0 ? movies[0]._id : '',
      hall: halls.length > 0 ? halls[0]._id : '',
      date: '',
      startTime: '',
      endTime: '',
      ticketPrice: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (st) => {
    setEditingShowtime(st);
    setFormData({
      movie: st.movie?._id || st.movie,
      hall: st.hall?._id || st.hall,
      date: st.date ? st.date.split('T')[0] : '',
      startTime: st.startTime || '',
      endTime: st.endTime || '',
      ticketPrice: st.ticketPrice || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        movie: formData.movie,
        hall: formData.hall,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        ticketPrice: parseFloat(formData.ticketPrice)
      };

      if (editingShowtime) {
        // According to swagger, PUT /showtimes/:id takes ticketPrice mostly, but let's send what we have
        await api.put(`/showtimes/${editingShowtime._id}`, payload);
      } else {
        await api.post('/showtimes', payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save showtime');
    }
  };

  if (loading) return <div className="p-6">Loading showtimes...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1>Showtimes Management</h1>
        <button className="btn btn-primary" onClick={openAddModal}>Add Showtime</button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Movie</th>
              <th>Hall</th>
              <th>Date</th>
              <th>Time</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {showtimes.map((st) => (
              <tr key={st._id}>
                <td style={{ fontWeight: 500 }}>{st.movie?.title || 'Unknown'}</td>
                <td>{st.hall?.name || 'Unknown'}</td>
                <td>{new Date(st.date).toLocaleDateString()}</td>
                <td>{st.startTime} - {st.endTime}</td>
                <td>${st.ticketPrice}</td>
                <td>
                  <span className={`badge ${st.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {st.isActive ? 'Active' : 'Cancelled'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary p-2" title="Edit" onClick={() => openEditModal(st)}><Edit size={16} /></button>
                    <button className="btn btn-danger p-2" title="Delete" onClick={() => handleDelete(st._id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {showtimes.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No showtimes found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingShowtime ? "Edit Showtime" : "Add Showtime"}>
        <form onSubmit={handleSubmit} className="flex-col gap-4">
          <div className="input-group">
            <label className="input-label">Movie</label>
            <select className="input-field" required value={formData.movie} onChange={e => setFormData({...formData, movie: e.target.value})}>
              {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
            </select>
          </div>
          
          <div className="input-group">
            <label className="input-label">Hall</label>
            <select className="input-field" required value={formData.hall} onChange={e => setFormData({...formData, hall: e.target.value})}>
              {halls.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Date</label>
            <input type="date" className="input-field" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>

          <div className="flex gap-4">
            <div className="input-group w-full">
              <label className="input-label">Start Time (HH:MM)</label>
              <input type="time" className="input-field" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
            </div>
            <div className="input-group w-full">
              <label className="input-label">End Time (HH:MM)</label>
              <input type="time" className="input-field" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Ticket Price ($)</label>
            <input type="number" step="0.01" className="input-field" required value={formData.ticketPrice} onChange={e => setFormData({...formData, ticketPrice: e.target.value})} />
          </div>

          <div className="flex justify-between mt-4">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingShowtime ? "Save Changes" : "Create Showtime"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Showtimes;
