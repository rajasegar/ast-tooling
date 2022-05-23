import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { StateField } from "@codemirror/state";
import { showPanel } from "@codemirror/panel";

import { parse } from "recast";
import { es6, glimmer as hbsBuilder } from "ast-node-builder";
const { buildAST } = es6;

import { findQuery } from "ast-node-finder";

import { store } from "./store";

function filterAstNodes(key, value) {
  return ["loc", "tokens"].includes(key) ? undefined : value;
}

function createInputPanel() {
  return createHelpPanel("Enter the input code here to transform:");
}

function createOutputPanel() {
  return createHelpPanel("Enter the output code here to be transformed:");
}

function createHelpPanel(text) {
  let dom = document.createElement("div");
  dom.textContent = text;
  dom.className = "cm-help-panel";
  dom.style = "background: yellow; padding: 2px";
  return { top: true, dom };
}

const helpPanelState = StateField.define({
  create: () => false,
  provide: (f) => showPanel.from(f, (on) => createInputPanel),
});

const outputHelpPanelState = StateField.define({
  create: () => false,
  provide: (f) => showPanel.from(f, (on) => createOutputPanel),
});

export default async function () {
  const sampleCode = `foo()`;

  const extensions = [basicSetup, javascript()];

  let { mode: oldMode } = store.getState();
  const inputCode = oldMode === "javascript" ? `foo()` : `{{hello-world}}`;

  const destEditor = new EditorView({
    state: EditorState.create({
      doc: getBuilderApi(inputCode),
      extensions: [...extensions],
    }),
    parent: document.getElementById("dest-editor"),
  });

  function getBuilderApi(code) {
    const ast = parse(code);
    const builderApi = buildAST(ast);
    return builderApi.join("\n");
  }

  function getFinderApi(code) {
    const ast = parse(code);
    const api = findQuery(ast.program.body[0].expression);
    console.log(api);
    return api;
  }

  function getAstJson(code) {
    const ast = parse(code);
    return JSON.stringify(ast, filterAstNodes, 2);
  }

  const listenChangesExtension = StateField.define({
    create: () => null,
    update: async (value, transaction) => {
      if (transaction.docChanged) {
        const _input = transaction.newDoc.toString();
        destEditor.setState(
          EditorState.create({
            doc: getBuilderApi(_input),
            extensions,
          })
        );

        astEditor.setState(
          EditorState.create({
            doc: getAstJson(_input),
            extensions: [basicSetup, json()],
          })
        );

        finderEditor.setState(
          EditorState.create({
            doc: getFinderApi(_input),
            extensions: [basicSetup, javascript()],
          })
        );
      }
      return null;
    },
  });

  let editor = new EditorView({
    state: EditorState.create({
      doc: "foo()",
      extensions: [...extensions, listenChangesExtension],
    }),
    parent: document.getElementById("editor"),
  });

  const astEditor = new EditorView({
    state: EditorState.create({
      doc: getAstJson(inputCode),
      extensions: [basicSetup, json()],
    }),
    parent: document.getElementById("ast-editor"),
  });

  const finderEditor = new EditorView({
    state: EditorState.create({
      doc: getFinderApi(inputCode),
      extensions: [basicSetup, javascript()],
    }),
    parent: document.getElementById("finder-editor"),
  });

  // Update input code
  const _inputCode = oldMode === "javascript" ? `foo()` : `{{hello-world}}`;
  editor.setState(
    EditorState.create({
      doc: _inputCode,
      extensions: [...extensions, listenChangesExtension],
    })
  );

  // Update output code
  const _outputCode = oldMode === "javascript" ? `foo.bar()` : `<HelloWorld />`;
  destEditor.setState(
    EditorState.create({
      doc: getBuilderApi(_inputCode),
      extensions: [...extensions],
    })
  );

  astEditor.setState(
    EditorState.create({
      doc: getAstJson(inputCode),
      extensions: [basicSetup, json()],
    })
  );

  finderEditor.setState(
    EditorState.create({
      doc: getFinderApi(inputCode),
      extensions: [basicSetup, javascript()],
    })
  );

  store.subscribe(async (action) => {});
}
