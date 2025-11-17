import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const MandatoryTraining = ({ user }) => {
  const { t, i18n } = useTranslation();
  const [trainingModules, setTrainingModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState({});
  const [certification, setCertification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainingData();
    loadProgress();
    checkCertification();
  }, []);

  const loadTrainingData = () => {
    const modules = [
      {
        id: 1,
        title: "Waste Segregation at Source",
        description: "Learn proper waste segregation techniques for dry, wet, and hazardous waste",
        mandatory: true,
        duration: "30 minutes",
        icon: "🗂️",
        steps: [
          {
            title: "Understanding Waste Types",
            content: "India generates 1.7 lakh tonnes of waste daily. Only 54% is scientifically treated. Learn to categorize waste into: Dry (recyclable), Wet (organic), and Domestic Hazardous waste.",
            video: "waste_types_demo.mp4",
            quiz: {
              question: "Which waste type should food scraps be categorized as?",
              options: ["Dry waste", "Wet waste", "Hazardous waste", "Mixed waste"],
              correct: 1
            }
          },
          {
            title: "Three Dustbin System",
            content: "Every household must have 3 color-coded dustbins: Green (Wet/Organic), Blue (Dry/Recyclable), Red (Domestic Hazardous).",
            video: "dustbin_system.mp4",
            quiz: {
              question: "What color dustbin should be used for plastic bottles?",
              options: ["Green", "Blue", "Red", "Any color"],
              correct: 1
            }
          },
          {
            title: "Source Segregation Rules",
            content: "No wet waste should be mixed with dry waste. Improper segregation leads to contamination and affects recycling efficiency.",
            video: "segregation_rules.mp4",
            quiz: {
              question: "What happens when wet and dry waste are mixed?",
              options: ["Nothing", "Better recycling", "Contamination occurs", "Easier processing"],
              correct: 2
            }
          }
        ]
      },
      {
        id: 2,
        title: "Home Composting Techniques",
        description: "Master the art of converting organic waste into nutrient-rich compost",
        mandatory: true,
        duration: "45 minutes",
        icon: "🌱",
        steps: [
          {
            title: "Compost Kit Components",
            content: "Your government-provided compost kit contains: composting bin, brown material (dried leaves), activator powder, and instruction manual.",
            video: "compost_kit_intro.mp4",
            quiz: {
              question: "What is the main purpose of brown material in composting?",
              options: ["Add smell", "Balance carbon-nitrogen ratio", "Make it heavy", "Change color"],
              correct: 1
            }
          },
          {
            title: "Compost Making Process",
            content: "Layer green waste (kitchen scraps) with brown material. Add activator. Turn weekly. Compost ready in 2-3 months.",
            video: "composting_process.mp4",
            quiz: {
              question: "How often should you turn the compost?",
              options: ["Daily", "Weekly", "Monthly", "Never"],
              correct: 1
            }
          }
        ]
      },
      {
        id: 3,
        title: "Plastic Reuse and Recycling",
        description: "Learn creative ways to reuse plastic items and proper recycling methods",
        mandatory: true,
        duration: "25 minutes",
        icon: "♻️",
        steps: [
          {
            title: "Plastic Types and Recycling Codes",
            content: "Understand plastic recycling codes 1-7. PET (1) and HDPE (2) are most recyclable. Avoid PVC (3) when possible.",
            video: "plastic_codes.mp4",
            quiz: {
              question: "Which plastic code is most commonly recyclable?",
              options: ["PET (1)", "PVC (3)", "PS (6)", "OTHER (7)"],
              correct: 0
            }
          },
          {
            title: "Creative Reuse Ideas",
            content: "Transform plastic containers into planters, organizers, or storage solutions before recycling.",
            video: "plastic_reuse.mp4",
            quiz: {
              question: "What should you do before recycling plastic containers?",
              options: ["Break them", "Clean them", "Paint them", "Nothing"],
              correct: 1
            }
          }
        ]
      },
      {
        id: 4,
        title: "Hazardous Waste Management",
        description: "Safe handling and disposal of domestic hazardous materials",
        mandatory: true,
        duration: "35 minutes",
        icon: "⚠️",
        steps: [
          {
            title: "Identifying Hazardous Waste",
            content: "Batteries, CFL bulbs, paint cans, pesticides, medicines, and electronic waste require special handling.",
            video: "hazardous_identification.mp4",
            quiz: {
              question: "Which of these is NOT hazardous waste?",
              options: ["Old batteries", "Expired medicines", "Newspaper", "Paint cans"],
              correct: 2
            }
          },
          {
            title: "Safe Storage and Disposal",
            content: "Store hazardous waste separately in red bins. Never mix with regular waste. Use authorized collection centers.",
            video: "hazardous_disposal.mp4",
            quiz: {
              question: "Where should you dispose of old batteries?",
              options: ["Regular dustbin", "Authorized collection center", "Throw anywhere", "Burn them"],
              correct: 1
            }
          }
        ]
      }
    ];
    setTrainingModules(modules);
    setLoading(false);
  };

  const loadProgress = () => {
    const saved = localStorage.getItem(`citizen_training_${user.id}`);
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  };

  const checkCertification = async () => {
    try {
      const response = await axios.get(`/api/citizen/certification/${user.id}`);
      setCertification(response.data.certification);
    } catch (error) {
      console.error('Error checking certification:', error);
    }
  };

  const startModule = (module) => {
    setCurrentModule(module);
    setCurrentStep(0);
  };

  const completeStep = () => {
    if (currentStep < currentModule.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeModule();
    }
  };

  const completeModule = async () => {
    const newProgress = {
      ...progress,
      [currentModule.id]: {
        completed: true,
        completedAt: new Date(),
        score: 95 // Mock score
      }
    };
    
    setProgress(newProgress);
    localStorage.setItem(`citizen_training_${user.id}`, JSON.stringify(newProgress));
    
    // Check if all mandatory modules are completed
    const mandatoryModules = trainingModules.filter(m => m.mandatory);
    const completedMandatory = mandatoryModules.filter(m => newProgress[m.id]?.completed);
    
    if (completedMandatory.length === mandatoryModules.length) {
      // Award certification
      try {
        await axios.post('/api/citizen/certification', {
          userId: user.id,
          type: 'waste_management_basic',
          completedAt: new Date()
        });
        setCertification({
          type: 'waste_management_basic',
          issuedAt: new Date(),
          certificateId: `WM-${user.id}-${Date.now()}`
        });
      } catch (error) {
        console.error('Error issuing certification:', error);
      }
    }
    
    setCurrentModule(null);
    setCurrentStep(0);
  };

  const getModuleStatus = (moduleId) => {
    return progress[moduleId]?.completed ? 'completed' : 'pending';
  };

  const getOverallProgress = () => {
    const completed = Object.keys(progress).filter(id => progress[id].completed).length;
    return Math.round((completed / trainingModules.length) * 100);
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  }

  if (currentModule) {
    const step = currentModule.steps[currentStep];
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Module Header */}
            <div className="card bg-primary text-white mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4>{currentModule.icon} {currentModule.title}</h4>
                    <p className="mb-0">Step {currentStep + 1} of {currentModule.steps.length}</p>
                  </div>
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => setCurrentModule(null)}
                  >
                    ← Back
                  </button>
                </div>
                <div className="progress mt-3" style={{ height: '5px' }}>
                  <div 
                    className="progress-bar bg-warning" 
                    style={{ width: `${((currentStep + 1) / currentModule.steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="card">
              <div className="card-body">
                <h5 className="mb-4">{step.title}</h5>
                <div className="row">
                  <div className="col-md-6">
                    <p className="lead">{step.content}</p>
                    
                    {/* Video Placeholder */}
                    <div className="border rounded p-4 text-center bg-light mb-4">
                      <div style={{ fontSize: '3rem' }}>🎥</div>
                      <p className="mb-2"><strong>Training Video</strong></p>
                      <p className="small text-muted">
                        Video: {step.video}<br/>
                        (In production: Embedded training video would play here)
                      </p>
                      <button className="btn btn-primary btn-sm">▶️ Play Video</button>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    {/* Quiz Section */}
                    <div className="border rounded p-4">
                      <h6 className="text-primary mb-3">📝 Knowledge Check</h6>
                      <p className="fw-bold">{step.quiz.question}</p>
                      <div className="d-grid gap-2">
                        {step.quiz.options.map((option, index) => (
                          <button
                            key={index}
                            className="btn btn-outline-primary text-start"
                            onClick={() => {
                              if (index === step.quiz.correct) {
                                alert('✅ Correct! Well done.');
                                completeStep();
                              } else {
                                alert('❌ Not correct. Please watch the video again and try again.');
                              }
                            }}
                          >
                            {String.fromCharCode(65 + index)}. {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
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
      <div className="card bg-danger text-white mb-4">
        <div className="card-body">
          <h2 className="card-title">🎓 Mandatory Citizen Training</h2>
          <p className="card-text mb-0">
            As per Government of India guidelines, all citizens must complete waste management training
          </p>
          {!certification && (
            <div className="alert alert-warning mt-3 mb-0">
              <strong>⚠️ Training Incomplete:</strong> You must complete all modules to receive your certification and access waste collection services.
            </div>
          )}
        </div>
      </div>

      {/* Certification Status */}
      {certification && (
        <div className="card border-success mb-4">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">🏆 Certification Achieved</h5>
          </div>
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h6>Waste Management Basic Certification</h6>
                <p className="mb-1">Certificate ID: <code>{certification.certificateId}</code></p>
                <small className="text-muted">
                  Issued on: {new Date(certification.issuedAt).toLocaleDateString()}
                </small>
              </div>
              <div className="col-md-4 text-center">
                <button className="btn btn-success">
                  📄 Download Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Overview */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Training Progress</h5>
            <span className="badge bg-primary">{getOverallProgress()}% Complete</span>
          </div>
          <div className="progress mb-2">
            <div 
              className="progress-bar" 
              style={{ width: `${getOverallProgress()}%` }}
            ></div>
          </div>
          <small className="text-muted">
            {Object.keys(progress).filter(id => progress[id].completed).length} of {trainingModules.length} modules completed
          </small>
        </div>
      </div>

      {/* Training Modules */}
      <div className="row">
        {trainingModules.map((module) => {
          const status = getModuleStatus(module.id);
          const isCompleted = status === 'completed';
          
          return (
            <div key={module.id} className="col-md-6 mb-4">
              <div className={`card h-100 ${module.mandatory ? 'border-danger' : 'border-secondary'}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <span className="me-3" style={{ fontSize: '2rem' }}>{module.icon}</span>
                      <div>
                        <h6 className="card-title mb-1">{module.title}</h6>
                        <small className="text-muted">{module.duration}</small>
                      </div>
                    </div>
                    <div>
                      {module.mandatory && (
                        <span className="badge bg-danger mb-2">MANDATORY</span>
                      )}
                      <br/>
                      <span className={`badge ${isCompleted ? 'bg-success' : 'bg-warning'}`}>
                        {isCompleted ? '✅ Completed' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>

                  <p className="card-text small">{module.description}</p>

                  {isCompleted && progress[module.id] && (
                    <div className="mb-3">
                      <small className="text-success">
                        ✅ Completed on {new Date(progress[module.id].completedAt).toLocaleDateString()}
                      </small>
                    </div>
                  )}
                </div>
                
                <div className="card-footer">
                  <button
                    className={`btn w-100 ${isCompleted ? 'btn-outline-success' : 'btn-primary'}`}
                    onClick={() => startModule(module)}
                  >
                    {isCompleted ? 'Review Module' : 'Start Training'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Training Materials Request */}
      <div className="card mt-4">
        <div className="card-header">
          <h5 className="mb-0">📦 Request Training Materials</h5>
        </div>
        <div className="card-body">
          <p>As part of the mandatory training program, you are entitled to receive:</p>
          <div className="row">
            <div className="col-md-4">
              <div className="text-center p-3 border rounded">
                <div style={{ fontSize: '2rem' }}>🗑️</div>
                <h6>3-Dustbin Set</h6>
                <p className="small">Color-coded bins for proper segregation</p>
                <button className="btn btn-outline-primary btn-sm">Request Bins</button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-3 border rounded">
                <div style={{ fontSize: '2rem' }}>🌱</div>
                <h6>Compost Kit</h6>
                <p className="small">Complete home composting solution</p>
                <button className="btn btn-outline-primary btn-sm">Request Kit</button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-3 border rounded">
                <div style={{ fontSize: '2rem' }}>📚</div>
                <h6>Training Manual</h6>
                <p className="small">Physical copy of training materials</p>
                <button className="btn btn-outline-primary btn-sm">Request Manual</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandatoryTraining;