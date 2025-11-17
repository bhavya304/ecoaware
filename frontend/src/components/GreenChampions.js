import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const GreenChampions = ({ user }) => {
  const { t } = useTranslation();
  const [champions, setChampions] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [monitoringReports, setMonitoringReports] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [newReport, setNewReport] = useState({
    area: '',
    category: '',
    issue: '',
    severity: 'medium',
    evidence: null,
    geoLocation: null
  });
  const [isChampion, setIsChampion] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChampionsData();
    loadMonitoringReports();
    checkChampionStatus();
  }, []);

  const loadChampionsData = async () => {
    try {
      const response = await axios.get('/api/green-champions');
      setChampions(response.data.champions || []);
    } catch (error) {
      console.error('Error loading champions:', error);
      // Mock data
      setChampions([
        {
          id: 1,
          name: "Rajesh Kumar",
          area: "Sector 15, Noida",
          role: "Area Monitoring Head",
          certificationLevel: "Advanced",
          reportsSubmitted: 45,
          issuesResolved: 38,
          contact: "+91-9876543210",
          avatar: "👨‍🦱"
        },
        {
          id: 2,
          name: "Priya Sharma",
          area: "Connaught Place, Delhi",
          role: "Commercial Building Monitor",
          certificationLevel: "Expert",
          reportsSubmitted: 67,
          issuesResolved: 59,
          contact: "+91-9876543211",
          avatar: "👩‍🦰"
        },
        {
          id: 3,
          name: "Amit Patel",
          area: "Koramangala, Bangalore",
          role: "Residential Complex Monitor",
          certificationLevel: "Intermediate",
          reportsSubmitted: 23,
          issuesResolved: 20,
          contact: "+91-9876543212",
          avatar: "👨‍🦲"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadMonitoringReports = async () => {
    try {
      const response = await axios.get('/api/monitoring-reports');
      setMonitoringReports(response.data.reports || []);
    } catch (error) {
      console.error('Error loading reports:', error);
      // Mock data
      setMonitoringReports([
        {
          id: 1,
          championId: 1,
          area: "Sector 15, Block A",
          category: "waste_generation",
          issue: "Source segregation not followed",
          severity: "high",
          status: "resolved",
          reportedAt: new Date(Date.now() - 86400000),
          resolvedAt: new Date(),
          evidenceCount: 3
        },
        {
          id: 2,
          championId: 2,
          area: "CP Metro Station",
          category: "waste_collection",
          issue: "Collection vehicle missed pickup",
          severity: "medium",
          status: "in_progress",
          reportedAt: new Date(Date.now() - 172800000),
          evidenceCount: 1
        }
      ]);
    }
  };

  const checkChampionStatus = async () => {
    try {
      const response = await axios.get(`/api/green-champions/status/${user.id}`);
      setIsChampion(response.data.isChampion);
    } catch (error) {
      console.error('Error checking champion status:', error);
      // Mock: User is a champion if they have completed training
      setIsChampion(user.mode === 'worker' || Math.random() > 0.7);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const reportData = {
            ...newReport,
            championId: user.id,
            geoLocation: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            reportedAt: new Date()
          };

          const response = await axios.post('/api/monitoring-reports', reportData);
          if (response.data.success) {
            setMonitoringReports([response.data.report, ...monitoringReports]);
            setNewReport({
              area: '',
              category: '',
              issue: '',
              severity: 'medium',
              evidence: null,
              geoLocation: null
            });
            setShowReportForm(false);
            alert('Monitoring report submitted successfully!');
          }
        });
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'in_progress': return 'warning';
      case 'pending': return 'danger';
      default: return 'secondary';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getCertificationColor = (level) => {
    switch (level) {
      case 'Expert': return 'success';
      case 'Advanced': return 'primary';
      case 'Intermediate': return 'warning';
      default: return 'secondary';
    }
  };

  const monitoringCategories = [
    { value: 'waste_generation', label: 'Waste Generation & Source Segregation' },
    { value: 'waste_collection', label: 'Waste Collection' },
    { value: 'waste_transportation', label: 'Waste Transportation' },
    { value: 'waste_treatment', label: 'Waste Treatment Facilities' },
    { value: 'waste_disposal', label: 'Waste Disposal' },
    { value: 'public_cleanliness', label: 'Public Area Cleanliness' },
    { value: 'illegal_dumping', label: 'Illegal Dumping' }
  ];

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="card bg-success text-white mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="card-title">🌱 Green Champions Network</h2>
              <p className="card-text mb-0">
                Decentralized monitoring system for comprehensive waste management oversight
              </p>
            </div>
            <div className="col-md-4 text-center">
              {isChampion ? (
                <div>
                  <h4>🏆 You are a Green Champion!</h4>
                  <button 
                    className="btn btn-outline-light"
                    onClick={() => setShowReportForm(true)}
                  >
                    📝 Submit Report
                  </button>
                </div>
              ) : (
                <div>
                  <h6>Become a Green Champion</h6>
                  <button className="btn btn-outline-light">
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white text-center">
            <div className="card-body">
              <h3>{champions.length}</h3>
              <p className="card-text">Active Champions</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white text-center">
            <div className="card-body">
              <h3>{monitoringReports.length}</h3>
              <p className="card-text">Reports Submitted</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white text-center">
            <div className="card-body">
              <h3>{monitoringReports.filter(r => r.status === 'resolved').length}</h3>
              <p className="card-text">Issues Resolved</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white text-center">
            <div className="card-body">
              <h3>94%</h3>
              <p className="card-text">Resolution Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Green Champions List */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">🏆 Active Green Champions</h5>
              <select 
                className="form-select form-select-sm w-auto"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="">All Areas</option>
                <option value="delhi">Delhi NCR</option>
                <option value="bangalore">Bangalore</option>
                <option value="mumbai">Mumbai</option>
              </select>
            </div>
            <div className="card-body">
              <div className="row">
                {champions.map((champion) => (
                  <div key={champion.id} className="col-12 mb-3">
                    <div className="card border-success">
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          <div className="col-2 text-center">
                            <div style={{ fontSize: '2rem' }}>{champion.avatar}</div>
                          </div>
                          <div className="col-10">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="mb-1">{champion.name}</h6>
                                <p className="text-muted small mb-1">📍 {champion.area}</p>
                                <p className="text-muted small mb-2">{champion.role}</p>
                                <span className={`badge bg-${getCertificationColor(champion.certificationLevel)}`}>
                                  {champion.certificationLevel}
                                </span>
                              </div>
                              <div className="text-end">
                                <div className="small">
                                  <strong>Reports:</strong> {champion.reportsSubmitted}
                                </div>
                                <div className="small">
                                  <strong>Resolved:</strong> {champion.issuesResolved}
                                </div>
                                <button className="btn btn-outline-success btn-sm mt-1">
                                  Contact
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Monitoring Reports */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📋 Recent Monitoring Reports</h5>
              {isChampion && (
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowReportForm(true)}
                >
                  + New Report
                </button>
              )}
            </div>
            <div className="card-body">
              {monitoringReports.length === 0 ? (
                <div className="text-center py-4">
                  <div style={{ fontSize: '3rem' }}>📊</div>
                  <p className="text-muted">No monitoring reports yet</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {monitoringReports.slice(0, 5).map((report) => (
                    <div key={report.id} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-1">{report.issue}</h6>
                            <span className={`badge bg-${getStatusColor(report.status)}`}>
                              {report.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="mb-1 small">
                            <strong>📍 Area:</strong> {report.area}
                          </p>
                          <p className="mb-1 small">
                            <strong>📂 Category:</strong> {report.category.replace('_', ' ')}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {new Date(report.reportedAt).toLocaleDateString()}
                            </small>
                            <div>
                              <span className={`badge bg-${getSeverityColor(report.severity)} me-2`}>
                                {report.severity}
                              </span>
                              {report.evidenceCount > 0 && (
                                <span className="badge bg-info">
                                  📸 {report.evidenceCount} photos
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Champion Application */}
          {!isChampion && (
            <div className="card mt-4 border-primary">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">🌟 Become a Green Champion</h5>
              </div>
              <div className="card-body">
                <h6>Requirements:</h6>
                <ul className="small">
                  <li>✅ Complete mandatory citizen training</li>
                  <li>✅ Pass Green Champion certification exam</li>
                  <li>✅ Commit to minimum 2 hours/week monitoring</li>
                  <li>✅ Submit at least 5 reports per month</li>
                </ul>
                <h6>Benefits:</h6>
                <ul className="small">
                  <li>🏆 Official Green Champion certificate</li>
                  <li>💰 Monthly incentive of ₹2,000</li>
                  <li>🎯 Priority access to training programs</li>
                  <li>📱 Advanced monitoring app features</li>
                </ul>
                <button className="btn btn-primary w-100">
                  Apply to Become Champion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Monitoring Areas Coverage */}
      <div className="card mt-4">
        <div className="card-header">
          <h5 className="mb-0">🗺️ Monitoring Coverage Areas</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <h6 className="text-primary">🏢 Commercial Buildings</h6>
              <ul className="list-unstyled small">
                <li>• Office complexes</li>
                <li>• Shopping malls</li>
                <li>• Restaurants & hotels</li>
                <li>• Markets</li>
              </ul>
            </div>
            <div className="col-md-4">
              <h6 className="text-success">🏠 Residential Areas</h6>
              <ul className="list-unstyled small">
                <li>• Housing societies</li>
                <li>• Individual houses</li>
                <li>• Slum areas</li>
                <li>• Student hostels</li>
              </ul>
            </div>
            <div className="col-md-4">
              <h6 className="text-warning">🏭 Industrial & Public</h6>
              <ul className="list-unstyled small">
                <li>• Industrial buildings</li>
                <li>• Public institutions</li>
                <li>• Transportation hubs</li>
                <li>• Parks & open spaces</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">📝 Submit Monitoring Report</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowReportForm(false)}
                ></button>
              </div>
              <form onSubmit={handleReportSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">📍 Area/Location *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newReport.area}
                          onChange={(e) => setNewReport({...newReport, area: e.target.value})}
                          placeholder="Specific area, building, or location"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">📂 Monitoring Category *</label>
                        <select
                          className="form-select"
                          value={newReport.category}
                          onChange={(e) => setNewReport({...newReport, category: e.target.value})}
                          required
                        >
                          <option value="">Select category...</option>
                          {monitoringCategories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">⚠️ Issue Description *</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={newReport.issue}
                      onChange={(e) => setNewReport({...newReport, issue: e.target.value})}
                      placeholder="Describe the observed issue in detail..."
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">🚨 Severity Level</label>
                    <div className="row">
                      {[
                        { value: 'low', label: 'Low', color: 'success', desc: 'Minor issue, can wait' },
                        { value: 'medium', label: 'Medium', color: 'warning', desc: 'Needs attention soon' },
                        { value: 'high', label: 'High', color: 'danger', desc: 'Urgent action required' }
                      ].map((severity) => (
                        <div key={severity.value} className="col-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="severity"
                              value={severity.value}
                              id={severity.value}
                              checked={newReport.severity === severity.value}
                              onChange={(e) => setNewReport({...newReport, severity: e.target.value})}
                            />
                            <label className={`form-check-label text-${severity.color}`} htmlFor={severity.value}>
                              <strong>{severity.label}</strong><br/>
                              <small>{severity.desc}</small>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">📷 Evidence Photos</label>
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      accept="image/*"
                      onChange={(e) => setNewReport({...newReport, evidence: e.target.files})}
                    />
                    <div className="form-text">
                      Upload photos as evidence (optional, but recommended)
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <h6 className="alert-heading">📋 Monitoring Guidelines</h6>
                    <ul className="mb-0 small">
                      <li>Be objective and factual in your observations</li>
                      <li>Include specific locations and timestamps</li>
                      <li>Take clear photos showing the issue</li>
                      <li>Report immediately for health hazards</li>
                      <li>Follow up on previous reports when possible</li>
                    </ul>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowReportForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    📤 Submit Report
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

export default GreenChampions;