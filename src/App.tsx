import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BankCredentials from './pages/BankCredentials';
import Dashboard from './pages/Dashboard';
import Logout from './pages/Logout';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* FIX: Changed path from '/link-bank' to '/bank-credentials' to match your Register page */}
        <Route path="/bank-credentials" element={<BankCredentials />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;