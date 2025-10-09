// Home Page Logic
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Initialize variables
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    let editingTaskId = null;

    // DOM elements
    const usernameDisplay = document.getElementById('username-display');
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskFilter = document.getElementById('taskFilter');
    const emptyState = document.getElementById('emptyState');
    const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
    const editTaskForm = document.getElementById('editTaskForm');
    const editTaskInput = document.getElementById('editTaskInput');
    const saveTaskBtn = document.getElementById('saveTaskBtn');

    // Set username
    usernameDisplay.textContent = localStorage.getItem('username') || 'Usuário';

    // Event listeners
    taskForm.addEventListener('submit', addTask);
    taskFilter.addEventListener('change', filterTasks);
    editTaskForm.addEventListener('submit', saveEditedTask);
    saveTaskBtn.addEventListener('click', saveEditedTask);

    // Initialize app
    renderTasks();
    updateStats();

    // Add new task
    function addTask(e) {
        e.preventDefault();
        
        const taskText = taskInput.value.trim();
        if (!taskText) return;

        const newTask = {
            id: generateId(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        updateStats();
        
        // Clear input with animation
        taskInput.value = '';
        taskInput.focus();
        
        // Add success feedback
        showNotification('Tarefa adicionada com sucesso!', 'success');
    }

    // Toggle task completion
    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            
            saveTasks();
            renderTasks();
            updateStats();
            
            const message = task.completed ? 'Tarefa concluída!' : 'Tarefa reativada!';
            const type = task.completed ? 'success' : 'info';
            showNotification(message, type);
        }
    }

    // Edit task
    function editTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            editingTaskId = id;
            editTaskInput.value = task.text;
            editTaskModal.show();
            
            // Focus on input after modal is shown
            setTimeout(() => {
                editTaskInput.focus();
                editTaskInput.select();
            }, 500);
        }
    }

    // Save edited task
    function saveEditedTask(e) {
        e.preventDefault();
        
        const newText = editTaskInput.value.trim();
        if (!newText || !editingTaskId) return;

        const task = tasks.find(t => t.id === editingTaskId);
        if (task) {
            task.text = newText;
            saveTasks();
            renderTasks();
            editTaskModal.hide();
            editingTaskId = null;
            showNotification('Tarefa atualizada!', 'success');
        }
    }

    // Delete task
    function deleteTask(id) {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
            updateStats();
            showNotification('Tarefa excluída!', 'warning');
        }
    }

    // Filter tasks
    function filterTasks() {
        currentFilter = taskFilter.value;
        renderTasks();
    }

    // Render tasks
    function renderTasks() {
        const filteredTasks = getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            taskList.style.display = 'none';
            emptyState.style.display = 'block';
            
            // Update empty state message based on filter
            const emptyMessages = {
                all: 'Nenhuma tarefa ainda',
                pending: 'Nenhuma tarefa pendente',
                completed: 'Nenhuma tarefa concluída'
            };
            
            const emptyDescriptions = {
                all: 'Que tal começar adicionando sua primeira tarefa?',
                pending: 'Todas as tarefas foram concluídas! 🎉',
                completed: 'Nenhuma tarefa foi concluída ainda'
            };
            
            emptyState.querySelector('h3').textContent = emptyMessages[currentFilter];
            emptyState.querySelector('p').textContent = emptyDescriptions[currentFilter];
        } else {
            emptyState.style.display = 'none';
            taskList.style.display = 'block';
            
            taskList.innerHTML = filteredTasks.map(task => createTaskHTML(task)).join('');
            
            // Add event listeners to task elements
            attachTaskEventListeners();
        }
    }

    // Get filtered tasks
    function getFilteredTasks() {
        switch (currentFilter) {
            case 'pending':
                return tasks.filter(t => !t.completed);
            case 'completed':
                return tasks.filter(t => t.completed);
            default:
                return tasks;
        }
    }

    // Create task HTML
    function createTaskHTML(task) {
        const completedClass = task.completed ? 'completed' : '';
        const checkedAttr = task.completed ? 'checked' : '';
        
        return `
            <div class="task-item ${completedClass} slide-in" data-id="${task.id}">
                <input type="checkbox" class="form-check-input task-checkbox" ${checkedAttr} 
                       onchange="toggleTask('${task.id}')">
                <p class="task-text">${escapeHtml(task.text)}</p>
                <div class="task-actions">
                    <button class="btn-action btn-edit" onclick="editTask('${task.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteTask('${task.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Attach event listeners to task elements
    function attachTaskEventListeners() {
        // Event listeners are handled via inline onclick for simplicity
        // In a larger app, you might want to use event delegation
    }

    // Update statistics
    function updateStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;
        const pendingTasks = totalTasks - completedTasks;

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;

        // Animate counters
        animateCounter('totalTasks', totalTasks);
        animateCounter('completedTasks', completedTasks);
        animateCounter('pendingTasks', pendingTasks);
    }

    // Animate counter
    function animateCounter(elementId, finalValue) {
        const element = document.getElementById(elementId);
        const currentValue = parseInt(element.textContent) || 0;
        
        if (currentValue !== finalValue) {
            let start = currentValue;
            const increment = finalValue > start ? 1 : -1;
            const timer = setInterval(() => {
                start += increment;
                element.textContent = start;
                if (start === finalValue) {
                    clearInterval(timer);
                }
            }, 50);
        }
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Generate unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        const icons = {
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle',
            danger: 'fas fa-times-circle'
        };
        
        notification.innerHTML = `
            <i class="${icons[type]} me-2"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Global functions (attached to window for inline event handlers)
    window.toggleTask = toggleTask;
    window.editTask = editTask;
    window.deleteTask = deleteTask;

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to add task
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (document.activeElement === taskInput) {
                taskForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape to close modal
        if (e.key === 'Escape' && editTaskModal._isShown) {
            editTaskModal.hide();
        }
    });

    // Auto-focus on task input
    taskInput.focus();
});

// Logout function
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        if (localStorage.getItem('rememberMe') !== 'true') {
            localStorage.clear();
        }
        window.location.href = 'index.html';
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);