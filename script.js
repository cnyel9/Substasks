function addTask() {
    var taskInput = document.getElementById('taskInput');
    var priorityInput = document.getElementById('priorityInput');
    var taskList = document.getElementById('taskList');
    var task = taskInput.value;
    var priority = priorityInput.value;

    if (task) {
        var li = document.createElement('li');
        li.className = 'priority-' + priority;
        li.innerHTML = `<span>${task}</span>`;

        var buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        var editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.onclick = function() {
            editTask(li);
        };

        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            taskList.removeChild(li);
            saveTasks();
        };

        var addSubtaskButton = document.createElement('button');
        addSubtaskButton.textContent = 'Add Subtask';
        addSubtaskButton.onclick = function() {
            addSubtask(li);
        };

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        buttonContainer.appendChild(addSubtaskButton);
        li.appendChild(buttonContainer);
        taskList.appendChild(li);
        taskInput.value = '';
        saveTasks();
    }
}

function editTask(li) {
    var taskDetails = li.firstChild.textContent;
    var newTask = prompt('Edit your task:', taskDetails);

    if (newTask) {
        li.firstChild.textContent = newTask;
        saveTasks();
    }
}

function addSubtask(li) {
    var subtaskContainer = li.querySelector('.subtask-container');
    if (!subtaskContainer) {
        subtaskContainer = document.createElement('div');
        subtaskContainer.className = 'subtask-container';
        li.appendChild(subtaskContainer);
    }

    var subtaskInput = document.createElement('input');
    subtaskInput.type = 'text';
    subtaskInput.placeholder = 'Add a new subtask';
    subtaskInput.onkeypress = function(event) {
        if (event.key === 'Enter') {
            var subtask = subtaskInput.value;
            if (subtask) {
                var subtaskLi = document.createElement('li');
                subtaskLi.textContent = subtask;
                subtaskContainer.appendChild(subtaskLi);
                subtaskInput.value = '';
                saveTasks();
            }
        }
    };

    subtaskContainer.appendChild(subtaskInput);
}

function saveTasks() {
    var tasks = [];
    var taskList = document.getElementById('taskList').children;
    for (var i = 0; i < taskList.length; i++) {
        var taskText = taskList[i].firstChild.textContent;
        var priorityClass = taskList[i].className;
        var subtasks = [];
        var subtaskContainer = taskList[i].querySelector('.subtask-container');
        if (subtaskContainer) {
            var subtaskList = subtaskContainer.children;
            for (var j = 0; j < subtaskList.length; j++) {
                if (subtaskList[j].tagName === 'LI') {
                    subtasks.push(subtaskList[j].textContent);
                }
            }
        }
        tasks.push({ text: taskText, priority: priorityClass, subtasks: subtasks });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        for (var i = 0; i < tasks.length; i++) {
            var li = document.createElement('li');
            li.className = tasks[i].priority;
            li.innerHTML = `<span>${tasks[i].text}</span>`;

            var buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            var editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-button';
            editButton.onclick = function() {
                editTask(li);
            };

            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() {
                taskList.removeChild(li);
                saveTasks();
            };

            var addSubtaskButton = document.createElement('button');
            addSubtaskButton.textContent = 'Add Subtask';
            addSubtaskButton.onclick = function() {
                addSubtask(li);
            };

            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);
            buttonContainer.appendChild(addSubtaskButton);
            li.appendChild(buttonContainer);

            if (tasks[i].subtasks.length > 0) {
                var subtaskContainer = document.createElement('div');
                subtaskContainer.className = 'subtask-container';
                for (var j = 0; j < tasks[i].subtasks.length; j++) {
                    var subtaskLi = document.createElement('li');
                    subtaskLi.textContent = tasks[i].subtasks[j];
                    subtaskContainer.appendChild(subtaskLi);
                }
                li.appendChild(subtaskContainer);
            }

            document.getElementById('taskList').appendChild(li);
        }
    }
}

function backupTasks() {
    var tasks = localStorage.getItem('tasks');
    var blob = new Blob([tasks], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importTasks(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var tasks = JSON.parse(e.target.result);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        document.getElementById('taskList').innerHTML = '';
        loadTasks();
    };
    reader.readAsText(file);
}

window.onload = loadTasks;