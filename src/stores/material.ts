import create from "zustand";

const [useMaterial] = create((set) => ({
  wireframe: true,
  materialColor: "#fff",
  toggleWireframe: () =>
    set((state) => ({
      wireframe: !state.wireframe,
    })),
  setMaterialColor: (color) =>
    set({
      materialColor: color.hex,
    }),
}));

export { useMaterial };
