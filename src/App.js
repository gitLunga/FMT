import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './screens/Register';
import Login from './screens/Login';

import PlayerForm from './component/ADMIN/PlayerForm';

import AdminDashboard from './component/ADMIN/AdminDashboard';

import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Register />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/playerform' element={<PlayerForm />} />

        <Route exact path='/AdminDashboard' element={<AdminDashboard />} />



      </Routes>
    </Router>
  );
}
export default App;
