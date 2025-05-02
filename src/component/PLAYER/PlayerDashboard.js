import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../ADMIN/styles/viewPlayers.css'; // Reuse your existing styles
import '../PLAYER/styling/playerDashboard.css'; // New styles for dashboard

const PlayerDashboard = () => {
  const [playerData, setPlayerData] = useState(null);
  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        // Get player ID from auth or URL
        const playerId = localStorage.getItem('playerId'); // Adjust based on your auth
        
        // Fetch player profile
        const profileResponse = await api.get(`/players/${playerId}`);
        setPlayerData(profileResponse.data);
        
        // Fetch player stats
        const statsResponse = await api.get(`/players/${playerId}/stats`);
        setStats(statsResponse.data);
        
        // Fetch notifications
        const notificationsResponse = await api.get(`/players/${playerId}/notifications`);
        setNotifications(notificationsResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchPlayerData();
    
    // Set up real-time updates (WebSocket or polling)
    const notificationInterval = setInterval(() => {
      fetchPlayerData();
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(notificationInterval);
  }, []);

  const markNotificationAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? {...n, is_read: true} : n
      ));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  if (loading) return <div className="loading">Loading your dashboard...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!playerData) return <div className="error">Player data not found</div>;

  return (
    <div className="player-dashboard">
      <div className="dashboard-header">
        <div className="player-profile-card">
          <div className="avatar-container">
            {playerData.avatar_url ? (
              <img src={playerData.avatar_url} alt="Player Avatar" className="player-avatar" />
            ) : (
              <div className="avatar-placeholder">
                {playerData.first_name.charAt(0)}{playerData.last_name.charAt(0)}
              </div>
            )}
          </div>
          <div className="player-info">
            <h2>{playerData.first_name} {playerData.last_name}</h2>
            <div className="player-meta">
              <span className="position-badge">{playerData.position}</span>
              <span className="nationality">{playerData.nationality}</span>
              <span className={`status-badge ${playerData.status.toLowerCase()}`}>
                {playerData.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="dashboard-tabs">
          <button 
            className={activeTab === 'stats' ? 'active' : ''}
            onClick={() => setActiveTab('stats')}
          >
            My Stats
          </button>
          <button 
            className={activeTab === 'notifications' ? 'active' : ''}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
            {notifications.filter(n => !n.is_read).length > 0 && (
              <span className="notification-badge">
                {notifications.filter(n => !n.is_read).length}
              </span>
            )}
          </button>
          <button 
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            My Profile
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'stats' && (
          <div className="stats-container">
            <h3>Performance Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Matches Played</h4>
                <div className="stat-value">{stats.matches_played || 0}</div>
              </div>
              <div className="stat-card">
                <h4>Goals Scored</h4>
                <div className="stat-value">{stats.goals_scored || 0}</div>
              </div>
              <div className="stat-card">
                <h4>Assists</h4>
                <div className="stat-value">{stats.assists || 0}</div>
              </div>
              <div className="stat-card">
                <h4>Yellow Cards</h4>
                <div className="stat-value yellow">{stats.yellow_cards || 0}</div>
              </div>
              <div className="stat-card">
                <h4>Red Cards</h4>
                <div className="stat-value red">{stats.red_cards || 0}</div>
              </div>
              <div className="stat-card">
                <h4>Average Rating</h4>
                <div className="stat-value rating">
                  {stats.average_rating ? stats.average_rating.toFixed(1) : 'N/A'}
                </div>
              </div>
            </div>
            
            <div className="performance-chart">
              <h4>Recent Performance</h4>
              <div className="chart-placeholder">
                {/* Would be replaced with actual chart component */}
                Performance chart visualization would go here
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="notifications-container">
            <h3>Your Notifications</h3>
            {notifications.length > 0 ? (
              <div className="notification-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="notification-icon">
                      {notification.type === 'scouting' ? '🔍' : '📢'}
                    </div>
                    <div className="notification-content">
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">
                        {new Date(notification.created_at).toLocaleString()}
                      </div>
                    </div>
                    {!notification.is_read && <div className="unread-dot"></div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-notifications">
                You don't have any notifications yet.
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'profile' && (
          <div className="profile-container">
            <h3>My Profile</h3>
            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-label">Full Name:</span>
                <span className="detail-value">{playerData.first_name} {playerData.last_name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date of Birth:</span>
                <span className="detail-value">
                  {playerData.date_of_birth ? new Date(playerData.date_of_birth).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Height:</span>
                <span className="detail-value">{playerData.height || 'N/A'} cm</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Weight:</span>
                <span className="detail-value">{playerData.weight || 'N/A'} kg</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Contact Email:</span>
                <span className="detail-value">{playerData.contact_email || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone Number:</span>
                <span className="detail-value">{playerData.contact_phone || 'N/A'}</span>
              </div>
            </div>
            
            <button className="edit-profile-btn">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDashboard;