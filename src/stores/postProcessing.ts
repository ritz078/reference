import create from "zustand";

interface IPostProcessing {
  sobelRenderPass: boolean;
  toggleSobelRenderPass: () => void;
}

const [usePostProcessing] = create<IPostProcessing>((set) => ({
  sobelRenderPass: false,
  toggleSobelRenderPass: () => {
    set((state) => ({
      sobelRenderPass: !state.sobelRenderPass,
    }));
  },
}));

export { usePostProcessing };
