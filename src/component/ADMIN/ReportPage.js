import React from 'react';
import { FileText, Users, Calendar, BarChart2 } from 'lucide-react';
import '../ADMIN/styles/report.css';

const ReportPage = () => {
  // Sample report data
  const reports = [
    {
      id: 1,
      title: 'Player Performance',
      type: 'Performance',
      date: '2023-06-15',
      icon: <Users size={20} />
    },
    {
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
  ];

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2><FileText size={24} /> Reports</h2>
        <button className="generate-btn">Generate New Report</button>
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
              <button className="view-btn">View</button>
              <button className="download-btn">Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportPage;