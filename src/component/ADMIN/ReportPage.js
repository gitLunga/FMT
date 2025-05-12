import React, { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import '../ADMIN/styles/report.css';
import api from '../../api';

const ReportPage = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch report data
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get('/report');
        setReportData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Failed to load report data');
        setIsLoading(false);
      }
    };
    fetchReport();
  }, []);

  const downloadReport = async (format) => {
    try {
      if (format === 'pdf') {
        // Directly download PDF from backend
        window.open('/api/report?format=pdf', '_blank');
      } else if (format === 'csv') {
        // Generate CSV on frontend
        if (!reportData) return;
        
        let csvContent = "Category,Count\n";
        
        // Add user statistics
        csvContent += `Total Users,${reportData.data.users}\n`;
        csvContent += `Administrators,${reportData.data.admins}\n`;
        csvContent += `Scouts,${reportData.data.scouts}\n`;
        csvContent += `Players,${reportData.data.players}\n`;
        csvContent += `Active Players,${reportData.data.active_players}\n`;
        csvContent += `Pending Scouting Requests,${reportData.data.pending_scouting}\n\n`;
        
        // Add top players if available
        if (reportData.data.top_players?.length > 0) {
          csvContent += "Top Players\nRank,Name,Average Rating\n";
          reportData.data.top_players.forEach(player => {
            csvContent += `${player.rank},${player.name},${player.rating}\n`;
          });
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `system_report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download report');
    }
  };

  if (isLoading) return <div className="loading">Loading report data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2><FileText size={24} /> System Report</h2>
        <div className="download-options">
          <button 
            className="download-btn"
            onClick={() => downloadReport('pdf')}
            disabled={!reportData}
          >
            <Download size={16} /> PDF
          </button>
          <button 
            className="download-btn"
            onClick={() => downloadReport('csv')}
            disabled={!reportData}
          >
            <Download size={16} /> CSV
          </button>
        </div>
      </div>

      {reportData && (
        <div className="report-content">
          <div className="report-meta">
            <p>Generated at: {new Date(reportData.generated_at).toLocaleString()}</p>
          </div>
          
          <div className="stats-section">
            <h3>User Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total Users</h4>
                <p>{reportData.data.users}</p>
              </div>
              <div className="stat-card">
                <h4>Administrators</h4>
                <p>{reportData.data.admins}</p>
              </div>
              <div className="stat-card">
                <h4>Scouts</h4>
                <p>{reportData.data.scouts}</p>
              </div>
              <div className="stat-card">
                <h4>Players</h4>
                <p>{reportData.data.players}</p>
              </div>
              <div className="stat-card">
                <h4>Active Players</h4>
                <p>{reportData.data.active_players}</p>
              </div>
              <div className="stat-card">
                <h4>Pending Scouting</h4>
                <p>{reportData.data.pending_scouting}</p>
              </div>
            </div>
          </div>

          {reportData.data.top_players?.length > 0 && (
            <div className="top-players-section">
              <h3>Top Players</h3>
              <table className="players-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Average Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.data.top_players.map(player => (
                    <tr key={player.rank}>
                      <td>{player.rank}</td>
                      <td>{player.name}</td>
                      <td>{player.rating.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportPage;