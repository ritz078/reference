import React from "react";
import { Canvas } from "react-three-fiber";
import { ModelContainer } from "./ModelContainer";

const cameraProps = {
  position: [100, 120, 200],
};

const webRendererOptions = {
  // This is needed if you want to get the image
  // from the canvas.
  // https://stackoverflow.com/a/15563621/3366126
  preserveDrawingBuffer: true,
};

export default function ModelLoader() {
  return (
    <Canvas
      shadowMap
      invalidateFrameloop={false}
      camera={cameraProps as any}
      pixelRatio={window.devicePixelRatio}
      gl={webRendererOptions}
    >
      <ambientLight intensity={1} />

      <ModelContainer />
    </Canvas>
  );
}
