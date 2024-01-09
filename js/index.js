// Author: Asror Klichev

const SEQUENCE_KEY = "sequence";

if (!exists(SEQUENCE_KEY)) {
  save(SEQUENCE_KEY, 1);
}

const plusButton = document.getElementById("plus");
const todoInput = document.getElementById("todo-input");

let priority = 1;

const list = new TodoList(document.getElementById("all-todos"));
const priorityDropdown = new Dropdown({
  element: document.getElementById("priority"),
  onInput: (event) => {
    priority = event.target.getAttribute("data-value");
  },
});
const sortDropdown = new Dropdown({
  element: document.getElementById("sort"),
  onInput: (event) => {
    list.sort(event.target.getAttribute("data-value"));
  },
});

const search = document.getElementById("search");
search.addEventListener("input", () => {
  list.filter(search.value);
});
search.addEventListener("blur", () => {
  search.value = "";
});

const create = () => {
  try {
    list.pushTask({ text: todoInput.value, priority });
    todoInput.value = "";
  } catch (error) {
    if (error.message.startsWith("TODO:")) {
      const duration = 3000;
      notify(error.message, "error", duration);
      plusButton.disabled = true;
      setTimeout(() => {
        plusButton.disabled = false;
      }, duration);
    } else {
      console.error(error);
    }
  }
};

plusButton.addEventListener("click", create);
todoInput.addEventListener("keydown", (event) => {
  if (!todoInput.value && plusButton.disabled) return;
  if (event.key === "Enter") {
    create();
  }
});

const allTab = document.getElementById("all");
const activeTab = document.getElementById("active");
const completedTab = document.getElementById("completed");

activeTab.addEventListener("click", () => {
  activeTab.classList.add("selected");
  allTab.classList.remove("selected");
  completedTab.classList.remove("selected");
  search.value = "";
  list.render("active");
});

allTab.addEventListener("click", () => {
  allTab.classList.add("selected");
  activeTab.classList.remove("selected");
  completedTab.classList.remove("selected");
  search.value = "";
  list.render("all");
});

completedTab.addEventListener("click", () => {
  completedTab.classList.add("selected");
  activeTab.classList.remove("selected");
  allTab.classList.remove("selected");
  search.value = "";
  list.render("completed");
});
