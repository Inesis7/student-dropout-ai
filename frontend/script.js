// =======================
// STEP NAVIGATION
// =======================

function nextStep(step) {
    document.querySelectorAll(".step").forEach(s => s.style.display = "none");
    document.getElementById("step" + step).style.display = "block";
}

function prevStep(step) {
    nextStep(step);
}


// =======================
// ADD SEMESTER
// =======================

let semCount = 2;

function addSemester() {
    semCount++;

    const container = document.getElementById("semesterContainer");

    const div = document.createElement("div");
    div.classList.add("semester");

    div.innerHTML = `
        <h4>Semester ${semCount}</h4>
        <input type="number" placeholder="Total Subjects" class="total">
        <input type="number" placeholder="Subjects Passed" class="approved">
        <input type="number" placeholder="Average Grade (Out of 20)" class="grade">
    `;

    container.appendChild(div);
}


// =======================
// FINANCIAL CHECK
// =======================

function handleFinancial() {
    const fees = document.getElementById("fees").value;

    if (fees == "0") {
        showDirectResult(
            "⚠️ High Dropout Risk",
            "Tuition fees are not paid. This is a major risk factor."
        );
    } else {
        nextStep(3);
    }
}


// =======================
// DIRECT RESULT
// =======================

function showDirectResult(title, reason) {
    document.querySelectorAll(".step").forEach(s => s.style.display = "none");

    const box = document.getElementById("resultBox");
    box.classList.remove("result-orange", "result-green");
    box.classList.add("result-red");

    document.getElementById("result").innerHTML = `
        <h3>${title}</h3>
        <p>${reason}</p>
    `;
}


// =======================
// PREDICTION
// =======================

async function predictDropout() {

    const totals = document.querySelectorAll(".total");
    const approveds = document.querySelectorAll(".approved");
    const grades = document.querySelectorAll(".grade");

    if (totals.length < 2) {
        alert("Enter at least 2 semesters!");
        return;
    }

    // Only first 2 semesters used
    const total1 = parseFloat(totals[0].value);
    const approved1 = parseFloat(approveds[0].value);
    const grade1 = parseFloat(grades[0].value);

    const total2 = parseFloat(totals[1].value);
    const approved2 = parseFloat(approveds[1].value);
    const grade2 = parseFloat(grades[1].value);

    if (approved1 > total1 || approved2 > total2) {
        alert("Subjects passed cannot exceed total!");
        return;
    }

    const data = {
        "Age at enrollment": 20,
        "Gender": 1,
        "Curricular units 1st sem (approved)": approved1,
        "Curricular units 1st sem (grade)": grade1,
        "Curricular units 2nd sem (approved)": approved2,
        "Curricular units 2nd sem (grade)": grade2,
        "Tuition fees up to date": parseInt(document.getElementById("fees").value),
        "Scholarship holder": parseInt(document.getElementById("scholarship").value)
    };

    try {
        const res = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        const r = await res.json();

        const box = document.getElementById("resultBox");
        box.classList.remove("result-red", "result-orange", "result-green");

        let title = "";
        let suggestion = "";
        let colorClass = "";

        if (r.prediction == 0) {
            title = "⚠️ High Dropout Risk";
            suggestion = "Improve academics and attendance.";
            colorClass = "result-red";
        }
        else if (r.prediction == 1) {
            title = "📚 Likely to Continue";
            suggestion = "Maintain consistency.";
            colorClass = "result-orange";
        }
        else {
            title = "🎓 Likely to Graduate";
            suggestion = "Excellent performance!";
            colorClass = "result-green";
        }

        box.classList.add(colorClass);

        document.getElementById("result").innerHTML = `
            <h3>${title}</h3>
            <p>${suggestion}</p>
        `;

    } catch {
        alert("Backend not working!");
    }
}

function updateCourses() {
    const dept = document.getElementById("department").value;
    const course = document.getElementById("course");

    // Clear old options
    course.innerHTML = '<option value="">Select Course</option>';

    const data = {
        sciences: ["BCA", "BSc Data Science", "BSc Computer Science"],
        commerce: ["BCom Honours", "BCom Professional"],
        business: ["BBA", "BBA Finance"],
        arts: ["BA Psychology", "BA Media"],
        law: ["BA LLB", "BBA LLB"]
    };

    if (data[dept]) {
        data[dept].forEach(c => {
            const option = document.createElement("option");
            option.value = c;
            option.textContent = c;
            course.appendChild(option);
        });
    }
}