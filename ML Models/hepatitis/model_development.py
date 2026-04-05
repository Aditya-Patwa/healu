import warnings

import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.metrics import classification_report,accuracy_score

warnings.filterwarnings("ignore")

# Load the latest version
data = pd.read_csv("HepatitisCdata.csv")

def build_hepatitis_model(data):
        #Convert categorical to binary in Category & Sex
        data["Category"] = data["Category"].map(
                {
                        "0=Blood Donor": 0, 
                        "0s=suspect Blood Donor": 0, 
                        "1=Hepatitis" : 1, 
                        "2=Fibrosis" : 1, 
                        "3=Cirrhosis" : 1
                }
        )
        
        data["Gender"] = data["Sex"].map({"m": 1, "f": 0})

        # drop Sex column
        data.drop(columns=["Sex"], inplace=True)
        
        data.fillna(data.median() ,inplace=True)

        n_cols = {
                "ALB":"ALB (g/L)",
                "ALP":  "ALP (IU/L)",
                "ALT": "ALT (U/L)",
                "AST" : "AST (U/L)",
                "BIL": "BIL (µmol/L)",
                "CHE" : "CHE (kU/L)" ,
                "CHOL" : "CHOL (mmol/L)",
                "CREA" : "CREA (µmol/L)",
                "GGT" : "GGT (U/L)",
                "PROT" : "PROT (g/L)"
        }

        data.rename(columns=n_cols ,inplace=True)
        corr_data = data.drop("Category", axis=1)

        # Feature selection using SelectKBest with ANOVA F-value
        X = data.drop(["Category"], axis = 1)  
        y = data["Category"] 
        selector = SelectKBest(f_classif, k=11)
        X_selected = selector.fit_transform(X, y)

        selected_features = X.columns[selector.get_support()]
        feature_scores = selector.scores_[selector.get_support()]

        # Create a DataFrame to store the feature names and their scores
        feature_scores_data_set = pd.DataFrame({"Features": selected_features, "Scores": feature_scores})

        # Sort the DataFrame by score in descending order
        feature_scores_data_set = feature_scores_data_set.sort_values(by="Scores", ascending=False)

        # Drop less important features based on feature scores
        X = X.drop(["ALP (IU/L)", "MRN"], axis = 1)  

        #Splitting the data into the training and testing set  
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.3, random_state = 42) 
        from sklearn.ensemble import RandomForestClassifier
        rnf_model = RandomForestClassifier(random_state=42)
        rnf_model.fit(X_train, y_train)
        y_pred_rnf = rnf_model.predict(X_test)
        accr = accuracy_score(y_test, y_pred_rnf)
        print(f"Random Forest Accuracy: {accr*100:.2f}%")
        print(classification_report(y_test, y_pred_rnf))

        # Save the trained model
        joblib.dump(rnf_model, "hepatitis_model.pkl")

        # Save the feature scores
        feature_scores_data_set.to_csv("feature_scores.csv", index=False)

        # Save the feature names used in the model
        joblib.dump(list(X.columns), "model_features.pkl")

build_hepatitis_model(data)



