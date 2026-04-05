import streamlit as st
import pickle
import pandas as pd

st.title("Alzheimer's Prediction App")

import os

DIR = os.path.dirname(__file__)

# Load model and features
# model = pickle.load(open(os.path.join(DIR, "alz_lgbm_model.pkl"), "rb"))
# features = pickle.load(open(os.path.join(DIR, "model_features.pkl"), "rb"))


# Load model and scaler
with open(os.path.join(DIR, "alz_lgbm_model.pkl"), "rb") as f:
    model = pickle.load(f)
with open(os.path.join(DIR, "model_features.pkl"), "rb") as f:
    features = pickle.load(f)

# Sidebar input for features
user_input = {}
for feature in features:
    user_input[feature] = st.sidebar.number_input(feature, value=0)

user_df = pd.DataFrame([user_input])

# Make prediction
prediction = model.predict(user_df)
prediction_proba = model.predict_proba(user_df)

st.subheader("Prediction")
class_mapping = {0: "No Alzheimer's detected", 1: "Alzheimer's detected"}
st.write(class_mapping[prediction[0]])
st.subheader("Prediction Probabilities")
st.write({"No Alzheimer's": prediction_proba[0][0], "Alzheimer's": prediction_proba[0][1]})
