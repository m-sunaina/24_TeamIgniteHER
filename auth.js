// Form toggle functionality
function toggleForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (formType === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        handleRoleChange();
    }
}

// Handle role change for conditional fields
function handleRoleChange() {
    const role = document.getElementById('userRole').value;
    const sportsCategory = document.getElementById('sportsCategory');
    const sportSelect = document.getElementById('sport');
    const experienceLevel = document.getElementById('experienceLevel');
    const experienceSelect = document.getElementById('experience');
    const companyDetails = document.getElementById('companyDetails');
    const companyInput = document.getElementById('companyName');
    
    // Hide all conditional fields first and remove required attribute
    sportsCategory.classList.add('hidden');
    sportSelect.required = false;
    
    experienceLevel.classList.add('hidden');
    experienceSelect.required = false;
    
    companyDetails.classList.add('hidden');
    companyInput.required = false;
    
    // Show relevant fields based on role and set required attribute
    switch (role) {
        case 'athlete':
            sportsCategory.classList.remove('hidden');
            sportSelect.required = true;
            break;
        case 'mentor':
            experienceLevel.classList.remove('hidden');
            experienceSelect.required = true;
            break;
        case 'sponsor':
            companyDetails.classList.remove('hidden');
            companyInput.required = true;
            break;
    }
}

// Login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        // Use relative URL instead of hardcoded localhost
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Show success message before redirecting
            showSuccess('Login successful! Redirecting...');
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            showSuccess('Login successful! Redirecting...');
            // Redirect after a short delay to show the message
            setTimeout(() => {
                // Change this to your actual leaderboard page or home page
                window.location.href = '/dashboard';
            }, 2000);
        } else {
            showError(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('An error occurred. Please try again.');
    }
}

// Sign up form submission
async function handleSignup(event) {
    event.preventDefault();
    
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('userRole').value;
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    if (!role) {
        showError('Please select a role');
        return;
    }
    
    const userData = {
        name: document.getElementById('signupName').value,
        email: document.getElementById('signupEmail').value,
        password: password,
        role: role
    };
    
    // Add conditional fields based on role
    switch (userData.role) {
        case 'athlete':
            const sport = document.getElementById('sport').value;
            if (!sport) {
                showError('Please select a sports category');
                return;
            }
            userData.sportsCategory = sport;
            break;
        case 'mentor':
            const experience = document.getElementById('experience').value;
            if (!experience) {
                showError('Please select an experience level');
                return;
            }
            userData.experienceLevel = experience;
            break;
        case 'sponsor':
            const companyName = document.getElementById('companyName').value;
            if (!companyName) {
                showError('Please enter a company name');
                return;
            }
            userData.companyName = companyName;
            break;
    }
    
    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess('Account created successfully! Please log in.');
            setTimeout(() => toggleForm('login'), 2000);
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('An error occurred. Please try again.');
    }
}

// Social login handlers
function handleGoogleLogin() {
    // Implement Google OAuth login
    console.log('Google login clicked');
}

function handleFacebookLogin() {
    // Implement Facebook OAuth login
    console.log('Facebook login clicked');
}

// Error and success message handlers
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const form = document.querySelector('form');
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const form = document.querySelector('form');
    form.insertBefore(successDiv, form.firstChild);
    
    setTimeout(() => successDiv.remove(), 5000);
}