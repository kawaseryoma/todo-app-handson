const STORAGE_KEY = "todo-app-tasks";

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((task) => {
      if (typeof task === "string") {
        return { text: task, completed: false };
      }
      return { text: task.text, completed: Boolean(task.completed) };
    });
  } catch (error) {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks(tasks) {
  const taskList = document.querySelector(".task-list");
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "task-empty";
    empty.textContent = "タスクはまだありません。新しく追加してみましょう。";
    taskList.appendChild(empty);
    return;
  }

  tasks.forEach((task, index) => {
    const item = document.createElement("li");
    item.className = "task-item";
    if (task.completed) {
      item.classList.add("is-completed");
    }

    const label = document.createElement("label");
    label.className = "task-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      toggleTask(index);
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    label.appendChild(checkbox);
    label.appendChild(text);
    item.appendChild(label);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "task-delete-button";
    deleteButton.textContent = "削除";
    deleteButton.addEventListener("click", () => {
      removeTaskWithAnimation(item, index);
    });

    actions.appendChild(deleteButton);
    item.appendChild(actions);

    taskList.appendChild(item);
  });
}

function removeTaskWithAnimation(item, index) {
  if (item.classList.contains("is-removing")) {
    return;
  }
  item.classList.add("is-removing");
  item.addEventListener(
    "animationend",
    () => {
      deleteTask(index);
    },
    { once: true }
  );
}

function deleteTask(index) {
  const tasks = loadTasks();
  if (!tasks[index]) {
    return;
  }
  tasks.splice(index, 1);
  saveTasks(tasks);
  renderTasks(tasks);
}

function toggleTask(index) {
  const tasks = loadTasks();
  if (!tasks[index]) {
    return;
  }
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  renderTasks(tasks);
}

function setupForm() {
  const form = document.querySelector(".task-form");
  const input = document.querySelector(".task-input");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const value = input.value.trim();
    if (value === "") {
      return;
    }

    const tasks = loadTasks();
    tasks.push({ text: value, completed: false });
    saveTasks(tasks);
    renderTasks(tasks);

    input.value = "";
    input.focus();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderTasks(loadTasks());
  setupForm();
});
