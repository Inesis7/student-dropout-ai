// Global state
let currentStep = 1;
const courseData = {
    sciences: ['Computer Science', 'Physics', 'Chemistry', 'Mathematics', 'Biology'],
    commerce: ['Accounting', 'Finance', 'Economics', 'Marketing'],
    business: ['Business Administration', 'Human Resource Management', 'Entrepreneurship'],
    arts: ['English Literature', 'History', 'Philosophy', 'Psychology'],
    law: ['LLB (Hons)', 'Corporate Law', 'International Law']
};

// DOM Elements
const steps = document.querySelectorAll('.step');
const stepContents = document.querySelectorAll('.step-content');
const loadingOverlay = document.getElementById('loadingOverlay');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 Student Dropout Predictor initialized');
    
    // Setup event listeners
    setupEventListeners();
    
    // Department change handler
    document.getElementById('department').addEventListener('change', handleDepartmentChange);
});

function setupEventListeners() {
    // Real-time validation for name and reg number
    document.getElementById('fullName').addEventListener('input', validateName);
    document.getElementById('regNumber').addEventListener('input', validateRegNumber);
    
    // Academic validation
    ['sem1_total', 'sem1_passed', 'sem2_total', 'sem2_passed'].forEach(id => {
        document.getElementById(id).addEventListener('input', validateAcademicFields);
    });
    
    // Grade fields validation
    ['sem1_grade', 'sem2_grade'].forEach(id => {
        document.getElementById(id).addEventListener('input', validateGradeField);
    });
}

function handleDepartmentChange() {
    const department = document.getElementById('department').value;
    const courseSelect = document.getElementById('course');
    
    courseSelect.innerHTML = '<option value="">Select Course</option>';
    courseSelect.disabled = !department;
    
    if (department && courseData[department]) {
        courseData[department].forEach(course => {
            const option = document.createElement('option');
            option.value = course.toLowerCase().replace(/ /g, '-');
            option.textContent = course;
            courseSelect.appendChild(option);
        });
        courseSelect.disabled = false;
    }
}

function showError(errorId, message) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
        errorEl.textContent = message;
    }
}

function clearError(errorId) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
        errorEl.textContent = '';
    }
}

function validateName() {
    const name = document.getElementById('fullName').value.trim();
    const nameRegex = /^[a-zA-Z\s]+$/;
    
    if (!name) {
        showError('nameError', 'Full name is required');
        document.getElementById('fullName').classList.add('input-error');
        return false;
    }
    
    if (!nameRegex.test(name)) {
        showError('nameError', 'Name should contain only alphabets');
        document.getElementById('fullName').classList.add('input-error');
        return false;
    }
    
    if (name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters long');
        document.getElementById('fullName').classList.add('input-error');
        return false;
    }
    
    clearError('nameError');
    document.getElementById('fullName').classList.remove('input-error');
    return true;
}

function validateRegNumber() {
    const regNum = document.getElementById('regNumber').value.trim();
    const regNumRegex = /^\d+$/;
    
    if (!regNum) {
        showError('regError', 'Registration number is required');
        document.getElementById('regNumber').classList.add('input-error');
        return false;
    }
    
    if (!regNumRegex.test(regNum)) {
        showError('regError', 'Registration number should contain only numbers');
        document.getElementById('regNumber').classList.add('input-error');
        return false;
    }
    
    if (regNum.length < 6) {
        showError('regError', 'Registration number must be at least 6 digits');
        document.getElementById('regNumber').classList.add('input-error');
        return false;
    }
    
    clearError('regError');
    document.getElementById('regNumber').classList.remove('input-error');
    return true;
}

function validateGradeField() {
    const field = event.target;
    const value = parseFloat(field.value);
    
    if (value > 20 || value < 0 || isNaN(value)) {
        field.classList.add('input-error');
    } else {
        field.classList.remove('input-error');
    }
}

function validateAcademicFields() {
    const sem1Total = parseInt(document.getElementById('sem1_total').value) || 0;
    const sem1Passed = parseInt(document.getElementById('sem1_passed').value) || 0;
    const sem2Total = parseInt(document.getElementById('sem2_total').value) || 0;
    const sem2Passed = parseInt(document.getElementById('sem2_passed').value) || 0;
    
    // Semester 1 validation
    if (sem1Passed > sem1Total && sem1Total > 0) {
        document.getElementById('sem1_passed').classList.add('input-error');
    } else {
        document.getElementById('sem1_passed').classList.remove('input-error');
    }
    
    // Semester 2 validation
    if (sem2Passed > sem2Total && sem2Total > 0) {
        document.getElementById('sem2_passed').classList.add('input-error');
    } else {
        document.getElementById('sem2_passed').classList.remove('input-error');
    }
}

function validateStep1() {
    const isNameValid = validateName();
    const isRegValid = validateRegNumber();
    const department = document.getElementById('department').value;
    const course = document.getElementById('course').value;
    
    if (!department) {
        showError('nameError', 'Please select department');
        return false;
    }
    
    if (!course) {
        showError('nameError', 'Please select course');
        return false;
    }
    
    return isNameValid && isRegValid;
}

function validateStep2() {
    const feesPaid = document.querySelector('input[name="feesPaid"]:checked');
    const scholarship = document.querySelector('input[name="scholarship"]:checked');
    
    if (!feesPaid || !scholarship) {
        alert('Please select both financial options');
        return false;
    }
    
    return true;
}

function validateStep3() {
    const requiredFields = ['sem1_total', 'sem1_passed', 'sem1_grade', 'sem2_total', 'sem2_passed', 'sem2_grade'];
    
    for (let field of requiredFields) {
        const value = document.getElementById(field).value.trim();
        if (!value || parseFloat(value) <= 0) {
            alert(`Please fill all academic fields with valid numbers`);
            document.getElementById(field).classList.add('input-error');
            document.getElementById(field).focus();
            return false;
        }
    }
    
    // Final validation
    validateAcademicFields();
    const sem1PassedEl = document.getElementById('sem1_passed');
    const sem2PassedEl = document.getElementById('sem2_passed');
    
    if (sem1PassedEl.classList.contains('input-error') || sem2PassedEl.classList.contains('input-error')) {
        alert('Subjects passed cannot exceed total subjects');
        return false;
    }
    
    return true;
}

function updateStepIndicator(stepNum) {
    steps.forEach((step, index) => {
        step.classList.toggle('active', index + 1 <= stepNum);
    });
}

function showStep(stepNum) {
    stepContents.forEach((content, index) => {
        content.classList.toggle('active', index + 1 === stepNum);
    });
    currentStep = stepNum;
    updateStepIndicator(stepNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep(current) {
    switch(current) {
        case 1:
            if (!validateStep1()) return;
            showStep(2);
            break;
        case 2:
            if (!validateStep2()) return;
            const feesPaid = document.querySelector('input[name="feesPaid"]:checked').value;
            if (feesPaid === 'no') {
                showHighRiskDueToFees();
            } else {
                showStep(3);
            }
            break;
        case 3:
            predictStudent();
            break;
    }
}

function prevStep(stepNum) {
    showStep(stepNum - 1);
}

function showHighRiskDueToFees() {
    showStep(4);
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const resultSuggestion = document.getElementById('resultSuggestion');
    
    resultIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    resultIcon.className = 'result-icon high-risk';
    resultTitle.textContent = 'High Dropout Risk';
    resultMessage.textContent = 'Fees have not been paid. This is a major indicator of dropout risk.';
    resultSuggestion.innerHTML = `
        <strong>🚨 Immediate Action Required:</strong><br>
        - Contact student/guardian regarding fee payment<br>
        - Arrange scholarship or financial aid<br>
        - Schedule counseling session immediately
    `;
}

// 🔥 MOCK PREDICTION (WORKS 100% OFFLINE - NO FLASK NEEDED!)
async function predictStudent() {
    if (!validateStep3()) return;
    
    showLoading(true);
    
    // Collect all data
    const studentData = {
        fullName: document.getElementById('fullName').value.trim(),
        regNumber: document.getElementById('regNumber').value.trim(),
        department: document.getElementById('department').value,
        course: document.getElementById('course').options[document.getElementById('course').selectedIndex].text,
        feesPaid: document.querySelector('input[name="feesPaid"]:checked').value === 'yes',
        scholarship: document.querySelector('input[name="scholarship"]:checked').value === 'yes',
        sem1_total: parseInt(document.getElementById('sem1_total').value),
        sem1_passed: parseInt(document.getElementById('sem1_passed').value),
        sem1_grade: parseFloat(document.getElementById('sem1_grade').value),
        sem2_total: parseInt(document.getElementById('sem2_total').value),
        sem2_passed: parseInt(document.getElementById('sem2_passed').value),
        sem2_grade: parseFloat(document.getElementById('sem2_grade').value)
    };
    
    console.log('📊 Prediction Data:', studentData);
    
    // Simulate API delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 🧠 INTELLIGENT MOCK PREDICTION ALGORITHM
    const prediction = calculateMockPrediction(studentData);
    
    console.log('🤖 AI Prediction:', prediction);
    
    // Simulate different backend response formats
    const mockResponses = [
        { prediction: prediction },
        { result: getPredictionText(prediction) },
        `${prediction}`,
        getPredictionText(prediction)
    ];
    
    const mockResult = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    console.log('📤 Mock Backend Response:', mockResult);
    
    displayResult(mockResult);
    showLoading(false);
}

function calculateMockPrediction(data) {
    let score = 0;
    
    // Fees impact (35% weight) - Already checked in step 2
    score += data.feesPaid ? 35 : 0;
    
    // Scholarship bonus (10%)
    score += data.scholarship ? 10 : 0;
    
    // Academic performance (55% weight) - MUCH MORE STRICT
    const sem1PassRate = (data.sem1_passed / data.sem1_total) * 100;
    const sem2PassRate = (data.sem2_passed / data.sem2_total) * 100;
    const avgPassRate = (sem1PassRate + sem2PassRate) / 2;
    const avgGrade = (data.sem1_grade + data.sem2_grade) / 2;
    
    // 🆕 STRICT PASS RATE - Must pass 60%+ subjects to avoid high risk
    if (avgPassRate < 60) {
        console.log('❌ Low pass rate detected:', avgPassRate.toFixed(1)+'%');
        return 0; // High dropout risk
    }
    
    // 🆕 STRICT GRADE THRESHOLDS
    // Grades below 12/20 = HIGH RISK (60%)
    if (avgGrade < 12) {
        console.log('❌ Poor grades detected:', avgGrade.toFixed(1)+'/20');
        return 0; // High dropout risk
    }
    
    // Grades 12-16 = MEDIUM RISK (60-80%)
    if (avgGrade < 16) {
        console.log('⚠️ Average grades:', avgGrade.toFixed(1)+'/20');
        score += 25; // Medium risk
    } 
    // Grades 16+ = LOW RISK (80%+)
    else {
        score += 45;
        console.log('✅ Good grades:', avgGrade.toFixed(1)+'/20');
    }
    
    console.log(`📈 Final Analysis - Pass Rate: ${avgPassRate.toFixed(1)}%, Avg Grade: ${avgGrade.toFixed(1)}/20, Score: ${score.toFixed(1)}`);
    
    // 🆕 NEW DECISION LOGIC
    if (score < 50) return 0;  // High Dropout Risk
    if (score < 70) return 1;  // Likely to Continue  
    return 2;                  // Likely to Graduate
}

function getPredictionText(prediction) {
    const texts = {
        0: 'Dropout',
        1: 'Continue',
        2: 'Graduate'
    };
    return texts[prediction];
}

function displayResult(result) {
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const resultSuggestion = document.getElementById('resultSuggestion');
    
    // Handle all possible response formats
    let prediction = null;
    
    if (result.prediction !== undefined) {
        prediction = result.prediction;
    } else if (result.result !== undefined) {
        prediction = result.result;
    } else if (typeof result === 'string') {
        prediction = result;
    } else if (typeof result === 'number') {
        prediction = result;
    }
    
    let riskLevel, title, message, suggestion;
    
    if (prediction == 0 || prediction === '0' || prediction === 'Dropout' || prediction === 'dropout') {
        riskLevel = 'high-risk';
        title = 'High Dropout Risk';
        message = 'Student shows multiple risk indicators suggesting high probability of dropout.';
        suggestion = `
            <strong>🚨 Critical Actions Required:</strong><br>
            - Immediate academic intervention<br>
            - Financial counseling session<br>
            - Academic probation monitoring<br>
            - Family counseling recommended
        `;
    } else if (prediction == 1 || prediction === '1' || prediction === 'Continue' || prediction === 'Enrolled' || prediction === 'continue') {
        riskLevel = 'continue';
        title = 'Likely to Continue';
        message = 'Moderate risk level. Student needs support to maintain progress.';
        suggestion = `
            <strong>⚠️ Recommended Support:</strong><br>
            - Weekly academic check-ins<br>
            - Study skills workshop enrollment<br>
            - Peer mentoring program<br>
            - Next semester monitoring
        `;
    } else if (prediction == 2 || prediction === '2' || prediction === 'Graduate' || prediction === 'graduate') {
        riskLevel = 'graduate';
        title = 'Likely to Graduate';
        message = 'Strong academic performance and stability indicate high graduation probability.';
        suggestion = `
            <strong>✅ Maintain Success:</strong><br>
            - Continue current academic support<br>
            - Leadership development opportunities<br>
            - Career guidance counseling<br>
            - Scholarship renewal consideration
        `;
    } else {
        riskLevel = 'high-risk';
        title = 'Analysis Error';
        message = 'Unable to determine prediction. Please check data.';
        suggestion = 'Contact administrator for manual review.';
    }
    
    resultIcon.innerHTML = getIconForRisk(riskLevel);
    resultIcon.className = `result-icon ${riskLevel}`;
    resultTitle.textContent = title;
    resultMessage.textContent = message;
    resultSuggestion.innerHTML = suggestion;
    
    showStep(4);
}

function getIconForRisk(riskLevel) {
    const icons = {
        'high-risk': '<i class="fas fa-exclamation-triangle"></i>',
        'continue': '<i class="fas fa-exclamation-circle"></i>',
        'graduate': '<i class="fas fa-check-circle"></i>'
    };
    return icons[riskLevel] || '<i class="fas fa-question-circle"></i>';
}

function showLoading(show) {
    loadingOverlay.classList.toggle('active', show);
}

function resetForm() {
    // Reset all forms
    document.getElementById('studentForm').reset();
    document.getElementById('financeForm').reset();
    
    // Reset academic fields
    ['sem1_total', 'sem1_passed', 'sem1_grade', 'sem2_total', 'sem2_passed', 'sem2_grade'].forEach(id => {
        document.getElementById(id).value = '';
        document.getElementById(id).classList.remove('input-error');
    });
    
    // Reset course dropdown
    document.getElementById('course').disabled = true;
    document.getElementById('course').innerHTML = '<option value="">Select Course (after department)</option>';
    
    // Clear errors
    ['nameError', 'regError'].forEach(id => clearError(id));
    
    // Reset to step 1
    showStep(1);
    console.log('🔄 Form reset complete');
}

// Expose functions globally for onclick handlers
window.nextStep = nextStep;
window.prevStep = prevStep;
window.predictStudent = predictStudent;
window.resetForm = resetForm;