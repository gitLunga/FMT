import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api';
import '../ADMIN/styles/viewPlayers.css'; // Import the CSS file

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    position: '',
    status: '',
    nationality: '',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'last_name',
    direction: 'asc'
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPlayerData, setEditPlayerData] = useState(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleEditPlayer = (playerId) => {
    const player = players.find(p => p.player_id === playerId);
    setEditPlayerData(player);
    setIsEditModalOpen(true);
  };

  const handleDeletePlayer = async (playerId) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await api.delete(`/players/${playerId}`);
        setPlayers(players.filter(player => player.player_id !== playerId));
        alert('Player deleted successfully');
      } catch (err) {
        setError('Failed to delete player');
        console.error(err);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/players/${editPlayerData.player_id}`, editPlayerData);
      setPlayers(prevPlayers =>
        prevPlayers.map(p =>
          p.player_id === editPlayerData.player_id ? editPlayerData : p
        )
      );
      setIsEditModalOpen(false);
      alert('Player updated successfully');
    } catch (err) {
      setError('Failed to update player');
      console.error(err);
    }
  };

  const filterAndSortPlayers = useCallback(() => {
    let result = [...players];

    if (filters.position) {
      result = result.filter(p => p.position === filters.position);
    }
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters.nationality) {
      result = result.filter(p => p.nationality === filters.nationality);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(p =>
        p.first_name?.toLowerCase().includes(searchTerm) ||
        p.last_name?.toLowerCase().includes(searchTerm) ||
        String(p.player_id).toLowerCase().includes(searchTerm) ||
        p.email?.toLowerCase().includes(searchTerm) ||
        p.phone_number?.toLowerCase().includes(searchTerm)
      );
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

    setFilteredPlayers(result);
  }, [players, filters, sortConfig]);

  useEffect(() => {
    filterAndSortPlayers();
  }, [filterAndSortPlayers]);

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players');
      setPlayers(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

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
    setEditPlayerData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="loading">Loading players...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="player-list-container">
      <h1>Player Management</h1>
      
      <div className="filters-container">
        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search players..."
          />
        </div>
        
        <div className="filter-group">
          <label>Position:</label>
          <select name="position" value={filters.position} onChange={handleFilterChange}>
            <option value="">All Positions</option>
            <option value="MIDFIELDER">Midfielder</option>
            <option value="GOALKEEPER">Goalkeeper</option>
            <option value="DEFENDER">Defender</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Nationality:</label>
          <select name="nationality" value={filters.nationality} onChange={handleFilterChange}>
            <option value="">All Nationalities</option>
            <option value="South Africa">South Africa</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <button 
          className="reset-filters"
          onClick={() => setFilters({
            position: '',
            status: '',
            nationality: '',
            search: ''
          })}
        >
          Reset Filters
        </button>
      </div>

      <div className="table-container">
        <table className="players-table">
          <thead>
            <tr>
              
              <th onClick={() => handleSort('last_name')}>
                Name {getSortIndicator('last_name')}
              </th>
              <th onClick={() => handleSort('position')}>
                Position {getSortIndicator('position')}
              </th>
              <th onClick={() => handleSort('nationality')}>
                Nationality {getSortIndicator('nationality')}
              </th>
              <th onClick={() => handleSort('status')}>
                Status {getSortIndicator('status')}
              </th>
              <th>Age</th>
              <th>Height (cm)</th>
              <th>Weight (kg)</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map(player => (
                <tr key={player.player_id}>
                  <td>{player.first_name} {player.last_name}</td>
                  <td>{player.position}</td>
                  <td>{player.nationality}</td>
                  <td>
                    <span className={`status-badge ${player.status.toLowerCase()}`}>
                      {player.status}
                    </span>
                  </td>
                  <td>
                    {player.date_of_birth ? 
                      new Date().getFullYear() - new Date(player.date_of_birth).getFullYear() : 
                      '-'}
                  </td>
                  <td>{player.height || '-'}</td>
                  <td>{player.weight || '-'}</td>
                  <td>{player.contact_email || '-'}</td>
                  <td>{player.contact_phone || '-'}</td>
                  <td className="actions-column">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditPlayer(player.player_id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeletePlayer(player.player_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="no-results">No players found matching your criteria</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="summary">
        Showing {filteredPlayers.length} of {players.length} players
      </div>

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Player</h2>
            
            <div className="modal-form-group">
              <label>First Name:</label>
              <input 
                type="text"
                name="first_name"
                value={editPlayerData?.first_name || ''}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="modal-form-group">
              <label>Last Name:</label>
              <input 
                type="text"
                name="last_name"
                value={editPlayerData?.last_name || ''}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="modal-form-group">
              <label>Position:</label>
              <select
                name="position"
                value={editPlayerData?.position || ''}
                onChange={handleEditInputChange}
              >
                <option value="MIDFIELDER">Midfielder</option>
                <option value="GOALKEEPER">Goalkeeper</option>
                <option value="DEFENDER">Defender</option>
              </select>
            </div>
            
            <div className="modal-form-group">
              <label>Status:</label>
              <select
                name="status"
                value={editPlayerData?.status || ''}
                onChange={handleEditInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Graduated">Graduated</option>
              </select>
            </div>
            
            <div className="modal-form-group">
              <label>Nationality:</label>
              <select
                name="nationality"
                value={editPlayerData?.nationality || ''}
                onChange={handleEditInputChange}
              >
                <option value="South Africa">South Africa</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="modal-form-group">
              <label>Date of Birth:</label>
              <input 
                type="date"
                name="date_of_birth"
                value={editPlayerData?.date_of_birth?.slice(0, 10) || ''}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="modal-form-group">
              <label>Height (cm):</label>
              <input 
                type="number"
                name="height"
                value={editPlayerData?.height || ''}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="modal-form-group">
              <label>Weight (kg):</label>
              <input 
                type="number"
                name="weight"
                value={editPlayerData?.weight || ''}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="modal-form-group">
              <label>Email:</label>
              <input 
                type="email"
                name="email"
                value={editPlayerData?.contact_email || ''}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="modal-form-group">
              <label>Phone Number:</label>
              <input 
                type="tel"
                name="phone_number"
                value={editPlayerData?.contact_phone || ''}
                onChange={handleEditInputChange}
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

export default PlayerList;