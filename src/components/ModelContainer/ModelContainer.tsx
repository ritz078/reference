import React, {
  memo,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { Male } from "../Male";
import { Dom, useThree } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { Group } from "three";
import { useHighlightOnHover } from "../../hooks/useHighlightOnHover";
import { useTransformOnClick } from "../../hooks/useTransformOnClick";

function _ModelContainer() {
  const { scene, gl, camera, invalidate } = useThree();
  const orbitalControls = useRef(new OrbitControls(camera, gl.domElement));

  useTransformOnClick(orbitalControls);
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
        console.log(object);
        object.addEventListener("click", console.log);
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
      <Male />
    </Suspense>
  );
}

export const ModelContainer = memo(_ModelContainer);
