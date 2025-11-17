import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const WorkerDashboard = ({ user }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    trainingProgress: 0,
    totalSegregations: 0,
    correctSegregations: 0,
    hazardousDetected: 0,
    hoursWorked: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data for worker dashboard
      setStats({
        trainingProgress: 85,
        totalSegregations: 127,
        correctSegregations: 118,
        hazardousDetected: 3,
        hoursWorked: 156
      });
      
      setRecentActivity([
        { 
          id: 1, 
          type: 'segregation', 
          result: 'correct', 
          time: '10:30 AM',
          description: 'Plastic waste properly segregated'
        },
        { 
          id: 2, 
          type: 'training', 
          result: 'completed', 
          time: '09:15 AM',
          description: 'Completed Module 3: Hazardous Waste'
        },
        { 
          id: 3, 
          type: 'alert', 
          result: 'hazardous', 
          time: '08:45 AM',
          description: 'Battery waste detected - handled safely'
        }
      ]);

      setAlerts([
        {
          id: 1,
          type: 'warning',
          message: 'Remember to take water breaks every 2 hours',
          time: '1 hour ago'
        }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: t('trainingModules'),
      description: 'Continue your training progress',
      icon: '📚',
      link: '/training',
      color: 'primary',
      badge: `${stats.trainingProgress}%`
    },
    {
      title: t('wasteSegregation'),
      description: 'Verify waste sorting accuracy',
      icon: '♻️',
      link: '/segregation',
      color: 'success'
    },
    {
      title: 'AR Training',
      description: 'Interactive 3D demonstrations',
      icon: '🥽',
      link: '/training',
      color: 'info'
    },
    {
      title: t('healthTracking'),
      description: 'Log your daily health metrics',
      icon: '💚',
      link: '/health',
      color: 'warning'
    }
  ];

  const getActivityIcon = (type, result) => {
    if (type === 'segregation') return result === 'correct' ? '✅' : '❌';
    if (type === 'training') return '📖';
    if (type === 'alert') return '⚠️';
    return '📋';
  };

  const getActivityColor = (type, result) => {
    if (type === 'alert' || result === 'hazardous') return 'danger';
    if (result === 'correct' || result === 'completed') return 'success';
    if (result === 'incorrect') return 'warning';
    return 'info';
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
          <div className="card bg-gradient bg-primary text-white">
            <div className="card-body">
              <h2 className="card-title mb-2">
                Welcome back, {user.username}! 👷
              </h2>
              <p className="card-text mb-0">
                Your dedication makes our environment cleaner and safer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            {alerts.map(alert => (
              <div key={alert.id} className={`alert alert-${alert.type} alert-dismissible`}>
                <strong>Alert:</strong> {alert.message}
                <small className="text-muted ms-2">({alert.time})</small>
                <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card bg-primary text-white text-center">
            <div className="card-body">
              <h5 className="card-title">📚</h5>
              <h3>{stats.trainingProgress}%</h3>
              <p className="card-text small">Training Progress</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card bg-success text-white text-center">
            <div className="card-body">
              <h5 className="card-title">♻️</h5>
              <h3>{stats.totalSegregations}</h3>
              <p className="card-text small">Total Checks</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card bg-info text-white text-center">
            <div className="card-body">
              <h5 className="card-title">✅</h5>
              <h3>{Math.round((stats.correctSegregations / stats.totalSegregations) * 100)}%</h3>
              <p className="card-text small">Accuracy Rate</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card bg-warning text-white text-center">
            <div className="card-body">
              <h5 className="card-title">⚠️</h5>
              <h3>{stats.hazardousDetected}</h3>
              <p className="card-text small">Hazardous Found</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card bg-secondary text-white text-center">
            <div className="card-body">
              <h5 className="card-title">⏰</h5>
              <h3>{stats.hoursWorked}</h3>
              <p className="card-text small">Hours This Month</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card bg-dark text-white text-center">
            <div className="card-body">
              <h5 className="card-title">🏆</h5>
              <h3>A+</h3>
              <p className="card-text small">Performance Grade</p>
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
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div style={{ fontSize: '2rem' }}>
                      {action.icon}
                    </div>
                    {action.badge && (
                      <span className={`badge bg-${action.color}`}>
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <h5 className={`card-title text-${action.color}`}>
                    {action.title}
                  </h5>
                  <p className="card-text text-muted small">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row">
        {/* Recent Activity */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Activity</h5>
              <small className="text-muted">Today</small>
            </div>
            <div className="card-body">
              {recentActivity.length === 0 ? (
                <div className="text-center py-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>📋</div>
                  <p className="text-muted">No recent activity</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="list-group-item border-0 px-0">
                      <div className="d-flex align-items-center">
                        <div className="me-3" style={{ fontSize: '1.5rem' }}>
                          {getActivityIcon(activity.type, activity.result)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-bold">
                            {activity.description}
                          </div>
                          <small className="text-muted">
                            {activity.time}
                          </small>
                        </div>
                        <span className={`badge bg-${getActivityColor(activity.type, activity.result)}`}>
                          {activity.result}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Training Progress */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Training Progress</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small>Overall Progress</small>
                  <small>{stats.trainingProgress}%</small>
                </div>
                <div className="progress mb-3">
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ width: `${stats.trainingProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="small">
                <div className="d-flex justify-content-between mb-2">
                  <span>✅ Basic Safety</span>
                  <span className="text-success">Complete</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>✅ Waste Sorting</span>
                  <span className="text-success">Complete</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>✅ Hazardous Materials</span>
                  <span className="text-success">Complete</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>📖 Equipment Handling</span>
                  <span className="text-warning">In Progress</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>⏳ Emergency Procedures</span>
                  <span className="text-muted">Pending</span>
                </div>
              </div>

              <div className="mt-3">
                <Link to="/training" className="btn btn-primary btn-sm w-100">
                  Continue Training
                </Link>
              </div>
            </div>
          </div>

          {/* Health Reminder */}
          <div className="card mt-3">
            <div className="card-body">
              <h6 className="card-title text-warning">
                💚 Health Reminder
              </h6>
              <p className="card-text small">
                Don't forget to log your health metrics and take regular breaks!
              </p>
              <Link to="/health" className="btn btn-outline-warning btn-sm">
                Update Health Log
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;