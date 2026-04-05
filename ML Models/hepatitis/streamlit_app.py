import streamlit as st
import joblib
import numpy as np
import os

st.title("Hepatitis Prediction")

DIR = os.path.dirname(__file__)

# Load the trained model
try:
    model = joblib.load(os.path.join(DIR, "hepatitis_model.pkl"))
    model_features = joblib.load(os.path.join(DIR, "model_features.pkl"))
except Exception as e:
    st.error(f"Error loading model: {e}")
    st.stop()

st.write("Please enter the patient's medical details:")

user_inputs = {}
for feature in model_features:
    if feature == 'Gender':
        val = st.selectbox(feature, ['Male', 'Female'])
        user_inputs[feature] = 1 if val == 'Male' else 0
    else:
        user_inputs[feature] = st.number_input(feature, value=1.0)

if st.button("Predict"):
    model_input = np.zeros(len(model_features))
    for i, feature in enumerate(model_features):
        model_input[i] = user_inputs[feature]
    
    model_input = model_input.reshape(1, -1)
    prediction_class = model.predict(model_input)[0]
    prediction_proba = model.predict_proba(model_input)[0]
    
    if prediction_class == 1:
        st.error(f"Prediction: Positive for Hepatitis (Confidence: {prediction_proba[1]:.3f})")
    else:
        st.success(f"Prediction: Negative for Hepatitis (Healthy) (Confidence: {prediction_proba[0]:.3f})")
