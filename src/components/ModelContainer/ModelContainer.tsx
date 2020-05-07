import React, { memo, Suspense, useCallback, useEffect, useMemo } from "react";
import { Male } from "../Male";
import { Dom, useThree } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import {
  SkinnedMesh,
  Mesh,
  MeshBasicMaterial,
  SphereBufferGeometry,
} from "three";
import { useTransformOnClick } from "@hooks/useTransformOnClick";

function _ModelContainer() {
  const { scene, gl, camera, invalidate } = useThree();
  const orbitalControls = useMemo(
    () => new OrbitControls(camera, gl.domElement),
    []
  );
  const boneMeshMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: "red",
        visible: false,
        wireframe: true,
      }),
    []
  );

  useTransformOnClick(orbitalControls);
  // useHighlightOnHover();

  useEffect(() => {
    orbitalControls.addEventListener("change", invalidate);

    return () => {
      orbitalControls.removeEventListener("change", invalidate);
    };
  }, []);

  useEffect(() => {
    orbitalControls.target = new THREE.Vector3(0, 100, 0);
    orbitalControls.update();
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
      const spotLightHelperBack = new THREE.SpotLightHelper(spotLightBack);
      scene.add(spotLightHelperBack);
    }
  }, []);

  const onLoad = useCallback(() => {
    scene.traverse((object) => {
      if (object instanceof SkinnedMesh) {
        const bbox = object.geometry.boundingBox;
        const rootBone = object.skeleton.bones[0];

        const mesh = new Mesh(
          new SphereBufferGeometry(8, 20, 20),
          boneMeshMaterial
        );
        mesh.name = object.id.toString(10);
        rootBone.add(mesh);

        bbox.setFromObject(rootBone);
      }
    });
  }, []);

  return (
    <Suspense
      fallback={
        <Dom>
          <div>loading</div>
        </Dom>
      }
    >
      <Male
        onPointerOver={() => {
          boneMeshMaterial.visible = true;
        }}
        onPointerOut={() => {
          boneMeshMaterial.visible = false;
        }}
        onLoad={onLoad}
      />
    </Suspense>
  );
}

export const ModelContainer = memo(_ModelContainer);
