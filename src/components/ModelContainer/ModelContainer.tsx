import React, { memo, Suspense, useCallback, useEffect, useRef } from "react";
import { Male } from "../Male";
import { Dom, useFrame, useThree } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import {
  Group,
  SkinnedMesh,
  Mesh,
  MeshBasicMaterial,
  SphereBufferGeometry,
} from "three";
import { useTransformOnClick } from "../../hooks/useTransformOnClick";

function _ModelContainer() {
  const { scene, gl, camera, invalidate, raycaster } = useThree();
  const orbitalControls = useRef(new OrbitControls(camera, gl.domElement));

  const transformingSkin = useRef<SkinnedMesh>(null);
  useTransformOnClick(orbitalControls);
  // useHighlightOnHover();

  useEffect(() => {
    orbitalControls.current.addEventListener("change", invalidate);

    return () => {
      orbitalControls.current.removeEventListener("change", invalidate);
    };
  }, []);

  useEffect(() => {
    orbitalControls.current.target = new THREE.Vector3(0, 100, 0);
    orbitalControls.current.update();
  }, []);

  useEffect(() => {
    const size = 1000;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
  }, []);

  useEffect(() => {
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(50, 50, 300);
    scene.add(spotLight);

    const spotLightBack = new THREE.SpotLight(0xffffff);
    spotLightBack.position.set(50, 50, -300);
    scene.add(spotLightBack);

    if (DEV) {
      const spotLightHelper = new THREE.SpotLightHelper(spotLight);
      scene.add(spotLightHelper);
      const spotLightHelperBack = new THREE.SpotLightHelper(spotLight);
      scene.add(spotLightHelperBack);
    }
  }, []);

  useEffect(() => {
    scene.children
      .find((child) => child instanceof Group && child.name === "model")
      ?.children.forEach((object) => {
        object.addEventListener("click", console.log);
      });
  }, []);

  useFrame(() => {
    if (transformingSkin.current) {
      const _bbox = transformingSkin.current.geometry.boundingBox;
      const rootBone = transformingSkin.current.skeleton.bones[0];
      _bbox.setFromObject(rootBone);

      transformingSkin.current.updateWorldMatrix(true, true);
    }
  });

  const onLoad = useCallback(() => {
    scene.traverse((object) => {
      if (object instanceof SkinnedMesh) {
        const bbox = object.geometry.boundingBox;
        const rootBone = object.skeleton.bones[0];

        const mesh = new Mesh(
          new SphereBufferGeometry(8, 20, 20),
          new MeshBasicMaterial({ color: "red", wireframe: true })
        );
        rootBone.add(mesh);

        bbox.setFromObject(rootBone);
      }
    });
  }, [scene, raycaster]);

  return (
    <Suspense
      fallback={
        <Dom>
          <div>loading</div>
        </Dom>
      }
    >
      <Male onLoad={onLoad} />
    </Suspense>
  );
}

export const ModelContainer = memo(_ModelContainer);
