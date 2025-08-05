const input = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("todoList");
const filterButtons = document.querySelectorAll(".filterBtn");
const toggleTheme = document.getElementById("toggleTheme");

let currentFilter = "all";

function createTodoItem(text, completed = false) {
  const li = document.createElement("li");
  li.className = "taskItem";
  if (completed) li.classList.add("taskCompleted");

  const span = document.createElement("span");
  span.className = "taskText";
  span.textContent = text;

  const btnGroup = document.createElement("div");
  btnGroup.className = "btnGroup";

  // Complete Button
  const completeBtn = document.createElement("button");
  completeBtn.textContent = completed ? "Completed" : "Complete";
  completeBtn.className = "actionBtn completeBtn";
  if (completed) completeBtn.classList.add("completed");

  completeBtn.onclick = () => {
    li.classList.toggle("taskCompleted");
    const isDone = li.classList.contains("taskCompleted");
    completeBtn.textContent = isDone ? "Completed" : "Complete";
    completeBtn.classList.toggle("completed");
    saveTodos();
    applyFilter();
  };

  // Edit Button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "actionBtn editBtn";
  editBtn.onclick = () => {
    const newText = prompt("Edit task:", span.textContent);
    if (newText && newText.trim() !== "") {
      span.textContent = newText.trim();
      saveTodos();
    }
  };

  // Delete Button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "actionBtn deleteBtn";
  deleteBtn.onclick = () => {
    list.removeChild(li);
    saveTodos();
  };

  btnGroup.append(completeBtn, editBtn, deleteBtn);
  li.append(span, btnGroup);
  list.appendChild(li);
}

function saveTodos() {
  const todos = [];
  document.querySelectorAll(".taskItem").forEach((li) => {
    todos.push({
      text: li.querySelector(".taskText").textContent,
      completed: li.classList.contains("taskCompleted"),
    });
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const data = JSON.parse(localStorage.getItem("todos")) || [];
  data.forEach((todo) => createTodoItem(todo.text, todo.completed));
}

function applyFilter() {
  const allTasks = document.querySelectorAll(".taskItem");
  allTasks.forEach((task) => {
    const isCompleted = task.classList.contains("taskCompleted");
    task.style.display =
      currentFilter === "all" ||
      (currentFilter === "completed" && isCompleted) ||
      (currentFilter === "notCompleted" && !isCompleted)
        ? "flex"
        : "none";
  });
}

filterButtons.forEach((btn) => {
  btn.onclick = () => {
    currentFilter = btn.dataset.filter;
    applyFilter();
  };
});

addBtn.onclick = () => {
  const value = input.value.trim();
  if (value !== "") {
    createTodoItem(value);
    input.value = "";
    saveTodos();
    applyFilter();
  }
};

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addBtn.click();
});

toggleTheme.onclick = () => {
  document.body.classList.toggle("darkMode");
  toggleTheme.textContent = document.body.classList.contains("darkMode")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
};

window.onload = () => {
  loadTodos();
  applyFilter();
};
