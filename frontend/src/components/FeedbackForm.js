import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const FeedbackForm = ({ user }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    location: '',
    issueType: '',
    description: '',
    severity: 'medium',
    anonymous: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const issueTypes = [
    { value: 'improper_segregation', label: 'Improper Waste Segregation' },
    { value: 'illegal_dumping', label: 'Illegal Dumping' },
    { value: 'overflowing_bins', label: 'Overflowing Bins' },
    { value: 'hazardous_handling', label: 'Improper Hazardous Waste Handling' },
    { value: 'littering', label: 'Littering' },
    { value: 'equipment_issue', label: 'Equipment Problems' },
    { value: 'safety_concern', label: 'Safety Concern' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post('/api/feedback', {
        ...formData,
        workerId: user.id
      });

      if (response.data.success) {
        setSubmitted(true);
        setFormData({
          location: '',
          issueType: '',
          description: '',
          severity: 'medium',
          anonymous: false
        });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  if (submitted) {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-success">
              <div className="card-body text-center">
                <div style={{ fontSize: '4rem' }}>✅</div>
                <h4 className="text-success">Feedback Submitted Successfully!</h4>
                <p className="text-muted">
                  Thank you for your report. The management team will review your feedback
                  and take appropriate action.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setSubmitted(false)}
                >
                  Submit Another Report
                </button>
              </div>
            </div>
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
              <h2 className="card-title">📝 {t('submitFeedback')}</h2>
              <p className="card-text mb-0">
                Report issues with waste segregation and citizen compliance
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Submit Incident Report</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Location */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    📍 Location *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Street address, landmark, or area description"
                    required
                  />
                  <div className="form-text">
                    Provide specific location details to help identify the issue area
                  </div>
                </div>

                {/* Issue Type */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    🏷️ Issue Type *
                  </label>
                  <select
                    className="form-select"
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select issue type...</option>
                    {issueTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Severity */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    ⚠️ Severity Level
                  </label>
                  <div className="row">
                    {[
                      { value: 'low', label: 'Low', color: 'success', icon: '🟢' },
                      { value: 'medium', label: 'Medium', color: 'warning', icon: '🟡' },
                      { value: 'high', label: 'High', color: 'danger', icon: '🔴' }
                    ].map((severity) => (
                      <div key={severity.value} className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="severity"
                            value={severity.value}
                            id={severity.value}
                            checked={formData.severity === severity.value}
                            onChange={handleChange}
                          />
                          <label className={`form-check-label text-${severity.color}`} htmlFor={severity.value}>
                            {severity.icon} {severity.label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    📄 Detailed Description *
                  </label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide detailed description of the issue, including what you observed, when it occurred, and any relevant circumstances..."
                    required
                  ></textarea>
                  <div className="form-text">
                    Be as specific as possible to help management understand and address the issue
                  </div>
                </div>

                {/* Anonymous Option */}
                <div className="mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="anonymous"
                      id="anonymous"
                      checked={formData.anonymous}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="anonymous">
                      🔒 Submit anonymously (your identity will not be recorded)
                    </label>
                  </div>
                </div>

                {/* Guidelines */}
                <div className="alert alert-info">
                  <h6 className="alert-heading">📋 Reporting Guidelines</h6>
                  <ul className="mb-0 small">
                    <li>Be objective and factual in your description</li>
                    <li>Include specific times, locations, and circumstances</li>
                    <li>Focus on observable behaviors and conditions</li>
                    <li>Avoid personal opinions or judgments</li>
                    <li>Report safety hazards immediately to supervisors</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-warning btn-lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        📤 Submit Report
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Emergency Contact Info */}
          <div className="card mt-4 border-danger">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">🚨 Emergency Situations</h5>
            </div>
            <div className="card-body">
              <p className="text-danger fw-bold mb-2">
                For immediate safety hazards or emergencies, do not use this form!
              </p>
              <div className="row">
                <div className="col-md-6">
                  <h6>Emergency Contacts:</h6>
                  <ul className="list-unstyled">
                    <li>🚨 Emergency Services: <strong>108</strong></li>
                    <li>☎️ Supervisor: <strong>+91-XXXX-XXXX</strong></li>
                    <li>⚠️ Hazmat Team: <strong>+91-XXXX-YYYY</strong></li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Immediate Actions:</h6>
                  <ul className="list-unstyled small">
                    <li>• Secure the area if safe to do so</li>
                    <li>• Evacuate if necessary</li>
                    <li>• Call emergency services</li>
                    <li>• Notify your supervisor</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;