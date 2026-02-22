const inputField = document.getElementById('todo-input');
const addButton = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const historyList = document.getElementById('history-list');
const prioritySelect = document.getElementById('priority-select');

function addTask() {
    if (inputField.value.trim() !== "") {
        const now = new Date();
        const time = now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const priority = prioritySelect.value;

        renderTask(inputField.value, time, false, priority, "");
        saveData();
        inputField.value = '';
    }
}

function saveData() {
    const todos = [];
    const history = [];

    // 1. this is where we grab all tasks from the Todo List
    todoList.querySelectorAll('li').forEach(li => {
        todos.push({
            text: li.querySelector('.task-text').textContent,
            time: li.querySelector('.timestamp').textContent,
            done: false,
            priority: li.dataset.priority,
            notes: li.querySelector('.task-notes').value
        });
    });

    // 2. this is where we grab all tasks from the History List
    historyList.querySelectorAll('li').forEach(li => {
        history.push({
            text: li.querySelector('.task-text').textContent,
            time: li.querySelector('.timestamp').textContent,
            done: true,
            priority: li.dataset.priority,
            notes: li.querySelector('.task-notes').value
        });
    });

    // 3. This is where we save to localStorage
    localStorage.setItem('todosData', JSON.stringify({ todos, history }));
}

function renderTask(text, time, isDone, priority = 'medium', notes = "") {
    const newTask = document.createElement('li');
    newTask.className = 'task-item'; // Added for easier targeting
    if (isDone) newTask.classList.add('completed');

    // PRIORITY CLASS & DATA
    newTask.classList.add(`prio-${priority}`);
    newTask.dataset.priority = priority;

    const timestamp = document.createElement('span');
    timestamp.textContent = time;
    timestamp.className = 'timestamp';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'task-content';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isDone;

    checkbox.addEventListener('change', function () {
        newTask.classList.toggle('completed');
        if (checkbox.checked) {
            historyList.appendChild(newTask);
        } else {
            todoList.appendChild(newTask);
        }
        saveData();
    });

    const taskText = document.createElement('span');
    taskText.textContent = text;
    taskText.className = 'task-text';

    // DOUBLE CLICK TO EDIT
    taskText.addEventListener('dblclick', function () {
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = taskText.textContent;
        editInput.className = 'edit-input';

        const saveEdit = () => {
            const newText = editInput.value.trim();
            if (newText !== "") {
                taskText.textContent = newText;
            }
            editInput.replaceWith(taskText);
            saveData();
        };

        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') {
                editInput.replaceWith(taskText);
            }
        });

        editInput.addEventListener('blur', saveEdit);

        taskText.replaceWith(editInput);
        editInput.focus();
    });

    // PRIORITY BADGE
    const prioBadge = document.createElement('span');
    prioBadge.textContent = priority.toUpperCase();
    prioBadge.className = 'prio-badge';

    contentWrapper.appendChild(timestamp);
    contentWrapper.appendChild(checkbox);
    contentWrapper.appendChild(taskText);
    contentWrapper.appendChild(prioBadge);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevents expanding when deleting
        newTask.remove();
        saveData();
    });

    // WRAP MAIN CONTENT
    const mainWrapper = document.createElement('div');
    mainWrapper.className = 'task-item-main';
    mainWrapper.appendChild(contentWrapper);
    mainWrapper.appendChild(deleteBtn);

    newTask.appendChild(mainWrapper);

    // DETAILS (NOTES) SECTION
    const detailsSection = document.createElement('div');
    detailsSection.className = 'task-details';

    const notesArea = document.createElement('textarea');
    notesArea.placeholder = 'Add notes here...';
    notesArea.className = 'task-notes';
    notesArea.value = notes;

    // Save notes when they change
    notesArea.addEventListener('input', saveData);
    // Don't toggle expansion when clicking inside the textarea
    notesArea.addEventListener('click', (e) => e.stopPropagation());

    detailsSection.appendChild(notesArea);
    newTask.appendChild(detailsSection);

    // TOGGLE EXPANSION
    newTask.addEventListener('click', function () {
        // Toggle the 'expanded' class
        newTask.classList.toggle('expanded');
    });

    // Put it in the right list!
    if (isDone) {
        historyList.appendChild(newTask);
    } else {
        todoList.appendChild(newTask);
    }
}

function loadData() {
    const savedData = localStorage.getItem('todosData');
    if (savedData) {
        const { todos, history } = JSON.parse(savedData);

        // Rebuild the todo list
        todos.forEach(task => renderTask(task.text, task.time, false, task.priority, task.notes));

        // Rebuild the history list
        history.forEach(task => renderTask(task.text, task.time, true, task.priority, task.notes));
    }
}

// Call it once when the page starts!
loadData();
addButton.addEventListener('click', addTask);

// This is where we allow adding tasks with the "Enter" key
inputField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});