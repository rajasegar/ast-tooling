import { createSlice, configureStore } from "@reduxjs/toolkit";

const codemodSlice = createSlice({
  name: "codemod",
  initialState: {
    opcode: "replace",
    mode: "javascript",
  },
  reducers: {
    setOpCode: (state, action) => {
      state.opcode = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { setMode, setOpCode } = codemodSlice.actions;

export const store = configureStore({
  reducer: codemodSlice.reducer,
});
