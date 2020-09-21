import React, { useState } from "react";
import { Canvas } from "react-three-fiber";
import { ModelContainer } from "../ModelContainer";
import styles from "./ModelLoader.module.scss";
import Icon from "@mdi/react";
import { mdiCogClockwise, mdiLoading, mdiSnowflake } from "@mdi/js";

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
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  return (
    <>
      {!isModelLoaded && (
        <div className={styles.loader}>
          <Icon path={mdiSnowflake} spin size={1.5} color="#fff" />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flex: 1,
        }}
      >
        <Canvas
          shadowMap
          invalidateFrameloop={false}
          camera={cameraProps as any}
          pixelRatio={window.devicePixelRatio}
          gl={webRendererOptions}
        >
          <ambientLight intensity={1} />

          <ModelContainer onInitialModelLoad={setIsModelLoaded} />
        </Canvas>
      </div>
    </>
  );
}
