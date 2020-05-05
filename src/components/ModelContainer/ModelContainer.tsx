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
  Group,
  SkinnedMesh,
  Mesh,
  BoxBufferGeometry,
  MeshBasicMaterial,
  Bone,
} from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

function _ModelContainer() {
  const { scene, gl, camera, invalidate, raycaster } = useThree();
  const orbitalControls = useRef(new OrbitControls(camera, gl.domElement));
  const transformControls = useMemo<TransformControls>(
    () => new TransformControls(camera, gl.domElement),
    []
  );

  const transformingSkin = useRef<SkinnedMesh>(null);
  // useTransformOnClick(orbitalControls);
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
    const x = raycaster.intersectObjects(scene.children);
    console.log(x[0].object);
  }, []);

  useEffect(() => {
    scene.children
      .find((child) => child instanceof Group && child.name === "model")
      ?.children.forEach((object) => {
        object.addEventListener("click", console.log);
      });
  }, []);

  useEffect(() => {
    let _mesh;
    function handleChange(e) {
      orbitalControls.current.enabled = !e.value;
      const bone: Bone = e.target.object;
      console.log(bone, e.value);
      if (e.value) {
        _mesh = new Mesh(
          new BoxBufferGeometry(10, 10, 10),
          new MeshBasicMaterial({ color: 0x00ff00 })
        );

        bone.add(_mesh);
      } else {
        bone.remove(_mesh);
        _mesh = null;
        transformingSkin.current = null;
      }
    }

    transformControls.addEventListener("dragging-changed", handleChange);
    transformControls.addEventListener("change", invalidate);
    scene.add(transformControls);
    transformControls.mode = "rotate";

    return () => {
      transformControls.removeEventListener("dragging-changed", handleChange);
      transformControls.addEventListener("change", invalidate);
      transformControls.dispose();
    };
  }, [transformingSkin.current]);

  useFrame(() => {
    if (transformingSkin.current) {
      const _bbox = transformingSkin.current.geometry.boundingBox;
      const rootBone = transformingSkin.current.skeleton.bones[0];
      _bbox.setFromObject(rootBone);

      transformingSkin.current.updateWorldMatrix(true, true);
    }
  });

  const handleClick = useCallback(
    (e) => {
      const mesh: SkinnedMesh = e.object;

      console.log(mesh);
      if (!mesh.skeleton) return;
      const rootBone = mesh.skeleton.bones[0];

      transformingSkin.current = mesh;

      transformControls.attach(rootBone);
    },
    [transformingSkin.current]
  );

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
