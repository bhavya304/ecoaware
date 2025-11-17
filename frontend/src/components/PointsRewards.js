import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const PointsRewards = ({ user }) => {
  const { t } = useTranslation();
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPointsData();
    loadRewards();
  }, []);

  const loadPointsData = async () => {
    try {
      const response = await axios.get(`/api/points/${user.id}`);
      setPoints(response.data.totalPoints);
      setHistory(response.data.history);
    } catch (error) {
      console.error('Error loading points:', error);
      // Mock data
      setPoints(156);
      setHistory([
        { id: 1, points: 10, activity: 'product_analysis', description: 'Analyzed product sustainability', timestamp: new Date() },
        { id: 2, points: 25, activity: 'location_tag', description: 'Tagged new recycling location', timestamp: new Date(Date.now() - 86400000) },
        { id: 3, points: 15, activity: 'chat_engagement', description: 'Asked AI assistant for eco tips', timestamp: new Date(Date.now() - 172800000) }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadRewards = () => {
    setRewards([
      { id: 1, name: "Green Earth Store", discount: "15% off", pointsRequired: 100, type: "discount", claimed: true },
      { id: 2, name: "Zero Waste Co.", discount: "20% off bulk orders", pointsRequired: 150, type: "discount", claimed: false },
      { id: 3, name: "Eco Champion Badge", discount: "Digital certificate", pointsRequired: 200, type: "badge", claimed: false },
      { id: 4, name: "Solar Solutions", discount: "Free consultation", pointsRequired: 120, type: "service", claimed: false },
      { id: 5, name: "Tree Planting", discount: "Plant 5 trees in your name", pointsRequired: 300, type: "impact", claimed: false }
    ]);
  };

  const claimReward = async (reward) => {
    if (points >= reward.pointsRequired && !reward.claimed) {
      try {
        // Deduct points (in real app, send to backend)
        setPoints(points - reward.pointsRequired);
        setRewards(rewards.map(r => 
          r.id === reward.id ? { ...r, claimed: true } : r
        ));
        alert(`Congratulations! You've claimed: ${reward.name}`);
      } catch (error) {
        console.error('Error claiming reward:', error);
      }
    }
  };

  const getActivityIcon = (activity) => {
    switch (activity) {
      case 'product_analysis': return '🔍';
      case 'location_tag': return '📍';
      case 'chat_engagement': return '💬';
      case 'marketplace_visit': return '🛒';
      default: return '⭐';
    }
  };

  const getRewardIcon = (type) => {
    switch (type) {
      case 'discount': return '💰';
      case 'badge': return '🏆';
      case 'service': return '🛠️';
      case 'impact': return '🌱';
      default: return '🎁';
    }
  };

  const getRewardColor = (type) => {
    switch (type) {
      case 'discount': return 'success';
      case 'badge': return 'warning';
      case 'service': return 'info';
      case 'impact': return 'primary';
      default: return 'secondary';
    }
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
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h2 className="card-title">⭐ {t('pointsRewards')}</h2>
              <p className="card-text mb-0">
                Earn points for eco-friendly actions and redeem amazing rewards!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Points Summary */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-success text-white text-center">
            <div className="card-body">
              <h1 className="display-4">{points}</h1>
              <h5>Total {t('points')}</h5>
              <small>Keep earning to unlock more rewards!</small>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">🏅 Achievement Level</h5>
              <div className="row">
                <div className="col-6">
                  <div className="text-center p-3 border rounded">
                    <div className="mb-2" style={{ fontSize: '2rem' }}>
                      {points >= 300 ? '🌟' : points >= 150 ? '⭐' : '✨'}
                    </div>
                    <strong>
                      {points >= 300 ? 'Eco Champion' : points >= 150 ? 'Green Hero' : 'Eco Starter'}
                    </strong>
                    <div className="small text-muted mt-1">
                      Current Level
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center p-3 border rounded">
                    <div className="mb-2" style={{ fontSize: '2rem' }}>
                      {points >= 300 ? '🏆' : '🎯'}
                    </div>
                    <strong>
                      {points >= 300 ? 'Max Level!' : `${300 - points} points to go`}
                    </strong>
                    <div className="small text-muted mt-1">
                      {points >= 300 ? 'Achievement Unlocked' : 'Next Level'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Available Rewards */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">🎁 Available {t('rewards')}</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {rewards.map((reward) => (
                  <div key={reward.id} className="col-md-6 mb-3">
                    <div className={`card border-${getRewardColor(reward.type)} h-100`}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="d-flex align-items-center">
                            <span className="me-2" style={{ fontSize: '1.5rem' }}>
                              {getRewardIcon(reward.type)}
                            </span>
                            <h6 className="card-title mb-0">{reward.name}</h6>
                          </div>
                          {reward.claimed && (
                            <span className="badge bg-success">✓ Claimed</span>
                          )}
                        </div>
                        
                        <p className="card-text small">{reward.discount}</p>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-primary">
                            {reward.pointsRequired} points
                          </span>
                          
                          {reward.claimed ? (
                            <button className="btn btn-outline-success btn-sm" disabled>
                              Claimed ✓
                            </button>
                          ) : points >= reward.pointsRequired ? (
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => claimReward(reward)}
                            >
                              Claim Now
                            </button>
                          ) : (
                            <button className="btn btn-outline-secondary btn-sm" disabled>
                              Need {reward.pointsRequired - points} more
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ways to Earn More */}
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="fw-bold mb-3">💡 Ways to Earn More Points</h6>
                <div className="row small">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-1">🔍 Analyze products: <strong>10 points</strong></li>
                      <li className="mb-1">📍 Tag new locations: <strong>25 points</strong></li>
                      <li className="mb-1">💬 Use AI assistant: <strong>5 points</strong></li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-1">🛒 Visit marketplace: <strong>15 points</strong></li>
                      <li className="mb-1">📚 Complete training: <strong>50 points</strong></li>
                      <li className="mb-1">🌱 Daily login: <strong>5 points</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Points History */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">📈 Recent Activity</h5>
            </div>
            <div className="card-body">
              {history.length === 0 ? (
                <div className="text-center py-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>📊</div>
                  <p className="text-muted">No activity yet</p>
                  <small>Start using EcoAware to earn points!</small>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {history.slice(0, 10).map((item) => (
                    <div key={item.id} className="list-group-item border-0 px-0">
                      <div className="d-flex align-items-center">
                        <span className="me-2" style={{ fontSize: '1.2rem' }}>
                          {getActivityIcon(item.activity)}
                        </span>
                        <div className="flex-grow-1">
                          <div className="small fw-bold">
                            +{item.points} points
                          </div>
                          <div className="small text-muted">
                            {item.description}
                          </div>
                          <div className="small text-muted">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-4">
                <h6 className="fw-bold mb-2">⚡ Quick Actions</h6>
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={async () => {
                      try {
                        await axios.post('/api/points/earn', {
                          userId: user.id,
                          points: 5,
                          activity: 'daily_login',
                          description: 'Daily login bonus'
                        });
                        setPoints(points + 5);
                        alert('Daily bonus claimed: +5 points!');
                      } catch (error) {
                        console.error('Error claiming bonus:', error);
                      }
                    }}
                  >
                    🎁 Claim Daily Bonus
                  </button>
                  <button 
                    className="btn btn-outline-success btn-sm"
                    onClick={() => window.location.href = '/analysis'}
                  >
                    🔍 Analyze Product (+10)
                  </button>
                  <button 
                    className="btn btn-outline-info btn-sm"
                    onClick={() => window.location.href = '/assistant'}
                  >
                    💬 Ask AI Assistant (+5)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsRewards;