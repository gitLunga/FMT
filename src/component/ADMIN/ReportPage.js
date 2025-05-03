import React from 'react';
import { FileText, Users, Calendar, BarChart2 } from 'lucide-react';
import '../ADMIN/styles/report.css';
import { useNavigate } from 'react-router-dom';

const ReportPage = () => {
  const navigate = useNavigate();

  const handleGenerateReport = () => {
    console.log('Generating new report...');
    navigate('/generate-report');
  };

  const handleViewReport = (reportId) => {
    console.log(`Viewing report ${reportId}`);
    navigate(`/report/${reportId}`); // Navigate to specific report page
  };

  const handleDownloadReport = (reportId) => {
    console.log(`Downloading report ${reportId}`);
    // Add your download logic here
  };

  // Sample report data
  const reports = [
    {
      id: 1,
      title: 'Player Performance',
      type: 'Performance',
      date: '2023-06-15',
      icon: <Users size={20} />
    },{
      id: 2,
      title: 'Monthly Attendance',
      type: 'Attendance',
      date: '2023-06-10',
      icon: <Calendar size={20} />
    },
    {
      id: 3,
      title: 'Season Statistics',
      type: 'Statistics',
      date: '2023-05-30',
      icon: <BarChart2 size={20} />
    },
    {
      id: 4,
      title: 'Training Progress',
      type: 'Training',
      date: '2023-06-05',
      icon: <FileText size={20} />
    }
    // ... other reports
  ];

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2><FileText size={24} /> Reports</h2>
        <button className="generate-btn" onClick={handleGenerateReport}>
          Generate New Report
        </button>
      </div>

      <div className="reports-grid">
        {reports.map(report => (
          <div key={report.id} className="report-card">
            <div className="report-icon">
              {report.icon}
            </div>
            <div className="report-content">
              <h3>{report.title}</h3>
              <p className="report-type">{report.type}</p>
              <p className="report-date">{report.date}</p>
            </div>
            <div className="report-actions">
              <button 
                className="view-btn" 
                onClick={() => handleViewReport(report.id)} // Fixed: using onClick
              >
                View
              </button>
              <button 
                className="download-btn"
                onClick={() => handleDownloadReport(report.id)}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportPage;