import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import './styles/main.scss';

// Components
import Navbar from './components/Navbar';
import { PrivateRoute } from './components/PrivateRoute';
import TripSubmission from './components/TripSubmission';
import { Navigation } from './components/Navigation';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import CreateCrew from './pages/crew/CreateCrew';
import JoinCrew from './pages/crew/JoinCrew';
import CrewDetail from './pages/crew/CrewDetail';
import ManageCrew from './pages/crew/ManageCrew';
import CreateChallenge from './pages/crew/CreateChallenge';
import CarbonFootprint from './pages/challenges/CarbonFootprint';
import FoodCarbon from './pages/challenges/FoodCarbon';
import RecyclingChallenge from './pages/challenges/RecyclingChallenge';
import ShowerTimer from './pages/challenges/ShowerTimer';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Navigation />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            
            {/* Crew Routes */}
            <Route path="/crew" element={<PrivateRoute element={<CrewDetail />} />} />
            <Route path="/crew/create" element={<PrivateRoute element={<CreateCrew />} />} />
            <Route path="/crew/join" element={<PrivateRoute element={<JoinCrew />} />} />
            <Route path="/crew/manage" element={<PrivateRoute element={<ManageCrew />} />} />
            <Route path="/crew/challenges/create" element={<PrivateRoute element={<CreateChallenge />} />} />
            
            {/* Challenge Routes */}
            <Route path="/challenges/1" element={<PrivateRoute element={<CarbonFootprint />} />} />
            <Route path="/challenges/2" element={<PrivateRoute element={<FoodCarbon />} />} />
            <Route path="/challenges/3" element={<PrivateRoute element={<RecyclingChallenge />} />} />
            <Route path="/challenges/4" element={<PrivateRoute element={<ShowerTimer />} />} />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
