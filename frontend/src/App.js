import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Components
import Login from './components/Login';
import Composting from './components/Composting';
import CitizenDashboard from './components/CitizenDashboard';
import WorkerDashboard from './components/WorkerDashboard';
import Navbar from './components/Navbar';
import ProductAnalysis from './components/ProductAnalysis';
import AIAssistant from './components/AIAssistant';
import Marketplace from './components/Marketplace';
import MapPage from './components/MapPage';
import PointsRewards from './components/PointsRewards';
import TrainingModules from './components/TrainingModules';
import WasteSegregation from './components/WasteSegregation';
import HealthTracking from './components/HealthTracking';
import FeedbackForm from './components/FeedbackForm';

// New Indian Waste Management Components
import MandatoryTraining from './components/MandatoryTraining';
import GreenChampions from './components/GreenChampions';
import WasteTracking from './components/WasteTracking';
import IncentiveSystem from './components/IncentiveSystem';

function App() {
  const { i18n } = useTranslation();
  const [user, setUser] = React.useState(() => {
    const saved = localStorage.getItem('ecoaware_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('ecoaware_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ecoaware_user');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('ecoaware_language', lng);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onLanguageChange={changeLanguage}
          currentLanguage={i18n.language}
        />
        <div className="container-fluid">
          <Routes>
            {user.mode === 'citizen' ? (
              <>
                <Route path="/" element={<CitizenDashboard user={user} />} />
                <Route path="/mandatory-training" element={<MandatoryTraining user={user} />} />
                <Route path="/analysis" element={<ProductAnalysis user={user} />} />
                <Route path="/composting" element={<Composting user={user} />} />
                <Route path="/assistant" element={<AIAssistant user={user} />} />
                <Route path="/marketplace" element={<Marketplace user={user} />} />
                <Route path="/map" element={<MapPage user={user} />} />
                <Route path="/rewards" element={<PointsRewards user={user} />} />
                <Route path="/green-champions" element={<GreenChampions user={user} />} />
                <Route path="/waste-tracking" element={<WasteTracking mode={user.mode} user={user} />} />
                <Route path="/incentives" element={<IncentiveSystem user={user} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<WorkerDashboard user={user} />} />
                <Route path="/training" element={<TrainingModules user={user} />} />
                <Route path="/segregation" element={<WasteSegregation user={user} />} />
                <Route path="/health" element={<HealthTracking user={user} />} />
                <Route path="/feedback" element={<FeedbackForm user={user} />} />
                <Route path="/green-champions" element={<GreenChampions user={user} />} />
                <Route path="/waste-tracking" element={<WasteTracking mode={user.mode} user={user} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;