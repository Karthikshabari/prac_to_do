const taskInput = document.getElementById("taskInput");
const deadlineInput = document.getElementById("deadlineInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearAllBtn = document.getElementById("clearAllBtn");
const searchInput = document.getElementById("searchInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Add task
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const deadline = deadlineInput.value;

  if (taskText && deadline) {
    tasks.push({ text: taskText, deadline, completed: false });
    taskInput.value = "";
    deadlineInput.value = "";
    updateTasks();
  } else {
    alert("Please enter both task description and deadline.");
  }
});

// Render tasks
function renderTasks(filter = "all", search = "") {
  taskList.innerHTML = "";
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  }).filter((task) => task.text.toLowerCase().includes(search.toLowerCase()) || task.deadline.includes(search));

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    const deadlineDate = new Date(task.deadline);
    const today = new Date();

    li.className = `task-item ${task.completed ? "completed" : ""}`;
    if (!task.completed && deadlineDate < today) li.classList.add("urgent");

    li.innerHTML = `
      <span>${task.text}</span>
      <span class="deadline">${task.deadline}</span>
      <button class="edit-btn" onclick="editTask(${index})">Edit</button>
      <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      <button class="clear-btn" onclick="clearTask(${index})">Clear</button>
    `;

    li.addEventListener("click", () => toggleComplete(index));
    taskList.appendChild(li);
  });
}

// Toggle task completion
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  updateTasks();
}

// Edit task
function editTask(index) {
  const newText = prompt("Edit Task:", tasks[index].text);
  const newDeadline = prompt("Edit Deadline (YYYY-MM-DD):", tasks[index].deadline);

  if (newText !== null && newDeadline !== null) {
    tasks[index].text = newText.trim();
    tasks[index].deadline = newDeadline.trim();
    updateTasks();
  }
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  updateTasks();
}

// Clear specific task
function clearTask(index) {
  tasks.splice(index, 1);
  updateTasks();
}

// Update tasks in storage and UI
function updateTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks(document.querySelector(".filter-btn.active").dataset.filter, searchInput.value);
}

// Filter tasks
filterButtons.forEach((button) =>
  button.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    button.classList.add("active");
    renderTasks(button.dataset.filter, searchInput.value);
  })
);

// Search tasks
searchInput.addEventListener("input", (e) => {
  renderTasks(document.querySelector(".filter-btn.active").dataset.filter, e.target.value);
});

// Clear all tasks
clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    updateTasks();
  }
});

// Initial render
updateTasks();
