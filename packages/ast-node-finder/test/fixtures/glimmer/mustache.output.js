return {
  MustacheStatement(node) {
    if(node.path.original === 'hello') {
      return node;
    }
  }
};