import { parse, prettyPrint } from "recast";

import opQuery from "./op-query";

import { babel } from "ast-node-finder";

// import { parse as etrParse } from 'ember-template-recast';
import { store } from './store';

const { dispatchNodes } = babel;

export default async function(source, dest) {
	const { mode, opcode } = store.getState();
	let _transformTemplate = "";
	let transformLogic = "";
	if (mode === "javascript") {
		let ast = parse(source);
		let _inputNodeType = ast.program.body[0].type;

		let outAst = parse(dest);
		let _outputNodeType = outAst.program.body[0].type;

		//const isSmartUpdate = _inputNodeType === _outputNodeType && this.get('nodeOp') === 'replace';
		const isSmartUpdate = false;

		let _allowSmartUpdate = false;

		transformLogic = dispatchNodes(ast).join();
		const smartOp = "";
		let _opQuery =
			isSmartUpdate && _allowSmartUpdate
				? smartOp
				: await opQuery(mode, opcode, dest);

		// TODO: Need to change to es6 export default
		_transformTemplate = `
	  module.exports = function transformer(file, api) {
	 const j = api.jscodeshift;
	const root = j(file.source);
	const body = root.get().value.program.body;
	${transformLogic}
	${_opQuery}
	return root.toSource();
      };`;
	} else {

	    const { parse } = await import('ember-template-recast');
	    const { glimmer } = await import('ast-node-finder');
		let ast = parse(source);
		let _opQuery = await opQuery(mode, opcode, dest);
		transformLogic = glimmer.dispatchNodes(ast, _opQuery).join();

		_transformTemplate = `
	  module.exports = function(env) {
	let b = env.syntax.builders;
	${transformLogic}

      };`;
	}

	let _codemod = prettyPrint(parse(_transformTemplate), {
		tabWidth: 2,
	}).code;

    return new Promise((resolve, reject) => {
	resolve(_codemod);
    });
}
