import create from "zustand";

const [usePostProcessing] = create<IPostProcessing>((set) => ({
  sobelRenderPass: false,
  toggleSobelRenderPass: () => {
    set((state) => ({
      sobelRenderPass: !state.sobelRenderPass,
    }));
  },
}));

export { usePostProcessing };

interface IPostProcessing {
  sobelRenderPass: boolean;
  toggleSobelRenderPass: () => void;
}
