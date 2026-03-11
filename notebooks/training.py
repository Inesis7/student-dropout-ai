import kagglehub
import pandas as pd
import numpy as np
import os
import joblib
import seaborn as sns
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# ----------------------------------
# 1️⃣ Download Dataset from Kaggle
# ----------------------------------

path = kagglehub.dataset_download("thedevastator/higher-education-predictors-of-student-retention")

print("Dataset downloaded at:", path)

# Find CSV file inside downloaded folder
for file in os.listdir(path):
    if file.endswith(".csv"):
        dataset_path = os.path.join(path, file)

print("CSV File Found:", dataset_path)

# ----------------------------------
# 2️⃣ Load Dataset
# ----------------------------------

df = pd.read_csv(dataset_path)

print("\nFirst 5 Rows:")
print(df.head())

print("\nDataset Info:")
print(df.info())

# ----------------------------------
# 3️⃣ Data Cleaning
# ----------------------------------

# Check missing values
print("\nMissing Values:")
print(df.isnull().sum())

# Drop rows with missing values (safe option)
df = df.dropna()

# ----------------------------------
# 4️⃣ Encode Target Column
# ----------------------------------

# Target column name is usually "Target"
# Check actual name if different
print("\nUnique Target Values:")
print(df["Target"].unique())

# Convert Target to numeric
le = LabelEncoder()
df["Target"] = le.fit_transform(df["Target"])
# ----------------------------------
# 5️⃣ Select Features and Target
# ----------------------------------
selected_features = [
    "Age at enrollment",
    "Gender",
    "Curricular units 1st sem (approved)",
    "Curricular units 1st sem (grade)",
    "Curricular units 2nd sem (approved)",
    "Curricular units 2nd sem (grade)",
    "Tuition fees up to date",
    "Scholarship holder"
]

X = df[selected_features]
y = df["Target"]
# ----------------------------------
# 6️⃣ Train-Test Split
# ----------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ----------------------------------
# 7️⃣ Train Model
# ----------------------------------

model = RandomForestClassifier()
model.fit(X_train, y_train)

# ----------------------------------
# 8️⃣ Evaluate Model
# ----------------------------------

y_pred = model.predict(X_test)

print("\nModel Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))

# ----------------------------------
# 9️⃣ Save Model
# ----------------------------------

joblib.dump(model, "../model/dropout_model.pkl")

print("\nModel saved successfully!")