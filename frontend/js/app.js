document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const titleInput = document.getElementById('title');
    const descInput = document.getElementById('description');
    const statusSelect = document.getElementById('status');
    const submitBtn = taskForm.querySelector('button[type="submit"]');

    const listTodo = document.getElementById('list-todo');
    const listInProgress = document.getElementById('list-in-progress');
    const listDone = document.getElementById('list-done');

    const timeSpan = document.getElementById('current-time');
    const dateSpan = document.getElementById('current-date');

    let editingTaskLi = null;

    
    function updateDateTime() {
        const now = new Date();
        if (timeSpan) timeSpan.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        if (dateSpan) dateSpan.textContent = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);

    
    function buildCardContent(li, title, description) {
        const formattedDesc = description !== '' ? description : 'brak opisu';
        const today = new Date();
        const dateStr = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;

        li.innerHTML = '';
        li.className = 'task-card';

        
        const aside = document.createElement('aside');
        aside.className = 'card-left';
        const dot = document.createElement('span');
        dot.className = 'dot';
        aside.appendChild(dot);

        
        const article = document.createElement('article');
        article.className = 'card-content';

        const header = document.createElement('header');
        header.className = 'card-top';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'task-title';
        titleSpan.textContent = title;

        const dateSpan = document.createElement('span');
        dateSpan.className = 'task-date';
        dateSpan.textContent = dateStr;

        header.appendChild(titleSpan);
        header.appendChild(dateSpan);

        const descP = document.createElement('p');
        descP.className = 'task-desc';
        descP.textContent = formattedDesc;

        
        const nav = document.createElement('nav');
        nav.className = 'card-actions';

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'btn-edit';
        editBtn.textContent = 'Edytuj';
        editBtn.addEventListener('click', () => {
            titleInput.value = titleSpan.textContent;
            descInput.value = descP.textContent === 'brak opisu' ? '' : descP.textContent;
            statusSelect.value = li.dataset.status;

            editingTaskLi = li;
            submitBtn.innerHTML = '<span class="plus-icon">✓</span> ZAPISZ';
            titleInput.focus();
        });

        const moveBtn = document.createElement('button');
        moveBtn.type = 'button';
        moveBtn.className = 'btn-finish';
        moveBtn.textContent = 'Zmień status';
        moveBtn.addEventListener('click', () => {
            let currentStatus = li.dataset.status;
            let nextStatus = 'todo';
            if (currentStatus === 'todo') nextStatus = 'in_progress';
            else if (currentStatus === 'in_progress') nextStatus = 'done';
            else if (currentStatus === 'done') nextStatus = 'todo';

            placeCardInColumn(li, nextStatus);
        });
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = 'Usuń';
        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        nav.appendChild(editBtn);
        nav.appendChild(moveBtn);
        nav.appendChild(deleteBtn);

        article.appendChild(header);
        article.appendChild(descP);
        article.appendChild(nav);

        li.appendChild(aside);
        li.appendChild(article);
    }

    function placeCardInColumn(li, status) {
        li.dataset.status = status;
        if (status === 'todo') listTodo.appendChild(li);
        else if (status === 'in_progress') listInProgress.appendChild(li);
        else if (status === 'done') listDone.appendChild(li);
    }

    
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = titleInput.value.trim();
        const description = descInput.value.trim();
        const status = statusSelect.value;

        if (!title) return;

        if (editingTaskLi) {
            buildCardContent(editingTaskLi, title, description);
            placeCardInColumn(editingTaskLi, status);
            editingTaskLi = null;
            submitBtn.innerHTML = '<span class="plus-icon">+</span> DODAJ';
        } else {
            const li = document.createElement('li');
            buildCardContent(li, title, description);
            placeCardInColumn(li, status);
        }

        taskForm.reset();
    });


    function createDemoTask(title, desc, status) {
        const li = document.createElement('li');
        buildCardContent(li, title, desc, status);
        placeCardInColumn(li, status);
    }

    createDemoTask('Przygotować makietę', 'Ekran listy i formularza', 'todo');
    createDemoTask('Napisać kod JS', '', 'in_progress');
    createDemoTask('Zaliczyć projekt', 'Wszystko gotowe', 'done');
});