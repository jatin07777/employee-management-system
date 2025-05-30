// User credentials (in a real application, this would be stored securely on a server)
const USERS = {
    admin: {
        password: 'admin123',
        role: 'admin'
    },
    user: {
        password: 'user123',
        role: 'user'
    }
};

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Get current user role
function getUserRole() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user ? user.role : null;
}

// Handle login form submission
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginSection = document.getElementById('loginSection');
    const mainContent = document.getElementById('mainContent');

    // Check if user is already logged in
    if (isLoggedIn()) {
        showMainContent();
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (USERS[username] && USERS[username].password === password) {
                const user = {
                    username: username,
                    role: USERS[username].role
                };
                localStorage.setItem('currentUser', JSON.stringify(user));
                showMainContent();
            } else {
                const errorMessage = document.getElementById('error-message');
                errorMessage.textContent = 'Invalid username or password';
            }
        });
    }
});

// Show main content and hide login
function showMainContent() {
    const loginSection = document.getElementById('loginSection');
    const mainContent = document.getElementById('mainContent');
    
    if (loginSection) loginSection.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
    
    // Initialize main content
    if (typeof loadEmployees === 'function') loadEmployees();
    if (typeof setupEventListeners === 'function') setupEventListeners();
    if (typeof restrictAdminFeatures === 'function') restrictAdminFeatures();
    if (typeof addLogoutButton === 'function') addLogoutButton();
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.reload(); // Reload the page to show login form
}

// Check authentication on protected pages
function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// Add logout button to pages
function addLogoutButton() {
    const header = document.querySelector('header');
    if (header) {
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn secondary';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutBtn.onclick = logout;
        header.appendChild(logoutBtn);
    }
}

// Check if user is admin
function isAdmin() {
    return getUserRole() === 'admin';
}

// Restrict admin-only features
function restrictAdminFeatures() {
    if (!isAdmin()) {
        // Hide admin-only buttons
        const addEmployeeBtn = document.getElementById('addEmployeeBtn');
        if (addEmployeeBtn) addEmployeeBtn.style.display = 'none';

        // Remove edit and delete buttons from table
        const editButtons = document.querySelectorAll('.btn.edit, .btn.delete');
        editButtons.forEach(btn => btn.style.display = 'none');
    }
} 