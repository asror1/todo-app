/**
 * @class TreeNode, represents a BST node
 */
class TreeNode {
  constructor(data, id) {
    this.data = data;
    this.id = id;
    this.left = null;
    this.right = null;
  }
}
/**
 * @class BST data structure, used for efficient lookup, and storing elements in sorted order. Enforced order: left subtree smaller than root right subtree greater than root, meaning [smallest... biggest]
 */
class BST {
  /**
   * @constructor
   *
   * @param {function} isLess, the order of which to enforce,
   * provides two elements for the predicate to compare
   */
  constructor() {
    this.root = null;
  }
  insert(data, id) {
    let newNode = new TreeNode(data, id);
    if (this.root === null) this.root = newNode;
    else {
      this.#insert(this.root, newNode);
    }
  }
  #insert(node, newNode) {
    if (newNode.data < node.data) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this.#insert(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this.#insert(node.right, newNode);
      }
    }
  }
  #maxDepth(node) {
    if (node === null) return 1;
    return 1 + Math.max(this.#maxDepth(node.left), this.#maxDepth(node.right));
  }
  remove(data) {
    this.#remove(this.root, data);
  }
  #remove(node, data) {
    if (node === null) return null;
    if (data < node.data) {
      node.left = this.#remove(node.left, data);
      return node;
    } else if (data > node.data) {
      node.right = this.#remove(node.right, data);
      return node;
    } else {
      if (node.left === null && node.right === null) {
        node === null;
        return null;
      }
      if (node.left === null) {
        node = node.right;
        return node;
      } else if (node.right === null) {
        node = node.left;
        return node;
      }
      let successor = this.#leftMost(node.right);
      node.data = successor.data;
      node.id = successor.id;
      node.right = this.#remove(node.right, successor.data);
      return node;
    }
  }
  removeById(id) {
    this.root = this.#removeById(id, this.root);
  }
  #removeById(id, node) {
    if (node === null) return null;
    if (node.id === id) {
      if (!node.left && !node.right) {
        return null;
      } else if (!node.left) {
        return node.right;
      } else if (!node.right) {
        return node.left;
      } else {
        let successor = this.#leftMost(node.right);
        node.id = successor.id;
        node.data = successor.data;
        node.right = this.#removeById(successor.id, node.right);
        return node;
      }
    } else {
      node.left = this.#removeById(id, node.left);
      node.right = this.#removeById(id, node.right);
      return node;
    }
  }
  #leftMost(node) {
    if (node.left === null) {
      return node;
    } else {
      return this.#leftMost(node.left);
    }
  }
  /**
   * Iterate bst in order
   *
   * @param {TreeNode} node, starting node
   * @param {function} callback, function to call on every node
   */
  #iter(node, callback) {
    if (node === null) return;
    this.#iter(node.left, callback);
    callback(node);
    this.#iter(node.right, callback);
  }
  toArray() {
    let arr = [];
    this.#iter(this.root, (elem) => {
      arr.push({ id: elem.id, data: elem.data });
    });
    return arr;
  }
}
