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
                // Match exactly with your backend route
                const response = await api.get('/players/get-allperformances');
                
                // Your backend returns either data array or empty array
                setPerformances(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Performance fetch error:", {
                    message: err.message,
                    response: err.response?.data
                });
                setError(err.response?.data?.error || "Failed to fetch performances");
                setLoading(false);
            }
        };
        fetchPerformances();
    }, []);

    const getRatingClass = (rating) => {
        const numRating = Number(rating);
        if (isNaN(numRating)) return 'neutral';
        if (numRating >= 8) return 'excellent';
        if (numRating >= 6) return 'good';
        if (numRating >= 4) return 'average';
        return 'poor';
    };

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
                        {performances.map(perf => (
                            <tr key={perf.performance_id}>
                                <td>{perf.first_name} {perf.last_name}</td>
                                <td>{new Date(perf.assessment_date).toLocaleDateString('en-ZA')}</td>
                                <td>{perf.technical_score || 0}/10</td>
                                <td>{perf.tactical_score || 0}/10</td>
                                <td>{perf.physical_score || 0}/10</td>
                                <td>{perf.psychological_score || 0}/10</td>
                                <td>
                                    <span className={`rating-badge ${getRatingClass(perf.overall_rating)}`}>
                                        {perf.overall_rating || 0}/10
                                    </span>
                                </td>
                                <td>{perf.coach_comments || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {performances.length === 0 && (
                    <div className="no-results">No performance records found</div>
                )}
            </div>
        </div>
    );
};

export default ViewPerformances;