// Author: Asror Klichev

const buffer = new Map(); // {k = id, v =timeoutId} Buffer to store todo items that are about to be completed
/**
 * @class Task, represents a todo item in other words task semantically and visually
 * this.element is the DOM element that represents the task,
 * other properties are part of task state
 */
class Task {
  state = {};
  /**
   * Generates a unique sequence based numerical ID for a todo item
   */
  static id() {
    let num = find(SEQUENCE_KEY);
    save(SEQUENCE_KEY, ++num);
    return num;
  }
  /**
   *
   * @constructor
   *
   * @param {string} text - text of the todo item
   * @param {number} priority - priority of the todo item, 1-3
   * @param {boolean} isComplete - whether the todo item is complete
   * @param {function} onRemove - callback to be called when the todo item is removed
   * @param {function} onRedo - callback to be called when the todo item is redone
   * @param {function} onComplete - callback to be called when the todo item is completed
   *
   */
  constructor({
    id = Task.id(),
    text,
    priority = 1,
    isComplete = false,
    onRemove: handleRemove,
    onRedo: handleRedo,
    onComplete: handleComplete,
  }) {
    this.state.id = id;
    this.state.text = text;
    this.state.priority = priority;
    this.state.isComplete = isComplete;

    // priority indicator
    let i;
    if (priority == 2) {
      i = "◍";
    } else if (priority == 3) {
      i = "●";
    } else i = "○";

    const indicator = createElement({
      type: "span",
      classList: "indicator",
      text: i,
    });
    if (this.state.isComplete) {
      indicator.classList.add("hide");
    }

    const redo = createElement({
      type: "button",
      classList: ["btn", "btn-warning", "center"],
      children: [icon("./assets/redo")],
      listeners: [
        {
          event: "click",
          callback: () => {
            this.state.isComplete = false;
            const s = `priority-${this.state.priority}`;
            this.element.classList.remove("completed");
            this.element.classList.add(s);
            indicator.classList.remove("hide");
            checkbox.checked = false;
            checkbox.disabled = false;
            redo.remove();
            notify("Let's do it again!", "success");
            handleRedo(this.state.id);
          },
        },
      ],
    });
    const buttons = createElement({
      type: "div",
      classList: "todo-buttons",
      children: [
        createElement({
          type: "button",
          classList: ["btn", "btn-danger", "center"],
          children: [icon("./assets/trash")],
          listeners: [
            {
              event: "click",
              callback: () => {
                notify("Task successfully removed", "success");
                this.element.remove();
                handleRemove(this.state.id);
              },
            },
          ],
        }),
      ],
    });
    if (this.state.isComplete) {
      buttons.prepend(redo);
    }
    const checkbox = createElement({
      type: "input",
      attributes: [{ key: "type", value: "checkbox" }],
      listeners: [
        {
          event: "click",
          callback: () => {
            notify("Done already!?", "warning");
          },
        },
        {
          event: "keydown",
          callback: (event) => {
            if (event.key === "Enter") {
              checkbox.click();
            }
          },
        },
        {
          event: "change",
          callback: (event) => {
            if (event.target.checked) {
              buffer.set(
                this.state.id,
                setTimeout(() => {
                  this.state.isComplete = true;
                  const s = `priority-${this.state.priority}`;
                  if (this.element.classList.contains(s))
                    this.element.classList.remove(s);
                  this.element.classList.add("completed");
                  indicator.classList.add("hide");
                  checkbox.checked = true;
                  checkbox.disabled = true;
                  buttons.prepend(redo);
                  this.#popOut();
                  handleComplete(this.state.id);
                }, 1000)
              );
            } else {
              clearTimeout(buffer.get(this.state.id));
              buffer.delete(this.state.id);
            }
          },
        },
      ],
    });

    this.element = createElement({
      type: "li",
      classList: ["todo", isComplete ? "completed" : `priority-${priority}`],
      attributes: [{ key: "data-id", value: this.state.id }],
      children: [
        checkbox,
        createElement({
          type: "span",
          classList: "text",
          text: this.state.text,
        }),
        indicator,
        buttons,
      ],
    });

    if (this.state.isComplete) {
      checkbox.disabled = true;
      checkbox.checked = true;
      this.#popOut();
    }
  }
  #popOut() {
    this.element.classList.add("popOut");
    setTimeout(() => {
      this.element.classList.remove("popOut");
    }, 1000);
  }
}
