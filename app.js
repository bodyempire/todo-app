const inputField = document.getElementById('todo-input');
const addButton = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

addButton.addEventListener('click', function() {
    if (inputField.value.trim() !== "") {
        const newTask = document.createElement('li'); 
        newTask.textContent = inputField.value;

        // This is the delete button for each task
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'x';
        deleteBtn.className = 'delete-btn';

        //this is the event listener for the delete button
        deleteBtn.addEventListener('click', function() {
            newTask.remove();
        });

        // every task we create will have a delete button
        newTask.appendChild(deleteBtn);
        todoList.appendChild(newTask);

        inputField.value = '';
    }
});