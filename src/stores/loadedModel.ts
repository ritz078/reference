import create from "zustand";

interface ILoadedModel {
  name: string;
  setName: (name: string) => void;
}

const [useLoadedModel] = create<ILoadedModel>((set) => ({
  name: "male",
  setName: (name: string) =>
    set({
      name,
    }),
}));

export { useLoadedModel };
