import "./style.css";

import setupSplit from "./src/setup-split";
import setupEditor from "./src/setup-editor";
import { store, setMode } from "./src/store";
import "./src/tabs";

setupSplit();

setupEditor();

document.getElementById("lst-mode").addEventListener("change", (ev) => {
  store.dispatch(setMode(ev.target.value));
});

store.subscribe(() => {
  const { mode } = store.getState();
  console.log(mode);
  document.getElementById("lst-mode").value = mode;
});
