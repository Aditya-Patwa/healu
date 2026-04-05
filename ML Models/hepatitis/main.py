from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np

app = FastAPI(title="Hepatitis C Classification API")

# Load the trained model and features
try:
    model = joblib.load("hepatitis_model.pkl")
    model_features = joblib.load("model_features.pkl")
    print(f"Model loaded successfully with {len(model_features)} features")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    model_features = None

# CORS configuration for development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Development
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # React dev server
        "https://hepatitis-c-classification-workshop.onrender.com"
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Authorization", 
        "Accept",
        "Origin",
        "X-Requested-With",
        "Cache-Control",
        "Pragma"
    ],
    expose_headers=["Content-Length", "Content-Type"],
    max_age=600, 
)

def map_frontend_to_model_input(frontend_data: dict):
    try:
        # Create a mapping from frontend fields to model features
        field_mapping = {
            'gender': 'Gender',
            'albumin': 'ALB (g/L)',
            'alanineTransaminase': 'ALT (U/L)',
            'aspartateTransaminase': 'AST (U/L)',
            'bilirubin': 'BIL (µmol/L)',
            'cholinesterase': 'CHE (kU/L)',
            'cholesterol': 'CHOL (mmol/L)',
            'creatinine': 'CREA (µmol/L)',
            'gammaGlutamylTransferase': 'GGT (U/L)',
            'protein': 'PROT (g/L)'
        }
        
        # Initialize input array with zeros
        model_input = np.zeros(len(model_features))
        
        # Map frontend data to model features
        for frontend_field, value in frontend_data.items():
            if frontend_field in field_mapping:
                model_feature = field_mapping[frontend_field]
                if model_feature in model_features:
                    feature_idx = model_features.index(model_feature)
            
                    if frontend_field == 'gender':
                        model_input[feature_idx] = 1 if value.lower() == 'male' else 0
                    else:
                        model_input[feature_idx] = float(value) if value else 0.0
        
        print(f"Model input: {model_input}")  # Debug output
        return model_input.reshape(1, -1)
        
    except Exception as e:
        print(f"Error mapping frontend data: {e}")
        return None

@app.post("/predict")
async def predict(request: dict):
    """Make a prediction using the trained ML model"""
    try:
        if not request:
            return {
                "error": "No data received",
                "status": "error"
            }, 400
        
        model_input = map_frontend_to_model_input(request)
        if model_input is None:
            return {
                "error": "Failed to process input data",
                "status": "error"
            }, 400
    
        print(f"Making prediction with input shape: {model_input.shape}")
        prediction_proba = model.predict_proba(model_input)[0]
        prediction_class = model.predict(model_input)[0]
        
        print(f"Raw prediction: {prediction_class}, Probabilities: {prediction_proba}")
        
        
        confidence = round(prediction_proba[prediction_class], 3)
        
        
        prediction_label = "Positive" if prediction_class == 1 else "Negative"
        
        return {
            "prediction": prediction_label,
            "confidence": confidence,
            "probabilities": {
                "healthy": round(prediction_proba[0], 3),
                "hepatitis": round(prediction_proba[1], 3)
            },
            "message": f"Prediction: {prediction_label} (Confidence: {confidence})",
            "status": "success",
        }
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return {
            "error": "Prediction failed",
            "message": str(e),
            "status": "error"
        }, 500

import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)