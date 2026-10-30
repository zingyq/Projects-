const API_URL = "http://localhost:5113/api/tasks";
let tasks = [];

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const titleInput = document.getElementById('title');
    const descInput = document.getElementById('description');
    const statusSelect = document.getElementById('status');
    const submitBtn = taskForm.querySelector('button[type="submit"]');

    const listTodo = document.getElementById('list-todo');
    const listInProgress = document.getElementById('list-in-progress');
    const listDone = document.getElementById('list-done');

    let editingTaskLi = null;

    function renderTasks() {
        listTodo.innerHTML = '';
        listInProgress.innerHTML = '';
        listDone.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-card';
            li.dataset.id = task.id;
            li.dataset.status = task.status || 'new';

            li.innerHTML = `
                <aside class="card-left"><span class="dot"></span></aside>
                <article class="card-content">
                    <header class="card-top">
                        <span class="task-title">${task.title}</span>
                        <span class="task-date"></span>
                    </header>
                    <p class="task-desc">${task.description || 'no description'}</p>
                    <nav class="card-actions">
                        <button type="button" class="btn-edit">Edit</button>
                        <button type="button" class="btn-finish">Status</button>
                        <button type="button" class="btn-delete">Delete</button>
                    </nav>
                </article>
            `;

            
            li.querySelector('.btn-edit').addEventListener('click', () => {
                titleInput.value = task.title;
                descInput.value = task.description || '';
                statusSelect.value = task.status || 'new';
                editingTaskLi = li;
                submitBtn.innerHTML = '<span class="plus-icon">✓</span> SAVE';
            });

            li.querySelector('.btn-finish').addEventListener('click', async () => {
                let nextStatus = 'new';
                if (li.dataset.status === 'new' || li.dataset.status === 'todo') nextStatus = 'in_progress';
                else if (li.dataset.status === 'in_progress') nextStatus = 'done';

                await updateTaskStatus(task.id, nextStatus, task.title, task.description);
            });

            // Кнопка удаления
            li.querySelector('.btn-delete').addEventListener('click', async () => {
                try {
                    const res = await fetch(`${API_URL}/${task.id}`, { method: 'DELETE' });
                    if (res.ok) loadTasks();
                } catch (err) {
                    console.error('Delete error:', err);
                }
            });

            if (li.dataset.status === 'in_progress') listInProgress.appendChild(li);
            else if (li.dataset.status === 'done') listDone.appendChild(li);
            else listTodo.appendChild(li);
        });
    }

    async function loadTasks() {
        try {
            const response = await fetch(API_URL);
            if (response.ok) {
                tasks = await response.json();
                renderTasks();
            }
        } catch (err) {
            console.error('Load error:', err);
        }
    }

    async function updateTaskStatus(id, status, title, description) {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: Number(id), title, description, status })
            });
            if (res.ok) loadTasks();
        } catch (err) {
            console.error('Status update error:', err);
        }
    }

    loadTasks();

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = titleInput.value.trim();
        const description = descInput.value.trim();
        const status = statusSelect.value;

        if (!title) return;

        try {
            if (editingTaskLi) {
                const id = editingTaskLi.dataset.id;
                const res = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: Number(id), title, description, status })
                });
                if (res.ok) {
                    editingTaskLi = null;
                    submitBtn.innerHTML = '<span class="plus-icon">+</span> ADD';
                }
            } else {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description, status })
                });
            }
            taskForm.reset();
            loadTasks();
        } catch (err) {
            console.error('Submit error:', err);
        }
    });
});
