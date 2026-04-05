import streamlit as st
import pickle
import numpy as np
import os

st.title("Kidney Disease Prediction")

DIR = os.path.dirname(__file__)

# Load the trained model
try:
    with open(os.path.join(DIR, "kidney.pkl"), "rb") as file:
        model = pickle.load(file)
except Exception as e:
    st.error(f"Error loading model: {e}")
    st.stop()

st.write("Please enter the patient's medical details (18 expected features):")

# Since exact feature names are not available in the API/model, we use generic placeholders
# For a full production app, these should be mapped to ['age', 'bp', 'sg', 'al', 'su', 'rbc', ...]
user_inputs = {}
cols = st.columns(3)
for i in range(18):
    with cols[i % 3]:
        user_inputs[f"Feature {i+1}"] = st.number_input(f"Feature {i+1}", value=0.0)

if st.button("Predict"):
    features = list(user_inputs.values())
    input_data = np.asarray(features).reshape(1, -1)
    
    try:
        prediction = model.predict(input_data)
        if prediction[0] == 0:
            st.success('The person is not likely to have Kidney Disease')
        else:
            st.error('The person is at high risk for Kidney Disease')
    except Exception as e:
        st.error(f"Prediction error: {e}. The model might require different inputs.")
