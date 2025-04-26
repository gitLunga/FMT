import React, { useState } from 'react';
import api from '../api';

const initialForm = {
  player_id: '',
  first_name: '',
  last_name: '',
  date_of_birth: '',
  position: 'MIDFIELDER',
  nationality: 'South Africa',
  height: '',
  weight: '',
  contact_email: '',
  contact_phone: '',
  academy_join_date: '',
  status: 'Active'
};

const PlayerForm = ({ onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.first_name || !form.last_name) {
      setError('First name and last name are required');
      return;
    }

    try {
      await api.post('/players', form);
      setForm(initialForm);
      onSuccess();
    } catch (error) {
      console.error('API Error:', error.message);
      setError(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Failed to add player. Please try again.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Player</h2>
      
      {error && <div className="error-message">{error}</div>}

      <input name="player_id" placeholder="ID" value={form.player_id} onChange={handleChange} />
      <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
      <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required />
      
      <select name="position" value={form.position} onChange={handleChange} required>
        <option value="MIDFIELDER">Midfielder</option>
        <option value="GOALKEEPER">Goalkeeper</option>
        <option value="DEFENDER">Defender</option>
      </select>
      
      <select name="nationality" value={form.nationality} onChange={handleChange} required>
        <option value="South Africa">South Africa</option>
        <option value="Nigeria">Nigeria</option>
        <option value="Other">Other</option>
      </select>
      
      <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} required />
      <input name="height" type="number" placeholder="Height (cm)" value={form.height} onChange={handleChange} />
      <input name="weight" type="number" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} />
      <input name="contact_email" type="email" placeholder="Email" value={form.contact_email} onChange={handleChange} />
      <input name="contact_phone" placeholder="Phone" value={form.contact_phone} onChange={handleChange} />
      <input name="academy_join_date" type="date" value={form.academy_join_date} onChange={handleChange} required />
      
      <select name="status" value={form.status} onChange={handleChange} required>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Graduated">Graduated</option>
      </select>
      
      <button type="submit">Add Player</button>
    </form>
  );
};

export default PlayerForm;