class Dropdown {
  constructor({ element: dropdown, onInput: handleInput }) {
    const upArrow = icon("./assets/up");
    const downArrow = icon("./assets/down");
    const button = dropdown.querySelector("button");
    const menu = dropdown.querySelector(".menu");
    const items = menu.querySelectorAll("li");
    button.appendChild(downArrow);
    button.addEventListener("click", () => {
      if (menu.classList.contains("hide")) {
        downArrow.remove();
        button.appendChild(upArrow);
      } else {
      }
      menu.classList.toggle("hide");
    });
    let index = -1;

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
      item.addEventListener("click", (event) => {
        menu.classList.toggle("hide");
        handleInput(event);
        const arr = item.textContent.split(" ");
        let text = arr[0];
        if (arr.length > 1) {
          text += "...";
        }
        button.textContent = text;
        button.appendChild(downArrow);
      });
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          menu.classList.toggle("hide");
          handleInput(event);
          const arr = item.textContent.split(" ");
          let text = arr[0];
          if (arr.length > 1) {
            text += "...";
          }
          button.textContent = text;
          button.appendChild(downArrow);
        }
      });
    });
    document.addEventListener("click", (event) => {
      if (event.target.closest(".dropdown")) return;
      menu.classList.add("hide");
      button.appendChild(downArrow);
      upArrow.remove();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        menu.classList.add("hide");
        button.appendChild(downArrow);
        upArrow.remove();
      }
    });
  }
}
