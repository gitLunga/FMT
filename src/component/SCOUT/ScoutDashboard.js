import React, { useState, useEffect } from 'react';
import '../SCOUT/styling/scoutDashboard.css';
import api from '../../api'; // Import your axios instance

const ScoutDashboard = () => {
    const [players, setPlayers] = useState([]);
    const [scoutedPlayers, setScoutedPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [performanceData, setPerformanceData] = useState(null);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('scout');
    const [notifications, setNotifications] = useState([]);
    const [scoutingLoading, setScoutingLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    // const [showPlayerModal, setShowPlayerModal] = useState(false);
    // const [detailedPerformance, setDetailedPerformance] = useState(null);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                setCurrentUser(user);
                console.log('Current user:', user);

                if (!user || !user.id) {
                    throw new Error('User not found in localStorage');
                }

                // Fetch all players
                const allPlayers = await api.get('/players');
                setPlayers(allPlayers.data || []);

                // Fetch scouted players - ensure we always get an array
                const scoutedResponse = await api.get(`/scout/scoutedplayers/${user.id}`);
                setScoutedPlayers(Array.isArray(scoutedResponse.data) ? scoutedResponse.data : []);

                // Fetch notifications
                const notificationsResponse = await api.get(`/scout/notifications/${user.id}`);
                setNotifications(notificationsResponse.data || []);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setScoutedPlayers([]); // Ensure it's always an array
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePlayerSelect = async (playerId) => {
        try {
            // Get basic player info
            const playerResponse = await api.get(`/players/${playerId}`);
            setSelectedPlayer(playerResponse.data);

            // Get performance data
            const performanceResponse = await api.get(`/scout/player-performance/${playerId}`);
            setPerformanceData(performanceResponse.data.data); // Access the data property

        } catch (error) {
            console.error('Error fetching player data:', error);
            setPerformanceData(null); // Clear performance data on error
        }
    };

    const handleScoutPlayer = async () => {
        if (!selectedPlayer || !currentUser) return;

        try {
            setScoutingLoading(true);

            console.log('Current user object:', currentUser); // Debug log
            console.log('Attempting to scout with:', {
                scout_id: currentUser.id,
                player_id: selectedPlayer.player_id
            });

            const response = await api.post('/scout/scout', {
                scout_id: currentUser.id, // Make sure this matches what backend expects
                player_id: selectedPlayer.player_id
            });

            // Update UI with returned performance data
            if (response.data.performance_data) {
                setPerformanceData(response.data.performance_data);
            }

            // Refresh scouted players list
            const scoutedResponse = await api.get(`/scout/scoutedplayers/${currentUser.id}`);
            console.log('Refreshed scouted players:', scoutedResponse.data);
            setScoutedPlayers(scoutedResponse.data);

            alert('Player scouted successfully!');

        } catch (error) {
            console.error('Full error object:', error);
            console.error('Error response:', error.response);
            alert(error.response?.data?.error || 'Failed to scout player');
        } finally {
            setScoutingLoading(false);
        }
    };

    const handleSendNotification = async () => {
        if (!selectedPlayer || !notificationMessage) return;

        try {
            const user = JSON.parse(localStorage.getItem('user'));

            await api.post('/notifications', {
                user_id: selectedPlayer.user_id,
                title: 'Scouting Notification',
                message: notificationMessage,
                type: 'scouting',
                related_id: selectedPlayer.player_id,
                sender_id: user.user_id
            });

            alert('Notification sent successfully!');
            setNotificationMessage('');

            // Refresh notifications
            const notificationsResponse = await api.get(`/notifications/${user.user_id}`);
            setNotifications(notificationsResponse.data);
        } catch (error) {
            console.error('Error sending notification:', error);
            alert('Failed to send notification');
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await api.put(`/notifications/read/${notificationId}`);

            // Refresh notifications
            const user = JSON.parse(localStorage.getItem('user'));
            const notificationsResponse = await api.get(`/notifications/${user.user_id}`);
            setNotifications(notificationsResponse.data);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;

    const isPlayerScouted = Array.isArray(scoutedPlayers) &&
        scoutedPlayers.some(p => p.player_id === selectedPlayer?.player_id);
    return (
        <div className="scout-dashboard">
            <header className="dashboard-header">
                <h1>Scout Dashboard</h1>
                <nav className="dashboard-nav">
                    <button
                        className={activeTab === 'scout' ? 'active' : ''}
                        onClick={() => setActiveTab('scout')}
                    >
                        Scout Players
                    </button>
                    <button
                        className={activeTab === 'my-players' ? 'active' : ''}
                        onClick={() => setActiveTab('my-players')}
                    >
                        My Scouted Players ({scoutedPlayers.length})
                    </button>
                </nav>
            </header>

            {/* Notifications Panel */}
            <div className="notifications-panel">
                <h3>Notifications ({notifications.filter(n => !n.is_read).length})</h3>
                <div className="notifications-list">
                    {notifications.map(notification => (
                        <div
                            key={notification.notification_id}
                            className={`notification ${notification.is_read ? 'read' : 'unread'}`}
                            onClick={() => handleMarkAsRead(notification.notification_id)}
                        >
                            <h4>{notification.title}</h4>
                            <p>{notification.message}</p>
                            <small>{new Date(notification.created_at).toLocaleString()}</small>
                        </div>
                    ))}
                    {notifications.length === 0 && <p>No notifications</p>}
                </div>
            </div>

            <div className="dashboard-content">
                {activeTab === 'scout' && (
                    <div className="scout-players">
                        <h2>Available Players</h2>
                        <div className="players-grid">
                            {players.map(player => (
                                <div
                                    key={player.player_id}
                                    className={`player-card ${selectedPlayer?.player_id === player.player_id ? 'selected' : ''}`}
                                    onClick={() => handlePlayerSelect(player.player_id)}
                                >
                                    <div className="player-avatar">
                                        {player.first_name.charAt(0)}{player.last_name.charAt(0)}
                                    </div>
                                    <div className="player-info">
                                        <h3>{player.first_name} {player.last_name}</h3>
                                        <p>{player.position} | {player.nationality}</p>
                                        <span className={`status ${player.status.toLowerCase()}`}>
                                            {player.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'my-players' && (
                    <div className="my-players">
                        <h2>Players I've Scouted</h2>
                        {scoutedPlayers.length > 0 ? (
                            <div className="scouted-players-list">
                                {scoutedPlayers.map(player => (
                                    <div key={player.player_id} className="scouted-player">
                                        <h3>{player.first_name} {player.last_name}</h3>
                                        <p>Status: <span className={`status ${player.status}`}>{player.status}</span></p>
                                        <p>Scouted on: {new Date(player.scouted_date).toLocaleDateString()}</p>
                                        <button onClick={() => handlePlayerSelect(player.player_id)}>
                                            View Performance
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-players">You haven't scouted any players yet.</p>
                        )}
                    </div>
                )}

                {(selectedPlayer || activeTab === 'my-players') && (
                    <div className="player-details">
                        {selectedPlayer ? (
                            <>
                                <h2>{selectedPlayer.first_name} {selectedPlayer.last_name}</h2>
                                <div className="player-stats">
                                    <h3>Performance Data</h3>
                                    {performanceData && performanceData.overall_rating && (
                                        <div className="performance-badge">
                                            Overall Rating: {performanceData.overall_rating}
                                        </div>
                                    )}
                                </div>

                                <div className="scout-actions">
                                    {activeTab === 'scout' && !isPlayerScouted && (
                                        <button
                                            className="scout-button"
                                            onClick={handleScoutPlayer}
                                            disabled={scoutingLoading}
                                        >
                                            {scoutingLoading ? 'Scouting...' : 'Scout This Player'}
                                        </button>
                                    )}

                                    <div className="send-notification">
                                        <h3>Send Notification</h3>
                                        <textarea
                                            value={notificationMessage}
                                            onChange={(e) => setNotificationMessage(e.target.value)}
                                            placeholder="Write your message to the player..."
                                        />
                                        <button
                                            onClick={handleSendNotification}
                                            disabled={!notificationMessage}
                                        >
                                            Send Notification
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="select-player-prompt">
                                <p>Select a player to view details and send notifications</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScoutDashboard;