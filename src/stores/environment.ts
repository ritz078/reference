import create from "zustand";

interface IEnvironmentState {
  showGrid: boolean;
  showSky: boolean;
  toggleGrid: () => void;
  toggleSky: () => void;
}

const [useEnvironment] = create<IEnvironmentState>((set) => ({
  showGrid: true,
  showSky: false,
  toggleGrid: () =>
    set((state) => ({
      showGrid: !state.showGrid,
    })),
  toggleSky: () =>
    set((state) => ({
      showSky: !state.showSky,
    })),
}));

export { useEnvironment };
