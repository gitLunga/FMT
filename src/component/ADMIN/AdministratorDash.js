import React, { useState, useEffect } from 'react';
import './styles/administratorDash.css';
import api from '../../api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  // ... your existing state declarations ...

  const [scoutingData, setScoutingData] = useState(null);
  const [playerData, setPlayerData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        
        // Fetch all stats - using your existing endpoint
        const statsResponse = await api.get('/scout/admin/stats');
        setStats(statsResponse.data);
        
        // Fetch notifications - using your existing endpoint
        const notificationsResponse = await api.get(`/notifications/user/${user.user_id}`);
        setNotifications(notificationsResponse.data);
        
        // Fetch data for charts (add these endpoints to your backend)
        const scoutingResponse = await api.get('/scout/admin/scouting-data');
        setScoutingData(scoutingResponse.data);
        
        const playersResponse = await api.get('/scout/admin/players-data');
        setPlayerData(playersResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // ... rest of your existing functions ...

  // Chart configuration (added to your component)
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
            {/* Your existing stat cards */}
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="stat-card">
                <h3>{key.split(/(?=[A-Z])/).join(' ')}</h3>
                <p className="stat-value">{value}</p>
              </div>
            ))}
          </div>
          
          {/* Integrated Charts - Added below stats */}
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

        {/* Your existing notifications section */}
        <div className="notifications-section">
          {/* ... your existing notifications code ... */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;