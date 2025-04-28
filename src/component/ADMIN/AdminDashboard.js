import React, { useState } from "react";

import PlayerList from "../ADMIN/ViewPlayers";
import AdminSideBar from "./AdminSidebar"; // Import the Sidebar component
import "../ADMIN/styles/adminSideBar.css";

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
          {activeTab === "reports" && <ReportsView />}
          {activeTab === "settings" && <SettingsView />}
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

const ReportsView = () => (
  <div className="reports-view">
    <h2>Reports</h2>
    <p>Player performance and academy statistics</p>
  </div>
);

const SettingsView = () => (
  <div className="settings-view">
    <h2>Settings</h2>
    <p>Configure your academy settings</p>
  </div>
);

export default Dashboard;