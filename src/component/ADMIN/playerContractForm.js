import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../ADMIN/styles/playerForm.css';
import { useNavigate } from "react-router-dom";

const initialForm = {
    player_id: '',
    start_date: '',
    end_date: '',
    contract_type: 'Scholarship',
    monthly_stipend: '',
    performance_bonus: '',
    status: 'Active'
};

const PlayerContractForm = ({ onSuccess }) => {
    const [form, setForm] = useState(initialForm);
    const [players, setPlayers] = useState([]);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch players for dropdown
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

        if (!form.player_id || !form.start_date) {
            setToast({ type: 'error', message: 'Player and start date are required' });
            return;
        }

        try {
            await api.post('/api/players/add-contract', form);
            setForm(initialForm);
            setToast({ type: 'success', message: 'Contract added successfully!' });
            navigate('/ViewContracts');
           
        } catch (error) {
            console.error('API Error:', error);
            setToast({
                type: 'error',
                message: error.response?.data?.error ||
                    error.response?.data?.message ||
                    'Failed to add contract. Please try again.'
            });
        }
    };

    return (
        <div className="player-form-container">
            <h2 className="form-title">Add New Contract</h2>

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

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="start_date">Start Date*</label>
                        <input
                            id="start_date"
                            type="date"
                            name="start_date"
                            value={form.start_date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="end_date">End Date</label>
                        <input
                            id="end_date"
                            type="date"
                            name="end_date"
                            value={form.end_date}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="contract_type">Contract Type*</label>
                        <select
                            id="contract_type"
                            name="contract_type"
                            value={form.contract_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="Scholarship">Scholarship</option>
                            <option value="Amateur">Amateur</option>
                            <option value="Professional">Professional</option>
                        </select>
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
                            <option value="Expired">Expired</option>
                            <option value="Terminated">Terminated</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="monthly_stipend">Monthly Stipend (ZAR)</label>
                        <input
                            id="monthly_stipend"
                            type="number"
                            name="monthly_stipend"
                            value={form.monthly_stipend}
                            onChange={handleChange}
                            placeholder="Enter amount"
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="performance_bonus">Performance Bonus (ZAR)</label>
                        <input
                            id="performance_bonus"
                            type="number"
                            name="performance_bonus"
                            value={form.performance_bonus}
                            onChange={handleChange}
                            placeholder="Enter amount"
                            min="0"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        Add Contract
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PlayerContractForm;