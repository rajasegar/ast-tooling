import { parse } from "recast";
import { es6, glimmer as hbsBuilder } from "ast-node-builder";
const { buildAST } = es6;

function opQueryJS(nodeOp, dest) {
  let str = "";

  let newNode;
  switch (nodeOp) {
    case "remove":
      str = `.remove();`;
      break;

    case "replace":
      newNode = buildAST(parse(dest), false);
      str = `.replaceWith(path => {
          return ${newNode};
        })`;
      break;

    case "insert-before":
      newNode = buildAST(parse(dest));
      str = `.forEach(path => {
        path.parent.insertBefore(${newNode});
        })`;
      break;

    case "insert-after":
      newNode = buildAST(parse(dest));
      str = `.forEach(path => {
        path.parent.insertAfter(${newNode});
        })`;
      break;
  }
  return str;
}

async function opQueryGlimmer(nodeOp, dest) {
  let str = "";

  const { parse } = await import("ember-template-recast");

  switch (nodeOp) {
    case "remove":
      str = `return null;`;
      break;

    case "replace":
      str = `return ${hbsBuilder.buildAST(parse(dest))};`;
      break;
  }
  return new Promise((resolve, reject) => {
    resolve(str);
  });
}

export default async function opQuery(mode, nodeOp, dest) {
  let _query = "";
  switch (mode) {
    case "javascript":
      _query = opQueryJS(nodeOp, dest);
      break;

    case "handlebars":
      _query = await opQueryGlimmer(nodeOp, dest);
      break;
  }
  return _query;
}
