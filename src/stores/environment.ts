import create from "zustand";

const [useEnvironment] = create<IEnvironmentState>((set) => ({
  showGrid: true,
  toggleGrid: () =>
    set((state) => ({
      showGrid: !state.showGrid,
    })),
}));

export { useEnvironment };

interface IEnvironmentState {
  showGrid: boolean;
  toggleGrid: () => void;
}
