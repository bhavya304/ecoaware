import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const IncentiveSystem = ({ user }) => {
  const { t } = useTranslation();
  const [incentives, setIncentives] = useState([]);
  const [userEarnings, setUserEarnings] = useState(null);
  const [buildingCompliance, setBuildingCompliance] = useState([]);
  const [penalizations, setPenalizations] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      loadIncentiveData(),
      loadUserEarnings(),
      loadBuildingCompliance(),
      loadPenalizations(),
    ]);
    setLoading(false);
  };

  const loadIncentiveData = async () => {
    try {
      const response = await axios.get(`/api/incentives?period=${selectedPeriod}`);
      setIncentives(response.data?.incentives || []);
    } catch (error) {
      console.error('Error loading incentive data:', error);
      setIncentives([]); // fallback empty array
    }
  };

  const loadUserEarnings = async () => {
    try {
      const response = await axios.get(`/api/user-incentives/${user?.id}`);
      setUserEarnings(response.data?.earnings || null);
    } catch (error) {
      console.error('Error loading user earnings:', error);
      setUserEarnings(null);
    }
  };

  const loadBuildingCompliance = async () => {
    try {
      const response = await axios.get('/api/building-compliance');
      setBuildingCompliance(response.data?.buildings || []);
    } catch (error) {
      console.error('Error loading compliance data:', error);
      setBuildingCompliance([]);
    }
  };

  const loadPenalizations = async () => {
    try {
      const response = await axios.get('/api/penalizations');
      setPenalizations(response.data?.penalizations || []);
    } catch (error) {
      console.error('Error loading penalization data:', error);
      setPenalizations([]);
    }
  };

  const getComplianceColor = (score) => (score >= 95 ? 'success' : score >= 80 ? 'warning' : 'danger');
  const getComplianceStatus = (score) => (score >= 95 ? 'Excellent' : score >= 80 ? 'Good' : 'Needs Improvement');
  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'success';
      case 'good': return 'warning';
      case 'needs_improvement': return 'danger';
      case 'active': return 'danger';
      case 'resolved': return 'success';
      case 'pending_payment': return 'warning';
      default: return 'secondary';
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="card bg-success text-white mb-4">
        <div className="card-body">
          <h2 className="card-title">💰 Incentive & Penalty System</h2>
          <p className="card-text mb-0">
            Reward-based approach for waste segregation compliance and community participation
          </p>
        </div>
      </div>

      {/* User Earnings Dashboard */}
      {userEarnings && (
        <div className="card mb-4 border-success">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">🏆 Your Incentive Dashboard</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 text-center mb-3">
                <div className="border rounded p-3">
                  <h3 className="text-success">₹{userEarnings?.totalEarned?.toLocaleString() || 0}</h3>
                  <small>Total Earned</small>
                </div>
              </div>
              <div className="col-md-3 text-center mb-3">
                <div className="border rounded p-3">
                  <h3 className="text-primary">₹{userEarnings?.currentMonth || 0}</h3>
                  <small>This Month</small>
                </div>
              </div>
              <div className="col-md-3 text-center mb-3">
                <div className="border rounded p-3">
                  <h4 className="text-warning">🏅</h4>
                  <strong>{userEarnings?.rank || '-'}</strong>
                  <br /><small>Current Level</small>
                </div>
              </div>
              <div className="col-md-3 text-center mb-3">
                <div className="border rounded p-3">
                  <h4 className="text-info">{userEarnings?.nextLevelPoints || 0}</h4>
                  <small>Points to Next Level</small>
                </div>
              </div>
            </div>

            <h6 className="mt-3">Recent Earnings:</h6>
            <div className="list-group list-group-flush">
              {(userEarnings?.recentEarnings || []).map((earning, index) => (
                <div key={index} className="list-group-item border-0 px-0 py-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong className="text-success">+₹{earning?.amount || 0}</strong>
                      <span className="ms-2">{earning?.type || ''}</span>
                      <br /><small className="text-muted">{earning?.description || ''}</small>
                    </div>
                    <small className="text-muted">
                      {earning?.date ? new Date(earning.date).toLocaleDateString() : ''}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Period Selector */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="mb-0">📊 Incentive Programs Overview</h5>
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="monthly">Monthly Data</option>
                <option value="quarterly">Quarterly Data</option>
                <option value="yearly">Yearly Data</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Incentive Programs */}
      <div className="row mb-4">
        {(incentives || []).map((incentive) => (
          <div key={incentive?.id} className="col-lg-6 mb-4">
            <div className="card h-100 border-success">
              <div className="card-header bg-light">
                <h6 className="mb-0 text-success">💰 {incentive?.title}</h6>
              </div>
              <div className="card-body">
                <p className="card-text">{incentive?.description}</p>

                <div className="mb-3">
                  <h6 className="small text-primary">Eligibility:</h6>
                  <p className="small">{incentive?.eligibility}</p>
                </div>

                <div className="mb-3">
                  <h6 className="small text-success">Incentive Amount:</h6>
                  <p className="fw-bold text-success">{incentive?.incentiveAmount}</p>
                </div>

                <div className="mb-3">
                  <h6 className="small">Requirements:</h6>
                  <ul className="small">
                    {(incentive?.requirements || []).map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <h6 className="small">Benefits:</h6>
                  <ul className="small">
                    {(incentive?.benefits || []).map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="row text-center">
                  <div className="col-6">
                    <div className="border rounded p-2">
                      <h5 className="text-primary">{incentive?.participants || 0}</h5>
                      <small>Participants</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="border rounded p-2">
                      <h5 className="text-success">{incentive?.totalPayout || '₹0'}</h5>
                      <small>Total Payout</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn btn-success btn-sm w-100">Apply for Program</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Building Compliance */}
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">🏢 Building Compliance Leaderboard</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Building Name</th>
                      <th>Type</th>
                      <th>Compliance Score</th>
                      <th>Monthly Incentive</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(buildingCompliance || []).map((building) => (
                      <tr key={building?.id}>
                        <td>
                          <strong>{building?.name}</strong>
                          <br /><small className="text-muted">{building?.location}</small>
                        </td>
                        <td>
                          <span className="badge bg-info">{building?.type}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className={`badge bg-${getComplianceColor(building?.complianceScore)} me-2`}>
                              {building?.complianceScore || 0}%
                            </span>
                            <small>{getComplianceStatus(building?.complianceScore)}</small>
                          </div>
                        </td>
                        <td>
                          <span className={building?.monthlyIncentive > 0 ? 'text-success fw-bold' : 'text-muted'}>
                            ₹{building?.monthlyIncentive?.toLocaleString() || 0}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${getStatusColor(building?.status)}`}>
                            {building?.status?.replace('_', ' ') || '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Penalizations */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">⚠️ Active Penalizations</h5>
            </div>
            <div className="card-body">
              {(penalizations || []).length === 0 ? (
                <div className="text-center py-4">
                  <div style={{ fontSize: '3rem' }}>✅</div>
                  <p className="text-muted">No active penalties</p>
                  <small>All buildings are compliant!</small>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {(penalizations || []).slice(0, 5).map((penalty) => (
                    <div key={penalty?.id} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{penalty?.buildingName}</h6>
                          <p className="mb-1 small text-muted">{penalty?.location}</p>
                          <p className="mb-2 small">{penalty?.violation}</p>

                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold text-danger">
                              Fine: ₹{penalty?.fineAmount?.toLocaleString() || 0}
                            </span>
                            <span className={`badge bg-${getStatusColor(penalty?.status)}`}>
                              {penalty?.status?.replace('_', ' ') || '-'}
                            </span>
                          </div>

                          {penalty?.wasteCollectionSuspended && (
                            <div className="mt-2">
                              <span className="badge bg-warning">
                                🚫 Collection Suspended ({penalty?.suspensionDays || 0} days)
                              </span>
                            </div>
                          )}

                          <div className="mt-2">
                            <small className="text-muted">
                              Issued: {penalty?.issuedDate ? new Date(penalty.issuedDate).toLocaleDateString() : '-'}
                            </small>
                          </div>
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

      {/* System Statistics */}
      <div className="card mt-4">
        <div className="card-header">
          <h5 className="mb-0">📈 System Performance</h5>
        </div>
        <div className="card-body">
          <div className="row text-center">
            <div className="col-md-3">
              <div className="border rounded p-3">
                <h4 className="text-success">₹85,82,000</h4>
                <small>Total Incentives Paid</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border rounded p-3">
                <h4 className="text-primary">8,244</h4>
                <small>Active Participants</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border rounded p-3">
                <h4 className="text-warning">₹23,000</h4>
                <small>Total Fines Collected</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border rounded p-3">
                <h4 className="text-info">92%</h4>
                <small>Overall Compliance Rate</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncentiveSystem;
