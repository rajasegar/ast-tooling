declare type Ast = {
    body: any;
};
declare function dispatchNodes(ast: Ast, transform?: string): string[];
export { dispatchNodes };
