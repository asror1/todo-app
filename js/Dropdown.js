// Author: Asror Klichev

/**
 * @class Dropdown, represents a custom dropdown element
 * associated html elements must be present in index.html for this class to work properly
 * Logic unit for dropdowns
 */
class Dropdown {
  constructor({ element: dropdown, onInput: handleInput }) {
    // definitions
    const upArrow = icon("./assets/up");
    const downArrow = icon("./assets/down");
    const button = dropdown.querySelector("button");
    const menu = dropdown.querySelector(".menu");
    const items = menu.querySelectorAll("li");

    button.appendChild(downArrow);

    // toggle menu visibility
    button.addEventListener("click", () => {
      if (menu.classList.contains("hide")) {
        downArrow.remove();
        button.appendChild(upArrow);
      } else {
        upArrow.remove();
        button.appendChild(downArrow);
      }
      menu.classList.toggle("hide");
    });

    let index = -1;

    // allow for keyboard navigation
    dropdown.addEventListener("keydown", function (e) {
      switch (e.keyCode) {
        case 38: // up arrow
          index = index <= 0 ? items.length - 1 : --index;
          break;
        case 40: // down arrow
          index = index >= items.length - 1 ? 0 : ++index;
          break;
        default:
          return; // exit this handler for other keys
      }
      items[index].focus();
      e.preventDefault(); // prevent the default action (scroll / move caret)
    });
    items.forEach((item) => {
      const select = (event) => {
        menu.classList.toggle("hide");
        handleInput(event);
        const arr = item.textContent.split(" ");
        let text = arr[0]; // using only the first word, ellipsis the rest
        if (arr.length > 1) {
          text += "...";
        }
        button.textContent = text;
        button.appendChild(downArrow);
      }
      item.addEventListener("click", (event) => {
        select(event)
      });
      // allow enter to select choice
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          select(event)
        }
      });
    });
    const handleBlur = () => {
      menu.classList.add("hide");
      button.appendChild(downArrow);
      upArrow.remove();
    }
    // close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (event.target.closest(".dropdown")) return;
      handleBlur();
    });
    // close menu when pressing escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        handleBlur();
      }
    });
  }
}
