import streamlit as st

st.set_page_config(page_title="Disease Prediction Hub", layout="wide", page_icon="🏥")

st.title("🏥 Healthcare Disease Prediction Hub")
st.markdown("Welcome to the unified disease prediction model interface. Please select a disease model from the sidebar to begin.")

pages = {
    "Disease Models": [
        st.Page("alzheimer/app.py", title="Alzheimer's Prediction", url_path="alzheimer_prediction"),
        # st.Page("Breast Cancer/streamlit_app.py", title="Breast Cancer Prediction", url_path="breast_cancer_prediction"),
        st.Page("diabetes/streamlit_app.py", title="Diabetes Prediction", url_path="diabetes_prediction"),
        st.Page("heart disease/app.py", title="Heart Disease Prediction", url_path="heart_disease_prediction"),
        st.Page("hepatitis/streamlit_app.py", title="Hepatitis Prediction", url_path="hepatitis_prediction"),
        # st.Page("hypertension/app.py", title="Hypertension Prediction", url_path="hypertension_prediction"),
        # st.Page("kidney disease/streamlit_app.py", title="Kidney Disease Prediction", url_path="kidney_disease_prediction"),
        # st.Page("Lung Cancer/streamlit_app.py", title="Lung Cancer Prediction", url_path="lung_cancer_prediction"),
        st.Page("thyroid/app.py", title="Thyroid Prediction", url_path="thyroid_prediction"),
    ]
}

pg = st.navigation(pages)
pg.run()
