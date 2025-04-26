import React, { useState } from 'react';
import api from '../../api';
import '../ADMIN/styles/playerForm.css'; // Import the CSS file

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
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.first_name || !form.last_name) {
      setError('First name and last name are required');
      return;
    }

    try {
      await api.post('/players', form);
      setForm(initialForm);
      setSuccess(true);
      onSuccess();
    } catch (error) {
      console.error('API Error:', error);
      setError(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Failed to add player. Please try again.'
      );
    }
  };

  return (
    <div className="player-form-container">
      <h2 className="form-title">Add New Player</h2>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">Player added successfully!</div>}

      <form onSubmit={handleSubmit} className="player-form">
        <div className="form-group">
          <label htmlFor="player_id">Player ID</label>
          <input 
            id="player_id"
            name="player_id" 
            value={form.player_id} 
            onChange={handleChange}
            placeholder="Enter unique player ID"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first_name">First Name*</label>
            <input 
              id="first_name"
              name="first_name" 
              value={form.first_name} 
              onChange={handleChange}
              placeholder="Player's first name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="last_name">Last Name*</label>
            <input 
              id="last_name"
              name="last_name" 
              value={form.last_name} 
              onChange={handleChange}
              placeholder="Player's last name"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date_of_birth">Date of Birth*</label>
            <input 
              id="date_of_birth"
              type="date" 
              name="date_of_birth" 
              value={form.date_of_birth} 
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="academy_join_date">Academy Join Date*</label>
            <input 
              id="academy_join_date"
              type="date" 
              name="academy_join_date" 
              value={form.academy_join_date} 
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="position">Position*</label>
            <select 
              id="position"
              name="position" 
              value={form.position} 
              onChange={handleChange}
              required
            >
              <option value="MIDFIELDER">Midfielder</option>
              <option value="GOALKEEPER">Goalkeeper</option>
              <option value="DEFENDER">Defender</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="nationality">Nationality*</label>
            <select 
              id="nationality"
              name="nationality" 
              value={form.nationality} 
              onChange={handleChange}
              required
            >
              <option value="South Africa">South Africa</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="height">Height (cm)</label>
            <input 
              id="height"
              type="number" 
              name="height" 
              value={form.height} 
              onChange={handleChange}
              placeholder="Enter height in cm"
              min="100"
              max="250"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input 
              id="weight"
              type="number" 
              name="weight" 
              value={form.weight} 
              onChange={handleChange}
              placeholder="Enter weight in kg"
              min="30"
              max="120"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contact_email">Email</label>
            <input 
              id="contact_email"
              type="email" 
              name="contact_email" 
              value={form.contact_email} 
              onChange={handleChange}
              placeholder="player@example.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contact_phone">Phone</label>
            <input 
              id="contact_phone"
              name="contact_phone" 
              value={form.contact_phone} 
              onChange={handleChange}
              placeholder="+27 12 345 6789"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status*</label>
          <select 
            id="status"
            name="status" 
            value={form.status} 
            onChange={handleChange}
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Add Player
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerForm;