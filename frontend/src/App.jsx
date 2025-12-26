import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import VoiceAssistant from './components/VoiceAssistant';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import Recommendations from './pages/Recommendations';
import GPSTracking from './pages/GPSTracking';
import Dashboard from './pages/Dashboard';
import CropCalendar from './pages/CropCalendar';
import Profile from './pages/Profile';

import CropSelection from './pages/CropSelection';
import Notifications from './pages/Notifications';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', paddingBottom: '2rem', position: 'relative' }}>
        <Navbar />
        <VoiceAssistant />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/crop-selection" element={
            <PrivateRoute>
              <CropSelection />
            </PrivateRoute>
          } />

          <Route path="/notifications" element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          } />

          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          <Route path="/calendar" element={
            <PrivateRoute>
              <CropCalendar />
            </PrivateRoute>
          } />

          <Route path="/marketplace" element={
            <PrivateRoute>
              <Marketplace />
            </PrivateRoute>
          } />

          <Route path="/recommendations" element={
            <PrivateRoute>
              <Recommendations />
            </PrivateRoute>
          } />

          <Route path="/track/:orderId" element={
            <PrivateRoute>
              <GPSTracking />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
