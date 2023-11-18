// @ts-nocheck
'use strict';

import * as query from './query/recast';
import * as babel from './query/babel';
import * as glimmer from './glimmer';

import { Node, Ast } from './typings';

const {
	functionDeclaration,
	jsxElementQuery,
  arrowFunctionExpressionQuery,
  assignmentExpression,
  callExpressionQuery,
  exportDefaultDeclarationQuery,
  exportNamedDeclarationQuery,
  expressionStatementQuery,
  identifier,
  importDeclarationQuery,
  literalQuery,
  memberExpressionQuery,
  newExpressionQuery,
  variableDeclaratorQuery,
} = query;


// Build the jscodeshift find query from nodes
function findQuery(node: Node) {
  let str = '';
  switch(node.type) {
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

    case 'ArrowFunctionExpression':
      str = arrowFunctionExpressionQuery(node);
        break;

    default:
      console.log('findQuery => ', node.type);
      break;

  }

  return str;
}

function dispatchNodes(ast: Ast) {
  let str = '';
    str = ast.program && ast.program.body.map((node: Node) => {
      switch(node.type) {
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

export {
  findQuery,
  dispatchNodes,
  query,
  glimmer,
  babel
};

