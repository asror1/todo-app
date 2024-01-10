// Description: Logic for dynamic header
// Author: Asror Klichev

// Definitions
const USERNAME_KEY = "username"; // The key used to store the user's name in local storage
const DEFAULT_USERNAME = "<YourName>"; // The default name to use if the user has not set one
const nameInput = document.getElementById("username"); // The input element for the user's name

let userName = DEFAULT_USERNAME;

if (exists(USERNAME_KEY)) {
  userName = find(USERNAME_KEY) + "'s";
}

/**
 * Resizes the input element to fit the text inside it.
 *
 */
function resize() {
  let span = document.getElementById("measure")
  span.textContent = userName
  nameInput.style.width = span.offsetWidth + "px";
}

/**
 * Changes the user's name, updates document title,
 * and adjusts the width of the input. Assuming that "userName" has updated name,
 * and "nameInput" is the input element for the user's name
 *
 * @param {HTMLInputElement} inputElement - The input element to change
 * @param {string} name - The name to change to
 */
function updateUserName() {
  nameInput.value = userName;
  resize();
  document.title = `${userName} TODO List`;
}

/**
 * Capitalizes the first letter of a string
 * @param {string} string - The string to capitalize
 * @returns {string} The capitalized string
 */
function sentenceCase(string = "") {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Execution --------------------------------------------------
updateUserName();

nameInput.addEventListener("input", () => {
  const input = nameInput.value?.replace(/[^a-zA-Z]|'s/g, ""); // Remove non-alphabetical characters
  userName = sentenceCase(input);

  updateUserName();
  save(USERNAME_KEY, userName); // Persist username in local storage
});

nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    nameInput.blur();
  }
});

nameInput.addEventListener("focus", () => {
  nameInput.select();
});

nameInput.addEventListener("blur", () => {
  userName = userName.replace(/'s/, "") + "'s"; // Add ONLY one 's to the end
  if (userName === "'s") userName = DEFAULT_USERNAME; // If the name is empty, set it to default
  updateUserName();
});
