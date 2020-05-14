import React from "react";
import { Canvas } from "react-three-fiber";
import { Sky } from "drei";
import { ModelContainer } from "./ModelContainer";
import { useEnvironment } from "@stores/environment";

const cameraProps = {
  position: [100, 120, 200],
};

export default function () {
  const showSky = useEnvironment((state) => state.showSky);

  return (
    <Canvas
      shadowMap
      invalidateFrameloop={false}
      camera={cameraProps as any}
      pixelRatio={window.devicePixelRatio}
    >
      <ambientLight intensity={1} />

      {showSky && <Sky />}

      <ModelContainer />
    </Canvas>
  );
}
