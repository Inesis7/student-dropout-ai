async function predictDropout() {

    // Collect values from inputs
    const data = {
        "Age at enrollment": parseFloat(document.getElementById("age").value),
        "Gender": parseInt(document.getElementById("gender").value),
        "Curricular units 1st sem (approved)": parseFloat(document.getElementById("approved1").value),
        "Curricular units 1st sem (grade)": parseFloat(document.getElementById("grade1").value),
        "Curricular units 2nd sem (approved)": parseFloat(document.getElementById("approved2").value),
        "Curricular units 2nd sem (grade)": parseFloat(document.getElementById("grade2").value),
        "Tuition fees up to date": parseInt(document.getElementById("fees").value),
        "Scholarship holder": parseInt(document.getElementById("scholarship").value)
    };

    try {

        // Send request to Flask backend
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // Convert prediction number into readable label
        let label = "";

        if (result.prediction == 0) {
            label = "High Dropout Risk";
        }
        else if (result.prediction == 1) {
            label = "Student Likely to Continue";
        }
        else if (result.prediction == 2) {
            label = "Student Likely to Graduate";
        }

        // Show result
        document.getElementById("result").innerText =
            label + " | Confidence: " + result.probability;

    } catch (error) {

        console.error("Error:", error);

        document.getElementById("result").innerText =
            " Prediction failed. Make sure backend is running.";

    }
}