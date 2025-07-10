document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const filterBtn = document.getElementById('filterBtn');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    const taskList = document.getElementById('taskList');
    const noTaskFound = document.querySelector('.no-task-found');

    let todos = [];

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const loadTodos = () => {
        const storedTodos = localStorage.getItem('todos');
        if (storedTodos) {
            todos = JSON.parse(storedTodos);
        }
        renderTodos();
    };

    const renderTodos = (filteredTodos = todos) => {
        taskList.innerHTML = '';

        if (filteredTodos.length === 0) {
            noTaskFound.style.display = 'block';
        } else {
            noTaskFound.style.display = 'none';
            filteredTodos.forEach((todo, index) => {
                const taskItem = document.createElement('div');
                taskItem.classList.add('task-item');

                const statusClass = todo.completed ? 'completed' : 'pending';
                const statusText = todo.completed ? 'Selesai' : 'Pending';

                taskItem.innerHTML = `
                    <div class="task-name">${todo.task}</div>
                    <div class="task-due-date">${todo.dueDate}</div>
                    <div class="task-status ${statusClass}">${statusText}</div>
                    <div class="task-actions">
                        <button class="toggle-complete-btn" data-index="${index}" title="${todo.completed ? 'Tandai sebagai Pending' : 'Tandai sebagai Selesai'}">
                            <i class="fas ${todo.completed ? 'fa-undo' : 'fa-check'}"></i>
                        </button>
                        <button class="edit-btn" data-index="${index}" title="Edit Tugas">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" data-index="${index}" title="Hapus Tugas">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                taskList.appendChild(taskItem);
            });
        }
    };

    addTodoBtn.addEventListener('click', () => {
        const taskText = todoInput.value.trim();
        const dueDate = dueDateInput.value;

        if (taskText !== '' && dueDate !== '') {
            const newTodo = {
                id: Date.now(),
                task: taskText,
                dueDate: dueDate,
                completed: false
            };
            todos.push(newTodo);
            saveTodos();
            renderTodos();
            todoInput.value = '';
            dueDateInput.value = '';
        } else {
            alert('Mohon masukkan tugas dan tanggal jatuh tempo.');
        }
    });

    taskList.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const index = parseInt(target.dataset.index);

        if (target.classList.contains('toggle-complete-btn')) {
            todos[index].completed = !todos[index].completed;
            saveTodos();
            renderTodos();
        } else if (target.classList.contains('edit-btn')) {
            const currentTask = todos[index].task;
            const newText = prompt('Edit tugas Anda:', currentTask);
            if (newText !== null && newText.trim() !== '') {
                todos[index].task = newText.trim();
                saveTodos();
                renderTodos();
            }
        } else if (target.classList.contains('delete-btn')) {
            if (confirm('Anda yakin ingin menghapus tugas ini?')) {
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
            }
        }
    });

    let isFiltered = false;
    filterBtn.addEventListener('click', () => {
        isFiltered = !isFiltered;
        if (isFiltered) {
            const pendingTodos = todos.filter(todo => !todo.completed);
            renderTodos(pendingTodos);
            filterBtn.textContent = 'TAMPILKAN SEMUA';
        } else {
            renderTodos();
            filterBtn.textContent = 'FILTER';
        }
    });

    deleteAllBtn.addEventListener('click', () => {
        if (confirm('Anda yakin ingin menghapus semua tugas?')) {
            todos = [];
            saveTodos();
            renderTodos();
        }
    });

    loadTodos();
});