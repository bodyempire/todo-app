const inputField = document.getElementById('todo-input');
const addButton = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const historyList = document.getElementById('history-list');

function addTask() {
    if (inputField.value.trim() !== "") {
        const now = new Date();
        const time = now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

        renderTask(inputField.value, time, false);
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
            text: li.querySelector('.task-content span').textContent,
            time: li.querySelector('.timestamp').textContent,
            done: false
        });
    });

    // 2. this is where we grab all tasks from the History List
    historyList.querySelectorAll('li').forEach(li => {
        history.push({
            text: li.querySelector('.task-content span').textContent,
            time: li.querySelector('.timestamp').textContent,
            done: true
        });
    });

    // 3. This is where we save to localStorage
    localStorage.setItem('todosData', JSON.stringify({ todos, history }));
}

function renderTask(text, time, isDone) {
    const newTask = document.createElement('li');
    if (isDone) newTask.classList.add('completed');

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

    contentWrapper.appendChild(timestamp);
    contentWrapper.appendChild(checkbox);
    contentWrapper.appendChild(taskText);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', function () {
        newTask.remove();
        saveData();
    });

    newTask.appendChild(contentWrapper);
    newTask.appendChild(deleteBtn);

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
        todos.forEach(task => renderTask(task.text, task.time, false));

        // Rebuild the history list
        history.forEach(task => renderTask(task.text, task.time, true));
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