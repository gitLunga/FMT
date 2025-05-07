import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSideBar from './AdminSidebar';
import './styles/adminSideBar.css';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-app-container">
      <AdminSideBar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`admin-main-content ${collapsed ? 'collapsed' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;