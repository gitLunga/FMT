import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api';
import '../ADMIN/styles/viewPerformances.css';

const ViewPerformances = () => {
  const [performances, setPerformances] = useState([]);
  const [filteredPerformances, setFilteredPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    search: '',
    minRating: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'assessment_date',
    direction: 'desc'
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPerformanceData, setEditPerformanceData] = useState(null);

  useEffect(() => {
    fetchPerformances();
  }, []);

  const handleEditPerformance = (performanceId) => {
    const performance = performances.find(p => p.performance_id === performanceId);
    setEditPerformanceData(performance);
    setIsEditModalOpen(true);
  };
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

  const handleDeletePerformance = async (performanceId) => {
    if (window.confirm('Are you sure you want to delete this performance record?')) {
      try {
        await api.delete(`/players/performances/${performanceId}`);
        setPerformances(performances.filter(performance => performance.performance_id !== performanceId));
        alert('Performance record deleted successfully');
      } catch (err) {
        setError('Failed to delete performance record');
        console.error(err);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/players/performances/${editPerformanceData.performance_id}`, editPerformanceData);
      setPerformances(prevPerformances =>
        prevPerformances.map(p =>
          p.performance_id === editPerformanceData.performance_id ? editPerformanceData : p
        )
      );
      setIsEditModalOpen(false);
      alert('Performance record updated successfully');
    } catch (err) {
      setError('Failed to update performance record');
      console.error(err);
    }
  };

  const filterAndSortPerformances = useCallback(() => {
    let result = [...performances];

    if (filters.dateFrom) {
      result = result.filter(p => new Date(p.assessment_date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      result = result.filter(p => new Date(p.assessment_date) <= new Date(filters.dateTo));
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(p =>
        p.first_name?.toLowerCase().includes(searchTerm) ||
        p.last_name?.toLowerCase().includes(searchTerm) ||
        String(p.performance_id).toLowerCase().includes(searchTerm)
      );
    }
    if (filters.minRating) {
      result = result.filter(p => p.overall_rating >= Number(filters.minRating));
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredPerformances(result);
  }, [performances, filters, sortConfig]);

  useEffect(() => {
    filterAndSortPerformances();
  }, [filterAndSortPerformances]);

 

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditPerformanceData(prev => ({ ...prev, [name]: value }));
  };

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
      
      <div className="filters-container">
        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search performances..."
          />
        </div>
        
        <div className="filter-group">
          <label>From Date:</label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="filter-group">
          <label>To Date:</label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="filter-group">
          <label>Min Rating:</label>
          <select name="minRating" value={filters.minRating} onChange={handleFilterChange}>
            <option value="">Any Rating</option>
            <option value="8">8+ (Excellent)</option>
            <option value="6">6+ (Good)</option>
            <option value="4">4+ (Average)</option>
            <option value="0">All Ratings</option>
          </select>
        </div>
        
        <button 
          className="reset-filters"
          onClick={() => setFilters({
            dateFrom: '',
            dateTo: '',
            search: '',
            minRating: ''
          })}
        >
          Reset Filters
        </button>
      </div>

      <div className="table-container">
        <table className="performances-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('last_name')}>
                Player {getSortIndicator('last_name')}
              </th>
              <th onClick={() => handleSort('assessment_date')}>
                Date {getSortIndicator('assessment_date')}
              </th>
              <th onClick={() => handleSort('technical_score')}>
                Technical {getSortIndicator('technical_score')}
              </th>
              <th onClick={() => handleSort('tactical_score')}>
                Tactical {getSortIndicator('tactical_score')}
              </th>
              <th onClick={() => handleSort('physical_score')}>
                Physical {getSortIndicator('physical_score')}
              </th>
              <th onClick={() => handleSort('psychological_score')}>
                Psychological {getSortIndicator('psychological_score')}
              </th>
              <th onClick={() => handleSort('overall_rating')}>
                Overall {getSortIndicator('overall_rating')}
              </th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPerformances.length > 0 ? (
              filteredPerformances.map(perf => (
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
                  <td className="actions-column">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditPerformance(perf.performance_id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeletePerformance(perf.performance_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-results">No performances found matching your criteria</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="summary">
        Showing {filteredPerformances.length} of {performances.length} performance records
      </div>

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Performance Record</h2>
            
            <div className="modal-form-group">
              <label>Assessment Date:</label>
              <input 
                type="date"
                name="assessment_date"
                value={editPerformanceData?.assessment_date?.slice(0, 10) || ''}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="modal-form-group">
              <label>Technical Score (0-10):</label>
              <input 
                type="number"
                name="technical_score"
                min="0"
                max="10"
                step="0.1"
                value={editPerformanceData?.technical_score || ''}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="modal-form-group">
              <label>Tactical Score (0-10):</label>
              <input 
                type="number"
                name="tactical_score"
                min="0"
                max="10"
                step="0.1"
                value={editPerformanceData?.tactical_score || ''}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="modal-form-group">
              <label>Physical Score (0-10):</label>
              <input 
                type="number"
                name="physical_score"
                min="0"
                max="10"
                step="0.1"
                value={editPerformanceData?.physical_score || ''}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="modal-form-group">
              <label>Psychological Score (0-10):</label>
              <input 
                type="number"
                name="psychological_score"
                min="0"
                max="10"
                step="0.1"
                value={editPerformanceData?.psychological_score || ''}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="modal-form-group">
              <label>Overall Rating (0-10):</label>
              <input 
                type="number"
                name="overall_rating"
                min="0"
                max="10"
                step="0.1"
                value={editPerformanceData?.overall_rating || ''}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="modal-form-group">
              <label>Coach Comments:</label>
              <textarea
                name="coach_comments"
                value={editPerformanceData?.coach_comments || ''}
                onChange={handleEditInputChange}
                rows="3"
              />
            </div>
            
            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSaveEdit}>Save</button>
              <button className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPerformances;