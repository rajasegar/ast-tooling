'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var commonTags = require('common-tags');

// Build object query
function objectQuery$1(node) {
    let str = '';
    switch (node.type) {
        case 'Identifier':
            str = `object: { name: '${node.name}' }`;
            break;
        case 'CallExpression':
            str = `object: { ${calleeQuery(node.callee)} }`;
            break;
        case 'MemberExpression':
            str = commonTags.stripIndent `
      object: { ${objectQuery$1(node.object)} ,
        property: { name: '${node.property.name}' }
      }`;
            break;
        case 'ThisExpression':
            str = `object: { type: "ThisExpression" }`;
            break;
        default:
            console.log('objectQuery::object => ', node.type);
            break;
    }
    return str;
}
// Build callee query
function calleeQuery(node) {
    let str = '';
    if (node.type === 'MemberExpression') {
        let { object, property } = node;
        let obj = '';
        let prop = '';
        obj = objectQuery$1(object);
        switch (property.type) {
            case 'Identifier':
                prop = `property: { name: '${property.name}' }`;
                break;
            default:
                console.log('calleeQuery::property => ', property.type);
                break;
        }
        str = commonTags.stripIndent `callee: {
      ${obj},
      ${prop}
    }`;
    }
    else if (node.type === 'CallExpression') {
        str = ` ${calleeQuery(node.callee)} `;
    }
    else if (node.type === 'Identifier') {
        str = `callee: { name: '${node.name}' }`;
    }
    else {
        console.error('calleeQuery: ', node.type);
    }
    return str;
}
// Build memberExpression query
function memberExpressionQuery$1(node) {
    let str = '';
    let { object, property } = node;
    let obj = '';
    let prop = '';
    obj = objectQuery$1(object);
    switch (property.type) {
        case 'Identifier':
            prop = `property: { name: '${property.name}' }`;
            break;
        default:
            console.log('buildMemberExpressionQuery::property => ', property.type);
            break;
    }
    str = `root.find(j.MemberExpression, {
    ${obj},
    ${prop}
    })`;
    return str;
}
// Build callExpression query
function callExpressionQuery$1(node) {
    let str = '';
    const { arguments: args } = node;
    // Deliberately filtering out other argument nodes here
    let filteredArgs = args.filter((a) => ['Literal', 'Identifier'].includes(a.type));
    let _filter = filteredArgs.map((a, i) => {
        let temp = '';
        switch (a.type) {
            case 'Literal':
                temp = `path.value.arguments[${i}].raw === '${a.raw.replace(/'/g, '')}'`;
                break;
            case 'Identifier':
                temp = `path.value.arguments[${i}].name === '${a.name}'`;
                break;
            default:
                console.log('callExpressionQuery::filter => ', a.type);
                break;
        }
        return temp;
    }).join('\n  && ');
    if (filteredArgs.length > 0) {
        str = commonTags.stripIndent `
  root.find(j.CallExpression, {
    ${calleeQuery(node.callee)}
  })
  .filter(path => {
    return ${_filter}
  })`;
    }
    else {
        str = commonTags.stripIndent `
  root.find(j.CallExpression, {
    ${calleeQuery(node.callee)}
  })`;
    }
    return str;
}
function literalQuery$1(node) {
    let value = typeof node.value === 'string' ? `'${node.value}'` : node.value;
    return `root.find(j.Literal, { value: ${value} })`;
}
function variableDeclaratorQuery$1(node) {
    return `root.find(j.VariableDeclarator, {
  id: { name: '${node.id.name}' }
  });`;
}
function jsxElementQuery$2(node) {
    let str = `root.find(j.JSXElement, {
openingElement: { name: { name: '${node.openingElement.name.name}' }}
})`;
    return str;
}
function expressionStatementQuery$1(node) {
    let { expression } = node;
    let str = '';
    switch (expression.type) {
        case 'CallExpression':
            str = `root.find(j.ExpressionStatement, {
      expression: {
      ${calleeQuery(expression)}
      }
      })`;
            break;
        case 'MemberExpression':
            str = `root.find(j.ExpressionStatement, {
      expression: {
      ${calleeQuery(expression)}
      }
      })`;
            break;
        case 'JSXElement':
            str = `root.find(j.ExpressionStatement, {
expression: {
${jsxElementQuery$2(expression)}
}

})`;
            break;
        default:
            console.error('expressionStatementQuery => ', node.type);
    }
    return str;
}
// New Expression Query
function newExpressionQuery$1(node) {
    let str = '';
    str = `root.find(j.NewExpression, {
  callee: { name: '${node.callee.name}' }
})`;
    return str;
}
// Import Declaration query
function importDeclarationQuery$1(node) {
    let str = '';
    str = `root.find(j.ImportDeclaration, {
  source: ${node.source.raw}
})`;
    return str;
}
function exportDefaultDeclarationQuery$1(node) {
    let str = '';
    switch (node.declaration.type) {
        case 'CallExpression':
            str = `root.find(j.ExportDefaultDeclaration, {
  declaration: { ${calleeQuery(node.declaration.callee)} }
  })`;
            break;
        default:
            console.log('exportDefaultDeclaration => ', node.declaration.type);
    }
    return str;
}
function exportNamedDeclarationQuery$1(node) {
    let str = '';
    switch (node.declaration.type) {
        case 'CallExpression':
            str = `root.find(j.ExportNamedDeclaration, {
  declaration: { ${calleeQuery(node.declaration.callee)} }
  })`;
            break;
        case 'FunctionDeclaration':
            str = `root.find(j.ExportNamedDeclaration, {
declaration: { id: { name: '${node.declaration.id.name}' } }
  })`;
            break;
        default:
            console.log('exportNamedDeclaration => ', node.declaration.type);
    }
    return str;
}
function identifier$2(node) {
    let str = '';
    str = `root.find(j.Identifier, {
  name: '${node.name}'
  })`;
    return str;
}
function functionDeclaration$2(node) {
    let str = '';
    str = `root.find(j.FunctionDeclaration, {
  id: { name: '${node.id.name}' }
  })`;
    return str;
}
function assignmentExpression$2(node) {
    let { operator, left, right } = node;
    let str = '';
    let val = '';
    let _right = '';
    switch (right.type) {
        case 'Literal':
            val = typeof right.value === 'string' ? `'${right.value}'` : right.value;
            _right = `right: { value: ${val} }`;
            break;
        case 'Identifier':
            _right = `right: { name: '${right.name}' }`;
            break;
        case 'MemberExpression':
            _right = commonTags.stripIndent `
      right: {
        ${objectQuery$1(right.object)},
        property: { name: '${right.property.name}' }
      }`;
            break;
        default:
            console.log('assignmentExpression => ', right.type);
            break;
    }
    str = commonTags.stripIndent `
  root.find(j.AssignmentExpression, {
    operator: '${operator}',
    left: { name: '${left.name}' },
    ${_right}
  })
  `;
    return str;
}

var query = /*#__PURE__*/Object.freeze({
  __proto__: null,
  assignmentExpression: assignmentExpression$2,
  callExpressionQuery: callExpressionQuery$1,
  literalQuery: literalQuery$1,
  memberExpressionQuery: memberExpressionQuery$1,
  newExpressionQuery: newExpressionQuery$1,
  expressionStatementQuery: expressionStatementQuery$1,
  variableDeclaratorQuery: variableDeclaratorQuery$1,
  importDeclarationQuery: importDeclarationQuery$1,
  exportDefaultDeclarationQuery: exportDefaultDeclarationQuery$1,
  exportNamedDeclarationQuery: exportNamedDeclarationQuery$1,
  identifier: identifier$2,
  functionDeclaration: functionDeclaration$2,
  jsxElementQuery: jsxElementQuery$2
});

// Build object query
function objectQuery(node) {
    let str = '';
    switch (node.type) {
        case 'Identifier':
            str = `object: { name: '${node.name}' }`;
            break;
        case 'CallExpression':
            str = `object: { ${callee(node.callee)} }`;
            break;
        case 'MemberExpression':
            str = commonTags.stripIndent `
      object: { ${objectQuery(node.object)} ,
        property: { name: '${node.property.name}' }
      }`;
            break;
        case 'ThisExpression':
            str = `object: { type: "ThisExpression" }`;
            break;
        default:
            console.log('objectQuery::object => ', node.type);
            break;
    }
    return str;
}
// Build callee query
function callee(node) {
    let str = '';
    if (node.type === 'MemberExpression') {
        let { object, property } = node;
        let obj = '';
        let prop = '';
        obj = objectQuery(object);
        switch (property.type) {
            case 'Identifier':
                prop = `property: { name: '${property.name}' }`;
                break;
            default:
                console.log('calleeQuery::property => ', property.type);
                break;
        }
        str = commonTags.stripIndent `callee: {
      ${obj},
      ${prop}
    }`;
        //} else if (node.type === 'CallExpression') {
        //str = ` ${calleeQuery(node.callee)} `;
    }
    else if (node.type === 'Identifier') {
        str = `callee: { name: '${node.name}' }`;
    }
    else {
        console.error('Unknown node type in calleeQuery');
    }
    return str;
}
// Build memberExpression query
function memberExpression(node) {
    let str = '';
    let { object, property } = node;
    let obj = '';
    let prop = '';
    obj = objectQuery(object);
    switch (property.type) {
        case 'Identifier':
            prop = `property: { name: '${property.name}' }`;
            break;
        default:
            console.log('buildMemberExpressionQuery::property => ', property.type);
            break;
    }
    str = `root.find(j.MemberExpression, {
    ${obj},
    ${prop}
    })`;
    return str;
}
// Build callExpression query
function callExpression(node) {
    let str = '';
    const { arguments: args } = node;
    // Deliberately filtering out other argument nodes here
    let filteredArgs = args.filter((a) => ['Identifier'].includes(a.type));
    let _filter = filteredArgs.map((a, i) => {
        let temp = '';
        switch (a.type) {
            case 'Literal':
                temp = `path.value.arguments[${i}].raw === '${a.raw.replace(/'/g, '')}'`;
                break;
            case 'Identifier':
                temp = `path.value.arguments[${i}].name === '${a.name}'`;
                break;
            default:
                console.log('callExpressionQuery::filter => ', a.type);
                break;
        }
        return temp;
    }).join('\n  && ');
    if (filteredArgs.length > 0) {
        str = commonTags.stripIndent `
  root.find(j.CallExpression, {
    ${callee(node.callee)}
  })
  .filter(path => {
    return ${_filter}
  })`;
    }
    else {
        str = commonTags.stripIndent `
  root.find(j.CallExpression, {
    ${callee(node.callee)}
  })`;
    }
    return str;
}
function variableDeclarator(node) {
    return `root.find(j.VariableDeclarator, {
  id: { name: '${node.id.name}' }
  })`;
}
function expressionStatement(node) {
    let { expression } = node;
    let str = '';
    switch (expression.type) {
        case 'CallExpression':
            str = `root.find(j.ExpressionStatement, {
      expression: {
      ${callee(expression)}
      }
      })`;
            break;
        case 'MemberExpression':
            str = `root.find(j.ExpressionStatement, {
      expression: {
      ${callee(expression)}
      }
      })`;
            break;
    }
    return str;
}
// New Expression Query
function newExpression(node) {
    let str = '';
    str = `root.find(j.NewExpression, {
  callee: { name: '${node.callee.name}' }
})`;
    return str;
}
// Import Declaration query
function importDeclaration(node) {
    let str = '';
    str = `root.find(j.ImportDeclaration, {
  source: { value: '${node.source.value}' }
})`;
    return str;
}
function exportDefaultDeclaration(node) {
    let str = '';
    switch (node.declaration.type) {
        case 'CallExpression':
            str = `root.find(j.ExportDefaultDeclaration, {
  declaration: { ${callee(node.declaration.callee)} }
  })`;
            break;
        case 'ClassDeclaration':
            str = `root.find(j.ExportDefaultDeclaration, {
        declaration: {
          type: 'ClassDeclaration'
        }
      })`;
            break;
        default:
            console.log('exportDefaultDeclaration => ', node.declaration.type);
    }
    return str;
}
function identifier$1(node) {
    let str = '';
    str = `root.find(j.Identifier, {
  name: '${node.name}'
  })`;
    return str;
}
function functionDeclaration$1(node) {
    let str = '';
    str = `root.find(j.FunctionDeclaration, {
  id: { name: '${node.id.name}' }
  })`;
    return str;
}
function assignmentExpression$1(node) {
    let { operator, left, right } = node;
    let str = '';
    let val = '';
    let _right = '';
    switch (right.type) {
        case 'StringLiteral':
            val = `'${right.value}'`;
            _right = `right: { value: ${val} }`;
            break;
        case 'NumericLiteral':
            val = right.value;
            _right = `right: { value: ${val} }`;
            break;
        case 'BooleanLiteral':
            val = right.value;
            _right = `right: { value: ${val} }`;
            break;
        case 'Identifier':
            _right = `right: { name: '${right.name}' }`;
            break;
        case 'MemberExpression':
            _right = commonTags.stripIndent `
      right: {
        ${objectQuery(right.object)},
        property: { name: '${right.property.name}' }
      }`;
            break;
        default:
            console.log('assignmentExpression => ', right.type);
            break;
    }
    str = commonTags.stripIndent `
  root.find(j.AssignmentExpression, {
    operator: '${operator}',
    left: { name: '${left.name}' },
    ${_right}
  })
  `;
    return str;
}
function expressionQuery(node) {
    let str = '';
    switch (node.type) {
        case 'CallExpression':
            str = callExpression(node);
            break;
        case 'AssignmentExpression':
            str = assignmentExpression$1(node);
            break;
        case 'Identifier':
            str = identifier$1(node);
            break;
        case 'MemberExpression':
            str = memberExpression(node);
            break;
        case 'NewExpression':
            str = newExpression(node);
            break;
        case 'JSXElement':
            str = jsxElementQuery$1(node);
            break;
        default:
            console.log('expressionQuery => ', node.type);
            break;
    }
    return str;
}
function dispatchNodes$2(ast, wrapExpression = false) {
    let str = '';
    str = ast.program && ast.program.body.map((node) => {
        switch (node.type) {
            case 'ExpressionStatement':
                return wrapExpression ? expressionStatement(node.expression) : expressionQuery(node.expression);
            case 'VariableDeclaration':
                return variableDeclarator(node.declarations[0]);
            case 'ImportDeclaration':
                return importDeclaration(node);
            case 'ExportDefaultDeclaration':
                return exportDefaultDeclaration(node);
            case 'FunctionDeclaration':
                return functionDeclaration$1(node);
            default:
                console.log('Babel::dispatchNodes => ', node.type); // eslint-disable-line
                return '';
        }
    });
    return str;
}
function jsxElementQuery$1(node) {
    let str = `root.find(j.JSXElement, {
  openingElement: { name: { name: '${node.openingElement.name.name}' } }
})`;
    return str;
}

var babel = /*#__PURE__*/Object.freeze({
  __proto__: null,
  dispatchNodes: dispatchNodes$2
});

function textNode(transform) {
    let str = '';
    str = commonTags.stripIndent `
  return {
    TextNode(node) {
      ${transform}
    }
  };`;
    return str;
}
function elementNode(node, transform) {
    let str = '';
    transform = transform || `node.tag = node.tag.split("").reverse().join("");`;
    str = commonTags.stripIndent `
  return {
    ElementNode(node) {
      if(node.tag === '${node.tag}') {
        ${transform}
      }
    }
  };`;
    return str;
}
function blockStatement(node, transform) {
    let str = '';
    str = commonTags.stripIndent `
  return {
    BlockStatement(node) {
      if(node.path.original === '${node.path.original}') {
        ${transform}
      }
    }
  };`;
    return str;
}
function mustacheStatement(node, transform) {
    let str = '';
    str = commonTags.stripIndent `
  return {
    MustacheStatement(node) {
      if(node.path.original === '${node.path.original}') {
        ${transform}
      }
    }
  };`;
    return str;
}
function dispatchNodes$1(ast, transform = 'return node;') {
    // Build the Glimmer template api
    let _body = ast && ast.body ? ast.body : [];
    let _ast = _body.map((node) => {
        switch (node.type) {
            case "TextNode":
                return textNode(transform);
            case "ElementNode":
                return elementNode(node, transform);
            case "BlockStatement":
                return blockStatement(node, transform);
            case 'MustacheStatement':
                return mustacheStatement(node, transform);
            default:
                console.log("dispatchNodes => ", node.type); // eslint-disable-line
        }
    });
    return _ast;
}

var glimmer = /*#__PURE__*/Object.freeze({
  __proto__: null,
  dispatchNodes: dispatchNodes$1
});

const { assignmentExpression, callExpressionQuery, memberExpressionQuery, literalQuery, newExpressionQuery, expressionStatementQuery, variableDeclaratorQuery, importDeclarationQuery, exportDefaultDeclarationQuery, exportNamedDeclarationQuery, identifier, functionDeclaration, jsxElementQuery, } = query;
// Build the jscodeshift find query from nodes
function findQuery(node) {
    let str = '';
    switch (node.type) {
        case 'CallExpression':
            str = callExpressionQuery(node);
            break;
        case 'MemberExpression':
            str = memberExpressionQuery(node);
            break;
        case 'Literal':
            str = literalQuery(node);
            break;
        case 'VariableDeclarator':
            str = variableDeclaratorQuery(node);
            break;
        case 'ExportDefaultDeclaration':
            str = exportDefaultDeclarationQuery(node);
            break;
        case 'ExportNamedDeclaration':
            str = exportNamedDeclarationQuery(node);
            break;
        case 'ExpressionStatement':
            str = expressionStatementQuery(node);
            break;
        case 'NewExpression':
            str = newExpressionQuery(node);
            break;
        case 'ImportDeclaration':
            str = importDeclarationQuery(node);
            break;
        case 'Identifier':
            str = identifier(node);
            break;
        case 'FunctionDeclaration':
            str = functionDeclaration(node);
            break;
        case 'AssignmentExpression':
            str = assignmentExpression(node);
            break;
        case 'JSXElement':
            str = jsxElementQuery(node);
            break;
        default:
            console.log('findQuery => ', node.type);
            break;
    }
    return str;
}
function dispatchNodes(ast) {
    let str = '';
    str = ast.program && ast.program.body.map((node) => {
        switch (node.type) {
            case 'ExpressionStatement':
                return findQuery(node.expression);
            case 'VariableDeclaration':
                return findQuery(node.declarations[0]);
            case 'ImportDeclaration':
                return findQuery(node);
            case 'ExportDefaultDeclaration':
                return findQuery(node);
            case 'FunctionDeclaration':
                return findQuery(node);
            default:
                console.log('dispatchNodes => ', node.type); // eslint-disable-line
                return '';
        }
    });
    return str;
}

exports.babel = babel;
exports.dispatchNodes = dispatchNodes;
exports.findQuery = findQuery;
exports.glimmer = glimmer;
exports.query = query;
