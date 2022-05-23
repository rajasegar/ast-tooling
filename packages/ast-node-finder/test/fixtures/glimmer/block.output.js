return {
  BlockStatement(node) {
    if(node.path.original === 'hello') {
      return node;
    }
  }
};