import streamlit as st
import pickle
import numpy as np
import os

st.title("Diabetes Prediction")

DIR = os.path.dirname(__file__)

# Load the trained model
with open(os.path.join(DIR, "diabetes_prediction_model.pkl"), "rb") as file:
    model = pickle.load(file)

st.write("Please enter the patient's medical details:")

col1, col2 = st.columns(2)

with col1:
    pregnancies = st.number_input("Pregnancies", min_value=0, max_value=20, value=1)
    glucose = st.number_input("Glucose", min_value=0.0, max_value=300.0, value=100.0)
    blood_pressure = st.number_input("Blood Pressure", min_value=0.0, max_value=200.0, value=70.0)
    skin_thickness = st.number_input("Skin Thickness", min_value=0.0, max_value=100.0, value=20.0)

with col2:
    insulin = st.number_input("Insulin", min_value=0.0, max_value=1000.0, value=79.0)
    bmi = st.number_input("BMI", min_value=0.0, max_value=70.0, value=25.0)
    diabetes_pedigree_function = st.number_input("Diabetes Pedigree Function", min_value=0.0, max_value=3.0, value=0.5)
    age = st.number_input("Age", min_value=0.0, max_value=120.0, value=30.0)

if st.button("Predict"):
    input_data = np.asarray([[pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, diabetes_pedigree_function, age]])
    prediction = model.predict(input_data)

    if prediction[0] == 0:
        st.success('The person is not diabetic')
    else:
        st.error('The person is diabetic')
