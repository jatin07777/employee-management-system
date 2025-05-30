// DOM Elements - Get references to all required HTML elements
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const modal = document.getElementById('employeeModal');
const closeBtn = document.querySelector('.close');
const employeeForm = document.getElementById('employeeForm');
const employeesList = document.getElementById('employeesList');
const searchInput = document.getElementById('searchInput');
const departmentFilter = document.getElementById('departmentFilter');

// State Management
// Load employees from localStorage or initialize empty array
let employees = JSON.parse(localStorage.getItem('employees')) || [];
let editingId = null; // Track which employee is being edited

// Event Listeners
// Open modal when Add Employee button is clicked
addEmployeeBtn.addEventListener('click', () => openModal());
// Close modal when close button is clicked
closeBtn.addEventListener('click', closeModal);
// Handle form submission
employeeForm.addEventListener('submit', handleFormSubmit);
// Real-time search functionality
searchInput.addEventListener('input', filterEmployees);
// Department filter functionality
departmentFilter.addEventListener('change', filterEmployees);

// Functions

/**
 * Opens the modal for adding or editing an employee
 * @param {Object} employee - Employee object to edit (optional)
 */
function openModal(employee = null) {
    modal.style.display = 'block';
    if (employee) {
        // If editing, populate form with employee data
        editingId = employee.id;
        document.getElementById('name').value = employee.name;
        document.getElementById('email').value = employee.email;
        document.getElementById('department').value = employee.department;
        document.getElementById('position').value = employee.position;
        document.getElementById('salary').value = employee.salary;
        document.getElementById('modalTitle').textContent = 'Edit Employee';
    } else {
        // If adding new employee, reset form
        editingId = null;
        employeeForm.reset();
        document.getElementById('modalTitle').textContent = 'Add Employee';
    }
}

/**
 * Closes the modal and resets the form
 */
function closeModal() {
    modal.style.display = 'none';
    employeeForm.reset();
    editingId = null;
}

/**
 * Handles form submission for adding/editing employees
 * @param {Event} e - Form submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Create employee object from form data
    const employee = {
        id: editingId || Date.now().toString(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value,
        position: document.getElementById('position').value,
        salary: document.getElementById('salary').value
    };

    // Update or add employee
    if (editingId) {
        employees = employees.map(emp => emp.id === editingId ? employee : emp);
    } else {
        employees.push(employee);
    }

    // Save and refresh display
    saveEmployees();
    renderEmployees();
    closeModal();
}

/**
 * Deletes an employee after confirmation
 * @param {string} id - Employee ID to delete
 */
function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        employees = employees.filter(emp => emp.id !== id);
        saveEmployees();
        renderEmployees();
    }
}

/**
 * Opens modal to edit an employee
 * @param {string} id - Employee ID to edit
 */
function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        openModal(employee);
    }
}

/**
 * Saves employees to localStorage
 */
function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

/**
 * Renders the employee list in the table
 * @param {Array} filteredEmployees - Optional filtered list of employees
 */
function renderEmployees(filteredEmployees = null) {
    const employeesToRender = filteredEmployees || employees;
    employeesList.innerHTML = '';

    employeesToRender.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.email}</td>
            <td>${employee.department}</td>
            <td>${employee.position}</td>
            <td>$${employee.salary}</td>
            <td class="action-buttons">
                <button class="btn primary" onclick="editEmployee('${employee.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn danger" onclick="deleteEmployee('${employee.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        employeesList.appendChild(row);
    });
}

/**
 * Filters employees based on search term and department
 */
function filterEmployees() {
    const searchTerm = searchInput.value.toLowerCase();
    const departmentValue = departmentFilter.value;

    const filtered = employees.filter(employee => {
        const matchesSearch = employee.name.toLowerCase().includes(searchTerm) ||
                            employee.email.toLowerCase().includes(searchTerm) ||
                            employee.position.toLowerCase().includes(searchTerm);
        const matchesDepartment = !departmentValue || employee.department === departmentValue;
        return matchesSearch && matchesDepartment;
    });

    renderEmployees(filtered);
}

// Initial render of employees
renderEmployees();

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
}); 