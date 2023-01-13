import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { StateField } from "@codemirror/state";
import { showPanel } from "@codemirror/panel";

import { getBuilderApi, getFinderApi, getAstJson } from "./utils";

import { store } from "./store";

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
  const extensions = [basicSetup, javascript()];

  const { mode } = store.getState();
  // const inputCode = mode === "javascript" ? `foo()` : `{{hello-world}}`;
  const inputCode =
    mode === "javascript" ? `<Link exact />` : `{{hello-world}}`;

  const builderEditor = new EditorView({
    state: EditorState.create({
      doc: getBuilderApi(inputCode, mode),
      extensions: [...extensions],
    }),
    parent: document.getElementById("dest-editor"),
  });

  const listenChangesExtension = StateField.define({
    create: () => null,
    update: async (value, transaction) => {
      if (transaction.docChanged) {
        const { mode } = store.getState();
        const _input = transaction.newDoc.toString();
        builderEditor.setState(
          EditorState.create({
            doc: getBuilderApi(_input, mode),
            extensions,
          })
        );

        astEditor.setState(
          EditorState.create({
            doc: getAstJson(_input, mode),
            extensions: [basicSetup, json()],
          })
        );

        finderEditor.setState(
          EditorState.create({
            doc: getFinderApi(_input, mode),
            extensions: [basicSetup, javascript()],
          })
        );
      }
      return null;
    },
  });

  let editor = new EditorView({
    state: EditorState.create({
      doc: inputCode,
      extensions: [...extensions, listenChangesExtension],
    }),
    parent: document.getElementById("editor"),
  });

  const astEditor = new EditorView({
    state: EditorState.create({
      doc: getAstJson(inputCode, mode),
      extensions: [basicSetup, json()],
    }),
    parent: document.getElementById("ast-editor"),
  });

  const finderEditor = new EditorView({
    state: EditorState.create({
      doc: getFinderApi(inputCode, mode),
      extensions: [basicSetup, javascript()],
    }),
    parent: document.getElementById("finder-editor"),
  });

  function updateEditors(mode) {
    // Update input code
    const _inputCode = mode === "javascript" ? `foo()` : `{{hello-world}}`;
    const _outputCode = mode === "javascript" ? `foo.bar()` : `<HelloWorld />`;
    editor.setState(
      EditorState.create({
        doc: _inputCode,
        extensions: [...extensions, listenChangesExtension],
      })
    );

    // Update output code
    builderEditor.setState(
      EditorState.create({
        doc: getBuilderApi(_inputCode, mode),
        extensions: [...extensions],
      })
    );

    astEditor.setState(
      EditorState.create({
        doc: getAstJson(_inputCode, mode),
        extensions: [basicSetup, json()],
      })
    );

    finderEditor.setState(
      EditorState.create({
        doc: getFinderApi(_inputCode, mode),
        extensions: [basicSetup, javascript()],
      })
    );
  }

  store.subscribe(async () => {
    const { mode } = store.getState();
    console.log(mode);
    updateEditors(mode);
  });
}
