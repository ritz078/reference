import { useThree } from "react-three-fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Group, Object3D, SkinnedMesh } from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

export function useTransformOnClick(orbitalControls) {
  const { raycaster, gl, camera, scene, invalidate } = useThree();
  const transformControls = useMemo<TransformControls>(
    () => new TransformControls(camera, gl.domElement),
    []
  );

  const objectRef = useRef<Object3D>(null);

  useEffect(() => {
    function handleChange(e) {
      orbitalControls.current.enabled = !e.value;
      scene.traverse((object) => {
        object.updateMatrix();
      });
      const box = new THREE.BoxHelper(e.target.object, 0xffff00);
      scene.add(box);

      invalidate();
    }

    transformControls.addEventListener("dragging-changed", handleChange);
    scene.add(transformControls);
    transformControls.mode = "rotate";

    return () => {
      transformControls.removeEventListener("dragging-changed", handleChange);
      transformControls.dispose();
    };
  }, []);

  useEffect(() => {
    function handleClick(ev: MouseEvent) {
      ev.preventDefault();

      const x = (ev.clientX / window.innerWidth) * 2 - 1;
      const y = -(ev.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera({ x, y }, camera);

      const intersects = raycaster
        .intersectObjects(
          scene.children.find((child) => child instanceof Group).children
        )
        // @ts-ignore
        .filter((child) => child.object?.skeleton?.bones?.length);

      if (intersects.length) {
        const object = intersects[0].object;

        // @ts-ignore
        transformControls.attach(object.skeleton.bones[0]);
        objectRef.current = object;
        const helper = new THREE.SkeletonHelper(object);
        scene.add(helper);
      } else {
        transformControls.detach();
      }
    }

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, []);
}
