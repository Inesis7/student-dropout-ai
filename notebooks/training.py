import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Load dataset
df = pd.read_csv("../data/student_dropout.csv")

# Encode target
le = LabelEncoder()
df["Target"] = le.fit_transform(df["Target"])

# Select only important features
features = [
    "Age at enrollment",
    "Gender",
    "Curricular units 1st sem (approved)",
    "Curricular units 1st sem (grade)",
    "Curricular units 2nd sem (approved)",
    "Curricular units 2nd sem (grade)",
    "Tuition fees up to date",
    "Scholarship holder"
]

X = df[features]
y = df["Target"]

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "../model/dropout_model.pkl")

print("Model trained and saved successfully!")
