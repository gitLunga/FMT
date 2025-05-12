import React, { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import '../ADMIN/styles/report.css';
import api from '../../api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];


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

  const userRoleData = reportData ? [
    { name: 'Admins', value: reportData.data.admins },
    { name: 'Scouts', value: reportData.data.scouts },
    { name: 'Players', value: reportData.data.players }
  ] : [];

  const playerStatusData = reportData ? [
    { name: 'Active', value: reportData.data.active_players },
    { name: 'Inactive', value: reportData.data.players - reportData.data.active_players }
  ] : [];

  const scoutingStatusData = reportData ? [
    { name: 'Pending', value: reportData.data.pending_scouting },
    { name: 'Approved', value: reportData.data.approved_scouting || 0 },
    { name: 'Rejected', value: reportData.data.rejected_scouting || 0 }
  ] : [];

  const generatePDF = () => {
    if (!reportData) return;
  
    const doc = new jsPDF();
    
    // Report title
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('Football Management System Report', 15, 20);
    
    // Report metadata
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date(reportData.generated_at).toLocaleString()}`, 15, 30);
    
    // User statistics section
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('User Statistics', 15, 45);
    
    // User statistics table
    doc.autoTable({
      startY: 55,
      head: [['Category', 'Count']],
      body: [
        ['Total Users', reportData.data.users],
        ['Administrators', reportData.data.admins],
        ['Scouts', reportData.data.scouts],
        ['Players', reportData.data.players],
        ['Active Players', reportData.data.active_players],
        ['Pending Scouting Requests', reportData.data.pending_scouting]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
  
    // Top players section if available
    if (reportData.data.top_players?.length > 0) {
      doc.setFontSize(14);
      doc.text('Top Players', 15, doc.lastAutoTable.finalY + 20);
      
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 30,
        head: [['Rank', 'Player Name', 'Average Rating']],
        body: reportData.data.top_players.map(player => [
          player.rank,
          player.name,
          player.rating.toFixed(2)
        ]),
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        }
      });
    }
  
    // Save the PDF
    doc.save(`system_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const generateCSV = () => {
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
  };

  const downloadReport = async (format) => {
    try {
      if (format === 'pdf') {
        generatePDF();
      } else if (format === 'csv') {
        generateCSV();
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to generate report');
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
          
          {/* User Statistics Section with Charts */}
          <div className="stats-section">
            <h3>User Statistics</h3>
            
            <div className="charts-container">
              <div className="chart-card">
                <h4>User Distribution</h4>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userRoleData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {userRoleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="chart-card">
                <h4>Player Status</h4>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={playerStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
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
            </div>
          </div>

          {/* Scouting Requests Section */}
          <div className="stats-section">
            <h3>Scouting Requests</h3>
            <div className="chart-card full-width">
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoutingStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#82CA9D" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Players Section */}
          {reportData.data.top_players?.length > 0 && (
            <div className="top-players-section">
              <h3>Top Players</h3>
              <div className="table-container">
                <table className="players-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player Name</th>
                      <th>Average Rating</th>
                      <th>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.data.top_players.map(player => (
                      <tr key={player.rank}>
                        <td>{player.rank}</td>
                        <td className="player-name">{player.name}</td>
                        <td>{player.rating.toFixed(2)}</td>
                        <td>
                          <div className="rating-bar">
                            <div 
                              className="rating-fill" 
                              style={{ width: `${(player.rating / 5) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportPage;