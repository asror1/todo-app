// Author: Asror Klichev

const TODO_LIST_KEY = "todo-list"; // used for state persistence

/**
 * @class TodoList, a class that represents a list of todo items, both
 * semantically and visually. Requires an HTML container.
 * Within the context of this class an "item" refers to a todo task, more specifically
 * it's state
 */
class TodoList {
  tasks = new Map(); // k = id, v = task: { state, element }

  trie = new Trie(); // used for text searching
  bst = new BST(); // used for sorting by priority

  mode = "all"; // one of "all", "active", "completed"

  /**
   * @constructor, Also loads any saved tasks from localStorage
   *
   * @param {HTMLElement} container the HTML element that will contain the todo list
   */
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error("Todo list container must be an HTMLElement");
    }
    this.container = container;

    if (exists(TODO_LIST_KEY)) {
      find(TODO_LIST_KEY).forEach((state) => {
        const redoTask = this.redoTask.bind(this);
        const markComplete = this.markComplete.bind(this);
        const removeTask = this.removeTask.bind(this);
        const task = new Task({
          ...state,
          onRedo: redoTask,
          onRemove: removeTask,
          onComplete: markComplete,
        });
        this.#add(task);
      });
    }
    this.#display();
  }

  /**
   * Sets the mode of the todo list, and updates the UI accordingly
   * @param {string} mode one of "all", "active", "completed"
   * @throws {Error} if mode is not one of the above
   */
  render(mode = "all") {
    if (!["all", "active", "completed"].includes(mode)) {
      throw new Error("Mode must be one of 'all', 'active', 'completed'");
    }
    this.mode = mode;
    this.#display();
  }
  /**
   * Iterates over the list of tasks, calling the callback function on each task
   * @param {function} callback a function that takes in a task's state and element
   */
  #iter(callback) {
    for (const task of this.tasks.values()) {
      callback(task.state, task.element);
    }
  }
  /**
   * Filters the list based on the given prefix
   * @param {string} prefix
   */
  filter(prefix) {
    const ids = this.trie.startsWith(prefix);
    this.#iter((state, elem) => {
      switch (this.mode) {
        case "all":
          if (ids.includes(state.id)) {
            elem.classList.remove("hide");
          } else {
            elem.classList.add("hide");
          }
          break;
        case "active":
          if (ids.includes(state.id) && !state.isComplete) {
            elem.classList.remove("hide");
          } else {
            elem.classList.add("hide");
          }
          break;
        case "completed":
          if (ids.includes(state.id) && state.isComplete) {
            elem.classList.remove("hide");
          } else {
            elem.classList.add("hide");
          }
      }
    });
  }
  /**
   * Sorts the todo list by the given criteria
   *
   * @param {string} by one of "az", "za", "lh", "hl", where "az" is ascending alphabetical order,
   * "za" is descending alphabetical order,
   * "lh" is least priority to highest, and "hl" is highest priority to lowest
   */
  sort(by = "az") {
    if (!["az", "za", "lh", "hl"].includes(by)) by = "az";
    let tasks = Array.from(this.tasks.values());
    const completed = [];
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    switch (by) {
      case "az":
        quicksort(tasks, (left, right) => {
          return left.state.text < right.state.text;
        });
        tasks.forEach((task) => {
          this.container.appendChild(task.element);
        });
        break;
      case "za":
        quicksort(tasks, (left, right) => {
          return left.state.text > right.state.text;
        });
        tasks.forEach((task) => {
          this.container.appendChild(task.element);
        });
        break;
      case "lh":
        this.bst.toArray().forEach(({ id }) => {
          if (this.tasks.has(id)) {
            if (this.tasks.get(id).state.isComplete) {
              completed.push(this.tasks.get(id).element);
            } else {
              this.container.appendChild(this.tasks.get(id).element);
            }
          }
        });
        completed.forEach((elem) => {
          this.container.appendChild(elem);
        });
        break;
      case "hl":
        this.bst
          .toArray()
          .reverse()
          .forEach(({ id }) => {
            if (this.tasks.has(id)) {
              if (this.tasks.get(id).state.isComplete) {
                completed.push(this.tasks.get(id).element);
              } else {
                this.container.appendChild(this.tasks.get(id).element);
              }
            }
          });
        completed.forEach((elem) => {
          this.container.appendChild(elem);
        });
        break;
    }
  }
  /**
   * Displays the tasks based on current display mode
   */
  #display() {
    switch (this.mode) {
      case "all":
        this.#iter((_, elem) => {
          elem.classList.remove("hide");
        });
        break;
      case "active":
        this.#iter((state, elem) => {
          if (!state.isComplete) {
            elem.classList.remove("hide");
          } else {
            elem.classList.add("hide");
          }
        });
        break;
      case "completed":
        this.#iter((state, elem) => {
          if (state.isComplete) {
            elem.classList.remove("hide");
          } else {
            elem.classList.add("hide");
          }
        });
        break;
    }
  }

  /**
   * Persists state
   */
  #persistState() {
    let arr = [];
    for (const task of this.tasks.values()) {
      arr.push(task.state);
    }
    save(TODO_LIST_KEY, arr); // the array of task states are persisted in storage, for persistence of data
  }
  // Handlers to pass to Task during creation
  markComplete() {
    this.#display();
    this.#persistState();
  }
  redoTask() {
    this.#display();
    this.#persistState();
  }
  removeTask(id) {
    this.tasks.delete(id);
    this.#persistState();
  }
  /**
   * Adds a task to the list
   * @param {Task} task
   */
  #add(task) {
    this.trie.insert(task.state.text, task.state.id);
    this.bst.insert(task.state.priority, task.state.id);
    this.tasks.set(task.state.id, task);
    this.container.appendChild(task.element);
  }
  /**
   * Creates and adds a task to the list
   * @param {obj.string} text, the name or description of the task
   * @param {obj.number} priority, the level of priority of the task
   */
  pushTask({ text, priority }) {
    if (!text) {
      throw new Error("TODO: Todo item text is required");
    }
    const markComplete = this.markComplete.bind(this);
    const redoTask = this.redoTask.bind(this);
    const removeTask = this.removeTask.bind(this);
    const task = new Task({
      text,
      priority,
      onRedo: redoTask,
      onRemove: removeTask,
      onComplete: markComplete,
    });
    this.#add(task);
    this.#persistState();
  }
}
