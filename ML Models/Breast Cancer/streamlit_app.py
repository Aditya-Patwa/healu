import streamlit as st
import pickle
import numpy as np
import os

st.title("Breast Cancer Prediction")

DIR = os.path.dirname(__file__)

# Load model and scaler
# model = pickle.load(open(os.path.join(DIR, 'model.pkl'), 'rb'))
# scaler = pickle.load(open(os.path.join(DIR, 'scaler.pkl'), 'rb'))

# Load model and scaler
with open(os.path.join(DIR, "model.pkl"), "rb") as f:
    model = pickle.load(f)
# with open(os.path.join(DIR, "scaler.pkl"), "rb") as f:
#     scaler = pickle.load(f)

st.write("Please enter the following features (from tumor image analysis):")

col1, col2 = st.columns(2)

with col1:
    texture_mean = st.number_input("texture_mean", value=15.0)
    area_mean = st.number_input("area_mean", value=500.0)
    concavity_mean = st.number_input("concavity_mean", value=0.05)
    area_se = st.number_input("area_se", value=20.0)
    concavity_se = st.number_input("concavity_se", value=0.02)

with col2:
    fractal_dimension_se = st.number_input("fractal_dimension_se", value=0.003)
    smoothness_worst = st.number_input("smoothness_worst", value=0.1)
    concavity_worst = st.number_input("concavity_worst", value=0.2)
    symmetry_worst = st.number_input("symmetry_worst", value=0.3)
    fractal_dimension_worst = st.number_input("fractal_dimension_worst", value=0.08)

if st.button("Predict"):
    features = [texture_mean, area_mean, concavity_mean, area_se, concavity_se, 
                fractal_dimension_se, smoothness_worst, concavity_worst, 
                symmetry_worst, fractal_dimension_worst]
    
    final_features = [np.array(features)]
    final_features = scaler.transform(final_features)    
    prediction = model.predict(final_features)
    y_prob = model.predict_proba(final_features)[0, 1]

    if prediction[0] == 0:
        st.success(f"THE PATIENT IS MORE LIKELY TO HAVE A BENIGN CANCER (Probability: {y_prob:.3f})")
    else:
        st.error(f"THE PATIENT IS MORE LIKELY TO HAVE A MALIGNANT CANCER (Probability: {y_prob:.3f})")
