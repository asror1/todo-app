// Author: Asror Klichev

/**
 * Inner Trie node
 */
class TrieNode {
  id;
  children = {};
  contructor(id) {
    this.id = id;
    this.children = {};
    this.isEnd = false;
  }
}
/**
 * Trie data structure also known as prefix tree.
 * Used for storing tasks for fast prefix searching
 */
class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  /**
   * @method insert, inserts task desc/name into trie
   * @param {string} word, task desc/name
   * @param {number} id, associated id with task
   */
  insert(word, id) {
    let node = this.root;
    for (const char of word) {
      if (!node.children || !node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEnd = true;
    node.id = id;
  }
  /**
   * Find all tasks that start with prefix
   * @param {TrieNode} node
   * @param {Array} res
   */
  #find(node, res) {
    if (!node || !node.children) return;
    if (node.isEnd) res.push(node.id);
    for (const child of Object.keys(node.children)) {
      this.#find(node.children[child], res);
    }
  }
  /**
   * @method startsWith, finds all tasks that start with prefix
   * @param {string} prefix
   * @returns {Array} Array of task ids
   */
  startsWith(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children || !node.children[char]) break;
      node = node.children[char];
    }
    let res = new Array();
    this.#find(node, res);
    return res;
  }
}
