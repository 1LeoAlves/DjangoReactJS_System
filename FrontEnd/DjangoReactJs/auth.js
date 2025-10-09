// Authentication Logic
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'home.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const errorMessage = document.getElementById('errorMessage');

    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validate inputs
        if (!username || !password) {
            showError('Por favor, preencha todos os campos.');
            return;
        }

        // Simulate authentication (accept any non-empty credentials)
        if (username.length >= 2 && password.length >= 2) {
            // Store user data
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('rememberMe', rememberMe);
            
            // Add success animation
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Entrando...';
            submitBtn.disabled = true;
            
            // Hide error if visible
            hideError();
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            showError('Usuário deve ter pelo menos 2 caracteres e senha pelo menos 2 caracteres.');
        }
    });

    // Auto-fill if user was remembered
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            document.getElementById('username').value = savedUsername;
            document.getElementById('rememberMe').checked = true;
        }
    }

    // Add input animations
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        loginError.classList.remove('d-none');
        loginError.classList.add('fade-in');
        
        // Auto-hide after 5 seconds
        setTimeout(hideError, 5000);
    }

    // Hide error message
    function hideError() {
        loginError.classList.add('d-none');
        loginError.classList.remove('fade-in');
    }

    // Add enter key support for username field
    document.getElementById('username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('password').focus();
        }
    });

    // Add some visual feedback for the form
    const formElements = document.querySelectorAll('.form-control, .btn-primary');
    formElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});