import * as query from './query/recast';
import * as babel from './query/babel';
import * as glimmer from './glimmer';
import { Node, Ast } from './typings';
declare function findQuery(node: Node): string;
declare function dispatchNodes(ast: Ast): string;
export { findQuery, dispatchNodes, query, glimmer, babel };
