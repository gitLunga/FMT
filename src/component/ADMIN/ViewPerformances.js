import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../ADMIN/styles/viewPerformances.css';

const ViewPerformances = () => {
    const [performances, setPerformances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPerformances = async () => {
            try {
                const response = await api.get('/players/performances');
                setPerformances(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchPerformances();
    }, []);

    if (loading) return <div className="loading">Loading performances...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="performances-container">
            <h1>Player Performance Assessments</h1>
            
            <div className="table-container">
                <table className="performances-table">
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Date</th>
                            <th>Technical</th>
                            <th>Tactical</th>
                            <th>Physical</th>
                            <th>Psychological</th>
                            <th>Overall</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {performances.length > 0 ? (
                            performances.map(perf => (
                                <tr key={perf.performance_id}>
                                    <td>{perf.first_name} {perf.last_name}</td>
                                    <td>{new Date(perf.assessment_date).toLocaleDateString()}</td>
                                    <td>{perf.technical_score}/10</td>
                                    <td>{perf.tactical_score}/10</td>
                                    <td>{perf.physical_score}/10</td>
                                    <td>{perf.psychological_score}/10</td>
                                    <td>
                                        <span className={`rating-badge ${getRatingClass(perf.overall_rating)}`}>
                                            {perf.overall_rating}/10
                                        </span>
                                    </td>
                                    <td>{perf.coach_comments || '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="no-results">No performances found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

function getRatingClass(rating) {
    if (!rating) return 'neutral';
    if (rating >= 8) return 'excellent';
    if (rating >= 6) return 'good';
    if (rating >= 4) return 'average';
    return 'poor';
}

export default ViewPerformances;