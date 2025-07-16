
// Mobile menu toggle function
function toggleMobileMenu() {
    const nav = document.getElementById('mobileNav');
    if (nav) {
        nav.classList.toggle('active');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.getElementById('mobileNav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (nav && toggle && nav.classList.contains('active') && !nav.contains(event.target) && !toggle.contains(event.target)) {
        nav.classList.remove('active');
    }
});

// Attendance Calculator Functionality
document.addEventListener('DOMContentLoaded', function() {
    const attendanceForm = document.getElementById('attendanceForm');
    const resultDiv = document.getElementById('result');
    const percentageValue = document.getElementById('percentageValue');
    const statusText = document.getElementById('statusText');
    const percentageDisplay = document.querySelector('.percentage-display');

    if (attendanceForm) {
        attendanceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateAttendance();
        });
    }

    function calculateAttendance() {
        const totalClasses = parseInt(document.getElementById('totalClasses').value);
        const attendedClasses = parseInt(document.getElementById('attendedClasses').value);

        // Validation
        if (attendedClasses > totalClasses) {
            showError('Classes attended cannot be more than total classes.');
            return;
        }

        if (totalClasses <= 0) {
            showError('Total classes must be greater than 0.');
            return;
        }

        // Calculate percentage
        const percentage = (attendedClasses / totalClasses) * 100;
        const roundedPercentage = Math.round(percentage * 100) / 100;

        // Display result
        percentageValue.textContent = roundedPercentage + '%';
        
        // Remove previous status classes
        percentageDisplay.classList.remove('good', 'warning', 'danger');
        
        // Set status and color based on percentage
        if (roundedPercentage >= 75) {
            percentageDisplay.classList.add('good');
            statusText.textContent = 'Excellent! You meet the minimum attendance requirement.';
            statusText.style.color = '#059669';
        } else if (roundedPercentage >= 65) {
            percentageDisplay.classList.add('warning');
            statusText.textContent = 'Warning: Your attendance is below 75%. You need to attend more classes.';
            statusText.style.color = '#d97706';
        } else {
            percentageDisplay.classList.add('danger');
            statusText.textContent = 'Critical: Your attendance is very low. Immediate action required.';
            statusText.style.color = '#dc2626';
        }

        resultDiv.classList.remove('hidden');
        hideError();
    }

    function showError(message) {
        hideError();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        attendanceForm.appendChild(errorDiv);
    }

    function hideError() {
        const existingError = attendanceForm.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
});

// Required Attendance Calculator
function calculateRequiredAttendance() {
    const currentTotal = parseInt(document.getElementById('currentTotal').value);
    const currentAttended = parseInt(document.getElementById('currentAttended').value);
    const targetPercentage = parseFloat(document.getElementById('targetPercentage').value);

    if (currentAttended > currentTotal) {
        showRequiredError('Current attended cannot be more than current total.');
        return;
    }

    if (targetPercentage < 0 || targetPercentage > 100) {
        showRequiredError('Target percentage must be between 0 and 100.');
        return;
    }

    // Calculate required classes
    const currentPercentage = (currentAttended / currentTotal) * 100;
    
    if (currentPercentage >= targetPercentage) {
        document.getElementById('requiredResult').innerHTML = `
            <div class="success-message">
                <h3>Great News!</h3>
                <p>You already have ${currentPercentage.toFixed(2)}% attendance, which meets your target of ${targetPercentage}%.</p>
            </div>
        `;
        return;
    }

    // Formula: (currentAttended + x) / (currentTotal + x) = targetPercentage/100
    // Solving for x: x = (targetPercentage * currentTotal - 100 * currentAttended) / (100 - targetPercentage)
    const requiredClasses = Math.ceil((targetPercentage * currentTotal - 100 * currentAttended) / (100 - targetPercentage));

    if (requiredClasses < 0) {
        document.getElementById('requiredResult').innerHTML = `
            <div class="success-message">
                <h3>You're all set!</h3>
                <p>Your current attendance of ${currentPercentage.toFixed(2)}% already exceeds your target.</p>
            </div>
        `;
    } else {
        const finalTotal = currentTotal + requiredClasses;
        const finalAttended = currentAttended + requiredClasses;
        const finalPercentage = (finalAttended / finalTotal) * 100;

        document.getElementById('requiredResult').innerHTML = `
            <div class="result">
                <h3>Classes Required</h3>
                <div class="percentage-display good">${requiredClasses}</div>
                <p>You need to attend <strong>${requiredClasses}</strong> consecutive classes to reach ${targetPercentage}% attendance.</p>
                <p>Final attendance: ${finalAttended}/${finalTotal} = ${finalPercentage.toFixed(2)}%</p>
            </div>
        `;
    }
}

// Bunk Calculator
function calculateBunkLimit() {
    const totalClasses = parseInt(document.getElementById('bunkTotal').value);
    const attendedClasses = parseInt(document.getElementById('bunkAttended').value);
    const minimumPercentage = parseFloat(document.getElementById('minimumPercentage').value);

    if (attendedClasses > totalClasses) {
        showBunkError('Attended classes cannot be more than total classes.');
        return;
    }

    const currentPercentage = (attendedClasses / totalClasses) * 100;
    
    if (currentPercentage < minimumPercentage) {
        document.getElementById('bunkResult').innerHTML = `
            <div class="error-message">
                <h3>Cannot Skip Classes</h3>
                <p>Your current attendance (${currentPercentage.toFixed(2)}%) is already below the minimum requirement (${minimumPercentage}%).</p>
                <p>You need to attend more classes instead of skipping them.</p>
            </div>
        `;
        return;
    }

    // Calculate maximum classes that can be skipped
    // Formula: (attendedClasses) / (totalClasses + x) >= minimumPercentage/100
    // Solving for x: x <= (100 * attendedClasses - minimumPercentage * totalClasses) / minimumPercentage
    const maxSkippable = Math.floor((100 * attendedClasses - minimumPercentage * totalClasses) / minimumPercentage);

    if (maxSkippable <= 0) {
        document.getElementById('bunkResult').innerHTML = `
            <div class="error-message">
                <h3>Cannot Skip Any Classes</h3>
                <p>You cannot skip any classes while maintaining ${minimumPercentage}% attendance.</p>
            </div>
        `;
    } else {
        const finalTotal = totalClasses + maxSkippable;
        const finalPercentage = (attendedClasses / finalTotal) * 100;

        document.getElementById('bunkResult').innerHTML = `
            <div class="result">
                <h3>Classes You Can Skip</h3>
                <div class="percentage-display warning">${maxSkippable}</div>
                <p>You can skip up to <strong>${maxSkippable}</strong> classes while maintaining ${minimumPercentage}% attendance.</p>
                <p>Final attendance would be: ${attendedClasses}/${finalTotal} = ${finalPercentage.toFixed(2)}%</p>
            </div>
        `;
    }
}

// Class Attendance Tracker
function addSubject() {
    const subjectName = document.getElementById('subjectName').value.trim();
    const totalClasses = parseInt(document.getElementById('subjectTotal').value);
    const attendedClasses = parseInt(document.getElementById('subjectAttended').value);

    if (!subjectName) {
        showTrackerError('Please enter a subject name.');
        return;
    }

    if (attendedClasses > totalClasses) {
        showTrackerError('Attended classes cannot be more than total classes.');
        return;
    }

    const percentage = (attendedClasses / totalClasses) * 100;
    const subjectList = document.getElementById('subjectList');
    
    const subjectRow = document.createElement('div');
    subjectRow.className = 'subject-row';
    subjectRow.innerHTML = `
        <div class="subject-info">
            <h4>${subjectName}</h4>
            <p>${attendedClasses}/${totalClasses} classes</p>
        </div>
        <div class="subject-percentage ${percentage >= 75 ? 'good' : percentage >= 65 ? 'warning' : 'danger'}">
            ${percentage.toFixed(1)}%
        </div>
        <button onclick="removeSubject(this)" class="remove-btn">Remove</button>
    `;
    
    subjectList.appendChild(subjectRow);
    
    // Clear form
    document.getElementById('subjectName').value = '';
    document.getElementById('subjectTotal').value = '';
    document.getElementById('subjectAttended').value = '';
    
    hideTrackerError();
    updateOverallAttendance();
}

function removeSubject(button) {
    button.parentElement.remove();
    updateOverallAttendance();
}

function updateOverallAttendance() {
    const subjectRows = document.querySelectorAll('.subject-row');
    let totalClasses = 0;
    let totalAttended = 0;

    subjectRows.forEach(row => {
        const text = row.querySelector('p').textContent;
        const [attended, total] = text.split('/').map(s => parseInt(s.trim()));
        totalAttended += attended;
        totalClasses += total;
    });

    const overallDiv = document.getElementById('overallAttendance');
    if (totalClasses > 0) {
        const overallPercentage = (totalAttended / totalClasses) * 100;
        overallDiv.innerHTML = `
            <h3>Overall Attendance</h3>
            <div class="percentage-display ${overallPercentage >= 75 ? 'good' : overallPercentage >= 65 ? 'warning' : 'danger'}">
                ${overallPercentage.toFixed(1)}%
            </div>
            <p>${totalAttended}/${totalClasses} total classes</p>
        `;
        overallDiv.classList.remove('hidden');
    } else {
        overallDiv.classList.add('hidden');
    }
}

// Working Days Calculator
function calculateWorkingDays() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    if (startDate >= endDate) {
        showWorkingDaysError('End date must be after start date.');
        return;
    }

    let workingDays = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        // Count Monday (1) through Friday (5) as working days
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            workingDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    document.getElementById('workingDaysResult').innerHTML = `
        <div class="result">
            <h3>Working Days Calculation</h3>
            <div class="percentage-display good">${workingDays}</div>
            <p><strong>${workingDays}</strong> working days between the selected dates.</p>
            <p>Total days (including weekends): ${totalDays}</p>
            <p>Weekend days: ${totalDays - workingDays}</p>
        </div>
    `;

    hideWorkingDaysError();
}

// Attendance to Grade Converter
function convertToGrade() {
    const attendancePercentage = parseFloat(document.getElementById('gradeAttendance').value);

    if (attendancePercentage < 0 || attendancePercentage > 100) {
        showGradeError('Attendance percentage must be between 0 and 100.');
        return;
    }

    let grade, gpa, description;

    if (attendancePercentage >= 95) {
        grade = 'A+';
        gpa = '4.0';
        description = 'Excellent attendance';
    } else if (attendancePercentage >= 90) {
        grade = 'A';
        gpa = '3.7-3.9';
        description = 'Very good attendance';
    } else if (attendancePercentage >= 85) {
        grade = 'B+';
        gpa = '3.3-3.6';
        description = 'Good attendance';
    } else if (attendancePercentage >= 80) {
        grade = 'B';
        gpa = '3.0-3.2';
        description = 'Satisfactory attendance';
    } else if (attendancePercentage >= 75) {
        grade = 'C+';
        gpa = '2.7-2.9';
        description = 'Minimum required attendance';
    } else if (attendancePercentage >= 70) {
        grade = 'C';
        gpa = '2.3-2.6';
        description = 'Below required attendance';
    } else if (attendancePercentage >= 65) {
        grade = 'D';
        gpa = '2.0-2.2';
        description = 'Poor attendance';
    } else {
        grade = 'F';
        gpa = '0.0-1.9';
        description = 'Failing attendance';
    }

    document.getElementById('gradeResult').innerHTML = `
        <div class="result">
            <h3>Attendance Grade</h3>
            <div class="percentage-display ${attendancePercentage >= 75 ? 'good' : attendancePercentage >= 65 ? 'warning' : 'danger'}">
                ${grade}
            </div>
            <p><strong>Grade:</strong> ${grade}</p>
            <p><strong>GPA Range:</strong> ${gpa}</p>
            <p><strong>Description:</strong> ${description}</p>
        </div>
    `;

    hideGradeError();
}

// Error handling functions for different calculators
function showRequiredError(message) {
    hideRequiredError();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.getElementById('requiredForm').appendChild(errorDiv);
}

function hideRequiredError() {
    const existingError = document.getElementById('requiredForm').querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function showBunkError(message) {
    hideBunkError();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.getElementById('bunkForm').appendChild(errorDiv);
}

function hideBunkError() {
    const existingError = document.getElementById('bunkForm').querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function showTrackerError(message) {
    hideTrackerError();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.getElementById('trackerForm').appendChild(errorDiv);
}

function hideTrackerError() {
    const existingError = document.getElementById('trackerForm').querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function showWorkingDaysError(message) {
    hideWorkingDaysError();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.getElementById('workingDaysForm').appendChild(errorDiv);
}

function hideWorkingDaysError() {
    const existingError = document.getElementById('workingDaysForm').querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function showGradeError(message) {
    hideGradeError();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.getElementById('gradeForm').appendChild(errorDiv);
}

function hideGradeError() {
    const existingError = document.getElementById('gradeForm').querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Contact form submission
function submitContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    
    // Simulate form submission
    document.getElementById('contactResult').innerHTML = `
        <div class="success-message">
            <h3>Message Sent!</h3>
            <p>Thank you ${name}, we've received your message and will get back to you soon.</p>
        </div>
    `;
    
    // Clear form
    document.getElementById('contactForm').reset();
}

// Login form submission
function submitLoginForm(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulate login
    if (email && password) {
        alert('Login successful! Redirecting to dashboard...');
        // In a real application, this would redirect to an actual dashboard
        window.location.href = '#dashboard';
    } else {
        document.getElementById('loginResult').innerHTML = `
            <div class="error-message">
                Please fill in all fields.
            </div>
        `;
    }
}
