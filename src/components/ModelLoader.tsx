import React, { useEffect, useRef, useState } from "react";
import {
  ArcRotateCamera,
  Color4,
  Engine,
  GizmoManager,
  HemisphericLight,
  MeshBuilder,
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
  const [gizmoManager, setGizmoManager] = useState<GizmoManager>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    const gizmoManager = new GizmoManager(scene);
    gizmoManager.rotationGizmoEnabled = true;
    gizmoManager.usePointerToAttachGizmos = false;

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
        // 32 is click event

        if (eventData.type === 32) {
          const mesh = MeshBuilder.CreateBox(
            "box",
            {
              width: 1,
              height: 1,
              size: 1,
            },
            scene
          );
          console.log(eventData.pickInfo, eventState.target);

          // eventData.pickInfo.pickedMesh.skeleton.bones[0];
          // mesh.attachToBone(
          //   eventData.pickInfo.pickedMesh.skeleton.bones[0],
          //   eventData.pickInfo.pickedMesh
          // );
          gizmoManager.attachToMesh(
            eventData.pickInfo.pickedMesh.skeleton.overrideMesh
          );
        }
      });

      engine.runRenderLoop(() => {
        scene.render();
      });
    });

    setScene(scene);
    setCamera(camera);
    setGizmoManager(gizmoManager);
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
