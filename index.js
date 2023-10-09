const nameInput = document.getElementById("username");
let n = "<YourName>";
if (window.localStorage.getItem("username")) {
  n = window.localStorage.getItem("username") + "'s";
}
nameInput.value = n;
document.title = `${n} TODO List`;
adjustNameInputWidth(n.length);

nameInput.addEventListener("input", (event) => {
  n = capitalizeFirstLetter(
    event.target.value?.replace(/[^a-zA-Z]/g, "").replace(/'s/, "")
  );
  adjustNameInputWidth(n.length);
  event.target.value = n;
  window.localStorage.setItem("username", n);
});
nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.target.blur();
  }
});
nameInput.addEventListener("focus", (event) => {
  event.target.select();
});

nameInput.addEventListener("blur", (event) => {
  n = n.replace(/'s/, "") + "'s";
  event.target.value = n;
  document.title = `${n} TODO List`;
  adjustNameInputWidth(n.length);
});

function adjustNameInputWidth(usernameLength) {
  const PIXEL_INCREMENT = 49;
  const width = usernameLength * PIXEL_INCREMENT;
  nameInput.style["width"] = `${width == 0 ? PIXEL_INCREMENT : width}px`;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//---------------------------------------------------------------------------------------------------

const plusButton = document.getElementById("plus");
const todoInput = document.getElementById("todo-input");
const allTodoContainer = document.getElementById("all-todos");
const activeTodoContainer = document.getElementById("active-todos");
const completedTodoContainer = document.getElementById("completed-todos");
const severityInput = document.getElementById("severity-input");

let cachedActiveTodoItems = [];
let cachedCompletedTodoItems = [];
let cachedAllTodoItems = [];
let severity = 1;

if (!window.localStorage.getItem("sequence")) {
  window.localStorage.setItem("sequence", 0);
}
function getNextId() {
  let id = window.localStorage.getItem("sequence");
  window.localStorage.setItem("sequence", ++id);
  return id;
}
function getTodos() {
  if (window.localStorage.getItem("todos")) {
    return JSON.parse(window.localStorage.getItem("todos"));
  }
  window.localStorage.setItem("todos", JSON.stringify([]));
  return [];
}
function _setCompleteStatusForTodo({ id, completed }) {
  const todos = getTodos();
  const todo = todos.find((todo) => todo.id == id);
  todo.completed = completed;
  window.localStorage.setItem("todos", JSON.stringify(todos));
}
function completeTodoById(id) {
  _setCompleteStatusForTodo({
    id,
    completed: true,
  });
}
function unCompleteTodoById(id) {
  _setCompleteStatusForTodo({
    id,
    completed: false,
  });
}
function findTodoById(id) {
  return getTodos().find((todo) => todo.id == id);
}
function deleteTodoById(id) {
  const todos = getTodos();
  const filteredTodos = todos.filter((todo) => todo.id != id);
  window.localStorage.setItem("todos", JSON.stringify(filteredTodos));
}
function saveTodo(todo) {
  const todos = getTodos();
  todos.push(todo);
  window.localStorage.setItem("todos", JSON.stringify(todos));
}
function filterCachedItem({ cache, item }) {
  return cache.filter(
    (cachedItem) =>
      cachedItem.getAttribute("data-id") !== item.getAttribute("data-id")
  );
}
function createUnCompleteButton() {
  const unCompleteButton = document.createElement("button");
  unCompleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1rem" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M125.7 160H176c17.7 0 32 14.3 32 32s-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32v51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z"/></svg>`;
  unCompleteButton.classList.add("btn", "btn-warning");
  unCompleteButton.addEventListener("click", (event) => {
    const todoItem = event.target.parentElement.parentElement;
    const todo = findTodoById(todoItem.getAttribute("data-id"));
    unCompleteTodoById(todo.id);

    todoItem.classList.remove("completed");
    todoItem.classList.add(`severity-${todo.severity}`);

    todoItem.querySelector(".todo-buttons").removeChild(event.target);
    const checkbox = todoItem.querySelector("input[type=checkbox]");
    checkbox.checked = false;
    checkbox.disabled = false;

    deleteFromContainer({ container: completedTodoContainer, item: todoItem });
    cachedCompletedTodoItems = filterCachedItem({
      cache: cachedCompletedTodoItems,
      item: todoItem,
    });

    if (!activeTodoContainer.classList.contains("remove")) {
      activeTodoContainer.appendChild(todoItem);
    }
    if (!allTodoContainer.classList.contains("remove")) {
      allTodoContainer.appendChild(todoItem);
    }
    cachedActiveTodoItems.push(todoItem);
  });
  return unCompleteButton;
}

(function initalizeTodos() {
  if (window.localStorage.getItem("todos")) {
    allTodoContainer.innerHTML = "";
    getTodos().forEach((todo) => {
      addTodo(todo);
    });
  }
})();

const deleteButtons = document.querySelectorAll(
  ".todos .todo button .btn-danger"
);
deleteButtons.forEach((button) => {
  addDeleteListener(button);
});
const checkBoxes = document.querySelectorAll(
  '.todos .todo input[type="checkbox"]'
);
checkBoxes.forEach((checkBox) => {
  addCheckListener(checkBox);
});

const TO_BE_COMPLETED_BUFFER = [
  {
    todoId: "",
    timeoutId: undefined,
  },
];
function addCheckListener(checkBox) {
  checkBox.addEventListener("change", (event) => {
    const todoItem = event.target.parentElement;
    const todoId = todoItem.getAttribute("data-id");
    if (event.target.checked) {
      TO_BE_COMPLETED_BUFFER.push({
        todoId,
        timeoutId: setTimeout(() => {
          completeTodoItem(todoItem);
        }, 1000),
      });
    } else {
      TO_BE_COMPLETED_BUFFER = TO_BE_COMPLETED_BUFFER.filter(
        (toBeCompleted) => {
          if (toBeCompleted.todoId === todoId) {
            clearTimeout(toBeCompleted.timeoutId);
            return true;
          }
          return false;
        }
      );
    }
  });
}

function completeTodoItem(todoItem) {
  if (
    !activeTodoContainer.classList.contains("remove") &&
    activeTodoContainer.contains(todoItem)
  ) {
    activeTodoContainer.removeChild(todoItem);
  }
  cachedActiveTodoItems = filterCachedItem({
    cache: cachedActiveTodoItems,
    item: todoItem,
  });

  completeTodoById(todoItem.getAttribute("data-id"));

  const todoButtons = todoItem.querySelector(".todo-buttons");
  if (todoButtons.children.length === 1) {
    todoButtons.prepend((createUnCompleteButton()));
  }

  completedTodoContainer.appendChild(todoItem);
  completedTodoContainer.querySelector(
    'input[type="checkbox"]'
  ).disabled = true;

  todoItem.classList.add("completed");
  todoItem.classList.remove("severity-1");
  todoItem.classList.remove("severity-2");
  todoItem.classList.remove("severity-3");

  allTodoContainer.appendChild(todoItem);

  cachedCompletedTodoItems.push(todoItem);
}
function deleteFromContainer({ container, item }) {
  if (!container.classList.contains("remove") && container.contains(item)) {
    container.removeChild(item);
  }
}
function deleteTodoItem(todoItem) {
  deleteFromContainer({ container: allTodoContainer, item: todoItem });
  deleteFromContainer({ container: activeTodoContainer, item: todoItem });
  deleteFromContainer({ container: completedTodoContainer, item: todoItem });

  cachedAllTodoItems = filterCachedItem({
    cache: cachedAllTodoItems,
    item: todoItem,
  });
  cachedCompletedTodoItems = filterCachedItem({
    cache: cachedCompletedTodoItems,
    item: todoItem,
  });
  cachedActiveTodoItems = filterCachedItem({
    cache: cachedActiveTodoItems,
    item: todoItem,
  });
  deleteTodoById(todoItem.getAttribute("data-id"));
}
function addDeleteListener(button) {
  button.addEventListener("click", (event) => {
    const todoItem = event.target.parentElement.parentElement;
    deleteTodoItem(todoItem);
  });
}
plusButton.addEventListener("click", () => {
  addTodoAndSave({
    id: getNextId(),
    title: todoInput.value,
    severity,
    completed: false,
  });
  todoInput.value = "";
});
todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodoAndSave({
      id: getNextId(),
      title: event.target.value,
      severity: severity,
      completed: false,
    });
    event.target.value = "";
  }
});

function addTodoAndSave(todo) {
  addTodo(todo);
  saveTodo(todo);
}
function addTodo(todo) {
  if (!todo.title) return;
  const todoItem = createTodoItem({ ...todo });
  if (todo.completed) {
    const todoButtons = todoItem.querySelector(".todo-buttons");
    if (todoButtons.children.length === 1) {
      todoButtons.prepend(createUnCompleteButton());
    }
    if (!completedTodoContainer.classList.contains("remove")) {
      completedTodoContainer.appendChild(todoItem);
    }
    const checkbox = todoItem.querySelector('input[type="checkbox"]');
    checkbox.checked = true;
    checkbox.disabled = true;
    cachedCompletedTodoItems.push(todoItem);
  } else {
    if (!activeTodoContainer.classList.contains("remove")) {
      activeTodoContainer.appendChild(todoItem);
    }
    cachedActiveTodoItems.push(todoItem);
  }
  if (!allTodoContainer.classList.contains("remove")) {
    allTodoContainer.appendChild(todoItem);
  }
  cachedAllTodoItems.push(todoItem);
}
function createTodoItem({ id, title, severity = 1, completed = false }) {
  const item = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  item.appendChild(checkbox);
  addCheckListener(checkbox);

  const t = document.createElement("span");
  t.innerText = title;
  item.appendChild(t);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("todo-buttons");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn-danger");
  deleteButton.innerHTML = `
    <i class="fa-solid fa-trash"></i>
    `;
  addDeleteListener(deleteButton);

  buttonContainer.appendChild(deleteButton);

  item.appendChild(buttonContainer);

  item.classList.add("todo", completed ? "completed" : `severity-${severity}`);
  item.setAttribute("data-id", id);
  return item;
}

// Dropdowns --------------------------------------------------------------------------------------

const dropdowns = document.querySelectorAll(".dd");

const upArrow = document.createElement("i");
upArrow.classList.add("fa", "fa-caret-up");

const downArrow = document.createElement("i");
downArrow.classList.add("fa", "fa-caret-down");

dropdowns.forEach((dropdown) => {
  const button = dropdown.querySelector("button");
  const menu = dropdown.querySelector(".menu");
  button.appendChild(downArrow);
  button.addEventListener("click", () => {
    if (menu.classList.contains("hide")) {
      button.removeChild(downArrow);
      button.appendChild(upArrow);
    } else {
      button.removeChild(upArrow);
      button.appendChild(downArrow);
    }
    menu.classList.toggle("hide");
  });
});

const severityDropdown = document.getElementById("severity");
const severityItems = severityDropdown.querySelectorAll("li");
severityItems?.forEach((item) => {
  item.addEventListener("click", (event) => {
    severity = event.target.getAttribute("data-value");
    const btn = severityDropdown.querySelector("button");
    btn.innerText = event.target.innerText.match(/\(.*\)/)[0];
    btn.appendChild(downArrow);
    severityDropdown.querySelector(".menu").classList.add("hide");
  });
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".dd")) return;
  dropdowns.forEach((dropdown) => {
    dropdown.querySelector(".menu").classList.add("hide");
  });
});

// tabs --------------------------------------------------------------------------------------------

const allTab = document.getElementById("all");
const completedTab = document.getElementById("completed");
const activeTab = document.getElementById("active");

allTab.addEventListener("click", () => {
  completedTodoContainer.classList.add("remove");
  activeTodoContainer.classList.add("remove");

  completedTab.classList.remove("selected");
  activeTab.classList.remove("selected");

  allTodoContainer.classList.remove("remove");
  allTab.classList.add("selected");

  console.log(cachedAllTodoItems.length);

  allTodoContainer.replaceChildren(...cachedAllTodoItems);
});
completedTab.addEventListener("click", () => {
  activeTodoContainer.classList.add("remove");
  allTodoContainer.classList.add("remove");

  allTab.classList.remove("selected");
  activeTab.classList.remove("selected");

  completedTodoContainer.classList.remove("remove");
  completedTab.classList.add("selected");

  completedTodoContainer.replaceChildren(...cachedCompletedTodoItems);
});
activeTab.addEventListener("click", () => {
  completedTodoContainer.classList.add("remove");
  allTodoContainer.classList.add("remove");

  completedTab.classList.remove("selected");
  allTab.classList.remove("selected");

  activeTodoContainer.classList.remove("remove");
  activeTab.classList.add("selected");

  activeTodoContainer.replaceChildren(...cachedActiveTodoItems);
});
