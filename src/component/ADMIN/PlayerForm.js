import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../ADMIN/styles/playerForm.css'; // Import the CSS file
// import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const initialForm = {
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
  // const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState(null);
   const navigate = useNavigate();


  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);


  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    if (!form.first_name || !form.last_name) {
      setToast({ type: 'error', message: 'First name and last name are required' });
      return;
    }

    try {
      const response = await api.post('/players', form);
      console.log('API Response:', response.data); //
      setForm(initialForm);
      setToast({
        type: 'success',
        message: `Player added successfully! ID: ${response.data.player_id}`
      });

    } catch (error) {
      console.error('Full error object:', error);
      setToast({
        type: 'error',
        message: error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to add player. Please try again.'
      });
    }
  };

  return (
    <div className="player-form-container">
      <div className="form-header">
        <button
          className="back-button"
          onClick={() => navigate(-1)} // Go back to previous page
        >
          &larr; Back
        </button>
        <h2 className="form-title">Add New Player</h2>
      </div>

      {toast && (
        <div className={`form-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}


      <form onSubmit={handleSubmit} className="player-form">

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
              <option value="GOALKEEPER">Goalkeeper</option>
              <option value="DEFENDER">Defender</option>
              <option value="MIDFIELDER">Midfielder</option>
              <option value="FORWARD">Forward</option>

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
              <option value="South Africa">Zimbabwe</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Botswana">Botswana</option>
              <option value="Namibia">Namibia</option>
              <option value="Swaziland">Swaziland</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Angola">Angola</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
              <option value="Zambia">Zambia</option>
              <option value="Malawi">Malawi</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Burundi">Burundi</option>
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
              min="70"
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
          <button type="submit" className="submit-btn"  >
            Add Player
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerForm;