
import streamlit as st
import numpy as np
import pickle
import pandas as pd # Import pandas for get_dummies if needed for input processing

import os

DIR = os.path.dirname(__file__)

# Load model and scaler
with open(os.path.join(DIR, "best_thyroid_model.pkl"), "rb") as f:
    model = pickle.load(f)
with open(os.path.join(DIR, "scaler.pkl"), "rb") as f:
    scaler = pickle.load(f)

st.title("Thyroid Disease Prediction")

# Input fields
age = st.number_input("Age", 0, 120, 50)
sex = st.selectbox("Sex", [0, 1], format_func=lambda x: "Male" if x==0 else "Female")
TSH = st.number_input("TSH", 0.0, 20.0, 1.0)
T3 = st.number_input("T3", 0.0, 10.0, 1.0)
TT4 = st.number_input("TT4", 0.0, 400.0, 100.0)
T4U = st.number_input("T4U", 0.0, 5.0, 1.0)
FTI = st.number_input("FTI", 0.0, 500.0, 100.0)

# For Streamlit app, we need to replicate the preprocessing, including one-hot encoding.
# Create a dictionary for the input features that match the columns used for training.
# Note: This is a simplified approach. A more robust app would handle all original columns.
input_dict = {
    'age': age,
    'sex': sex,
    'on thyroxine': 0, # Assuming default 'f' or 0
    'query on thyroxine': 0,
    'on antithyroid medication': 0,
    'sick': 0,
    'pregnant': 0,
    'thyroid surgery': 0,
    'I131 treatment': 0,
    'query hypothyroid': 0,
    'query hyperthyroid': 0,
    'lithium': 0,
    'goitre': 0,
    'tumor': 0,
    'hypopituitary': 0,
    'psych': 0,
    'TSH measured': 0,
    'TSH': TSH,
    'T3 measured': 0,
    'T3': T3,
    'TT4 measured': 0,
    'TT4': TT4,
    'T4U measured': 0,
    'T4U': T4U,
    'FTI measured': 0,
    'FTI': FTI,
    'TBG measured': 0,
    # Placeholder for one-hot encoded 'referral source'
    'referral source_SVHD': 0,
    'referral source_SVI': 0,
    'referral source_other': 0,
    'referral source_STMW': 0
}

# Handle the selected referral source in Streamlit
# For simplicity, assuming 'other' as default if not specified in the app for now
# In a real app, you would add a selectbox for 'referral source' and set the corresponding dummy variable
# Let's add a selectbox for referral source for better UX
referral_source_input = st.selectbox("Referral Source", ['other', 'SVHC', 'SVI', 'STMW', 'SVHD'])
if referral_source_input != 'other': # 'other' is the dropped_first column
    input_dict[f'referral source_{referral_source_input}'] = 1


# Create a DataFrame from the input dictionary, ensuring column order matches training data
# This is crucial for consistent prediction.
# To get the correct column order, we need the columns from df_encoded used for training
# A more robust solution would store these column names.
# For now, let's reconstruct based on knowledge of the original df and dummy encoding

# Get the feature names after encoding and dropping the target
# Ensure the features are in the correct order. For simplicity assuming input_dict is ordered.
training_features = list(input_dict.keys())

# Create a DataFrame from the input_dict, ensuring all training features are present
input_df = pd.DataFrame([input_dict], columns=training_features)


input_scaled = scaler.transform(input_df)

if st.button("Predict"):
    pred = model.predict(input_scaled)[0]
    if pred == 1:
        st.success("Normal / No Thyroid Disease")
    else:
        st.error("Thyroid Disease Detected. Consult a doctor!")
