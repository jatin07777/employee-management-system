// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    addLogoutButton();
    loadEmployees();
    setupEventListeners();
});

// Load employees from localStorage
function loadEmployees() {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const tableBody = document.getElementById('employeeTableBody');
    tableBody.innerHTML = '';

    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.department}</td>
            <td>${employee.position}</td>
            <td>$${employee.salary}</td>
            <td>
                <button class="btn small edit" data-id="${employee.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn small delete" data-id="${employee.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Add Employee button
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const modal = document.getElementById('employeeModal');
    const closeBtn = document.querySelector('.close');
    const employeeForm = document.getElementById('employeeForm');

    addEmployeeBtn.onclick = () => {
        document.getElementById('modalTitle').textContent = 'Add Employee';
        employeeForm.reset();
        modal.style.display = 'block';
    };

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Form submission
    employeeForm.onsubmit = (e) => {
        e.preventDefault();
        const employees = JSON.parse(localStorage.getItem('employees')) || [];
        const employeeId = employeeForm.dataset.editId || Date.now().toString();

        const employee = {
            id: employeeId,
            name: document.getElementById('employeeName').value,
            department: document.getElementById('employeeDepartment').value,
            position: document.getElementById('employeePosition').value,
            salary: document.getElementById('employeeSalary').value
        };

        if (employeeForm.dataset.editId) {
            const index = employees.findIndex(e => e.id === employeeId);
            employees[index] = employee;
        } else {
            employees.push(employee);
        }

        localStorage.setItem('employees', JSON.stringify(employees));
        modal.style.display = 'none';
        loadEmployees();
    };

    // Edit and Delete buttons
    document.getElementById('employeeTableBody').addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const employeeId = target.dataset.id;
        const employees = JSON.parse(localStorage.getItem('employees')) || [];
        const employee = employees.find(e => e.id === employeeId);

        if (target.classList.contains('edit')) {
            document.getElementById('modalTitle').textContent = 'Edit Employee';
            document.getElementById('employeeName').value = employee.name;
            document.getElementById('employeeDepartment').value = employee.department;
            document.getElementById('employeePosition').value = employee.position;
            document.getElementById('employeeSalary').value = employee.salary;
            employeeForm.dataset.editId = employeeId;
            modal.style.display = 'block';
        } else if (target.classList.contains('delete')) {
            if (confirm('Are you sure you want to delete this employee?')) {
                const updatedEmployees = employees.filter(e => e.id !== employeeId);
                localStorage.setItem('employees', JSON.stringify(updatedEmployees));
                loadEmployees();
            }
        }
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', filterEmployees);
    document.getElementById('departmentFilter').addEventListener('change', filterEmployees);
}

// Filter employees based on search and department
function filterEmployees() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const departmentFilter = document.getElementById('departmentFilter').value;
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const tableBody = document.getElementById('employeeTableBody');
    tableBody.innerHTML = '';

    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = employee.name.toLowerCase().includes(searchTerm) ||
                            employee.position.toLowerCase().includes(searchTerm);
        const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
        return matchesSearch && matchesDepartment;
    });

    filteredEmployees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.department}</td>
            <td>${employee.position}</td>
            <td>$${employee.salary}</td>
            <td>
                <button class="btn small edit" data-id="${employee.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn small delete" data-id="${employee.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
} 