import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Modal from '../components/Modal';

const Halls = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHall, setEditingHall] = useState(null);
  const [formData, setFormData] = useState({ name: '', screenType: 'standard', totalRows: 10, totalColumns: 10, isActive: true });

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const { data } = await api.get('/halls');
      setHalls(data.data.halls);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingHall(null);
    setFormData({ name: '', screenType: 'standard', totalRows: 10, totalColumns: 10, isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (hall) => {
    setEditingHall(hall);
    setFormData({
      name: hall.name,
      screenType: hall.screenType || 'standard',
      totalRows: hall.totalRows,
      totalColumns: hall.totalColumns,
      isActive: hall.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHall) {
        await api.put(`/halls/${editingHall._id}`, {
          name: formData.name,
          screenType: formData.screenType,
          isActive: formData.isActive
        });
      } else {
        await api.post('/halls', {
          name: formData.name,
          screenType: formData.screenType,
          totalRows: parseInt(formData.totalRows, 10),
          totalColumns: parseInt(formData.totalColumns, 10)
        });
      }
      setIsModalOpen(false);
      fetchHalls();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save hall');
    }
  };

  if (loading) return <div className="p-6">Loading halls...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1>Halls Management</h1>
        <button className="btn btn-primary" onClick={openAddModal}>Add Hall</button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {halls.map((hall) => (
              <tr key={hall._id}>
                <td style={{ fontWeight: 500 }}>{hall.name}</td>
                <td>{hall.capacity} seats</td>
                <td>
                  <span className={`badge ${hall.isActive ? 'badge-success' : 'badge-warning'}`}>
                    {hall.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary p-2" onClick={() => openEditModal(hall)}>Edit</button>
                </td>
              </tr>
            ))}
            {halls.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No halls found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingHall ? "Edit Hall" : "Add Hall"}>
        <form onSubmit={handleSubmit} className="flex-col gap-4">
          <div className="input-group">
            <label className="input-label">Hall Name</label>
            <input type="text" className="input-field" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div className="input-group">
            <label className="input-label">Screen Type</label>
            <select className="input-field" value={formData.screenType} onChange={e => setFormData({...formData, screenType: e.target.value})}>
              <option value="standard">Standard</option>
              <option value="imax">IMAX</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          {!editingHall && (
            <div className="flex gap-4">
              <div className="input-group w-full">
                <label className="input-label">Total Rows</label>
                <input type="number" className="input-field" required min="1" max="26" value={formData.totalRows} onChange={e => setFormData({...formData, totalRows: e.target.value})} />
              </div>
              <div className="input-group w-full">
                <label className="input-label">Total Columns</label>
                <input type="number" className="input-field" required min="1" max="50" value={formData.totalColumns} onChange={e => setFormData({...formData, totalColumns: e.target.value})} />
              </div>
            </div>
          )}

          {editingHall && (
            <div className="input-group">
              <label className="input-label">Status</label>
              <select className="input-field" value={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.value === 'true'})}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingHall ? "Save Changes" : "Create Hall"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Halls;
