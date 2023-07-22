document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');
    const taskDateInput = document.getElementById('task-date'); // Agrega el input para la fecha
    const taskTimeInput = document.getElementById('task-time'); // Agrega el input para la hora
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
        const date = taskDateInput.value; // Obtiene la fecha del formulario directamente
        const time = taskTimeInput.value; // Obtiene la hora del formulario directamente

        // Elimina la clase de error si se agregó anteriormente
        taskTitleInput.classList.remove('error');
        taskDescriptionInput.classList.remove('error');

        if (title && description && date && time) {
            const task = {
                id: Date.now(),
                title,
                description,
                date, // Usa la fecha obtenida del formulario
                time, // Usa la hora obtenida del formulario
            };
            saveTask(task);
            taskTitleInput.value = '';
            taskDescriptionInput.value = '';
            taskDateInput.value = ''; // Limpia el input de la fecha
            taskTimeInput.value = ''; // Limpia el input de la hora
            loadTasks(); // Carga las tareas nuevamente para mostrar la nueva tarea
        } else {
            // Agrega clase de error a campos vacíos
            if (!title) taskTitleInput.classList.add('error');
            if (!description) taskDescriptionInput.classList.add('error');
            if (!date) alert('Debes seleccionar una fecha.');
            if (!time) alert('Debes seleccionar una hora.');
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

        // Ordenar las tareas por fecha y hora (de más antigua a más reciente)
        tasks.sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            return dateA - dateB;
        });

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${task.title}</strong>
                <p>${task.description}</p>
                <p><em>Fecha: ${task.date}</em></p>
                <p><em>Hora: ${task.time}</em></p>
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
