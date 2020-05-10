import create from "zustand";

interface IEnvironmentState {
  showGrid: boolean;
}

const [useEnvironment] = create<IEnvironmentState>((set) => ({
  showGrid: false,
  toggleGrid: () =>
    set((state) => ({
      showGrid: !state.showGrid,
    })),
}));

export { useEnvironment };
