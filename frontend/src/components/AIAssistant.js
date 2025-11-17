import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const AIAssistant = ({ user }) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: i18n.language === 'hi' 
        ? 'नमस्ते! मैं आपका इको-फ्रेंडली असिस्टेंट हूं। मैं आपकी कैसे मदद कर सकता हूं?'
        : 'Hello! I\'m your eco-friendly assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_AI_API_URL || 'http://localhost:5001'}/ai/chat`,
        {
          message: inputMessage,
          language: i18n.language,
          userId: user.id
        }
      );

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: i18n.language === 'hi' 
          ? 'क्षमा करें, मुझे कोई समस्या हुई है। कृपया फिर से कोशिश करें।'
          : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = i18n.language === 'hi' ? [
    'मैं प्लास्टिक कैसे कम कर सकता हूं?',
    'घरेलू कंपोस्ट कैसे बनाएं?',
    'सबसे अच्छे इको-फ्रेंडली उत्पाद कौन से हैं?',
    'कैसे पता करें कि कुछ रीसाइकल हो सकता है?'
  ] : [
    'How can I reduce plastic usage?',
    'How to start composting at home?',
    'What are the best eco-friendly products?',
    'How do I know if something is recyclable?'
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm" style={{ height: '600px' }}>
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <span className="me-2">🤖</span>
                {t('aiAssistant')}
              </h5>
              <small>Ask me anything about sustainability and eco-friendly living!</small>
            </div>

            {/* Messages Area */}
            <div 
              className="card-body d-flex flex-column" 
              style={{ height: '450px', overflowY: 'auto' }}
            >
              <div className="flex-grow-1">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-3 d-flex ${
                      message.type === 'user' ? 'justify-content-end' : 'justify-content-start'
                    }`}
                  >
                    <div
                      className={`rounded px-3 py-2 ${
                        message.type === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-light border'
                      }`}
                      style={{ maxWidth: '80%' }}
                    >
                      {message.type === 'ai' && (
                        <div className="mb-1">
                          <small className="text-success fw-bold">
                            🤖 EcoBot
                          </small>
                        </div>
                      )}
                      <div>{message.content}</div>
                      <div className="text-end mt-1">
                        <small className={message.type === 'user' ? 'text-white-50' : 'text-muted'}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="mb-3 d-flex justify-content-start">
                    <div className="bg-light border rounded px-3 py-2">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Questions */}
            <div className="card-footer bg-light">
              <div className="mb-2">
                <small className="text-muted fw-bold">Quick Questions:</small>
              </div>
              <div className="d-flex flex-wrap gap-1 mb-3">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handleQuickQuestion(question)}
                    style={{ fontSize: '0.75rem' }}
                  >
                    {question}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="input-group">
                <textarea
                  className="form-control"
                  placeholder={i18n.language === 'hi' 
                    ? 'अपना सवाल यहाँ टाइप करें...'
                    : 'Type your question here...'
                  }
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows="1"
                  style={{ resize: 'none' }}
                  disabled={isTyping}
                />
                <button
                  className="btn btn-success"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                >
                  {isTyping ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <>📤</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Help Tips */}
          <div className="card mt-3">
            <div className="card-body">
              <h6 className="card-title">💡 I can help you with:</h6>
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled small">
                    <li>♻️ Recycling guidelines</li>
                    <li>🌱 Composting tips</li>
                    <li>🛒 Sustainable product recommendations</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled small">
                    <li>💡 Energy saving tips</li>
                    <li>🚗 Eco-friendly transportation</li>
                    <li>🏠 Green living practices</li>
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

export default AIAssistant;