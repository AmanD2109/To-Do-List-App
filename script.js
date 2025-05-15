// Select DOM elements for task input, add button, and task list container
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');

// Load tasks from local storage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render the tasks list on the page
function renderTasks() {
    taskList.innerHTML = ''; 

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';

        // Checkbox to mark complete/incomplete
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompletion(index));

        // Editable
        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        taskText.className = 'task-text';

        // On double click, make task text editable
        taskText.addEventListener('dblclick', () => {
            editTask(index);
        });

        // Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.addEventListener('click', () => editTask(index));

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => deleteTask(index));

        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

// Add a new task if input is valid
function addTask() {
    const text = taskInput.value.trim();

    if (text === '') {
        alert('Task cannot be empty.');
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

// Toggle the completed state of a task
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Edit the task text
function editTask(index) {
    const li = taskList.children[index];
    const task = tasks[index];

    // Create an input to replace the text span for editing
    const input = document.createElement('input');
    input.type = 'text';
    input.value = task.text;
    input.className = 'edit-input';

    // Replace the task text span with input
    const taskTextSpan = li.querySelector('.task-text');
    li.replaceChild(input, taskTextSpan);
    input.focus();

    // Save changes on Enter or when input loses focus
    function saveEdit() {
        const newValue = input.value.trim();
        if (newValue === '') {
            alert('Task cannot be empty.');
            input.focus();
            return;
        }
        tasks[index].text = newValue;
        saveTasks();
        renderTasks();
    }

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        } else if (e.key === 'Escape') {
            renderTasks(); // Cancel edit
        }
    });
}

// Delete a task from the list
function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

// Event listeners
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});


renderTasks();

