// Author: Asror Klichev

/**
 * Sorts an array of elements
 * @param {Array} arr, array to sort
 * @param {function} isLess, sorting predicate - is passed in two elements,
 * must return whether first element is less than second
 */
let FAILSAFE_FLAG;
function quicksort(arr, isLess) {
  if (!arr || arr.length === 1) return;
  FAILSAFE_FLAG = Math.pow(arr.length, 2);
  qs(arr, 0, arr.length - 1, isLess);
}
/**
 * Quick sort helper method
 * @param {Array} arr, array to sort
 * @param {number} left, left pointer
 * @param {number} right, right pointer
 * @param {function} isLess, sorting predicate to be passed onto partition func
 */
function qs(arr, left, right, isLess) {
  if (FAILSAFE_FLAG === 0) return;
  if (left >= right) return;
  let idx = partition(arr, left, right, isLess);
  qs(arr, left, idx - 1, isLess);
  qs(arr, idx, right, isLess);
}
/**
 *  Quick sort partition method, returns left pointer after execution
 * @param {Array} arr, array to sort
 * @param {number} left, left pointer
 * @param {number} right, right pointer
 * @param {function} isLess, sorting predicate
 */
function partition(arr, left, right, isLess) {
  FAILSAFE_FLAG--;
  let pivot = Math.floor((left + right) / 2);
  while (left <= right) {
    while (isLess(arr[left], arr[pivot])) left++;
    while (isLess(arr[pivot], arr[right])) right--;

    if (left <= right) {
      swap(arr, left, right);
      left++;
      right--;
    }
  }
  return left;
}
/**
 * Swaps two elements of an array using indices
 * @param {Array} arr, array to swap elements in
 * @param {number} idx1, index of first element
 * @param {number} idx2, index of second element
 */
function swap(arr, idx1, idx2) {
  let temp = arr[idx1];
  arr[idx1] = arr[idx2];
  arr[idx2] = temp;
}

/**
 * Creates an element with the given type, classes, and content
 *
 * @param {string} type, type of element to create
 * @param {string | string[]} classList, class or classes to add to element
 * @param {string} text, textual content to add to element
 * @param {object[]} attributes, attributes to add to element
 * @param {string} attributes[].key, key of attribute
 * @param {string} attributes[].value, value of attribute
 * @param {object[]} listeners, listeners to add to element
 * @param {HTMLElement[]} children, children to add to element
 * @returns {HTMLElement} element created
 * @throws {Error} if type is not provided
 */
function createElement({
  type,
  classList,
  text = "",
  attributes = [{}],
  listeners = [{}],
  children = [],
}) {
  if (!type) throw new Error("Type is required");
  const element = document.createElement(type);
  if (classList) {
    if (classList instanceof Array) element.classList.add(...classList);
    else element.classList.add(classList);
  }
  element.textContent = text;
  element.append(...children);
  attributes?.forEach((attribute) => {
    element.setAttribute(attribute.key, attribute.value);
  });
  listeners?.forEach((listener) => {
    element.addEventListener(listener.event, listener.callback);
  });
  return element;
}

/**
 * Creates an svg icon element using the path to the svg file
 *
 * @param {string} path, path to svg file
 * @returns {HTMLElement} svg icon element
 */
function icon(path) {
  return createElement({
    type: "img",
    classList: "icon",
    attributes: [
      { key: "src", value: `${path}.svg` },
      { key: "alt", value: "icon" },
    ],
  });
}
/**
 * Creates a notification element with the given message
 * @param {string} msg, message to display
 * @param {number} duration, duration of notification in ms
 * @returns {HTMLElement} notification element created
 */
function notify(msg, type, duration = 3000) {
  const notify = createElement({
    type: "span",
    classList: ["notify"],
    children: [
      createElement({
        type: "p",
        classList: ["message", type],
        text: `💬 ${msg}`,
      }),
      createElement({
        type: "button",
        classList: "close",
        listeners: [
          {
            event: "click",
            callback: () => {
              notify.remove();
            },
          },
        ],
        children: [icon(`./assets/x`)],
      }),
    ],
  });
  document.body.prepend(notify);
  setTimeout(() => {
    notify.remove();
  }, duration);
  return notify;
}
/**
 * Saves a key value pair to local storage
 *
 * @param {string} k, key to save
 * @param {any} v, value to save
 * @throws {Error} if key or value is not provided
 */
function save(k, v) {
  if (k === undefined || v === undefined)
    throw new Error("Key and value are required");
  const escape = (value) => {
    if (typeof value !== "string") return value;
    return value.replace(/</g, "<").replace(/>/g, ">");
  };
  window.localStorage.setItem(k, JSON.stringify(escape(v)));
}

/**
 * Retrieves a value from local storage
 *
 * @param {string} k, key to get
 * @returns {any} value of key
 * @throws {Error} if key is not provided
 */
function find(k) {
  if (k === undefined) throw new Error("Key is required");
  const unescape = (value) => {
    if (typeof value !== "string") return value;
    return value.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  };
  const v = window.localStorage.getItem(k);
  return v === undefined ? v : unescape(JSON.parse(v));
}

/**
 * Checks if a key exists in local storage
 *
 * @param {string} k, key to check
 * @returns {boolean} true if key exists, false otherwise
 * @throws {Error} if key is not provided
 */
function exists(k) {
  if (!k) throw new Error("Key is required");
  return window.localStorage.getItem(k) ? true : false;
}
