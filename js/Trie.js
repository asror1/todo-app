/**
 * Trie node
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
  #find(node, res) {
    if (!node || !node.children) return;
    if (node.isEnd) res.push(node.id);
    for (const child of Object.keys(node.children)) {
      this.#find(node.children[child], res);
    }
  }
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
