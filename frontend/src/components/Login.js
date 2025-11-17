import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    mode: 'citizen'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleModeSelect = (mode) => {
    setFormData({ ...formData, mode });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', formData);
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Quick login for demo
  const quickLogin = (mode, username) => {
    const userData = {
      id: username,
      username: username,
      mode: mode,
      token: 'mock-jwt-token'
    };
    onLogin(userData);
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="text-success fw-bold">🌱 EcoAware</h2>
                  <p className="text-muted">{t('welcome')}</p>
                  
                  {/* Language Switcher */}
                  <div className="btn-group mb-3" role="group">
                    <button 
                      type="button" 
                      className={`btn ${i18n.language === 'en' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                      onClick={() => changeLanguage('en')}
                    >
                      English
                    </button>
                    <button 
                      type="button" 
                      className={`btn ${i18n.language === 'hi' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                      onClick={() => changeLanguage('hi')}
                    >
                      हिंदी
                    </button>
                  </div>
                </div>

                {/* Mode Selection */}
                <div className="mb-4">
                  <h5 className="text-center mb-3">{t('selectMode')}</h5>
                  <div className="row">
                    <div className="col-6">
                      <div 
                        className={`card text-center p-3 cursor-pointer ${
                          formData.mode === 'citizen' ? 'bg-primary text-white' : 'bg-light'
                        }`}
                        onClick={() => handleModeSelect('citizen')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body p-2">
                          <h5>🏠</h5>
                          <small>{t('citizen')}</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div 
                        className={`card text-center p-3 cursor-pointer ${
                          formData.mode === 'worker' ? 'bg-primary text-white' : 'bg-light'
                        }`}
                        onClick={() => handleModeSelect('worker')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body p-2">
                          <h5>👷</h5>
                          <small>{t('worker')}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      placeholder={t('username')}
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder={t('password')}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {error && (
                    <div className="alert alert-danger">{error}</div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-success w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? t('loading') : t('login')}
                  </button>
                </form>

                {/* Demo Login Buttons */}
                <div className="border-top pt-3">
                  <small className="text-muted d-block text-center mb-2">Demo Accounts:</small>
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => quickLogin('citizen', 'citizen1')}
                    >
                      Demo {t('citizen')} (citizen1)
                    </button>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => quickLogin('worker', 'worker1')}
                    >
                      Demo {t('worker')} (worker1)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;