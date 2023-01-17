import { stripIndent } from 'common-tags';

import { Node, Ast } from '../typings';


// Build object query
function objectQuery(node: Node): string {
  let str = '';
  switch(node.type) {
    case 'Identifier':
      str = `object: { name: '${node.name}' }`;
      break;

     case 'CallExpression':
      str = `object: { ${callee(node.callee)} }`;
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
function callee(node: Node): string {
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

  //} else if (node.type === 'CallExpression') {
    //str = ` ${calleeQuery(node.callee)} `;

  } else if (node.type === 'Identifier') {

    str = `callee: { name: '${node.name}' }`;
  }
  else {

    console.error('Unknown node type in calleeQuery');
  }

  return str;

}

// Build memberExpression query
function memberExpression(node: Node): string {
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
function callExpression(node: Node): string {
  let str = '';
  const { arguments: args } = node;

  // Deliberately filtering out other argument nodes here
    let filteredArgs = args.filter((a: Node) => ['Identifier'].includes(a.type));
    let _filter = filteredArgs.map((a: Node,i: number) => {
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
    ${callee(node.callee)}
  })
  .filter(path => {
    return ${_filter}
  })`;
  } else {
  str = stripIndent`
  root.find(j.CallExpression, {
    ${callee(node.callee)}
  })`;
  }
  return str;
}


function variableDeclarator(node: Node): string {
  return `root.find(j.VariableDeclarator, {
  id: { name: '${node.id.name}' }
  })`;
}

function expressionStatement(node: Node): string {
  let { expression } = node;
  let str = '';
  switch(expression.type) {
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
function newExpression(node: Node): string {
  let str = '';
  str =   `root.find(j.NewExpression, {
  callee: { name: '${node.callee.name}' }
})`;
  return str;
}

// Import Declaration query
function importDeclaration(node: Node): string {
  let str = '';
  str = `root.find(j.ImportDeclaration, {
  source: { value: '${node.source.value}' }
})`;
  return str;
}

function exportDefaultDeclaration(node: Node): string {
  let str = '';
  switch(node.declaration.type) {

    case 'CallExpression':
  str =   `root.find(j.ExportDefaultDeclaration, {
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
    case 'StringLiteral':
      val =  `'${right.value}'`;
      _right = `right: { value: ${val} }`;
      break;

    case 'NumericLiteral':
      val =  right.value;
      _right = `right: { value: ${val} }`;
      break;

    case 'BooleanLiteral':
      val =  right.value;
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

function expressionQuery(node: Node): string {
  let str = '';
  switch(node.type) {
    case 'CallExpression':
    str = callExpression(node);
    break;

    case 'AssignmentExpression':
    str = assignmentExpression(node);
    break;

    case 'Identifier':
    str = identifier(node);
    break;

    case 'MemberExpression':
    str = memberExpression(node);
    break;

    case 'NewExpression':
    str = newExpression(node);
    break;

		case 'JSXElement':
		str = jsxElementQuery(node);
		break;


    default:
    console.log('expressionQuery => ', node.type);
    break;
  }
  return str;
}

export function dispatchNodes(ast: Ast,  wrapExpression = false): string {
  let str = '';
    str = ast.program && ast.program.body.map((node: Node) => {
      switch(node.type) {
        case 'ExpressionStatement':
          return wrapExpression ? expressionStatement(node.expression) : expressionQuery(node.expression);

        case 'VariableDeclaration':
          return variableDeclarator(node.declarations[0]);

        case 'ImportDeclaration':
          return importDeclaration(node);

        case 'ExportDefaultDeclaration':
          return exportDefaultDeclaration(node);

        case 'FunctionDeclaration':
          return functionDeclaration(node);

        default:
          console.log('Babel::dispatchNodes => ', node.type); // eslint-disable-line
          return '';
      }
    });

    return str;
}


function jsxElementQuery(node: Node): string {
		let str = `root.find(j.JSXElement, {
  openingElement: { name: { name: '${node.openingElement.name.name}' } }
})`;
		return str;
}
