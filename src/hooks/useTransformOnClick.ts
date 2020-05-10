import { useThree } from "react-three-fiber";
import { useEffect, useMemo } from "react";
import { Group, Mesh, SkinnedMesh } from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

export function useTransformOnClick(orbitalControls) {
  const { raycaster, gl, camera, scene, invalidate } = useThree();
  const transformControls = useMemo<TransformControls>(
    () => new TransformControls(camera, gl.domElement),
    []
  );

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

      console.log(gl.domElement.width);

      const x = (ev.clientX / gl.domElement.parentElement.clientWidth) * 2 - 1;
      const y =
        -(ev.clientY / gl.domElement.parentElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera({ x, y }, camera);

      const intersects = raycaster
        .intersectObjects(
          scene.children.find((child) => child instanceof Group).children,
          true
        )
        .filter(
          (x) => x.object instanceof Mesh && !(x.object instanceof SkinnedMesh)
        );

      if (intersects.length) {
        const boneMesh = intersects[0].object as Mesh;
        const rootBone = boneMesh.parent;

        transformControls.attach(rootBone);
      } else {
        transformControls.detach();
      }
    }

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, []);
}
