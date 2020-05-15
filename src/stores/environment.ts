import create from "zustand";

interface IEnvironmentState {
  showGrid: boolean;
  toggleGrid: () => void;
}

const [useEnvironment] = create<IEnvironmentState>((set) => ({
  showGrid: true,
  toggleGrid: () =>
    set((state) => ({
      showGrid: !state.showGrid,
    })),
}));

export { useEnvironment };
