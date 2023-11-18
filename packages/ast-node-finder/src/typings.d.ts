export interface Node {
    type: string,
    tag: string,
    expression: {
	type: string
    },
    declarations: any[],
    path: {
	original: string
    },
    object: any,
    property: any,
    arguments: any,
    id: {
	name: string
    },
    callee: any,
    source: {
	value: any
    },
    declaration: {
	type: string,
	callee: any
    },
    name: string,
    value: string,
    operator: any,
    left: any,
    right: any,
    raw: any
}

export interface Ast {
		program: {
				body: any,
		}
}
