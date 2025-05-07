import React, { useState, useEffect } from 'react';
import './styles/administratorDash.css';
import api from '../../api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  // Define all state variables properly
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalUsers: 0,
    scoutedPlayers: 0,
    playersWithContracts: 0,
    activeScouts: 0
  });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [scoutingData, setScoutingData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        
        // Fetch all stats
        const statsResponse = await api.get('/scout/admin/stats');
        setStats(statsResponse.data);
        
        // Fetch notifications
        const notificationsResponse = await api.get(`/scout/notifications/user/${user.user_id}`);
        setNotifications(notificationsResponse.data);
        
        // Fetch data for charts - updated endpoints to match backend
        const scoutingResponse = await api.get('/scout/scouting-data');
        setScoutingData(scoutingResponse.data);
        
        const playersResponse = await api.get('/scout/player-data');
        setPlayerData(playersResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleNotificationAction = async (notificationId, action) => {
    try {
      // const response = await api.put(`/notifications/${notificationId}`, { action });
      
      // Refresh notifications
      const updatedResponse = await api.get('/scout/admin/notifications');
      setNotifications(updatedResponse.data);
    } catch (error) {
      console.error('Error updating notification:', error);
      alert('Failed to update notification');
    }
  };

  // Chart configuration
  const scoutingChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Scouting Activity',
      },
    },
  };

  const playersChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Player Status Distribution',
      },
    },
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>

      <div className="dashboard-content">
        <div className="stats-section">
          <h2>System Overview</h2>
          <div className="stats-grid">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="stat-card">
                <h3>{key.split(/(?=[A-Z])/).join(' ')}</h3>
                <p className="stat-value">{value}</p>
              </div>
            ))}
          </div>
          
          {/* Integrated Charts */}
          <div className="chart-row">
            {scoutingData && (
              <div className="chart-container">
                <Bar 
                  options={scoutingChartOptions}
                  data={{
                    labels: scoutingData.months,
                    datasets: [{
                      label: 'Scouting Requests',
                      data: scoutingData.counts,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    }]
                  }} 
                />
              </div>
            )}
            
            {playerData && (
              <div className="chart-container">
                <Bar 
                  options={playersChartOptions}
                  data={{
                    labels: playerData.statuses,
                    datasets: [{
                      label: 'Players',
                      data: playerData.counts,
                      backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    }]
                  }} 
                />
              </div>
            )}
          </div>
        </div>

        <div className="notifications-section">
          <h2>Recent Notifications</h2>
          {notifications.length > 0 ? (
            <div className="notifications-list">
              {notifications.map(notification => (
                <div key={notification.notification_id} className="notification-item">
                  <div className="notification-header">
                    <h3>{notification.title}</h3>
                    <span className="notification-date">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  {notification.type === 'scouting_request' && (
                    <div className="notification-actions">
                      <button 
                        onClick={() => handleNotificationAction(notification.notification_id, 'approve')}
                        className="approve-button"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleNotificationAction(notification.notification_id, 'reject')}
                        className="reject-button"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-notifications">No recent notifications</p>
          )}
        </div>
        <button
          className="back-button"
          onClick={() => navigate(-1)} // Go back to previous page
        >
          &larr; Back
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;