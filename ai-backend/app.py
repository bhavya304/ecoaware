#!/usr/bin/env python3
"""
EcoAware AI Backend - Flask Application
Provides AI-powered image analysis and chat assistant for sustainability analysis
"""

import os
import io
import json
import random
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import requests
from dotenv import load_dotenv
import base64

# For real AI
import openai
from transformers import pipeline
from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration

# Load Blenderbot model
print("🔄 Loading BlenderBot model...")
chat_model_name = "facebook/blenderbot_small-90M"
chat_tokenizer = BlenderbotTokenizer.from_pretrained(chat_model_name)
chat_model = BlenderbotForConditionalGeneration.from_pretrained(chat_model_name)
print("✅ BlenderBot loaded successfully")


# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
AI_MODE = os.getenv('MODE', 'real')  # 'mock' or 'real'

# Hugging Face model setup
HF_MODEL_NAME = os.getenv('HF_MODEL_NAME', 'microsoft/resnet-50')
hf_classifier = None
if AI_MODE == "real":
    try:
        hf_classifier = pipeline(
            "image-classification",
            model=HF_MODEL_NAME,
            device=-1   # Always use CPU
        )
        print(f"[INFO] Hugging Face model '{HF_MODEL_NAME}' loaded on CPU")
    except Exception as e:
        print(f"[ERROR] Could not load Hugging Face model: {e}")
        hf_classifier = None
openai.api_key = os.getenv("OPENAI_API_KEY")

# Mock data for sustainability scoring
MATERIAL_SCORES = {
    'bamboo': 9.5,
    'wood': 8.8,
    'glass': 8.2,
    'aluminum': 7.8,
    'jute':8.0,
    'cardboard': 7.5,
    'paper': 7.2,
    'stainless_steel': 7.0,
    'ceramic': 6.8,
    'cotton': 6.5,
    'plastic_pet': 3.2,
    'plastic_hdpe': 3.0,
    'plastic_pvc': 2.1,
    'polystyrene': 1.8,
    'composite': 2.5,
    'synthetic_fabric': 2.8
}

DISPOSAL_METHODS = {
    'bamboo': 'Compost',
    'wood': 'Compost',
    'glass': 'Recycle',
    'aluminum': 'Recycle',
    'cardboard': 'Recycle',
    'paper': 'Recycle',
    'stainless_steel': 'Recycle',
    'ceramic': 'Landfill',
    'cotton': 'Compost',
    'plastic_pet': 'Recycle',
    'plastic_hdpe': 'Recycle',
    'plastic_pvc': 'Hazardous',
    'polystyrene': 'Landfill',
    'composite': 'Landfill',
    'synthetic_fabric': 'Landfill'
}

# Alternative products database
ECO_ALTERNATIVES = [
    {"id": 1, "name": "Bamboo Water Bottle", "score": 9.2},
    {"id": 2, "name": "Stainless Steel Container", "score": 8.8},
    {"id": 3, "name": "Glass Storage Jar", "score": 8.5},
    {"id": 4, "name": "Organic Cotton Bag", "score": 8.3},
    {"id": 5, "name": "Recycled Paper Packaging", "score": 7.8},
    {"id": 6, "name": "Biodegradable Plates", "score": 9.0},
    {"id": 7, "name": "Hemp Fiber Products", "score": 8.9},
    {"id": 8, "name": "Cork-based Items", "score": 8.7}
]

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'EcoAware AI Backend',
        'mode': AI_MODE,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/ai/analyze-image', methods=['POST'])
def analyze_image():
    """
    Analyze uploaded product image for sustainability metrics
    Returns: score, disposal method, carbon footprint, alternatives
    """
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        image_file = request.files['image']
        user_id = request.form.get('userId', 'anonymous')
        
        if image_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Process image
        try:
            image = Image.open(io.BytesIO(image_file.read()))
            print(f"Processing image: {image_file.filename} for user: {user_id}")
        except Exception as e:
            return jsonify({'error': 'Invalid image file'}), 400
        
        if AI_MODE == 'real':
            result = analyze_with_real_ai(image, image_file.filename)
        else:
            result = analyze_with_mock_ai(image_file.filename)
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error in analyze_image: {str(e)}")
        return jsonify({'error': 'Analysis failed'}), 500

@app.route('/ai/chat', methods=['POST'])
def ai_chat():
    """
    AI Assistant chat endpoint for eco-friendly advice
    """
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        language = data.get('language', 'en')
        user_id = data.get('userId', 'anonymous')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        print(f"Chat request from {user_id} ({language}): {message[:50]}...")
        
        if AI_MODE == 'real':
            response = get_real_ai_response(message, language)
        else:
            response = get_mock_ai_response(message, language)
        
        return jsonify({'response': response, 'language': language})
    
    except Exception as e:
        print(f"Error in ai_chat: {str(e)}")
        return jsonify({'error': 'Chat service unavailable'}), 500

@app.route('/ai/check-segregation', methods=['POST'])
def check_segregation():
    """
    Check if waste is properly segregated (Worker feature)
    """
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        image_file = request.files['image']
        worker_id = request.form.get('workerId', 'anonymous')
        
        # Process image
        try:
            image = Image.open(io.BytesIO(image_file.read()))
            print(f"Checking segregation: {image_file.filename} by worker: {worker_id}")
        except Exception as e:
            return jsonify({'error': 'Invalid image file'}), 400
        
        if AI_MODE == 'real':
            result = check_segregation_real_ai(image, image_file.filename)
        else:
            result = check_segregation_mock(image_file.filename)
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error in check_segregation: {str(e)}")
        return jsonify({'error': 'Segregation check failed'}), 500

# ---------------------- AI IMPLEMENTATIONS ----------------------

def analyze_with_mock_ai(filename):
    """Mock AI analysis based on filename patterns"""
    name = filename.lower()
    detected_materials = []
    for material in MATERIAL_SCORES.keys():
        if material.replace('_', ' ') in name or material.replace('_', '') in name:
            detected_materials.append(material)
    
    if not detected_materials:
        detected_materials = [random.choice(list(MATERIAL_SCORES.keys()))]
    
    primary_material = detected_materials[0]
    base_score = MATERIAL_SCORES[primary_material]
    score = max(0, min(10, base_score + random.uniform(-0.5, 0.5)))
    disposal = DISPOSAL_METHODS.get(primary_material, 'Landfill')
    carbon_base = {'Recycle':0.5,'Compost':0.2,'Landfill':2.0,'Hazardous':5.0}
    carbon_kg = carbon_base[disposal]*random.uniform(0.5,1.5)
    alert = disposal=='Hazardous' or 'hazard' in name
    alternatives = random.sample(ECO_ALTERNATIVES,3)
    
    return {
        'score': round(score,1),
        'disposal': disposal,
        'carbon_kg': round(carbon_kg,2),
        'alt_products': alternatives,
        'detected_materials': detected_materials,
        'alert': alert,
        'confidence': round(random.uniform(0.7,0.95),2),
        'analysis_method':'mock',
        'timestamp': datetime.now().isoformat()
    }

from transformers import pipeline

# Load model once
hf_classifier = pipeline("image-classification", model=HF_MODEL_NAME, device=-1)  # CPU

def analyze_with_real_ai(image, filename):
    predictions = hf_classifier(image)  # real HF model output
    top_label = predictions[0]['label']
    score = predictions[0]['score'] * 10  # map to 0–10 scale
    disposal = "Landfill"  # map label to disposal if needed
    carbon_kg = 1.5  # estimate or map from label
    alternatives = [{"name": "Eco Bottle"}, {"name": "Recycled Bag"}, {"name": "Bamboo Toothbrush"}]
    alert = False

    return {
        'score': round(score, 1),
        'disposal': disposal,
        'carbon_kg': round(carbon_kg, 2),
        'alt_products': alternatives,
        'detected_materials': [top_label],
        'alert': alert,
        'confidence': round(predictions[0]['score'], 2),
        'analysis_method': 'real_hf',
        'timestamp': datetime.now().isoformat()
    }


def get_mock_ai_response(message, language):
    """Fallback mock responses"""
    message_lower = message.lower()
    en_responses = {
        'plastic': "Reduce plastic: reuse bags/bottles, choose minimal packaging, bamboo/glass alternatives.",
        'compost': "Home composting: mix green & brown materials, keep moist, turn weekly.",
        'recycle': "Follow local recycling: clean containers, separate materials, check guidelines.",
        'energy': "Save energy: LED bulbs, unplug devices, efficient thermostat, air-dry clothes.",
        'transport': "Eco transport: walk, bike, public transit, carpool, EVs or hybrids.",
        'default': "Ask me about recycling, composting, energy saving, eco-products or green tips."
    }
    hi_responses = {
        'plastic': "प्लास्टिक कम करें: पुन: उपयोग बैग/बोतलें, कम पैकेजिंग, बांस/कांच विकल्प।",
        'compost': "घर में कंपोस्ट: हरी+भूरी सामग्री मिलाएं, नमी रखें, साप्ताहिक हिलाएं।",
        'recycle': "स्थानीय रीसाइक्लिंग: कंटेनर साफ करें, सामग्री अलग करें, नियम देखें।",
        'energy': "ऊर्जा बचाएं: LED बल्ब, उपकरण अनप्लग करें, थर्मोस्टेट सेट करें, कपड़े सुखाएं।",
        'transport': "पर्यावरण मित्र यात्रा: पैदल, साइकिल, सार्वजनिक परिवहन, कारपूल, EV/हाइब्रिड।",
        'default': "रीसाइक्लिंग, कंपोस्टिंग, ऊर्जा बचत या हरित जीवन के बारे में पूछें।"
    }
    responses = hi_responses if language=='hi' else en_responses
    for key in responses:
        if key in message_lower:
            return responses[key]
    return responses['default']

def get_real_ai_response(message, language):
    try:
        inputs = chat_tokenizer([message], return_tensors="pt")
        reply_ids = chat_model.generate(
            **inputs,
            max_length=100,
            num_beams=2,
            early_stopping=True,
            pad_token_id=chat_tokenizer.eos_token_id
        )
        response = chat_tokenizer.batch_decode(
            reply_ids,
            skip_special_tokens=True
        )[0]

        # Ensure safe text
        response = response.encode("utf-8", "ignore").decode("utf-8", "ignore")
        return response.strip()

    except Exception as e:
        print(f"⚠️ Chat model error: {e}")
        return get_mock_ai_response(message, language)



def check_segregation_mock(filename):
    """Mock waste segregation analysis"""
    name = filename.lower()
    is_correct = True
    confidence = random.uniform(0.7,0.95)
    waste_types=[]
    recommendations=[]
    alert=False
    if 'mixed' in name or 'unsorted' in name:
        is_correct=False
        waste_types=['plastic','organic','paper']
        recommendations=['Separate plastic','Remove organic','Sort paper']
    elif 'hazard' in name or 'battery' in name or 'chemical' in name:
        is_correct=False
        alert=True
        waste_types=['hazardous']
        recommendations=['Contact hazardous team','Do not handle directly','Use PPE']
    elif 'plastic' in name:
        waste_types=['plastic']
        recommendations=['Good separation']
    elif 'organic' in name or 'food' in name:
        waste_types=['organic']
        recommendations=['Compostable']
    else:
        categories=['plastic','organic','paper','glass','metal']
        waste_types=[random.choice(categories)]
        is_correct=random.random()>0.2
    reason="Proper segregation detected" if is_correct else "Mixed waste found"
    if alert:
        reason="Hazardous waste detected"
    return {
        'segregatedCorrectly':is_correct,
        'confidence':round(confidence,2),
        'reason':reason,
        'wasteTypes':waste_types,
        'recommendations':recommendations,
        'alert':alert,
        'timestamp':datetime.now().isoformat(),
        'analysis_method':'mock'
    }

def check_segregation_real_ai(image, filename):
    """Use Hugging Face model to classify if waste is segregated properly"""
    if hf_classifier is None:
        # Fallback if model not loaded
        return {
            "filename": filename,
            "category": "unknown",
            "confidence": 0.0,
            "analysis_method": "huggingface_fallback",
            "note": "HF model not available, fallback triggered"
        }

    try:
        # Run Hugging Face classification
        results = hf_classifier(image)

        if not results:
            return {
                "filename": filename,
                "category": "unknown",
                "confidence": 0.0,
                "analysis_method": "huggingface_empty",
                "note": "No classification result returned"
            }

        # Take top prediction
        top = results[0]
        return {
            "filename": filename,
            "category": top["label"],
            "confidence": float(top["score"]),
            "analysis_method": "huggingface_real",
            "note": f"Classified using {HF_MODEL_NAME}"
        }

    except Exception as e:
        return {
            "filename": filename,
            "category": "error",
            "confidence": 0.0,
            "analysis_method": "huggingface_error",
            "note": f"Error: {e}"
        }


# ---------------------- END AI IMPLEMENTATIONS ----------------------

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT',5001))
    debug = os.getenv('FLASK_ENV')=='development'
    print(f"🤖 EcoAware AI Backend starting... Mode={AI_MODE} Port={port} Debug={debug}")
    app.run(host='0.0.0.0', port=port, debug=debug)
