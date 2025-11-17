import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TrainingModules = ({ user }) => {
  const { t, i18n } = useTranslation();
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState({});
  const [showARDemo, setShowARDemo] = useState(false);

  useEffect(() => {
    loadTrainingModules();
    loadProgress();
  }, [i18n.language]);

  const loadTrainingModules = () => {
    const trainingData = i18n.language === 'hi' ? hindiModules : englishModules;
    setModules(trainingData);
  };

  const loadProgress = () => {
    // Load from localStorage or API
    const saved = localStorage.getItem(`training_progress_${user.id}`);
    if (saved) {
      setProgress(JSON.parse(saved));
    } else {
      setProgress({
        1: { completed: true, score: 95 },
        2: { completed: true, score: 88 },
        3: { completed: true, score: 92 },
        4: { completed: false, currentStep: 2 },
        5: { completed: false, currentStep: 0 }
      });
    }
  };

  const englishModules = [
    {
      id: 1,
      title: "Basic Safety Protocols",
      description: "Essential safety measures for waste management workers",
      duration: "30 minutes",
      difficulty: "Beginner",
      icon: "🦺",
      steps: [
        {
          title: "Personal Protective Equipment (PPE)",
          content: "Always wear appropriate PPE including gloves, safety glasses, masks, and protective clothing when handling waste materials.",
          image: "👥",
          quiz: {
            question: "Which PPE is most important when handling unknown waste?",
            options: ["Gloves only", "Full protective gear", "Just a mask", "Safety glasses"],
            correct: 1
          }
        },
        {
          title: "Hand Hygiene",
          content: "Wash hands thoroughly with soap and water for at least 20 seconds after handling waste. Use hand sanitizer if soap is unavailable.",
          image: "🧼",
          quiz: {
            question: "How long should you wash your hands after waste handling?",
            options: ["10 seconds", "15 seconds", "20+ seconds", "5 seconds"],
            correct: 2
          }
        },
        {
          title: "Emergency Procedures",
          content: "Know the location of emergency exits, first aid kits, eyewash stations, and emergency contact numbers.",
          image: "🚨",
          quiz: {
            question: "What should you do first if chemicals splash on your skin?",
            options: ["Call supervisor", "Rinse with water immediately", "Remove clothing", "Take a photo"],
            correct: 1
          }
        }
      ]
    },
    {
      id: 2,
      title: "Waste Classification & Sorting",
      description: "Learn to identify and properly sort different types of waste",
      duration: "45 minutes", 
      difficulty: "Beginner",
      icon: "♻️",
      steps: [
        {
          title: "Recyclable Materials",
          content: "Paper, cardboard, plastic bottles, glass containers, and metal cans can be recycled. Check local guidelines for specific types.",
          image: "📦",
          quiz: {
            question: "Which material is NOT typically recyclable in standard programs?",
            options: ["Glass bottles", "Pizza boxes with grease", "Aluminum cans", "Newspapers"],
            correct: 1
          }
        },
        {
          title: "Organic Waste",
          content: "Food scraps, garden waste, and biodegradable materials. These should be composted or sent to organic processing facilities.",
          image: "🌱",
          quiz: {
            question: "What happens to properly composted organic waste?",
            options: ["It becomes toxic", "It creates methane", "It becomes nutrient-rich soil", "It needs incineration"],
            correct: 2
          }
        },
        {
          title: "Hazardous Materials",
          content: "Batteries, chemicals, paint, electronics, and medical waste require special handling and disposal methods.",
          image: "⚠️",
          quiz: {
            question: "Why do batteries need special disposal?",
            options: ["They're expensive", "They contain toxic metals", "They're too small", "They're flammable"],
            correct: 1
          }
        }
      ]
    },
    {
      id: 3,
      title: "Hazardous Waste Management",
      description: "Safe handling procedures for dangerous materials",
      duration: "60 minutes",
      difficulty: "Intermediate",
      icon: "⚠️",
      steps: [
        {
          title: "Identification of Hazardous Materials",
          content: "Learn to identify hazardous waste through labels, symbols, and material safety data sheets (MSDS).",
          image: "🔍",
          quiz: {
            question: "What symbol indicates corrosive materials?",
            options: ["Flame", "Skull and crossbones", "Liquid dropping on hand", "Exploding bomb"],
            correct: 2
          }
        },
        {
          title: "Containment Procedures",
          content: "Use appropriate containers, avoid mixing incompatible materials, and ensure proper sealing and labeling.",
          image: "📦",
          quiz: {
            question: "Why should you never mix different hazardous chemicals?",
            options: ["It's wasteful", "It may cause dangerous reactions", "It's illegal", "It's too expensive"],
            correct: 1
          }
        },
        {
          title: "Emergency Response",
          content: "Know how to respond to spills, exposures, and accidents involving hazardous materials.",
          image: "🆘",
          quiz: {
            question: "First step when discovering a chemical spill?",
            options: ["Clean it up", "Secure the area", "Take photos", "Call the media"],
            correct: 1
          }
        }
      ]
    },
    {
      id: 4,
      title: "Equipment Operation & Maintenance",
      description: "Proper use and care of waste management equipment",
      duration: "50 minutes",
      difficulty: "Intermediate",
      icon: "🔧",
      steps: [
        {
          title: "Collection Vehicle Safety",
          content: "Pre-trip inspections, loading procedures, and safe driving practices for waste collection vehicles.",
          image: "🚛",
          quiz: {
            question: "Before operating collection equipment, you should:",
            options: ["Just start working", "Check all safety systems", "Skip the manual", "Work alone"],
            correct: 1
          }
        },
        {
          title: "Sorting Equipment",
          content: "Operation of conveyors, compactors, and sorting machinery with emphasis on safety protocols.",
          image: "⚙️",
          quiz: {
            question: "What should you do if sorting equipment jams?",
            options: ["Force it to work", "Stop machine and follow lockout procedures", "Ignore it", "Speed up"],
            correct: 1
          }
        },
        {
          title: "Maintenance Schedules",
          content: "Daily, weekly, and monthly maintenance tasks to keep equipment running safely and efficiently.",
          image: "📅",
          quiz: {
            question: "How often should you inspect safety equipment?",
            options: ["Monthly", "Daily before use", "Yearly", "When it breaks"],
            correct: 1
          }
        }
      ]
    },
    {
      id: 5,
      title: "Emergency Procedures & First Aid",
      description: "Response procedures for workplace emergencies",
      duration: "40 minutes",
      difficulty: "Advanced",
      icon: "🚑",
      steps: [
        {
          title: "Medical Emergency Response",
          content: "Basic first aid, CPR basics, and when to call for professional medical help.",
          image: "🏥",
          quiz: {
            question: "In case of serious injury, your first action should be:",
            options: ["Move the person", "Call emergency services", "Give them water", "Take photos"],
            correct: 1
          }
        },
        {
          title: "Fire Safety",
          content: "Fire prevention, proper use of fire extinguishers, and evacuation procedures.",
          image: "🔥",
          quiz: {
            question: "What does PASS stand for in fire extinguisher use?",
            options: ["Pull, Aim, Squeeze, Sweep", "Push, Alert, Stop, Save", "Point, Activate, Spray, Switch", "Prepare, Attack, Secure, Stop"],
            correct: 0
          }
        },
        {
          title: "Evacuation Procedures",
          content: "Emergency exit routes, assembly points, and communication protocols during emergencies.",
          image: "🚪",
          quiz: {
            question: "During evacuation, you should:",
            options: ["Run quickly", "Use elevators", "Walk calmly to nearest exit", "Collect personal items first"],
            correct: 2
          }
        }
      ]
    }
  ];

  const hindiModules = [
    {
      id: 1,
      title: "बुनियादी सुरक्षा प्रोटोकॉल",
      description: "कचरा प्रबंधन कर्मचारियों के लिए आवश्यक सुरक्षा उपाय",
      duration: "30 मिनट",
      difficulty: "शुरुआती",
      icon: "🦺",
      steps: [
        {
          title: "व्यक्तिगत सुरक्षा उपकरण (PPE)",
          content: "कचरे की सामग्री को संभालते समय हमेशा उपयुक्त PPE पहनें जिसमें दस्ताने, सुरक्षा चश्मे, मास्क और सुरक्षात्मक कपड़े शामिल हैं।",
          image: "👥",
          quiz: {
            question: "अज्ञात कचरे को संभालते समय कौन सा PPE सबसे महत्वपूर्ण है?",
            options: ["केवल दस्ताने", "पूर्ण सुरक्षात्मक गियर", "केवल मास्क", "सुरक्षा चश्मे"],
            correct: 1
          }
        },
        {
          title: "हाथों की स्वच्छता",
          content: "कचरे को संभालने के बाद कम से कम 20 सेकंड तक साबुन और पानी से हाथों को अच्छी तरह धोएं।",
          image: "🧼",
          quiz: {
            question: "कचरे को संभालने के बाद आपको कितनी देर तक हाथ धोने चाहिए?",
            options: ["10 सेकंड", "15 सेकंड", "20+ सेकंड", "5 सेकंड"],
            correct: 2
          }
        },
        {
          title: "आपातकालीन प्रक्रियाएं",
          content: "आपातकालीन निकास, प्राथमिक चिकित्सा किट, आंखों को धोने के स्टेशन और आपातकालीन संपर्क नंबरों का स्थान जानें।",
          image: "🚨",
          quiz: {
            question: "यदि रसायन आपकी त्वचा पर छींटे पड़ें तो सबसे पहले क्या करना चाहिए?",
            options: ["पर्यवेक्षक को कॉल करें", "तुरंत पानी से धोएं", "कपड़े उतारें", "फोटो लें"],
            correct: 1
          }
        }
      ]
    }
    // More Hindi modules would follow the same pattern...
  ];

  const completeStep = () => {
    if (selectedModule && currentStep < selectedModule.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (selectedModule) {
      // Complete module
      const newProgress = {
        ...progress,
        [selectedModule.id]: { completed: true, score: 90 + Math.floor(Math.random() * 10) }
      };
      setProgress(newProgress);
      localStorage.setItem(`training_progress_${user.id}`, JSON.stringify(newProgress));
      setSelectedModule(null);
      setCurrentStep(0);
      alert('Module completed successfully!');
    }
  };

  const startModule = (module) => {
    setSelectedModule(module);
    setCurrentStep(progress[module.id]?.currentStep || 0);
  };

  const getModuleStatus = (moduleId) => {
    const moduleProgress = progress[moduleId];
    if (moduleProgress?.completed) return 'completed';
    if (moduleProgress?.currentStep > 0) return 'in-progress';
    return 'not-started';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      default: return '⏳';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  // Calculate overall progress
  const completedModules = Object.values(progress).filter(p => p.completed).length;
  const overallProgress = Math.round((completedModules / modules.length) * 100);

  if (selectedModule) {
    const currentStepData = selectedModule.steps[currentStep];
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Module Header */}
            <div className="card bg-primary text-white mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="card-title">
                      <span className="me-2">{selectedModule.icon}</span>
                      {selectedModule.title}
                    </h4>
                    <p className="card-text mb-0">
                      Step {currentStep + 1} of {selectedModule.steps.length}
                    </p>
                  </div>
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => setSelectedModule(null)}
                  >
                    ← Back to Modules
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>{currentStepData.title}</strong>
                  <small className="text-muted">
                    {Math.round(((currentStep + 1) / selectedModule.steps.length) * 100)}% Complete
                  </small>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${((currentStep + 1) / selectedModule.steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="text-center mb-4">
                  <div style={{ fontSize: '4rem' }}>
                    {currentStepData.image}
                  </div>
                </div>
                
                <h5 className="mb-3">{currentStepData.title}</h5>
                <p className="lead">{currentStepData.content}</p>

                {/* Quiz */}
                {currentStepData.quiz && (
                  <div className="mt-4 p-4 bg-light rounded">
                    <h6 className="fw-bold mb-3">📝 Knowledge Check</h6>
                    <p className="fw-bold">{currentStepData.quiz.question}</p>
                    <div className="list-group">
                      {currentStepData.quiz.options.map((option, index) => (
                        <button
                          key={index}
                          className="list-group-item list-group-item-action text-start"
                          onClick={() => {
                            if (index === currentStepData.quiz.correct) {
                              alert('Correct! Well done.');
                              completeStep();
                            } else {
                              alert('Not quite right. Please review the material and try again.');
                            }
                          }}
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="text-center mt-4">
                  {!currentStepData.quiz ? (
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={completeStep}
                    >
                      {currentStep < selectedModule.steps.length - 1 ? 'Next Step →' : 'Complete Module ✓'}
                    </button>
                  ) : (
                    <p className="text-muted">Complete the knowledge check above to proceed</p>
                  )}
                </div>
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
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h2 className="card-title">
                <span className="me-2">📚</span>
                {t('trainingModules')}
              </h2>
              <p className="card-text mb-0">
                Comprehensive training program for waste management professionals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Your Training Progress</h5>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Overall Completion</span>
                <span className="fw-bold">{overallProgress}%</span>
              </div>
              <div className="progress mb-2">
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
              <small className="text-muted">
                {completedModules} of {modules.length} modules completed
              </small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-info">
            <div className="card-body text-center">
              <h5 className="card-title text-info">🎯 AR Training</h5>
              <p className="card-text small">
                Experience immersive 3D training demonstrations
              </p>
              <button
                className="btn btn-info btn-sm"
                onClick={() => setShowARDemo(true)}
              >
                View AR Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Training Modules Grid */}
      <div className="row">
        {modules.map((module) => {
          const status = getModuleStatus(module.id);
          const moduleProgress = progress[module.id];
          
          return (
            <div key={module.id} className="col-lg-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <span className="me-3" style={{ fontSize: '2rem' }}>
                        {module.icon}
                      </span>
                      <div>
                        <h5 className="card-title mb-1">{module.title}</h5>
                        <small className="text-muted">{module.duration}</small>
                      </div>
                    </div>
                    <span className={`badge bg-${getStatusColor(status)}`}>
                      {getStatusIcon(status)} {status.replace('-', ' ')}
                    </span>
                  </div>

                  <p className="card-text">{module.description}</p>

                  <div className="mb-3">
                    <span className={`badge bg-${getDifficultyColor(module.difficulty)} me-2`}>
                      {module.difficulty}
                    </span>
                    <span className="badge bg-light text-dark">
                      {module.steps.length} Steps
                    </span>
                  </div>

                  {/* Progress for in-progress modules */}
                  {status === 'in-progress' && moduleProgress && (
                    <div className="mb-3">
                      <div className="progress">
                        <div
                          className="progress-bar bg-warning"
                          style={{ width: `${(moduleProgress.currentStep / module.steps.length) * 100}%` }}
                        ></div>
                      </div>
                      <small className="text-muted">
                        Step {moduleProgress.currentStep} of {module.steps.length}
                      </small>
                    </div>
                  )}

                  {/* Score for completed modules */}
                  {status === 'completed' && moduleProgress && (
                    <div className="mb-3">
                      <div className="d-flex align-items-center">
                        <span className="text-success me-2">Score:</span>
                        <span className="fw-bold">{moduleProgress.score}%</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-footer bg-transparent">
                  <button
                    className={`btn ${status === 'completed' ? 'btn-outline-success' : 'btn-primary'} w-100`}
                    onClick={() => startModule(module)}
                  >
                    {status === 'completed' ? 'Review Module' : 
                     status === 'in-progress' ? 'Continue Training' : 'Start Training'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AR Demo Modal */}
      {showARDemo && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">🥽 AR Training Demonstration</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowARDemo(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <div style={{ fontSize: '4rem' }}>🥽</div>
                  <h4>Augmented Reality Training</h4>
                  <p className="text-muted">
                    Experience immersive 3D demonstrations of proper waste handling techniques
                  </p>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <h6>Available AR Modules:</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item border-0 px-0">
                        🦺 PPE Equipment Demo
                      </li>
                      <li className="list-group-item border-0 px-0">
                        ♻️ Waste Sorting Techniques
                      </li>
                      <li className="list-group-item border-0 px-0">
                        ⚠️ Hazardous Material Handling
                      </li>
                      <li className="list-group-item border-0 px-0">
                        🚛 Equipment Operation
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>How to Access:</h6>
                    <ol className="small">
                      <li>Use a smartphone or AR-capable device</li>
                      <li>Open the camera app</li>
                      <li>Point at the QR code or marker</li>
                      <li>Follow the 3D demonstrations</li>
                    </ol>
                    
                    <div className="border rounded p-3 text-center bg-light mt-3">
                      <div style={{ fontSize: '3rem' }}>📱</div>
                      <p className="mb-0 small">
                        <strong>Sample 3D Model:</strong><br />
                        <a 
                          href="https://modelviewer.dev/examples/#augmentedreality"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-primary"
                        >
                          View AR Demo
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowARDemo(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    window.open('https://developers.google.com/ar/develop/scene-viewer', '_blank');
                  }}
                >
                  Learn More About AR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingModules;