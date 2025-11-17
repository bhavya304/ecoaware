import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = ({ user, onLogout, onLanguageChange, currentLanguage }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const citizenNavItems = [
    { path: '/', label: t('dashboard'), icon: '🏠' },
    { path: '/mandatory-training', label: 'Training', icon: '🎓' },
    { path: '/analysis', label: t('productAnalysis'), icon: '🔍' },
    { path: '/assistant', label: t('aiAssistant'), icon: '🤖' },
    { path: '/marketplace', label: t('marketplace'), icon: '🛒' },
    { path: '/map', label: t('recyclingMap'), icon: '🗺️' },
    { path: '/green-champions', label: 'Green Champions', icon: '🌱' },
    { path: '/waste-tracking', label: 'Waste Tracking', icon: '🚛' },
    { path: '/composting', label: 'Composting', icon: '🌿' },   // ✅ Added Composting
    { path: '/incentives', label: 'Incentives', icon: '💰' },
    { path: '/rewards', label: t('pointsRewards'), icon: '⭐' }
  ];

  const workerNavItems = [
    { path: '/', label: t('dashboard'), icon: '🏠' },
    { path: '/training', label: t('trainingModules'), icon: '📚' },
    { path: '/segregation', label: t('wasteSegregation'), icon: '♻️' },
    { path: '/health', label: t('healthTracking'), icon: '💚' },
    { path: '/feedback', label: t('submitFeedback'), icon: '📝' },
    { path: '/green-champions', label: 'Monitoring', icon: '🌱' },
    { path: '/waste-tracking', label: 'Vehicle Tracking', icon: '🚛' }
  ];

  const navItems = user.mode === 'citizen' ? citizenNavItems : workerNavItems;

  return (
    <nav className="navbar navbar-dark bg-success shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand fw-bold" to="/">
          🌱 EcoAware India
        </Link>

        {/* Hamburger */}
        <button
          className="btn btn-outline-light"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: isOpen ? "0" : "-240px", // hidden until toggled
          height: "100vh",
          width: "220px",
          backgroundColor: "rgba(119, 178, 147, 0.9)", // green with transparency
          transition: "left 0.3s ease",
          padding: "10px",
          zIndex: 1050,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logout at top-right inside sidebar */}
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-outline-light btn-sm"
            onClick={onLogout}
          >
            {t('logout')}
          </button>
        </div>

        {/* Navigation items */}
        <ul className="list-unstyled mt-3 flex-grow-1 overflow-auto">
          {navItems.map((item) => (
            <li key={item.path} style={{ marginBottom: "10px" }}>
              <Link
                className={`nav-link text-white ${location.pathname === item.path ? 'fw-bold' : ''}`}
                to={item.path}
                onClick={() => setIsOpen(false)}
              >
                <span className="me-2">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Bottom Section */}
        <div>
          {/* User Info */}
          <div className="text-white mb-2">
            <span className="me-2">{user.mode === 'citizen' ? '🏠' : '👷'}</span>
            {user.username}
            <br />
            <small className="opacity-75">
              {user.mode === 'citizen' ? 'Citizen' : 'Waste Worker'}
            </small>
          </div>

          {/* Language Switcher */}
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-sm ${currentLanguage === 'en' ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => onLanguageChange('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={`btn btn-sm ${currentLanguage === 'hi' ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => onLanguageChange('hi')}
            >
              हिं
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
