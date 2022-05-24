import { parse } from "recast";
import { parse as etrParse } from "ember-template-recast";
import { es6, glimmer as hbsBuilder } from "ast-node-builder";
const { buildAST } = es6;

import { findQuery, glimmer as hbsFinder } from "ast-node-finder";

function filterAstNodes(key, value) {
  return ["loc", "tokens"].includes(key) ? undefined : value;
}

export function getBuilderApi(code, mode) {
  const parser = mode === "javascript" ? parse : etrParse;
  const ast = parser(code);
  const builderApi =
    mode === "javascript" ? buildAST(ast) : hbsBuilder.buildAST(ast);
  return builderApi.join("\n");
}

export function getFinderApi(code, mode) {
  const parser = mode === "javascript" ? parse : etrParse;
  const ast = parser(code);
  const api =
    mode === "javascript"
      ? findQuery(ast.program.body[0].expression)
      : hbsFinder.dispatchNodes(ast).join("\n");
  return api;
}

export function getAstJson(code, mode) {
  const parser = mode === "javascript" ? parse : etrParse;
  const ast = parser(code);
  return JSON.stringify(ast, filterAstNodes, 2);
}
