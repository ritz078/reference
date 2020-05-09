import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useThree } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import {
  SkinnedMesh,
  Mesh,
  MeshBasicMaterial,
  SphereBufferGeometry,
  MeshStandardMaterial,
} from "three";
import { useTransformOnClick } from "@hooks/useTransformOnClick";
import { useLoader } from "@hooks/useLoader";
import { MODEL_NAME } from "@constants/name";
import { getModelCenter } from "@utils/geometry";

function _ModelContainer() {
  const { scene, gl, camera } = useThree();

  const orbitalControls = useMemo(() => {
    const orbitalControls = new OrbitControls(camera, gl.domElement);
    orbitalControls.maxDistance = 500;
    orbitalControls.minDistance = 50;
    orbitalControls.screenSpacePanning = true;
    return orbitalControls;
  }, []);

  const boneMeshMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: "red",
        wireframe: true,
      }),
    []
  );
  const [modelName, setModelName] = useState("male");

  useTransformOnClick(orbitalControls);

  const reset = useCallback(() => {
    const model = scene.getObjectByName(MODEL_NAME);
    orbitalControls.target = getModelCenter(model, modelName);
    orbitalControls.update();
  }, [scene, orbitalControls, modelName]);

  const onLoad = useCallback(() => {
    const model = scene.getObjectByName(MODEL_NAME);

    model.traverse((object) => {
      if (object instanceof SkinnedMesh) {
        if (object.material instanceof MeshStandardMaterial) {
          object.material.wireframe = false;
        }

        const bbox = object.geometry.boundingBox;
        const rootBone = object.skeleton.bones[0];

        const mesh = new Mesh(new SphereBufferGeometry(2.5), boneMeshMaterial);
        mesh.name = object.id.toString(10);
        rootBone.add(mesh);

        bbox.setFromObject(rootBone);
      }
    });
    reset();
  }, []);

  useLoader(modelName, onLoad);

  useEffect(() => {
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(50, 50, 300);
    scene.add(spotLight);

    const spotLightBack = new THREE.SpotLight(0xffffff);
    spotLightBack.position.set(50, 50, -300);
    scene.add(spotLightBack);
  }, []);

  return null;
}

export const ModelContainer = memo(_ModelContainer);
