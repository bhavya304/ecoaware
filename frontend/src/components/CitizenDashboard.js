import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const CitizenDashboard = ({ user }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    points: 0,
    carbonSaved: 0,
    recyclablesFound: 0
  });
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data for now
      setStats({
        totalAnalyses: 23,
        points: 156,
        carbonSaved: 4.2,
        recyclablesFound: 18
      });
      
      setRecentAnalyses([
        { id: 1, product: 'Plastic Bottle', score: 3.2, date: '2024-01-15', disposal: 'Recycle' },
        { id: 2, product: 'Bamboo Toothbrush', score: 9.1, date: '2024-01-14', disposal: 'Compost' },
        { id: 3, product: 'Glass Jar', score: 8.5, date: '2024-01-13', disposal: 'Recycle' }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: t('productAnalysis'),
      description: 'Analyze product sustainability',
      icon: '🔍',
      link: '/analysis',
      color: 'primary'
    },
    {
      title: t('aiAssistant'),
      description: 'Get eco-friendly advice',
      icon: '🤖',
      link: '/assistant',
      color: 'success'
    },
    {
      title: t('marketplace'),
      description: 'Browse eco-vendors',
      icon: '🛒',
      link: '/marketplace',
      color: 'info'
    },
    {
      title: t('recyclingMap'),
      description: 'Find recycling locations',
      icon: '🗺️',
      link: '/map',
      color: 'warning'
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 8) return 'success';
    if (score >= 6) return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">{t('loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Welcome Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-gradient bg-success text-white">
            <div className="card-body">
              <h2 className="card-title mb-2">
                Welcome back, {user.username}! 🌱
              </h2>
              <p className="card-text mb-0">
                Ready to make more eco-friendly choices today?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h5 className="card-title">📊</h5>
              <h3>{stats.totalAnalyses}</h3>
              <p className="card-text">Products Analyzed</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h5 className="card-title">⭐</h5>
              <h3>{stats.points}</h3>
              <p className="card-text">{t('points')}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h5 className="card-title">🌍</h5>
              <h3>{stats.carbonSaved} kg</h3>
              <p className="card-text">CO₂ Saved</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h5 className="card-title">♻️</h5>
              <h3>{stats.recyclablesFound}</h3>
              <p className="card-text">Recyclables Found</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="mb-3">Quick Actions</h4>
        </div>
        {quickActions.map((action, index) => (
          <div key={index} className="col-lg-3 col-md-6 mb-3">
            <Link to={action.link} className="text-decoration-none">
              <div className={`card border-${action.color} h-100 hover-shadow`}>
                <div className="card-body text-center">
                  <div className="mb-3" style={{ fontSize: '2rem' }}>
                    {action.icon}
                  </div>
                  <h5 className={`card-title text-${action.color}`}>
                    {action.title}
                  </h5>
                  <p className="card-text text-muted">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Analyses */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Product Analyses</h5>
              <Link to="/analysis" className="btn btn-sm btn-outline-primary">
                Analyze More
              </Link>
            </div>
            <div className="card-body">
              {recentAnalyses.length === 0 ? (
                <div className="text-center py-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>📱</div>
                  <p className="text-muted">No analyses yet. Start by uploading a product photo!</p>
                  <Link to="/analysis" className="btn btn-primary">
                    {t('uploadPhoto')}
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Score</th>
                        <th>Disposal Method</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAnalyses.map((analysis) => (
                        <tr key={analysis.id}>
                          <td>
                            <strong>{analysis.product}</strong>
                          </td>
                          <td>
                            <span className={`badge bg-${getScoreColor(analysis.score)}`}>
                              {analysis.score}/10
                            </span>
                          </td>
                          <td>
                            <span className="text-muted">
                              {t(analysis.disposal.toLowerCase())}
                            </span>
                          </td>
                          <td className="text-muted">
                            {new Date(analysis.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;