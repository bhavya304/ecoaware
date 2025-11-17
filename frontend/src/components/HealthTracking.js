import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const HealthTracking = ({ user }) => {
  const { t } = useTranslation();
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    hoursWorked: '',
    waterBreaks: '',
    symptoms: '',
    notes: ''
  });

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      const response = await axios.get(`/api/workers/health/${user.id}`);
      setHealthData(response.data.entries || []);
    } catch (error) {
      console.error('Error loading health data:', error);
      // Mock data
      setHealthData([
        {
          id: 1,
          date: new Date().toISOString().split('T')[0],
          hoursWorked: 8,
          waterBreaks: 4,
          symptoms: '',
          notes: 'Feeling good today'
        },
        {
          id: 2,
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          hoursWorked: 7.5,
          waterBreaks: 3,
          symptoms: 'Slight fatigue',
          notes: 'Need more water breaks'
        },
        {
          id: 3,
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          hoursWorked: 8.5,
          waterBreaks: 5,
          symptoms: '',
          notes: 'Great day'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/workers/health', {
        workerId: user.id,
        ...newEntry
      });
      
      if (response.data.success) {
        setHealthData([response.data.entry, ...healthData]);
        setNewEntry({ hoursWorked: '', waterBreaks: '', symptoms: '', notes: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding health entry:', error);
      alert('Failed to add entry. Please try again.');
    }
  };

  // Calculate statistics
  const avgHours = healthData.length > 0 
    ? (healthData.reduce((sum, entry) => sum + entry.hoursWorked, 0) / healthData.length).toFixed(1)
    : 0;
  const avgWaterBreaks = healthData.length > 0
    ? (healthData.reduce((sum, entry) => sum + entry.waterBreaks, 0) / healthData.length).toFixed(1)
    : 0;
  const recentSymptoms = healthData.filter(entry => entry.symptoms).length;

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
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="card-title">💚 {t('healthTracking')}</h2>
                  <p className="card-text mb-0">
                    Monitor your daily health metrics and work patterns
                  </p>
                </div>
                <button
                  className="btn btn-outline-light"
                  onClick={() => setShowAddForm(true)}
                >
                  + {t('addHealthEntry')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white text-center">
            <div className="card-body">
              <h5 className="card-title">⏰</h5>
              <h3>{avgHours}</h3>
              <p className="card-text">Avg Hours/Day</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white text-center">
            <div className="card-body">
              <h5 className="card-title">💧</h5>
              <h3>{avgWaterBreaks}</h3>
              <p className="card-text">Avg Water Breaks</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white text-center">
            <div className="card-body">
              <h5 className="card-title">⚠️</h5>
              <h3>{recentSymptoms}</h3>
              <p className="card-text">Recent Symptoms</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-secondary text-white text-center">
            <div className="card-body">
              <h5 className="card-title">📊</h5>
              <h3>{healthData.length}</h3>
              <p className="card-text">Total Entries</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Chart Placeholder */}
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">📈 Health Trends</h5>
            </div>
            <div className="card-body">
              {healthData.length > 0 ? (
                <div className="text-center py-4">
                  <div style={{ fontSize: '4rem' }}>📊</div>
                  <h5>Health Trend Chart</h5>
                  <p className="text-muted">
                    Chart.js visualization would show here with hours worked and water breaks over time
                  </p>
                  <div className="row mt-4">
                    <div className="col-6">
                      <div className="border rounded p-3">
                        <h6 className="text-primary">Hours Worked Trend</h6>
                        <div className="progress mb-2">
                          <div className="progress-bar bg-primary" style={{ width: '70%' }}></div>
                        </div>
                        <small className="text-muted">Weekly average: {avgHours} hours</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="border rounded p-3">
                        <h6 className="text-info">Water Breaks Trend</h6>
                        <div className="progress mb-2">
                          <div className="progress-bar bg-info" style={{ width: '85%' }}></div>
                        </div>
                        <small className="text-muted">Weekly average: {avgWaterBreaks} breaks</small>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <div style={{ fontSize: '4rem' }}>📊</div>
                  <h5 className="text-muted">No data yet</h5>
                  <p className="text-muted">Add your first health entry to see trends</p>
                </div>
              )}
            </div>
          </div>

          {/* Health Tips */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">💡 Health Tips</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-success">✅ Recommended</h6>
                  <ul className="list-unstyled small">
                    <li className="mb-2">💧 Take water breaks every 1-2 hours</li>
                    <li className="mb-2">🚶 Walk for 5 minutes every hour</li>
                    <li className="mb-2">😴 Get 7-8 hours of sleep</li>
                    <li className="mb-0">🥗 Eat nutritious meals</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6 className="text-danger">⚠️ Warning Signs</h6>
                  <ul className="list-unstyled small">
                    <li className="mb-2">🤕 Persistent headaches or fatigue</li>
                    <li className="mb-2">🫁 Difficulty breathing</li>
                    <li className="mb-2">🤧 Recurring cold symptoms</li>
                    <li className="mb-0">💪 Joint or muscle pain</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">📋 Recent Entries</h5>
            </div>
            <div className="card-body">
              {healthData.length === 0 ? (
                <div className="text-center py-4">
                  <div style={{ fontSize: '3rem' }}>📝</div>
                  <p className="text-muted">No entries yet</p>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowAddForm(true)}
                  >
                    Add First Entry
                  </button>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {healthData.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-bold small">
                            {new Date(entry.date).toLocaleDateString()}
                          </div>
                          <div className="small text-muted">
                            {entry.hoursWorked}h worked, {entry.waterBreaks} breaks
                          </div>
                          {entry.symptoms && (
                            <div className="small text-warning">
                              ⚠️ {entry.symptoms}
                            </div>
                          )}
                          {entry.notes && (
                            <div className="small text-muted">
                              📝 {entry.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAddForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('addHealthEntry')}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddForm(false)}
                ></button>
              </div>
              <form onSubmit={handleAddEntry}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">{t('hoursWorked')} *</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      className="form-control"
                      value={newEntry.hoursWorked}
                      onChange={(e) => setNewEntry({...newEntry, hoursWorked: e.target.value})}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">{t('waterBreaks')} *</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={newEntry.waterBreaks}
                      onChange={(e) => setNewEntry({...newEntry, waterBreaks: e.target.value})}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">{t('symptoms')}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newEntry.symptoms}
                      onChange={(e) => setNewEntry({...newEntry, symptoms: e.target.value})}
                      placeholder="Any symptoms experienced (optional)"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Additional Notes</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newEntry.notes}
                      onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                      placeholder="Any additional notes about your day"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Add Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTracking;