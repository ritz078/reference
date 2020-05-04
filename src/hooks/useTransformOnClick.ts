import { useThree } from "react-three-fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Box3, Geometry, Group, Mesh, Object3D } from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

export function useTransformOnClick(orbitalControls) {
  const { raycaster, gl, camera, scene, invalidate } = useThree();
  const transformControls = useMemo<TransformControls>(
    () => new TransformControls(camera, gl.domElement),
    []
  );

  const bbox = useRef<Box3>(null);

  useEffect(() => {
    function handleChange(e) {
      orbitalControls.current.enabled = !e.value;

      console.log(bbox.current);
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
        const mesh = intersects[0].object;
        const rootBone = mesh.skeleton.bones[0];

        transformControls.attach(rootBone);

        mesh.geometry.computeBoundingBox();

        // add an invisible box around the bone and attach it to the bone.
        bbox.current = mesh.geometry.boundingBox;
        // @ts-ignore
        const _mesh = new Mesh(mesh.geometry.clone());

        const bone = mesh.add(_mesh);
        console.log(bone);
        bbox.current.setFromObject(rootBone);
      } else {
        transformControls.detach();
      }
    }

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, []);
}
