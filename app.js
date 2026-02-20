const inputField = document.getElementById('todo-input');
const addButton = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

function addTask() {
    if (inputField.value.trim() !== "") {
        const newTask = document.createElement('li');

        // Container for task content it will hold checkbox and task text
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'task-content';

        // Checkbox for for completing tasks
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', function () {
            newTask.classList.toggle('completed');
        });

        // The task text 
        const taskText = document.createElement('span');
        taskText.textContent = inputField.value;

        // we put the checkbox and task text in the content wrapper
        contentWrapper.appendChild(checkbox);
        contentWrapper.appendChild(taskText);

        // This is the delete button for each task
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'x';
        deleteBtn.className = 'delete-btn';

        //this is the event listener for the delete button
        deleteBtn.addEventListener('click', function () {
            newTask.remove();
        });

        // Assemble the new task item
        newTask.appendChild(contentWrapper);
        newTask.appendChild(deleteBtn);
        todoList.appendChild(newTask);

        inputField.value = '';
    }
}

addButton.addEventListener('click', addTask);

// Allow adding tasks with the "Enter" key
inputField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});