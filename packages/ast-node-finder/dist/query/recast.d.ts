import { Node } from '../typings';
declare function memberExpressionQuery(node: Node): string;
declare function callExpressionQuery(node: Node): string;
declare function literalQuery(node: Node): string;
declare function variableDeclaratorQuery(node: Node): string;
declare function expressionStatementQuery(node: Node): string;
declare function newExpressionQuery(node: Node): string;
declare function importDeclarationQuery(node: Node): string;
declare function exportDefaultDeclarationQuery(node: Node): string;
declare function exportNamedDeclarationQuery(node: Node): string;
declare function identifier(node: Node): string;
declare function functionDeclaration(node: Node): string;
declare function assignmentExpression(node: Node): string;
export { assignmentExpression, callExpressionQuery, literalQuery, memberExpressionQuery, newExpressionQuery, expressionStatementQuery, variableDeclaratorQuery, importDeclarationQuery, exportDefaultDeclarationQuery, exportNamedDeclarationQuery, identifier, functionDeclaration };
