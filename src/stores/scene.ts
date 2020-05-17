import create from "zustand";
import { WebGLRenderer } from "three";

interface ILoadedModel {
  model: string;
  setModel: (name: string) => void;
  renderer: WebGLRenderer;
  setRenderer: (renderer: WebGLRenderer) => void;
}

const [useScene] = create<ILoadedModel>((set) => ({
  model: "male",
  setModel: (model: string) =>
    set({
      model,
    }),
  renderer: null,
  setRenderer: (renderer) =>
    set({
      renderer,
    }),
}));

export { useScene };
