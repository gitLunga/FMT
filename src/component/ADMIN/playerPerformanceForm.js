import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../ADMIN/styles/playerForm.css';
import { useNavigate } from "react-router-dom";

const initialForm = {
    player_id: '',
    assessment_date: new Date().toISOString().split('T')[0],
    technical_score: '',
    tactical_score: '',
    physical_score: '',
    psychological_score: '',
    overall_rating: '',
    coach_comments: ''
  };

const PlayerPerformanceForm = ({ onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [players, setPlayers] = useState([]);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/players')
      .then(response => setPlayers(response.data))
      .catch(error => console.error('Error fetching players:', error));

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
  
    if (!form.player_id || !form.assessment_date) {
      setToast({ type: 'error', message: 'Player and assessment date are required' });
      return;
    }
  
    try {
      await api.post('/player-performances', form); // Changed endpoint to match backend
      setForm(initialForm);
      setToast({ type: 'success', message: 'Performance added successfully!' });
      navigate('/ViewPerformances');
      onSuccess();
    } catch (error) {
      console.error('API Error:', error);
      setToast({
        type: 'error',
        message: error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to add performance. Please try again.'
      });
    }
  };

  return (
    <div className="player-form-container">
      <h2 className="form-title">Add Performance Assessment</h2>

      {toast && (
        <div className={`form-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="player-form">
        <div className="form-group">
          <label htmlFor="player_id">Player*</label>
          <select
            id="player_id"
            name="player_id"
            value={form.player_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Player</option>
            {players.map(player => (
              <option key={player.player_id} value={player.player_id}>
                {player.first_name} {player.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="assessment_date">Assessment Date*</label>
          <input
            id="assessment_date"
            type="date"
            name="assessment_date"
            value={form.assessment_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="technical_score">Technical Score (1-10)</label>
            <input
              id="technical_score"
              type="number"
              name="technical_score"
              value={form.technical_score}
              onChange={handleChange}
              min="1"
              max="10"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tactical_score">Tactical Score (1-10)</label>
            <input
              id="tactical_score"
              type="number"
              name="tactical_score"
              value={form.tactical_score}
              onChange={handleChange}
              min="1"
              max="10"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="physical_score">Physical Score (1-10)</label>
            <input
              id="physical_score"
              type="number"
              name="physical_score"
              value={form.physical_score}
              onChange={handleChange}
              min="1"
              max="10"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="psychological_score">Psychological Score (1-10)</label>
            <input
              id="psychological_score"
              type="number"
              name="psychological_score"
              value={form.psychological_score}
              onChange={handleChange}
              min="1"
              max="10"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="overall_rating">Overall Rating (1-10)</label>
          <input
            id="overall_rating"
            type="number"
            name="overall_rating"
            value={form.overall_rating}
            onChange={handleChange}
            min="1"
            max="10"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="coach_comments">Coach Comments</label>
          <textarea
            id="coach_comments"
            name="coach_comments"
            value={form.coach_comments}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Add Performance
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerPerformanceForm;