import React, { useState } from "react";
import { Canvas } from "react-three-fiber";
import { ModelContainer } from "../ModelContainer";
import styles from "./ModelLoader.module.scss";
import Icon from "@mdi/react";
import { mdiSnowflake } from "@mdi/js";

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
        <Canvas camera={{ position: [100, 120, 200] }}>
          {/*<pointLight*/}
          {/*  position={[50, 50, 200]}*/}
          {/*  intensity={0.7 * Math.PI}*/}
          {/*  decay={0}*/}
          {/*/>*/}
          {/*<pointLight*/}
          {/*  position={[50, 50, -200]}*/}
          {/*  intensity={0.7 * Math.PI}*/}
          {/*  decay={0}*/}
          {/*/>*/}

          <ModelContainer onInitialModelLoad={setIsModelLoaded} />
        </Canvas>
      </div>
    </>
  );
}
