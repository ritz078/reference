import create from "zustand";

const [useMaterial] = create((set) => ({
  materialColor: "#fff",
  setMaterialColor: (color) =>
    set({
      materialColor: color.hex,
    }),
}));

export { useMaterial };
