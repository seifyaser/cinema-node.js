import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trash2, Edit } from 'lucide-react';
import Modal from '../components/Modal';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', description: '', poster: '', trailerUrl: '', 
    genre: '', duration: '', ageRating: 'G', releaseDate: '', 
    actors: [], status: 'now_showing' 
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const { data } = await api.get('/movies');
      setMovies(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      await api.delete(`/movies/${id}`);
      fetchMovies();
    } catch (err) {
      console.error(err);
      alert('Failed to delete movie');
    }
  };

  const openAddModal = () => {
    setEditingMovie(null);
    setFormData({ 
      title: '', description: '', poster: '', trailerUrl: '', 
      genre: '', duration: '', ageRating: 'G', releaseDate: '', 
      actors: [], status: 'now_showing' 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description || '',
      poster: movie.posterUrl || movie.poster || '',
      trailerUrl: movie.trailerUrl || '',
      genre: movie.genre ? movie.genre.join(', ') : '',
      duration: movie.durationInMinutes || movie.duration || '',
      ageRating: movie.ageRating || 'G',
      releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
      actors: movie.actors
        ? movie.actors.map(a => typeof a === 'string' ? { name: a, image: '' } : { name: a.name || '', image: a.image || '' })
        : [],
      status: movie.status || 'now_showing'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        genre: formData.genre.split(',').map(g => g.trim()).filter(Boolean),
        actors: formData.actors
          .map(a => ({ name: a.name.trim(), image: a.image.trim() || null }))
          .filter(a => a.name),
        duration: parseInt(formData.duration, 10),
      };

      if (editingMovie) {
        await api.put(`/movies/${editingMovie._id}`, payload);
      } else {
        await api.post('/movies', payload);
      }
      setIsModalOpen(false);
      fetchMovies();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save movie');
    }
  };

  if (loading) return <div className="p-6">Loading movies...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1>Movies Management</h1>
        <button className="btn btn-primary" onClick={openAddModal}>Add Movie</button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie._id}>
                <td>
                  <div className="flex items-center gap-4">
                    {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />}
                    <span style={{ fontWeight: 500 }}>{movie.title}</span>
                  </div>
                </td>
                <td>{movie.genre?.join(', ')}</td>
                <td>{movie.durationInMinutes} min</td>
                <td>
                  <span className={`badge ${movie.status === 'showing' ? 'badge-success' : 'badge-warning'}`}>
                    {movie.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary p-2" title="Edit" onClick={() => openEditModal(movie)}><Edit size={16} /></button>
                    <button className="btn btn-danger p-2" title="Delete" onClick={() => handleDelete(movie._id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {movies.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No movies found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMovie ? "Edit Movie" : "Add Movie"}>
        <form onSubmit={handleSubmit} className="flex-col gap-4">
          <div className="input-group">
            <label className="input-label">Title</label>
            <input type="text" className="input-field" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="flex gap-4">
            <div className="input-group w-full">
              <label className="input-label">Genre (comma separated)</label>
              <input type="text" className="input-field" required value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} />
            </div>
            <div className="input-group w-full">
              <label className="input-label">Duration (mins)</label>
              <input type="number" className="input-field" required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="input-group w-full">
              <label className="input-label">Poster URL</label>
              <input type="url" className="input-field" required value={formData.poster} onChange={e => setFormData({...formData, poster: e.target.value})} />
            </div>
            <div className="input-group w-full">
              <label className="input-label">Trailer URL</label>
              <input type="url" className="input-field" value={formData.trailerUrl} onChange={e => setFormData({...formData, trailerUrl: e.target.value})} />
            </div>
          </div>
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="input-label">Actors Cast</label>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                onClick={() => {
                  setFormData({
                    ...formData,
                    actors: [...formData.actors, { name: '', image: '' }],
                  });
                }}
              >
                + Add Actor
              </button>
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '4px' }}>
              {formData.actors.map((actor, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
                  <input
                    type="text"
                    placeholder="Actor Name"
                    className="input-field"
                    style={{ flex: 1, fontSize: '0.875rem', padding: '0.5rem' }}
                    value={actor.name}
                    onChange={(e) => {
                      const newActors = [...formData.actors];
                      newActors[index] = { ...newActors[index], name: e.target.value };
                      setFormData({ ...formData, actors: newActors });
                    }}
                    required
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    className="input-field"
                    style={{ flex: 2, fontSize: '0.875rem', padding: '0.5rem' }}
                    value={actor.image}
                    onChange={(e) => {
                      const newActors = [...formData.actors];
                      newActors[index] = { ...newActors[index], image: e.target.value };
                      setFormData({ ...formData, actors: newActors });
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{ padding: '0.5rem' }}
                    onClick={() => {
                      const newActors = formData.actors.filter((_, i) => i !== index);
                      setFormData({ ...formData, actors: newActors });
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {formData.actors.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem' }}>
                  No actors added yet.
                </div>
              )}
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Age Rating</label>
            <select className="input-field" value={formData.ageRating} onChange={e => setFormData({...formData, ageRating: e.target.value})}>
              <option value="G">G</option>
              <option value="PG">PG</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R</option>
              <option value="NC-17">NC-17</option>
            </select>
          </div>
          <div className="flex gap-4">
            <div className="input-group w-full">
              <label className="input-label">Release Date</label>
              <input type="date" className="input-field" required value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} />
            </div>
            <div className="input-group w-full">
              <label className="input-label">Status</label>
              <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="now_showing">Now Showing</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea className="input-field" rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="flex justify-between mt-4">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingMovie ? "Save Changes" : "Create Movie"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Movies;
