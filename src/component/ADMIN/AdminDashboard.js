import React, { useState } from "react";

import PlayerList from "../ADMIN/ViewPlayers";
import AdminSideBar from "./AdminSidebar"; // Import the Sidebar component
import "../ADMIN/styles/adminSideBar.css";

import ReportPage from "./ReportPage";
import SettingsPage from "../SettingsPage";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("players");

  return (
    <div className="dashboard-container">
      {/* Include the Sidebar component */}
      <AdminSideBar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <div className="header-actions">
          </div>
        </header>

        <div className="content-area">
          {activeTab === "players" && <PlayerList />}
          {activeTab === "dashboard" && <DashboardHome />}
          {activeTab === "ReportPage" && <ReportPage />}
          {activeTab === "SettingsPage" && <SettingsPage />}
        </div>
      </div>
    </div>
  );
};

// Placeholder components
const DashboardHome = () => (
  <div className="dashboard-home">
    <h2>Dashboard Overview</h2>
    <p>Welcome to Football Academy Admin Panel</p>
  </div>
);



export default Dashboard;