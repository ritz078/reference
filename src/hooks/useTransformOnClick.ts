import { useThree } from "react-three-fiber";
import { useEffect, useMemo } from "react";
import { Group, Mesh, SkinnedMesh } from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { convertPointerToCoordinate } from "@utils/convertPointerToCoordinate";
import { useMaterial } from "@stores/material";

export function useTransformOnClick(orbitalControls) {
  const { raycaster, gl, camera, scene, invalidate } = useThree();
  const transformControls = useMemo<TransformControls>(
    () => new TransformControls(camera, gl.domElement),
    []
  );
  const { wireframe, toggleWireframe } = useMaterial();

  useEffect(() => {
    function handleChange(e) {
      orbitalControls.enabled = !e.value;
      invalidate();
    }

    transformControls.addEventListener("dragging-changed", handleChange);
    transformControls.mode = "rotate";
    transformControls.axis = "local";
    scene.add(transformControls);

    return () => {
      transformControls.removeEventListener("dragging-changed", handleChange);
      transformControls.dispose();
    };
  }, []);

  useEffect(() => {
    function handleClick(ev: MouseEvent) {
      ev.preventDefault();

      raycaster.setFromCamera(
        convertPointerToCoordinate(ev, gl.domElement),
        camera
      );

      const intersects = raycaster
        .intersectObjects(
          scene.children.find((child) => child instanceof Group).children,
          true
        )
        .filter(
          (x) => x.object instanceof Mesh && !(x.object instanceof SkinnedMesh)
        );

      if (intersects.length) {
        if (!wireframe) toggleWireframe();

        const boneMesh = intersects[0].object as Mesh;
        const rootBone = boneMesh.parent;

        transformControls.attach(rootBone);
      } else {
        transformControls.detach();
      }
    }

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [wireframe]);
}
