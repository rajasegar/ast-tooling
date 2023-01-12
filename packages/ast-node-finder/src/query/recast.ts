import { stripIndent } from 'common-tags';

import { Node } from '../typings';

// Build object query
function objectQuery(node: Node): string {
  let str = '';
  switch(node.type) {
    case 'Identifier':
      str = `object: { name: '${node.name}' }`;
      break;

     case 'CallExpression':
      str = `object: { ${calleeQuery(node.callee)} }`;
      break;

    case 'MemberExpression':
      str = stripIndent`
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
function calleeQuery(node: Node):string {
  let str = '';
  if(node.type === 'MemberExpression') {
    let { object, property } = node;
    let obj = '';
    let prop = '';

    obj = objectQuery(object);
    switch(property.type) {
      case 'Identifier':
        prop = `property: { name: '${property.name}' }`;
        break;

      default:
        console.log('calleeQuery::property => ', property.type);
        break;
    }

    str =  stripIndent`callee: {
      ${obj},
      ${prop}
    }`;

  } else if (node.type === 'CallExpression') {
    str = ` ${calleeQuery(node.callee)} `;

  } else if (node.type === 'Identifier') {

    str = `callee: { name: '${node.name}' }`;
  }
  else {

			console.error('calleeQuery: ', node.type);
  }

  return str;

}

// Build memberExpression query
function memberExpressionQuery(node: Node): string {
  let str = '';

    let { object, property } = node;
    let obj = '';
    let prop = '';

    obj = objectQuery(object);

    switch(property.type) {
      case 'Identifier':
        prop = `property: { name: '${property.name}' }`;
        break;

      default:
        console.log('buildMemberExpressionQuery::property => ', property.type);
        break;
    }

    str =  `root.find(j.MemberExpression, {
    ${obj},
    ${prop}
    })`;

  return str;
}

// Build callExpression query
function callExpressionQuery(node: Node): string {
  let str = '';
  const { arguments: args } = node;

  // Deliberately filtering out other argument nodes here
    let filteredArgs = args.filter((a: Node) => ['Literal','Identifier'].includes(a.type));
    let _filter = filteredArgs.map((a: Node, i: number) => {
    let temp = '';
    switch(a.type) {
      case 'Literal':
        temp = `path.value.arguments[${i}].raw === '${a.raw.replace(/'/g,'')}'`;
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

  if(filteredArgs.length > 0) {
  str = stripIndent`
  root.find(j.CallExpression, {
    ${calleeQuery(node.callee)}
  })
  .filter(path => {
    return ${_filter}
  })`;
  } else {
  str = stripIndent`
  root.find(j.CallExpression, {
    ${calleeQuery(node.callee)}
  })`;
  }
  return str;
}

function literalQuery(node: Node): string {
  let value = typeof node.value === 'string' ? `'${node.value}'` : node.value;
  return `root.find(j.Literal, { value: ${value} })`;
}

function variableDeclaratorQuery(node: Node): string {
  return `root.find(j.VariableDeclarator, {
  id: { name: '${node.id.name}' }
  });`;
}

function expressionStatementQuery(node: Node): string {
  let { expression } = node;
  let str = '';
  switch(expression.type) {
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
  }

  return str;
}

// New Expression Query
function newExpressionQuery(node: Node): string {
  let str = '';
  str =   `root.find(j.NewExpression, {
  callee: { name: '${node.callee.name}' }
})`;
  return str;
}

// Import Declaration query
function importDeclarationQuery(node: Node): string {
  let str = '';
  str = `root.find(j.ImportDeclaration, {
  source: ${node.source.raw}
})`;
  return str;
}

function exportDefaultDeclarationQuery(node: Node): string {
  let str = '';
  switch(node.declaration.type) {

    case 'CallExpression':
  str =   `root.find(j.ExportDefaultDeclaration, {
  declaration: { ${calleeQuery(node.declaration.callee)} }
  })`;
      break;

    default:
      console.log('exportDefaultDeclaration => ', node.declaration.type);
  }

  return str;
}

function exportNamedDeclarationQuery(node: Node): string {
  let str = '';
  switch(node.declaration.type) {

    case 'CallExpression':
  str =   `root.find(j.ExportNamedDeclaration, {
  declaration: { ${calleeQuery(node.declaration.callee)} }
  })`;
      break;

			case 'FunctionDeclaration':
  str =   `root.find(j.ExportNamedDeclaration, {
declaration: { id: { name: '${node.declaration.id.name}' } }
  })`;
					break;

    default:
      console.log('exportNamedDeclaration => ', node.declaration.type);
  }

  return str;
}

function identifier(node: Node): string {
  let str = '';
  str = `root.find(j.Identifier, {
  name: '${node.name}'
  })`;
  return str;
}

function functionDeclaration(node: Node): string {
  let str = '';
  str = `root.find(j.FunctionDeclaration, {
  id: { name: '${node.id.name}' }
  })`;
  return str;
}

function assignmentExpression(node: Node): string {
  let { operator, left, right } = node;
  let str = '';
  let val = '';
  let _right = '';
  switch(right.type) {
    case 'Literal':
      val = typeof right.value === 'string' ? `'${right.value}'` : right.value;
      _right = `right: { value: ${val} }`;
      break;

    case 'Identifier':
      _right = `right: { name: '${right.name}' }`;
      break;

    case 'MemberExpression':
      _right = stripIndent`
      right: {
        ${objectQuery(right.object)},
        property: { name: '${right.property.name}' }
      }`;
      break;

    default:
      console.log('assignmentExpression => ', right.type);
      break;
      
  }
  str = stripIndent`
  root.find(j.AssignmentExpression, {
    operator: '${operator}',
    left: { name: '${left.name}' },
    ${_right}
  })
  `;
  return str;
}

export {
  assignmentExpression,
  callExpressionQuery,
  literalQuery,
  memberExpressionQuery,
  newExpressionQuery,
  expressionStatementQuery,
  variableDeclaratorQuery,
  importDeclarationQuery,
  exportDefaultDeclarationQuery,
  exportNamedDeclarationQuery,
  identifier,
  functionDeclaration
};
