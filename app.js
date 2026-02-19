const inputField = document.getElementById('todo-input');
const addButton = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

addButton.addEventListener('click', function() {
    const newTask = document.createElement('li'); 
    newTask.textContent = inputField.value;
    todoList.appendChild(newTask);
    inputField.value = '';
});