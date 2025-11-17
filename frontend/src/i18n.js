import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      "dashboard": "Dashboard",
      "logout": "Logout",
      "language": "Language",
      
      // Login
      "welcome": "Welcome to EcoAware",
      "selectMode": "Select Your Mode",
      "citizen": "Citizen",
      "worker": "Worker",
      "username": "Username",
      "password": "Password",
      "login": "Login",
      
      // Citizen Dashboard
      "productAnalysis": "Product Analysis",
      "aiAssistant": "AI Assistant",
      "marketplace": "Marketplace",
      "recyclingMap": "Recycling Map",
      "pointsRewards": "Points & Rewards",
      "uploadPhoto": "Upload Product Photo",
      "analyzeProduct": "Analyze Product",
      
      // Worker Dashboard
      "trainingModules": "Training Modules",
      "wasteSegregation": "Waste Segregation",
      "healthTracking": "Health Tracking",
      "submitFeedback": "Submit Feedback",
      "arTraining": "AR Training",
      
      // Analysis Results
      "sustainabilityScore": "Sustainability Score",
      "disposalMethod": "Disposal Method",
      "carbonFootprint": "Carbon Footprint",
      "alternatives": "Eco-Friendly Alternatives",
      "recycle": "Recycle",
      "compost": "Compost",
      "landfill": "Landfill",
      "hazardous": "Hazardous",
      
      // Common
      "upload": "Upload",
      "submit": "Submit",
      "cancel": "Cancel",
      "save": "Save",
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      "points": "Points",
      "rewards": "Rewards",
      
      // Alerts
      "hazardousAlert": "⚠️ HAZARDOUS WASTE DETECTED",
      "hazardousInstructions": "Do not handle directly. Contact hazardous waste disposal team immediately.",
      
      // Health Tracking
      "hoursWorked": "Hours Worked",
      "waterBreaks": "Water Breaks",
      "symptoms": "Reported Symptoms",
      "addHealthEntry": "Add Health Entry"
    }
  },
  hi: {
    translation: {
      // Navigation
      "dashboard": "डैशबोर्ड",
      "logout": "लॉग आउट",
      "language": "भाषा",
      
      // Login
      "welcome": "EcoAware में आपका स्वागत है",
      "selectMode": "अपना मोड चुनें",
      "citizen": "नागरिक",
      "worker": "कर्मचारी",
      "username": "उपयोगकर्ता नाम",
      "password": "पासवर्ड",
      "login": "लॉगिन",
      
      // Citizen Dashboard
      "productAnalysis": "उत्पाद विश्लेषण",
      "aiAssistant": "AI सहायक",
      "marketplace": "बाज़ार",
      "recyclingMap": "रीसाइक्लिंग मैप",
      "pointsRewards": "अंक और पुरस्कार",
      "uploadPhoto": "उत्पाद की फोटो अपलोड करें",
      "analyzeProduct": "उत्पाद का विश्लेषण करें",
      
      // Worker Dashboard
      "trainingModules": "प्रशिक्षण मॉड्यूल",
      "wasteSegregation": "कचरा पृथक्करण",
      "healthTracking": "स्वास्थ्य ट्रैकिंग",
      "submitFeedback": "प्रतिक्रिया जमा करें",
      "arTraining": "AR प्रशिक्षण",
      
      // Analysis Results
      "sustainabilityScore": "स्थिरता स्कोर",
      "disposalMethod": "निपटान विधि",
      "carbonFootprint": "कार्बन फुटप्रिंट",
      "alternatives": "पर्यावरण अनुकूल विकल्प",
      "recycle": "रीसाइकल",
      "compost": "कंपोस्ट",
      "landfill": "लैंडफिल",
      "hazardous": "खतरनाक",
      
      // Common
      "upload": "अपलोड",
      "submit": "जमा करें",
      "cancel": "रद्द करें",
      "save": "सहेजें",
      "loading": "लोड हो रहा है...",
      "error": "त्रुटि",
      "success": "सफलता",
      "points": "अंक",
      "rewards": "पुरस्कार",
      
      // Alerts
      "hazardousAlert": "⚠️ खतरनाक कचरा पाया गया",
      "hazardousInstructions": "सीधे हाथ न लगाएं। तुरंत खतरनाक कचरा निपटान टीम से संपर्क करें।",
      
      // Health Tracking
      "hoursWorked": "काम के घंटे",
      "waterBreaks": "पानी के ब्रेक",
      "symptoms": "रिपोर्ट किए गए लक्षण",
      "addHealthEntry": "स्वास्थ्य प्रविष्टि जोड़ें"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;