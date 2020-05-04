import React, {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Male } from "../Male";
import { Dom, useFrame, useThree } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import {
  Box3,
  Group,
  SkinnedMesh,
  BoxHelper,
  Mesh,
  Object3D,
  BufferGeometry,
  BoxBufferGeometry,
  MeshBasicMaterial,
} from "three";
import { useHighlightOnHover } from "../../hooks/useHighlightOnHover";
import { useTransformOnClick } from "../../hooks/useTransformOnClick";
import { instanceOf, object } from "prop-types";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

function _ModelContainer() {
  const { scene, gl, camera, invalidate } = useThree();
  const orbitalControls = useRef(new OrbitControls(camera, gl.domElement));
  const transformControls = useMemo<TransformControls>(
    () => new TransformControls(camera, gl.domElement),
    []
  );

  const bbox = useRef<Box3>(null);
  // useTransformOnClick(orbitalControls);
  useHighlightOnHover();

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

  useEffect(() => {
    function handleChange(e) {
      orbitalControls.current.enabled = !e.value;

      console.log(bbox.current.clone());
      invalidate();
    }

    transformControls.addEventListener("dragging-changed", handleChange);
    scene.add(transformControls);
    transformControls.mode = "rotate";

    return () => {
      transformControls.removeEventListener("dragging-changed", handleChange);
      transformControls.dispose();
    };
  }, [bbox.current]);

  useFrame(() => {});

  const handleClick = useCallback((e) => {
    const mesh: SkinnedMesh = e.object;
    if (!mesh.skeleton) return;
    const rootBone = mesh.skeleton.bones[0];

    bbox.current = mesh.geometry.boundingBox;

    const _mesh = new Mesh(
      new BoxBufferGeometry(),
      new MeshBasicMaterial({ color: 0x00ff00 })
    );

    _mesh.applyMatrix4(mesh.matrix);

    rootBone.add(_mesh);

    // bbox.current.setFromObject(rootBone);
    console.log(_mesh, mesh);
    const _bbox = new BoxHelper(_mesh, "green");
    scene.add(_bbox);
    transformControls.attach(rootBone);
  }, []);

  return (
    <Suspense
      fallback={
        <Dom>
          <div>loading</div>
        </Dom>
      }
    >
      <Male onClick={handleClick} />
    </Suspense>
  );
}

export const ModelContainer = memo(_ModelContainer);
