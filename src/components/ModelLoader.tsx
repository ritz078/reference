import React, { useEffect, useRef, useState } from "react";
import {
  ArcRotateCamera,
  Color4,
  Engine,
  HemisphericLight,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";

interface IBabylonContext {
  scene: Scene;
  camera: ArcRotateCamera;
}

const BabylonContext = React.createContext<IBabylonContext>({
  scene: null,
  camera: null,
});

export default function () {
  const [scene, setScene] = useState<Scene>();
  const [camera, setCamera] = useState<ArcRotateCamera>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 0);
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI,
      1,
      300,
      new Vector3(0, 90, 0),
      scene
    );
    camera.useFramingBehavior = true;
    camera.attachControl(canvasRef.current, true);

    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 2;

    SceneLoader.ShowLoadingScreen = false;
    SceneLoader.Append("/models/", "male.gltf", scene, () => {
      scene.onPointerObservable.add((eventData, eventState) => {
        if (eventData.type === 32) {
          // @ts-ignore
          eventData.pickInfo.pickedMesh.skeleton.bones[0].scale(2, 2, 2);
        }
      });

      engine.runRenderLoop(() => {
        scene.render();
      });
    });

    setScene(scene);
    setCamera(camera);
  }, []);

  useEffect(() => {}, []);

  return (
    <BabylonContext.Provider
      value={{
        scene,
        camera,
      }}
    >
      <canvas
        style={{
          width: "100vw",
          height: "100vh",
        }}
        ref={canvasRef}
      />
    </BabylonContext.Provider>
  );
}
