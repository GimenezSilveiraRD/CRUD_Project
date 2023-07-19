document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');
    const tasksContainer = document.getElementById('tasks-container');
    const editTaskForm = document.getElementById('edit-task-form');
    const editTaskTitleInput = document.getElementById('edit-task-title');
    const editTaskDescriptionInput = document.getElementById('edit-task-description');      
    let taskIdToEdit = null;

    // Cargar tasks desde localStorage
    loadTasks();

    // Agregar nueva task
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();

        // Elimina la clase de error si se agregó anteriormente
        taskTitleInput.classList.remove('error');
        taskDescriptionInput.classList.remove('error');

        if (title && description) {
            const task = {
                id: Date.now(),
                title,
                description
            };
            saveTask(task);
            taskTitleInput.value = '';
            taskDescriptionInput.value = '';
            loadTasks();
        } else {
            // Agrega clase de error a campos vacíos
            if (!title) taskTitleInput.classList.add('error');
            if (!description) taskDescriptionInput.classList.add('error');
        }
    });

    // Editar task
    editTaskForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = editTaskTitleInput.value.trim();
        const description = editTaskDescriptionInput.value.trim();

        if (title && description && taskIdToEdit) {
            const updatedTask = {
                id: taskIdToEdit,
                title,
                description
            };
            updateTask(updatedTask);
            editTaskForm.parentNode.setAttribute('hidden', true);
            taskForm.parentNode.removeAttribute('hidden');
            loadTasks();
        }
    });

    function loadTasks() {
        tasksContainer.innerHTML = '';
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${task.title}</strong>
                <p>${task.description}</p>
                <button onclick="deleteTask(${task.id})">Delete</button>
                <button onclick="showEditForm(${task.id})">Edit</button>
            `;
            tasksContainer.appendChild(li);
        });
    }

    function saveTask(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTask(updatedTask) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    window.deleteTask = function(taskId) {
        const userConfirmed = confirm('¿Estás seguro de que deseas eliminar esta tarea?');
        if (userConfirmed) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const filteredTasks = tasks.filter(task => task.id !== taskId);
            localStorage.setItem('tasks', JSON.stringify(filteredTasks));
            loadTasks();
        }
    };

    window.showEditForm = function(taskId) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskToEdit = tasks.find(task => task.id === taskId);
        if (taskToEdit) {
            editTaskTitleInput.value = taskToEdit.title;
            editTaskDescriptionInput.value = taskToEdit.description;
            taskIdToEdit = taskToEdit.id;
            editTaskForm.parentNode.removeAttribute('hidden');
            taskForm.parentNode.setAttribute('hidden', true);
        }
    };
});
