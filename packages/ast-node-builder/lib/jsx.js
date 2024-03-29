import * as base from "./core/base.js";
import { arrowFunctionExpression } from "./es6.js";

import { stringLiteral, numericLiteral, booleanLiteral } from "./babel/base.js";

function objectExpression(node) {
  let { properties } = node;
  let str = properties.map((p) => {
    return property(p);
  });
  return `j.objectExpression([${str.join(",")}])`;
}

function buildValue(node) {
  switch (node.type) {
    case "StringLiteral":
      return stringLiteral(node);
    case "Literal":
      return `j.literal(${node.raw})`;
    case "NumericLiteral":
      return numericLiteral(node);
    case "BooleanLiteral":
      return booleanLiteral(node);
    case "NullLiteral":
      return nullLiteral();
    case "ObjectExpression":
      return objectExpression(node);
    case "CallExpression":
      return callExpression(node);
    case "ArrayExpression":
      return arrayExpression(node);
    case "ArrowFunctionExpression":
      return arrowFunctionExpression(node);
    case "Identifier":
      return identifier(node);
    case "MemberExpression":
      return memberExpression(node);
    case "BinaryExpression":
      return binaryExpression(node);
    case "NewExpression":
      return newExpression(node);
    case "LogicalExpression":
      return logicalExpression(node);
    case "ConditionalExpression":
      return conditionalExpression(node);
    case "TemplateLiteral":
      return templateLiteral(node);
    case "ClassExpression":
      return classExpression(node);
    case "UnaryExpression":
      return unaryExpression(node);
    case "AwaitExpression":
      return awaitExpression(node);
    case "FunctionExpression":
      return functionExpression(node);
    case "JSXElement":
      return element(node);
    case "UpdateExpression":
      return updateExpression(node);
    default: // eslint-disable-line
      console.error("JSX::buildValue => ", node.type);
      return "";
  }
}

function property(node) {
  let { key, value, computed, shorthand } = node;
  let str = "";
  switch (node.type) {
    case "ObjectProperty":
      str = `j.objectProperty(
        ${identifier(key)},
        ${buildValue(value)},
        ${computed},
        ${shorthand}
    )`;
      break;

    case "Property":
      str = `j.Property(
        ${identifier(key)},
        ${buildValue(value)},
        ${computed},
        ${shorthand}
    )`;
      break;

    default:
      console.error("JSX::property => ", node.type);
      break;
  }

  return str;
}

// TODO: Remove from here
function binaryExpression(node) {
  let { operator, left, right } = node;

  let _left = "";
  let _right = "";

  switch (left.type) {
    case "Identifier":
      _left = identifier(left);
      break;

    case "CallExpression":
      _left = callExpression(left);
      break;

    case "MemberExpression":
      _left = memberExpression(left);
      break;

    case "BinaryExpression":
      _left = binaryExpression(left);
      break;

    case "NumericLiteral":
      _left = numericLiteral(left);
      break;

    default: // eslint-disable-line
      console.error("JSX::binaryExpression::left => ", left.type);
      break;
  }

  switch (right.type) {
    case "StringLiteral":
      _right = stringLiteral(right);
      break;

    case "BinaryExpression":
      _right = binaryExpression(right);
      break;

    case "Identifier":
      _right = identifier(right);
      break;

    case "NumericLiteral":
      _right = numericLiteral(right);
      break;

    default: // eslint-disable-line
      console.error("JSX::binaryExpression::right => ", right.type);
      break;
  }

  return `j.binaryExpression(
    '${operator}', 
    ${_left},
    ${_right}
  )`;
}
function identifier(node) {
  return `j.jsxIdentifier('${node.name}')`;
}

function spreadAttribute(node) {
  let str = "";
  switch (node.argument.type) {
    case "CallExpression":
      str = callExpression(node.argument);
      break;

    case "Identifier":
      str = identifier(node.argument);
      break;

    default:
      console.error("JSX::spreadAttribute => ", node.argument.type);
      break;
  }
  return `j.jsxSpreadAttribute(${str})`;
}

function buildAttributeValue(node) {
  let str = "";
  if (!node) {
    return "";
  }
  switch (node.type) {
    case "StringLiteral":
      str = `j.stringLiteral('${node.value}')`;
      break;

    case "JSXExpressionContainer":
      str = expressionContainer(node);
      break;

    case "Literal":
      str = `j.jsxLiteral(${node.value})`;
      break;

    default:
      console.error("JSX::buildAttributeValue => ", node.type);
      break;
  }
  return str;
}
function attribute(node) {
  let str = "";
  const { name, value } = node;
  switch (node.type) {
    case "JSXAttribute":
      str = `j.jsxAttribute(
        ${identifier(name)},
        ${buildAttributeValue(value)}
      )`;
      break;

    case "JSXSpreadAttribute":
      str = spreadAttribute(node);
      break;

    default:
      console.error("JSX::attribute => ", node.type);
      break;
  }
  return str;
}

function buildAttributes(attrs) {
  let str = "";

  str = attrs.map((attr) => {
    return attribute(attr);
  });

  return str.join(",");
}

function jsxMemberExpression(node) {
  let str = "";
  let { object, property } = node;
  let obj = "";

  // Constructing object of a MemberExpression
  switch (object.type) {
    case "JSXMemberExpression":
      obj = `${jsxMemberExpression(object)}`;
      break;

    case "JSXIdentifier":
      obj = identifier(object);
      break;

    default: // eslint-disable-line
      console.error("jsxMemberExpression::object => ", object.type);
      break;
  }

  let prop = "";
  // Constructing property of a MemberExpression
  switch (property.type) {
    case "JSXIdentifier":
      prop = identifier(property);
      break;

    default: // eslint-disable-line
      console.error("jsxMemberExpression.property => ", property.type);
      break;
  }

  str = `j.jsxMemberExpression(
 ${obj},
 ${prop}
  )`;
  return str;
}
function openingElement(node) {
  const { attributes, name, selfClosing } = node;
  let str = "";
  switch (name.type) {
    case "JSXIdentifier":
    case "Identifier":
      str = `j.jsxOpeningElement(
    ${identifier(name)},
    [${buildAttributes(attributes)}],
    ${selfClosing}
  )`;
      break;

    case "JSXMemberExpression":
      str = `j.jsxOpeningElement(
    ${jsxMemberExpression(name)},
    [${buildAttributes(attributes)}],
    ${selfClosing}
  )`;
      break;

    default:
      console.error("JSX::openingElement => ", name.type);
      break;
  }
  return str;
}
function closingElement(node) {
  const { name } = node;
  let str = "";
  switch (name.type) {
    case "JSXIdentifier":
      str = `j.jsxClosingElement(
        ${identifier(name)}
      )`;
      break;

    case "JSXMemberExpression":
      str = `j.jsxClosingElement(
          ${jsxMemberExpression(name)}
        )`;
      break;

    default:
      console.error("JSX::closingElement => ", name.type);
      break;
  }
  return str;
}
// TODO: Need to remove from here
function callExpression(expression) {
  let { arguments: args, callee } = expression;
  if (callee.type === "MemberExpression") {
    return `j.callExpression(
          ${memberExpression(callee)},
          [${buildArgs(args)}]
        )`;
  } else {
    return `j.callExpression(
          ${base.identifier(callee)},
          [${buildArgs(args)}]
        )`;
  }
}
// TODO: Need to remove from here
function arrayExpression(node) {
  let { elements } = node;
  let items = elements
    .map((e) => {
      switch (e.type) {
        case "Literal":
          return base.literal(e);
        //case 'UnaryExpression':
        //  return unaryExpression(e);
        //case 'SpreadElement':
        //  return spreadElement(e);
        case "MemberExpression":
          return memberExpression(e);
        default:
          console.error("arrayExpression => ", e.type);
          return "";
      }
    })
    .join(",");

  return `j.arrayExpression([${items}])`;
}
// TODO: Need to remove from here
function memberExpression(node) {
  let str = "";
  let { object, property, computed } = node;
  let obj = "";

  // Constructing object of a MemberExpression
  switch (object.type) {
    case "ThisExpression":
      obj = `j.thisExpression()`;
      break;

    case "MemberExpression":
      obj = `${memberExpression(object)}`;
      break;

    case "Identifier":
      obj = base.identifier(object);
      break;

    case "CallExpression":
      obj = callExpression(object);
      break;

    case "ArrayExpression":
      obj = arrayExpression(object);
      break;

    default: // eslint-disable-line
      console.error("memberExpression => ", object.type);
      break;
  }

  let prop = "";
  // Constructing property of a MemberExpression
  switch (property.type) {
    case "Identifier":
      prop = base.identifier(property);
      break;

    case "Literal":
      prop = base.literal(property);
      break;

    case "CallExpression":
      prop = callExpression(property);
      break;

    default: // eslint-disable-line
      console.error("memberExpression.property => ", property.type);
      break;
  }

  str = `j.memberExpression(
 ${obj},
 ${prop},
 ${computed}
  )`;
  return str;
}

// TODO: Need to remove from here
function buildArgs(params) {
  let str = params.map((p) => {
    switch (p.type) {
      case "Literal":
        return base.literal(p);

      case "Identifier":
        return base.identifier(p);

      case "StringLiteral":
        return base.literal(p);

      default: // eslint-disable-line
        console.error("buildArgs => ", p.type);
        return "";
    }
  });

  return str.join(",");
}
function expressionContainer(node) {
  let str = "";
  const { expression } = node;
  let expr = "";
  switch (expression.type) {
    case "CallExpression":
      expr = callExpression(expression);
      break;

    case "StringLiteral":
      expr = stringLiteral(expression);
      break;

    case "NumericLiteral":
      expr = numericLiteral(expression);
      break;

    case "BooleanLiteral":
      expr = booleanLiteral(expression);
      break;

    case "Identifier":
      expr = base.identifier(expression);
      break;

    case "MemberExpression":
      expr = memberExpression(expression);
      break;

    case "BinaryExpression":
      expr = binaryExpression(expression);
      break;

    case "ObjectExpression":
      expr = objectExpression(expression);
      break;

    case "ArrayExpression":
      expr = arrayExpression(expression);
      break;

    default:
      console.error("JSX::expressionContainer => ", expression.type);
      break;
  }

  str = `j.jsxExpressionContainer(${expr})`;
  return str;
}
function buildChildren(children) {
  let str = children.map((child) => {
    let s = "";
    switch (child.type) {
      case "Literal":
        s = `j.literal('${child.value.replace("\n", "\\n")}')`;
        break;

      case "JSXElement":
        s = element(child);
        break;

      case "JSXText":
        s = `j.jsxText('${child.value.replace(/\n/g, "\\n")}')`;
        break;

      case "JSXExpressionContainer":
        s = expressionContainer(child);
        break;

      default:
        console.error("JSX::buildChildren => ", child.type);
        break;
    }
    return s;
  });
  return str.join(",");
}
function element(node) {
  let str = "";
  const { openingElement: oe, closingElement: ce, children, extra } = node;

  let parenthesized = extra && extra.parenthesized ? true : false;
  if (ce !== null) {
    str = `j.jsxElement(
  ${openingElement(oe)},
  ${closingElement(ce)},
  [${buildChildren(children)}],
  ${parenthesized}
  )`;
  } else {
    str =
      `j.jsxElement(
  ${openingElement(oe)},` +
      "null," +
      `[${buildChildren(children)}],
  ${parenthesized}
  )`;
  }
  return str;
}

export { attribute, element };
