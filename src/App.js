import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './screens/Login';

import LandingPage from './component/LandingPage';
import LoginF from './component/Login';
import SignUpPage from './component/SignUpPage';


import PlayerForm from './component/ADMIN/PlayerForm';
import AdminDashboard from './component/ADMIN/AdminDashboard';
import ViewPlayers from './component/ADMIN/ViewPlayers';


import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
function App() {

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Router>
      <Routes>
        <Route exact path='/login' element={<Login />} />

        <Route exact path='/' element={<LandingPage />} />
        <Route exact path='/login' element={<LoginF />} />

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

        {/* Add more routes as needed */}



      </Routes>
    </Router>
  );
}
export default App;
