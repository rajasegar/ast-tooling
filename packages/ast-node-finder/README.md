# ast-node-finder
![Build and Deploy](https://github.com/rajasegar/ast-node-finder/workflows/Node%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/rajasegar/ast-node-finder/badge.svg?branch=refs/heads/master)](https://coveralls.io/github/rajasegar/ast-node-finder?branch=refs/heads/master)
[![Version](https://img.shields.io/npm/v/ast-node-finder.svg)](https://npmjs.org/package/ast-node-finder)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)


[jscodeshift](https://github.com/facebook/jscodeshift) find api automatically generated from code

Checkout the api in this [playground](https://rajasegar.github.io/ast-finder/)

Read the [introductory blog post](http://hangaroundtheweb.com/2019/12/ast-finder-finding-ast-nodes-from-code/) for more details.

## Usage
```js
import { findQuery } from 'ast-node-finder';
import { parse } from 'recast';

const source = `foo.bar.baz(1,2,3)`;

const ast = parse(source);

// Pass the node from ast and get the find api
console.log(findQuery(ast.program.body[0].expression));
```

### Output

```js
root.find(j.CallExpression, {
  callee: {
    object: {   object: { name: 'foo' },
    property: { name: 'bar' }
  },
  property: { name: 'baz' }
  }
})
.forEach(path => {
  // Manipulate the path (node) here
});
```

