import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const WasteSegregation = ({ user }) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [manualOverride, setManualOverride] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      setResult(null);
      setManualOverride(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('workerId', user.id);

    try {
      const response = await axios.post('/api/upload/waste-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleManualOverride = (isCorrect) => {
    setManualOverride(isCorrect);
    // In a real app, you would send this feedback to the backend
    console.log(`Manual override: ${isCorrect ? 'Correct' : 'Incorrect'} segregation`);
  };

  const getResultColor = (isCorrect) => {
    return isCorrect ? 'success' : 'danger';
  };

  const getWasteTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'plastic': return '🧴';
      case 'organic': return '🥬';
      case 'paper': return '📄';
      case 'glass': return '🫙';
      case 'metal': return '🥫';
      case 'hazardous': return '⚠️';
      default: return '🗑️';
    }
  };

  const getWasteTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'plastic': return 'info';
      case 'organic': return 'success';
      case 'paper': return 'warning';
      case 'glass': return 'primary';
      case 'metal': return 'secondary';
      case 'hazardous': return 'danger';
      default: return 'dark';
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="card bg-primary text-white mb-4">
            <div className="card-body">
              <h2 className="card-title">
                <span className="me-2">♻️</span>
                {t('wasteSegregation')}
              </h2>
              <p className="card-text mb-0">
                Verify proper waste sorting using AI-powered image analysis
              </p>
            </div>
          </div>

          {/* Upload Section */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Upload Waste Photo for Analysis</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Select Waste Photo</label>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={analyzing}
                      />
                      <button
                        className="btn btn-success"
                        onClick={handleAnalyze}
                        disabled={!selectedFile || analyzing}
                      >
                        {analyzing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <span className="me-1">🔍</span>
                            Analyze Segregation
                          </>
                        )}
                      </button>
                    </div>
                    <div className="form-text">
                      Supported formats: JPG, PNG (max 5MB)
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  {preview && (
                    <div className="text-center">
                      <img
                        src={preview}
                        alt="Preview"
                        className="img-fluid rounded border"
                        style={{ maxHeight: '150px' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Guidelines */}
              <div className="bg-light rounded p-3">
                <h6 className="fw-bold mb-2">📋 Quick Guidelines</h6>
                <div className="row small">
                  <div className="col-md-6">
                    <ul className="list-unstyled mb-0">
                      <li>🧴 <strong>Plastic:</strong> Bottles, containers, bags</li>
                      <li>🥬 <strong>Organic:</strong> Food scraps, garden waste</li>
                      <li>📄 <strong>Paper:</strong> Newspapers, cardboard, documents</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled mb-0">
                      <li>🫙 <strong>Glass:</strong> Bottles, jars, containers</li>
                      <li>🥫 <strong>Metal:</strong> Cans, foil, wire</li>
                      <li>⚠️ <strong>Hazardous:</strong> Batteries, chemicals, electronics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert alert-danger" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Analysis Results */}
          {result && (
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">Analysis Results</h5>
              </div>
              <div className="card-body">
                {/* Hazardous Alert */}
                {result.alert && (
                  <div className="alert alert-danger alert-dismissible mb-4" role="alert">
                    <h5 className="alert-heading">
                      ⚠️ HAZARDOUS WASTE DETECTED
                    </h5>
                    <p className="mb-2">
                      <strong>Immediate Action Required:</strong>
                    </p>
                    <ul className="mb-2">
                      <li>Do not handle directly with bare hands</li>
                      <li>Use protective equipment (gloves, mask)</li>
                      <li>Isolate the waste material</li>
                      <li>Contact hazardous waste disposal team</li>
                      <li>Report to supervisor immediately</li>
                    </ul>
                    <hr />
                    <p className="mb-0">
                      <strong>Emergency Contact:</strong> +91-XXX-XXXX-XXXX
                    </p>
                  </div>
                )}

                {/* Segregation Status */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className={`card border-${getResultColor(result.segregatedCorrectly)} bg-light`}>
                      <div className="card-body text-center">
                        <div style={{ fontSize: '3rem' }}>
                          {result.segregatedCorrectly ? '✅' : '❌'}
                        </div>
                        <h5 className={`text-${getResultColor(result.segregatedCorrectly)}`}>
                          {result.segregatedCorrectly ? 'Correctly Segregated' : 'Incorrectly Segregated'}
                        </h5>
                        <p className="text-muted mb-0">
                          Confidence: {(result.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-info text-white">
                      <div className="card-body">
                        <h6 className="card-title">Analysis Details</h6>
                        <p className="card-text small">
                          <strong>Reason:</strong> {result.reason}
                        </p>
                        <p className="card-text small mb-0">
                          <strong>Method:</strong> {result.analysis_method || 'AI Analysis'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detected Waste Types */}
                {result.wasteTypes && result.wasteTypes.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Detected Waste Categories</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {result.wasteTypes.map((type, index) => (
                        <span 
                          key={index}
                          className={`badge bg-${getWasteTypeColor(type)} fs-6 p-2`}
                        >
                          {getWasteTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">
                      💡 Recommendations
                    </h6>
                    <ul className="list-group list-group-flush">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="list-group-item border-0 px-0">
                          <span className="me-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Manual Override Section */}
                <div className="border-top pt-4">
                  <h6 className="fw-bold mb-3">Worker Verification</h6>
                  <p className="text-muted small mb-3">
                    As a trained waste management worker, you can override the AI analysis if needed:
                  </p>
                  
                  <div className="d-flex gap-2 mb-3">
                    <button
                      className={`btn ${manualOverride === true ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => handleManualOverride(true)}
                    >
                      ✅ Mark as Correct
                    </button>
                    <button
                      className={`btn ${manualOverride === false ? 'btn-danger' : 'btn-outline-danger'}`}
                      onClick={() => handleManualOverride(false)}
                    >
                      ❌ Mark as Incorrect
                    </button>
                  </div>

                  {manualOverride !== null && (
                    <div className={`alert alert-${manualOverride ? 'success' : 'warning'}`}>
                      <strong>Manual Override Recorded:</strong> 
                      {manualOverride 
                        ? ' You confirmed the segregation is correct.' 
                        : ' You marked the segregation as incorrect.'
                      }
                      <br />
                      <small>This feedback helps improve our AI analysis accuracy.</small>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="text-center mt-4">
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                      setResult(null);
                      setError('');
                      setManualOverride(null);
                    }}
                  >
                    Analyze Another Photo
                  </button>
                  <button className="btn btn-outline-secondary">
                    Save to Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tips Section */}
          {!result && (
            <div className="card bg-light">
              <div className="card-body">
                <h6 className="fw-bold mb-3">📸 Photo Tips for Better Analysis</h6>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">✅ Take clear, well-lit photos</li>
                      <li className="mb-2">✅ Show the entire waste container/area</li>
                      <li className="mb-2">✅ Capture from multiple angles if needed</li>
                      <li className="mb-0">✅ Focus on waste materials, not background</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">❌ Avoid blurry or dark images</li>
                      <li className="mb-2">❌ Don't obscure waste with hands/objects</li>
                      <li className="mb-2">❌ Minimize shadows and glare</li>
                      <li className="mb-0">❌ Avoid photos with too much clutter</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WasteSegregation;