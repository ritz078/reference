import { useThree } from "react-three-fiber";
import { useEffect, useMemo } from "react";
import { Group, Mesh, SkinnedMesh } from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

export function useTransformOnClick(orbitalControls, loaded: boolean) {
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
          scene.children.find((child) => child instanceof Group).children,
          true
        )
        .filter(
          (x) => x.object instanceof Mesh && !(x.object instanceof SkinnedMesh)
        );

      if (intersects.length) {
        const boneMesh = intersects[0].object;
        const rootBone = boneMesh.parent;

        transformControls.attach(rootBone);
      } else {
        transformControls.detach();
      }
    }

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [loaded]);
}
