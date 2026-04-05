import streamlit as st
import pandas as pd
import numpy as np
import joblib

import os

DIR = os.path.dirname(__file__)

# Load the trained model
model = joblib.load(os.path.join(DIR, "heart_disease_pred_model.pkl"))

# Streamlit U
st.title("Heart Disease Prediction App")
st.write("Enter the patient's details to predict heart disease severity.")

age = st.number_input("Age", min_value=1, max_value=120, value=50)
sex = st.selectbox("Sex", ["Male", "Female"])
cp = st.selectbox("Chest Pain Type", ["Typical Angina", "Atypical Angina", "Non-Anginal", "Asymptomatic"])
trestbps = st.number_input("Resting Blood Pressure (mm Hg)", min_value=50, max_value=200, value=120)
chol = st.number_input("Cholesterol Level (mg/dl)", min_value=100, max_value=600, value=200)
fbs = st.selectbox("Fasting Blood Sugar > 120 mg/dl", ["False", "True"])
restecg = st.selectbox("Resting ECG Results", ["Normal", "ST-T Abnormality", "Left Ventricular Hypertrophy"])
thalch = st.number_input("Maximum Heart Rate Achieved", min_value=60, max_value=220, value=150)
exang = st.selectbox("Exercise-Induced Angina", ["No", "Yes"])
oldpeak = st.number_input("ST Depression Induced by Exercise", min_value=0.0, max_value=6.0, value=1.0)
slope = st.selectbox("Slope of Peak ST Segment", ["Upsloping", "Flat", "Downsloping"])
ca = st.number_input("Number of Major Vessels (0-3) Colored by Fluoroscopy", min_value=0, max_value=3, value=1)
thal = st.selectbox("Thalassemia", ["Normal", "Fixed Defect", "Reversible Defect"])

# Convert categorical inputs to numerical values
sex = 1 if sex == "Male" else 0
cp = ["Typical Angina", "Atypical Angina", "Non-Anginal", "Asymptomatic"].index(cp)
fbs = 1 if fbs == "True" else 0
restecg = ["Normal", "ST-T Abnormality", "Left Ventricular Hypertrophy"].index(restecg)
exang = 1 if exang == "Yes" else 0
slope = ["Upsloping", "Flat", "Downsloping"].index(slope)
thal = ["Normal", "Fixed Defect", "Reversible Defect"].index(thal) + 1

# Prepare input data as a DataFrame
input_data = pd.DataFrame(np.array([[age, sex, cp, trestbps, chol, fbs, restecg, thalch, exang, oldpeak, slope, ca, thal]]),
                          columns=["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalch", "exang", "oldpeak", "slope", "ca", "thal"])

# Ensure all data is numeric
input_data = input_data.apply(pd.to_numeric, errors='coerce')

# Handle any missing values (e.g., fill with 0 or mean)
input_data = input_data.fillna(0)

# Predict
if st.button("Predict Heart Disease"):
    prediction = model.predict(input_data)
    if prediction[0] == 0:
        result = "No heart disease (Healthy heart)"
        st.success(f"Prediction: {result}")
    else:
        result = f"Heart disease detected (Severity Level: {prediction[0]})"
        st.error(f"Prediction: {result}")