import React from "react";
import { Canvas } from "react-three-fiber";
import { ModelContainer } from "./ModelContainer";

const cameraProps = {
  position: [10, 100, 160],
};

export default function () {
  return (
    <>
      <Canvas
        shadowMap
        invalidateFrameloop={false}
        camera={cameraProps as any}
        pixelRatio={window.devicePixelRatio}
      >
        <ambientLight intensity={1} />

        <ModelContainer />
      </Canvas>
    </>
  );
}
