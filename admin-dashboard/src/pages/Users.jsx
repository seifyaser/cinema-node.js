import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { ShieldAlert, ShieldCheck, Trash2 } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
    try {
      await api.put(`/users/${user._id}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to change role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="p-6">
      <h1 className="mb-6">Users Management</h1>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={{ fontWeight: 500 }}>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <span className={`badge ${user.role === 'admin' ? 'badge-success' : 'badge-warning'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-secondary p-2" 
                      title="Toggle Role" 
                      onClick={() => toggleRole(user)}
                    >
                      {user.role === 'admin' ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                    </button>
                    <button className="btn btn-danger p-2" title="Delete" onClick={() => handleDelete(user._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
