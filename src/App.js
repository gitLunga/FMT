import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './component/Layout';

import LandingPage from './component/LandingPage';
import LoginF from './component/Login';
import SignUpPage from './component/SignUpPage';

// ADMIN COMPONENTS
import PlayerForm from './component/ADMIN/PlayerForm';
import AdminDashboard from './component/ADMIN/AdminDashboard';
import ViewPlayers from './component/ADMIN/ViewPlayers';

import PlayerContractForm from './component/ADMIN/playerContractForm';
import PlayerPerformanceForm from './component/ADMIN/playerPerformanceForm';

import ViewContracts from './component/ADMIN/ViewContract';
import ViewPerformances from './component/ADMIN/ViewPerformances';

// import SettingsPage from './component/SettingsPage';







import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
function App() {

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Router>
      <Layout>
        <Routes>

          <Route exact path='/' element={<LandingPage />} />
          <Route exact path='/login' element={<LoginF />} />

          {/* //ADMIN ROUTES */}

          <Route exact path='/playerform' element={<PlayerForm />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route
            path="/AdminDashboard"
            element={
              <AdminDashboard
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
              />
            }
          />
          <Route exact path='/ViewPlayers' element={<ViewPlayers />} />

          <Route exact path='/PlayerContractForm' element={<PlayerContractForm />} />
          <Route exact path='/PlayerPerformanceForm' element={<PlayerPerformanceForm />} />

          <Route exact path='/ViewContracts' element={<ViewContracts />} />
          <Route exact path='/ViewPerformances' element={<ViewPerformances />} />




          {/* <Route exact path='/SettingsPage' element={<SettingsPage />} /> */}



          {/* Add more routes as needed */}



        </Routes>
      </Layout>
    </Router>
  );
}
export default App;
