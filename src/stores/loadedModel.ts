import create from "zustand";

const [useLoadedModel] = create((set) => ({
  name: "male",
  setName: (name: string) =>
    set({
      name,
    }),
}));

export { useLoadedModel };
